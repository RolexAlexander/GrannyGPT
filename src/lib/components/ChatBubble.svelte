<script>
  import { fly } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  
  export let message;
  export let fade = false;
</script>

<div 
  transition:fly={{ y: 20, duration: 500, easing: quintOut }}
  class="flex {message.role === 'user' ? 'justify-end' : 'justify-start'} {fade ? 'opacity-40' : 'opacity-100'} transition-opacity duration-1000"
>
  <div class="flex items-end space-x-2 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
    {#if message.role === 'assistant'}
      <!-- GrannyGPT Avatar -->
      <div class="w-10 h-10 rounded-full bg-gradient-to-br from-granny-green to-granny-green-dark shadow-lg flex items-center justify-center mb-1">
        <span class="text-white text-sm font-bold">G</span>
      </div>
    {/if}

    <!-- Message bubble -->
    <div class="group relative">
      <div class="
        {message.role === 'user' 
          ? 'bg-gradient-to-r from-granny-orange to-granny-orange-light text-white' 
          : 'bg-white/90 text-granny-brown'} 
        backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg
        {message.role === 'user' ? 'rounded-br-md' : 'rounded-bl-md'}
        transform transition-all duration-200 group-hover:scale-105
      ">
        <p class="text-sm leading-relaxed">{message.content}</p>
        
        <!-- Timestamp -->
        <div class="flex justify-end mt-1">
          <span class="text-xs {message.role === 'user' ? 'text-white/70' : 'text-granny-brown/50'}">
            {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </span>
        </div>
      </div>

      <!-- Message actions (show on hover) -->
      <div class="absolute -bottom-6 {message.role === 'user' ? 'right-0' : 'left-0'} opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div class="flex space-x-1">
          <button class="p-1 rounded-full bg-white/80 hover:bg-white shadow-sm">
            <svg class="w-4 h-4 text-granny-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          {#if message.role === 'assistant'}
            <button class="p-1 rounded-full bg-white/80 hover:bg-white shadow-sm">
              <svg class="w-4 h-4 text-granny-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
            </button>
          {/if}
        </div>
      </div>
    </div>

    {#if message.role === 'user'}
      <!-- User Avatar -->
      <div class="w-10 h-10 rounded-full bg-gradient-to-br from-granny-orange-light to-granny-orange shadow-lg flex items-center justify-center mb-1">
        <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      </div>
    {/if}
  </div>
</div>