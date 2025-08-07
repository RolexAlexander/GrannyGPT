<script>
  import { slide } from 'svelte/transition';
  
  let showMenu = false;
</script>

<header class="bg-granny-orange/90 backdrop-blur-sm border-b border-granny-orange-dark shadow-lg">
  <div class="flex items-center justify-between p-4">
    <!-- Menu button -->
    <button 
      on:click={() => showMenu = !showMenu}
      class="p-2 rounded-lg bg-granny-orange-dark/20 hover:bg-granny-orange-dark/30 transition-all duration-200"
    >
      <svg class="w-6 h-6 text-granny-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <!-- Title -->
    <h1 class="text-xl font-bold text-granny-brown flex items-center space-x-2">
      <img src="/logo.png" alt="GrannyGPT" class="w-8 h-8" />
      <span class="hidden sm:inline">GrannyGPT</span>
    </h1>

    <!-- User avatar -->
    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-granny-orange-light to-granny-green shadow-lg flex items-center justify-center">
      <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V19A2 2 0 0 0 5 21H11C10.36 20.45 10 19.77 10 19C10 17.34 11.34 16 13 16S16 17.34 16 19C16 19.77 15.64 20.45 15 21H19C20.11 21 21 20.11 21 19V9M20 10H15V5L20 10Z"/>
      </svg>
    </div>
  </div>

  {#if showMenu}
    <div transition:slide class="bg-granny-orange-dark/10 border-t border-granny-orange-dark/20 p-4">
      <div class="flex flex-wrap gap-2">
        <button class="px-4 py-2 rounded-full bg-white/20 text-granny-brown hover:bg-white/30 transition-all duration-200">
          New Chat
        </button>
        <button class="px-4 py-2 rounded-full bg-white/20 text-granny-brown hover:bg-white/30 transition-all duration-200">
          History
        </button>
        <button class="px-4 py-2 rounded-full bg-white/20 text-granny-brown hover:bg-white/30 transition-all duration-200">
          Settings
        </button>
      </div>
    </div>
  {/if}
</header>