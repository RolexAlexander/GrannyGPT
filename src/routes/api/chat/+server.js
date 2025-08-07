import { json } from '@sveltejs/kit';

// Your API endpoint
const API_ENDPOINT = `${import.meta.env.VITE_API_URL}/api/chat`;

export async function POST({ request }) {
  try {
    const { conversationHistory, conversationLimit } = await request.json();
    
    // Prepare headers
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    // Prepare the request body with your model and conversation history
    const requestBody = {
      "model": import.meta.env.VITE_MODEL_NAME,
      "messages": conversationHistory
    };
    
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(requestBody),
      redirect: "follow"
    };
    
    console.log('Sending to API:', requestBody); // Debug log
    
    // Make the API call to your endpoint
    const response = await fetch(API_ENDPOINT, requestOptions);
    
    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }
    
    // Handle streaming response
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body reader available');
    }
    
    let fullResponse = '';
    const decoder = new TextDecoder();
    
    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        // Decode the chunk
        const chunk = decoder.decode(value, { stream: true });
        
        // Split by newlines in case multiple JSON objects are in one chunk
        const lines = chunk.split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          try {
            const jsonResponse = JSON.parse(line);
            
            // Extract content from the streaming response
            if (jsonResponse.message && jsonResponse.message.content) {
              fullResponse += jsonResponse.message.content;
            }
            
            // Check if this is the final message
            if (jsonResponse.done) {
              console.log('Stream completed. Full response:', fullResponse);
              return json({
                response: fullResponse,
                success: true,
                metadata: {
                  total_duration: jsonResponse.total_duration,
                  eval_count: jsonResponse.eval_count
                }
              });
            }
          } catch (parseError) {
            console.warn('Failed to parse JSON line:', line, parseError);
            // Continue processing other lines
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
    
    // Return the concatenated response
    return json({
      response: fullResponse || "I apologize, but I didn't receive a complete response. Please try again.",
      success: true
    });
    
  } catch (error) {
    console.error('API Error:', error);
    
    // Fallback responses for when API fails
    const fallbackResponses = [
      "Well child, seems like I'm having trouble hearing you clearly right now. Try again in a moment, love.",
      "Oh honey, my old ears are acting up! Give me a second and ask again, darling.",
      "Sweet child, something's not quite right with the connection. Let's try that again, yes?"
    ];
    
    return json({
      response: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
      success: false,
      error: error.message
    });
  }
}