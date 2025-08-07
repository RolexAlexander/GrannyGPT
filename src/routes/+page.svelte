<script>
  import { onMount } from 'svelte';
  import { 
    messages, 
    addMessage, 
    isTyping, 
    currentChatId, 
    chats, 
    createNewChat, 
    deleteChat, 
    switchChat,
    getConversationHistory,
    conversationLimit
  } from '$lib/stores/chat.js';

  let messageInput = '';
  let chatContainer;
  let darkMode = false;
  let menuOpen = false;
  let showSettings = false;

  onMount(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      darkMode = true;
    }

    // Load saved conversation limit
    const savedLimit = localStorage.getItem('conversationLimit');
    if (savedLimit) {
      conversationLimit.set(parseInt(savedLimit));
    }

    // Create initial chat
    createNewChat();
  });

  async function sendMessage() {
    if (messageInput.trim()) {
      const userMessage = messageInput.trim();
      addMessage(userMessage, 'user');
      messageInput = '';
      
      // Auto scroll to bottom when user sends message
      setTimeout(() => {
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }, 100);
      
      try {
        // Get conversation history with current limit
        let limit;
        conversationLimit.subscribe(l => limit = l)();
        const conversationHistory = getConversationHistory(limit);
        
        console.log('Sending conversation history:', conversationHistory); // Debug log
        
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            conversationHistory,
            conversationLimit: limit
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.success) {
            addMessage(data.response, 'assistant');
          } else {
            // API returned an error but still gave us a response
            addMessage(data.response, 'assistant');
            console.warn('API Error:', data.error);
          }
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
        
      } catch (error) {
        console.error('Network Error:', error);
        
        // Network/connection error fallback
        const errorResponses = [
          "Oh dear, I'm having trouble connecting right now, love. My old mind needs a moment to catch up!",
          "Well child, seems like the spirits are interfering with our chat! Try again in a moment, yes?",
          "Sweet baby, I can't seem to hear you properly right now. Let me fix my hearing aid and try again!"
        ];
        
        addMessage(errorResponses[Math.floor(Math.random() * errorResponses.length)], 'assistant');
      }
      
      // Auto scroll after response
      setTimeout(() => {
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }, 100);
    }
  }

  function handleKeydown(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendMessage();
    }
  }

  function toggleDarkMode() {
    darkMode = !darkMode;
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }

  function toggleMenu() {
    menuOpen = !menuOpen;
  }

  function handleNewChat() {
    createNewChat();
    menuOpen = false;
  }

  function handleSwitchChat(chatId) {
    switchChat(chatId);
    menuOpen = false;
  }

  function handleDeleteChat(chatId, event) {
    event.stopPropagation();
    deleteChat(chatId);
  }

  function updateConversationLimit(newLimit) {
    conversationLimit.set(newLimit);
    localStorage.setItem('conversationLimit', newLimit.toString());
  }

  // Fixed opacity function
  function getMessageOpacity(index) {
    const totalMessages = $messages.length;
    const recentMessages = 3;
    
    if (index >= totalMessages - recentMessages) {
      return 1;
    }
    
    return 0.85;
  }
</script>

<!-- Dynamic theme-based background -->
<div class="h-screen flex transition-all duration-500 relative" 
     class:dark={darkMode}
     style="background: {darkMode 
       ? 'linear-gradient(135deg, #1f2937 0%, #374151 25%, #4b5563 50%, #059669 75%, #065f46 100%)' 
       : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 25%, #ea580c 50%, #22c55e 75%, #16a34a 100%)'};">
  
  <!-- Hamburger Menu Overlay -->
  {#if menuOpen}
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300" on:click={toggleMenu}></div>
  {/if}

  <!-- Sliding Menu -->
  <div class="fixed top-0 left-0 h-full w-80 {darkMode ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-xl shadow-2xl transform transition-transform duration-300 z-50 {menuOpen ? 'translate-x-0' : '-translate-x-full'} border-r {darkMode ? 'border-gray-700/50' : 'border-orange-200/50'}">
    
    <!-- Menu Header -->
    <div class="p-6 border-b {darkMode ? 'border-gray-700/50' : 'border-orange-200/50'}">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <img src="/logo.png" alt="GrannyGPT" class="w-10 h-10" />
          <div>
            <h2 class="{darkMode ? 'text-gray-100' : 'text-slate-800'} text-xl font-bold">GrannyGPT</h2>
            <p class="{darkMode ? 'text-gray-400' : 'text-slate-600'} text-sm">Manage your conversations</p>
          </div>
        </div>
        <button 
          on:click={toggleMenu}
          class="w-8 h-8 rounded-lg {darkMode ? 'hover:bg-gray-800' : 'hover:bg-orange-100'} flex items-center justify-center transition-colors duration-200">
          <svg class="w-5 h-5 {darkMode ? 'text-gray-400' : 'text-slate-600'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- New Chat Button -->
    <div class="p-4">
      <button 
        on:click={handleNewChat}
        class="w-full flex items-center space-x-3 px-4 py-3 rounded-xl {darkMode ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-orange-500 hover:bg-orange-600 text-white'} transition-colors duration-200 font-medium shadow-lg">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>New Chat</span>
      </button>
    </div>

    <!-- Settings Section -->
    <div class="p-4 border-b {darkMode ? 'border-gray-700/50' : 'border-orange-200/50'}">
      <button 
        on:click={() => showSettings = !showSettings}
        class="w-full flex items-center justify-between px-4 py-3 rounded-xl {darkMode ? 'hover:bg-gray-800/50 text-gray-200' : 'hover:bg-orange-100/50 text-slate-800'} transition-colors duration-200 font-medium">
        <div class="flex items-center space-x-3">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Settings</span>
        </div>
        <svg class="w-4 h-4 transition-transform duration-200 {showSettings ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {#if showSettings}
        <div class="mt-3 pl-4 space-y-3">
          <div>
            <label class="block text-xs font-medium {darkMode ? 'text-gray-300' : 'text-slate-600'} mb-2">
              Conversation Memory: {$conversationLimit} messages
            </label>
            <input 
              type="range" 
              min="10" 
              max="50" 
              value={$conversationLimit}
              on:input={(e) => updateConversationLimit(parseInt(e.target.value))}
              class="w-full h-2 rounded-lg {darkMode ? 'bg-gray-700' : 'bg-orange-200'} outline-none slider"
            />
            <div class="flex justify-between text-xs {darkMode ? 'text-gray-400' : 'text-slate-500'} mt-1">
              <span>10</span>
              <span>50</span>
            </div>
          </div>
          <p class="text-xs {darkMode ? 'text-gray-400' : 'text-slate-500'} leading-relaxed">
            GrannyGPT will remember the last {$conversationLimit} messages. Older messages are forgotten to keep conversations focused.
          </p>
        </div>
      {/if}
    </div>

    <!-- Chat History -->
    <div class="flex-1 overflow-y-auto px-4 pb-4">
      <h3 class="{darkMode ? 'text-gray-300' : 'text-slate-700'} text-sm font-semibold mb-3 px-2">Recent Conversations</h3>
      
      <div class="space-y-2">
        {#each Object.entries($chats) as [chatId, chat]}
          <div class="group relative">
            <button 
              on:click={() => handleSwitchChat(chatId)}
              class="w-full text-left px-3 py-3 rounded-xl {chatId === $currentChatId 
                ? darkMode ? 'bg-emerald-600/20 border border-emerald-500/30' : 'bg-orange-500/20 border border-orange-500/30'
                : darkMode ? 'hover:bg-gray-800/50' : 'hover:bg-orange-100/50'} 
                transition-all duration-200">
              
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 rounded-lg {darkMode ? 'bg-gray-700' : 'bg-orange-200'} flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 {darkMode ? 'text-gray-300' : 'text-orange-600'}" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="{darkMode ? 'text-gray-100' : 'text-slate-800'} font-medium text-sm truncate">
                    {chat.title || 'New Conversation'}
                  </p>
                  <p class="{darkMode ? 'text-gray-400' : 'text-slate-500'} text-xs truncate">
                    {chat.messages.length} messages • {new Date(chat.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </button>

            <!-- Delete button -->
            <button 
              on:click={(e) => handleDeleteChat(chatId, e)}
              class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 w-6 h-6 rounded-md {darkMode ? 'hover:bg-red-600/20 text-red-400' : 'hover:bg-red-100 text-red-500'} flex items-center justify-center transition-all duration-200">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        {/each}

        {#if Object.keys($chats).length === 0}
          <div class="text-center py-8">
            <svg class="w-12 h-12 {darkMode ? 'text-gray-600' : 'text-slate-400'} mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p class="{darkMode ? 'text-gray-400' : 'text-slate-500'} text-sm">No conversations yet</p>
            <p class="{darkMode ? 'text-gray-500' : 'text-slate-400'} text-xs mt-1">Start chatting to create your first conversation</p>
          </div>
        {/if}
      </div>
    </div>

    <!-- Menu Footer with Theme Toggle -->
    <div class="p-4 border-t {darkMode ? 'border-gray-700/50' : 'border-orange-200/50'}">
      <div class="flex items-center justify-between">
        <span class="{darkMode ? 'text-gray-400' : 'text-slate-600'} text-sm">Theme</span>
        <button 
          on:click={toggleDarkMode}
          class="w-12 h-6 rounded-full {darkMode ? 'bg-emerald-600' : 'bg-orange-400'} relative transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 {darkMode ? 'focus:ring-emerald-500' : 'focus:ring-orange-500'}">
          <div class="w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 {darkMode ? 'translate-x-6' : 'translate-x-0.5'}"></div>
        </button>
      </div>
    </div>
  </div>

  <!-- Left side - Fixed title cutoff issue -->
  <div class="w-1/2 flex flex-col justify-center items-center p-12 relative overflow-hidden">
    
    <!-- Animated background elements -->
    <div class="absolute top-20 left-20 w-32 h-32 {darkMode ? 'bg-emerald-400/10' : 'bg-orange-400/20'} rounded-full animate-float"></div>
    <div class="absolute bottom-32 right-16 w-24 h-24 {darkMode ? 'bg-gray-400/10' : 'bg-green-400/20'} rounded-full animate-float" style="animation-delay: 1s;"></div>
    <div class="absolute top-1/3 right-1/4 w-16 h-16 {darkMode ? 'bg-slate-400/10' : 'bg-yellow-400/20'} rounded-full animate-float" style="animation-delay: 2s;"></div>
    
    <!-- Logo -->
    <div class="relative mb-16 animate-float">
      <div class="absolute inset-0 {darkMode ? 'bg-gray-800/40' : 'bg-white/30'} backdrop-blur-md rounded-full scale-125 shadow-2xl"></div>
      <div class="absolute inset-0 bg-gradient-to-br {darkMode ? 'from-emerald-500/20 to-gray-500/20' : 'from-orange-300/40 to-green-300/40'} rounded-full scale-110 animate-pulse"></div>
      <img src="/logo.png" alt="GrannyGPT Profile" class="w-56 h-56 relative z-10 filter drop-shadow-2xl" />
    </div>
    
    <!-- Fixed title container - added more padding to prevent cutoff -->
    <div class="text-center {darkMode ? 'bg-gray-800/20' : 'bg-white/15'} backdrop-blur-xl rounded-3xl p-12 shadow-2xl border {darkMode ? 'border-gray-600/20' : 'border-white/20'} w-full max-w-md">
      <h1 class="text-7xl xl:text-8xl font-black leading-none drop-shadow-2xl mb-2 bg-gradient-to-r {darkMode ? 'from-emerald-400 to-gray-200' : 'from-orange-800 to-green-800'} bg-clip-text text-transparent">Granny</h1>
      <h1 class="text-7xl xl:text-8xl font-black leading-none drop-shadow-2xl mb-6 bg-gradient-to-r {darkMode ? 'from-emerald-400 to-gray-200' : 'from-orange-800 to-green-800'} bg-clip-text text-transparent">GPT</h1>
      <div class="w-24 h-1 bg-gradient-to-r {darkMode ? 'from-emerald-500 to-gray-400' : 'from-orange-500 to-green-500'} mx-auto mb-4 rounded-full"></div>
      <p class="{darkMode ? 'text-gray-300' : 'text-slate-700'} text-xl font-semibold">6K Caribbean Creole Conversations</p>
    </div>
  </div>

  <!-- Right side - Chat interface -->
  <div class="w-1/2 flex flex-col relative">
    
    <!-- Top bar with hamburger menu -->
    <div class="absolute top-6 left-6 right-6 z-20 flex items-center justify-between">
      <!-- Hamburger menu button -->
      <button 
        on:click={toggleMenu}
        class="flex items-center space-x-3 {darkMode ? 'bg-gray-800/30' : 'bg-white/20'} backdrop-blur-xl rounded-2xl px-6 py-3 shadow-xl border {darkMode ? 'border-gray-600/30' : 'border-white/30'} hover:scale-105 transition-all duration-200">
        <svg class="w-6 h-6 {darkMode ? 'text-gray-200' : 'text-slate-800'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <span class="{darkMode ? 'text-gray-200' : 'text-slate-800'} font-bold text-lg">GrannyGPT</span>
      </button>

      <!-- Profile -->
      <div class="w-12 h-12 rounded-xl bg-gradient-to-r {darkMode ? 'from-emerald-500 via-teal-500 to-emerald-600' : 'from-orange-500 via-red-500 to-orange-600'} shadow-xl flex items-center justify-center ring-2 {darkMode ? 'ring-gray-600/40' : 'ring-white/40'} group hover:scale-105 transition-all duration-200">
        <svg class="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      </div>
    </div>

    <!-- Scrollable chat area with custom styled scrollbar -->
    <div 
      bind:this={chatContainer}
      class="flex-1 overflow-y-auto px-8 py-24 space-y-6 scroll-smooth custom-scrollbar"
      style="scroll-behavior: smooth;">
      
      {#each $messages as message, index}
        <div class="flex {message.role === 'user' ? 'justify-end' : 'justify-start'}
                    transition-all duration-300 animate-fade-in-up"
             style="opacity: {getMessageOpacity(index)}">
          
          <div class="max-w-lg group">
            <div class="
              {message.role === 'user' 
                ? darkMode 
                  ? 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-500 text-white ml-auto shadow-emerald-500/20' 
                  : 'bg-gradient-to-br from-orange-500 via-orange-600 to-red-500 text-white ml-auto shadow-orange-300/30'
                : darkMode
                  ? 'bg-gray-800/80 text-gray-100 mr-auto shadow-gray-900/30 border-gray-600/30'
                  : 'bg-white/90 text-slate-800 mr-auto shadow-slate-300/30'}
              backdrop-blur-sm rounded-3xl px-6 py-4 shadow-2xl
              transform group-hover:scale-[1.02] group-hover:shadow-3xl transition-all duration-300
              {message.role === 'user' ? 'rounded-br-lg' : 'rounded-bl-lg'}
              border {darkMode ? 'border-gray-600/40' : 'border-white/40'}
            ">
              <p class="text-sm leading-relaxed font-medium">{message.content}</p>
              <div class="text-xs mt-3 {message.role === 'user' 
                ? darkMode ? 'text-emerald-100' : 'text-orange-100'
                : darkMode ? 'text-gray-400' : 'text-slate-500'} text-right font-semibold">
                {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
          </div>
        </div>
      {/each}
      
      {#if $isTyping}
        <div class="flex justify-start animate-fade-in-up">
          <div class="{darkMode ? 'bg-gray-800/80 border-gray-600/40' : 'bg-white/90 border-white/40'} backdrop-blur-sm rounded-3xl rounded-bl-lg px-6 py-4 shadow-2xl border">
            <div class="flex space-x-3 items-center">
              <div class="flex space-x-1">
                <div class="w-2.5 h-2.5 bg-gradient-to-r {darkMode ? 'from-emerald-500 to-teal-500' : 'from-orange-500 to-red-500'} rounded-full animate-typing"></div>
                <div class="w-2.5 h-2.5 bg-gradient-to-r {darkMode ? 'from-emerald-500 to-teal-500' : 'from-orange-500 to-red-500'} rounded-full animate-typing" style="animation-delay: 0.2s;"></div>
                <div class="w-2.5 h-2.5 bg-gradient-to-r {darkMode ? 'from-emerald-500 to-teal-500' : 'from-orange-500 to-red-500'} rounded-full animate-typing" style="animation-delay: 0.4s;"></div>
              </div>
              <span class="text-xs {darkMode ? 'text-gray-400' : 'text-slate-600'} font-medium">GrannyGPT is thinking...</span>
            </div>
          </div>
        </div>
      {/if}
    </div>

    <!-- Floating input -->
    <div class="absolute bottom-6 left-8 right-8">
      <div class="{darkMode ? 'bg-gray-800/80 border-gray-600/40' : 'bg-white/90 border-white/40'} backdrop-blur-2xl rounded-3xl shadow-2xl border p-2">
        <div class="flex items-center space-x-4 p-4">
          <input
            bind:value={messageInput}
            on:keydown={handleKeydown}
            type="text"
            placeholder="Ask GrannyGPT anything..."
            class="flex-1 bg-transparent {darkMode ? 'text-gray-100 placeholder-gray-400' : 'text-slate-800 placeholder-slate-500'} outline-none text-base py-3 px-4 rounded-2xl font-medium"
          />
          
          <button 
            on:click={sendMessage}
            disabled={!messageInput.trim()}
            class="w-14 h-14 rounded-2xl bg-gradient-to-r {darkMode ? 'from-emerald-500 via-emerald-600 to-teal-500 hover:from-emerald-600 hover:via-emerald-700 hover:to-teal-600' : 'from-orange-500 via-orange-600 to-red-500 hover:from-orange-600 hover:via-orange-700 hover:to-red-600'} 
                   disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center justify-center shadow-xl transform hover:scale-110 active:scale-95
                   transition-all duration-200 group border {darkMode ? 'border-gray-600/20' : 'border-white/20'}">
            <svg class="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200" 
                 fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  /* Custom styled scrollbar */
  .custom-scrollbar {
    scrollbar-width: thin;
  }
  
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    margin: 20px 0;
  }
  
  /* Light mode scrollbar */
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, rgba(249, 115, 22, 0.6), rgba(234, 88, 12, 0.6));
    border-radius: 10px;
    border: 2px solid rgba(255, 255, 255, 0.1);
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, rgba(249, 115, 22, 0.8), rgba(234, 88, 12, 0.8));
  }
  
  /* Dark mode scrollbar */
  .dark .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
  }
  
  .dark .custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, rgba(16, 185, 129, 0.6), rgba(20, 184, 166, 0.6));
    border: 2px solid rgba(0, 0, 0, 0.1);
  }
  
  .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, rgba(16, 185, 129, 0.8), rgba(20, 184, 166, 0.8));
  }
  
  /* Custom slider styling */
  .slider {
    appearance: none;
    cursor: pointer;
  }
  
  .slider::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: linear-gradient(45deg, #f97316, #ea580c);
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  }
  
  .dark .slider::-webkit-slider-thumb {
    background: linear-gradient(45deg, #10b981, #059669);
  }
  
  .shadow-3xl {
    box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
  }
</style>