<script>
  import { createEventDispatcher } from 'svelte';
  import { scale } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  
  const dispatch = createEventDispatcher();
  
  let message = '';
  let inputElement;
  let isRecording = false;
  
  function sendMessage() {
    if (message.trim()) {
      dispatch('send', message.trim());
      message = '';
      inputElement?.focus();
    }
  }
  
  function handleKeydown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }
  
  function toggleRecording() {
    isRecording = !isRecording;
    // Add voice recording logic here
  }
</script>

<!-- Floating input container -->
<div class="fixed bottom-0 left-0 right-0 z-50">
  <!-- Background blur -->
  <div class="bg-gradient-to-t from-granny-orange/20 via-granny-orange/10 to-transparent backdrop-blur-sm pb-6 pt-4">
    <div class="max-w-4xl mx-auto px-4">
      <!-- Input area -->
      <div 
        class="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-2"
        transition:scale={{ duration: 300, easing: quintOut }}
      >
        <div class="flex items-end space-x-3">
          <!-- Voice recording button -->
          <button
            on:click={toggleRecording}
            class="flex-shrink-0 w-12 h-12 rounded-full {isRecording ? 'bg-red-500 animate-pulse' : 'bg-granny-green hover:bg-granny-green-dark'} 
                   transition-all duration-200 flex items-center justify-center shadow-lg"
          >
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
            </svg>
          </button>

          <!-- Text input -->
          <div class="flex-1 min-h-[48px]">
            <textarea
              bind:this={inputElement}
              bind:value={message}
              on:keydown={handleKeydown}
              placeholder="Message GrannyGPT..."
              class="w-full resize-none bg-transparent border-none outline-none text-granny-brown placeholder-granny-brown/50 
                     text-base leading-relaxed py-3 px-1 max-h-32"
              rows="1"
              style="min-height: 24px;"
            ></textarea>
          </div>

          <!-- Send button -->
          <button
            on:click={sendMessage}
            disabled={!message.trim()}
            class="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-granny-orange to-granny-orange-light 
                   hover:from-granny-orange-dark hover:to-granny-orange shadow-lg
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all duration-200 flex items-center justify-center group"
          >
            <svg class="w-6 h-6 text-white transform group-hover:scale-110 transition-transform duration-200" 
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
          </button>
        </div>

        <!-- Quick suggestions (show when input is empty) -->
        {#if !message.trim()}
          <div class="px-3 pb-2 pt-1" transition:scale={{ duration: 200 }}>
            <div class="flex flex-wrap gap-2">
              <button 
                on:click={() => message = "Tell me about Caribbean culture"}
                class="px-3 py-1.5 text-sm bg-granny-cream text-granny-brown rounded-full hover:bg-granny-orange/20 transition-colors duration-200"
              >
                Caribbean culture
              </button>
              <button 
                on:click={() => message = "What's your best cooking tip?"}
                class="px-3 py-1.5 text-sm bg-granny-cream text-granny-brown rounded-full hover:bg-granny-orange/20 transition-colors duration-200"
              >
                Cooking tips
              </button>
              <button 
                on:click={() => message = "Share some life wisdom"}
                class="px-3 py-1.5 text-sm bg-granny-cream text-granny-brown rounded-full hover:bg-granny-orange/20 transition-colors duration-200"
              >
                Life wisdom
              </button>
            </div>
          </div>
        {/if}
      </div>

      <!-- Action buttons -->
      <div class="flex justify-center mt-4 space-x-4">
        <button class="p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200">
          <svg class="w-6 h-6 text-granny-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
        </button>
        
        <button class="p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200">
          <svg class="w-6 h-6 text-granny-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        <button class="p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200">
          <svg class="w-6 h-6 text-granny-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</div>