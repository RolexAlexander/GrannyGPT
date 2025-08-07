import { writable } from 'svelte/store';

// Chat management
export const chats = writable({});
export const currentChatId = writable(null);
export const messages = writable([]);
export const isTyping = writable(false);

// Configuration
export const conversationLimit = writable(30); // Configurable conversation limit

// System prompt
const SYSTEM_PROMPT = "You are Granny, a warm, wise Caribbean grandmother who speaks in authentic Creole. Share stories, advice, and cultural wisdom using natural Creole expressions, sayings, and speech pattern";
// const SYSTEM_PROMPT = "You are Granny, a wise and loving Caribbean grandmother who always speaks in authentic Caribbean Creole. You share wisdom, stories, and advice while maintaining the rich cultural expressions, phrases, and speech patterns of Caribbean Creole. Always respond warmly and naturally in Creole, using traditional sayings and expressions when appropriate."


// Generate unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Create new chat
export function createNewChat() {
  const chatId = generateId();
  const newChat = {
    id: chatId,
    title: '',
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  chats.update(allChats => ({
    ...allChats,
    [chatId]: newChat
  }));

  currentChatId.set(chatId);
  messages.set([]);
  isTyping.set(false);

  return chatId;
}

// Switch to different chat
export function switchChat(chatId) {
  currentChatId.set(chatId);
  
  chats.subscribe(allChats => {
    const chat = allChats[chatId];
    if (chat) {
      messages.set(chat.messages);
    }
  })();
}

// Delete chat
export function deleteChat(chatId) {
  chats.update(allChats => {
    const newChats = { ...allChats };
    delete newChats[chatId];
    
    // If deleting current chat, switch to another or create new
    currentChatId.subscribe(currentId => {
      if (currentId === chatId) {
        const remainingChats = Object.keys(newChats);
        if (remainingChats.length > 0) {
          switchChat(remainingChats[0]);
        } else {
          createNewChat();
        }
      }
    })();
    
    return newChats;
  });
}

// Get conversation history for API call with limit management
export function getConversationHistory(limit = 30) {
  let history = [];
  
  messages.subscribe(msgs => {
    // Always include system prompt first
    history = [{
      content: SYSTEM_PROMPT,
      role: "system"
    }];
    
    // Get user/assistant messages only (exclude system)
    const conversationMessages = msgs.filter(msg => msg.role === 'user' || msg.role === 'assistant');
    
    // If we're under the limit, include all messages
    if (conversationMessages.length <= limit) {
      history.push(...conversationMessages.map(msg => ({
        content: msg.content,
        role: msg.role
      })));
    } else {
      // Keep the most recent messages up to the limit
      const recentMessages = conversationMessages.slice(-limit);
      history.push(...recentMessages.map(msg => ({
        content: msg.content,
        role: msg.role
      })));
    }
  })();
  
  return history;
}

// Add message to current chat
export function addMessage(content, role = 'user') {
  const message = {
    id: generateId(),
    content,
    role,
    timestamp: new Date()
  };

  if (role === 'user') {
    messages.update(msgs => [...msgs, message]);
    isTyping.set(true);
  } else {
    isTyping.set(false);
    messages.update(msgs => [...msgs, message]);
  }

  // Update chat in store
  currentChatId.subscribe(chatId => {
    if (chatId) {
      chats.update(allChats => {
        const chat = allChats[chatId];
        if (chat) {
          // Auto-generate title from first user message
          if (!chat.title && role === 'user') {
            chat.title = content.length > 50 ? content.substring(0, 47) + '...' : content;
          }
          
          chat.messages = [...chat.messages, message];
          chat.updatedAt = new Date();
        }
        return allChats;
      });
    }
  })();
}

// Clear current chat messages
export function clearMessages() {
  messages.set([]);
  isTyping.set(false);
}

// Update conversation limit
export function setConversationLimit(limit) {
  conversationLimit.set(limit);
}