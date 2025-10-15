<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  
  let { showToggle = false }: { showToggle?: boolean } = $props();
  let isDarkMode = $state(false);
  
  onMount(() => {
    // Check localStorage for saved preference
    isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
    }
  });
  
  function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    localStorage.setItem('darkMode', isDarkMode.toString());
    document.documentElement.classList.toggle('dark-mode');
  }
</script>

<header>
  <button class="logo" onclick={() => goto('/')} aria-label="Go to homepage">
    <div class="logo-text">
      <div class="main-text">Christopher Mably</div>
      <div class="sub-text">CSC</div>
    </div>
  </button>
  
  <div class="header-right">
    {#if showToggle}
      <button class="dark-mode-toggle" onclick={toggleDarkMode} aria-label="Toggle dark mode">
        <div class="toggle-track">
          <div class="toggle-thumb" class:active={isDarkMode}></div>
        </div>
      </button>
    {/if}
    <button class="info-button" onclick={() => goto('/info')}>
      Info
    </button>
  </div>
</header>

<style>
  header {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30px 40px;
    z-index: 100;
    background: #fff;
    max-width: 2000px;
    margin: 0 auto;
  }
  
  .logo {
    cursor: pointer;
    background: transparent;
    border: none;
    padding: 0;
  }
  
  .logo-text {
    display: flex;
    flex-direction: row;
    align-items: baseline;
    line-height: 1;
    gap: 8px;
  }
  
  .main-text {
    font-size: 18px;
    font-weight: 600;
    color: #000;
    font-family: system-ui, -apple-system, sans-serif;
  }
  
  .sub-text {
    font-size: 12px;
    font-weight: 400;
    color: #000;
    font-family: system-ui, -apple-system, sans-serif;
  }
  

  .header-right {
    display: flex;
    align-items: center;
    gap: 20px;
    position: absolute;
    right: 40px;
    top: 35px;
  }

  .dark-mode-toggle {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
  }

  .toggle-track {
    width: 40px;
    height: 20px;
    background: #e0e0e0;
    border-radius: 10px;
    position: relative;
    transition: background 0.3s ease;
  }

  .toggle-thumb {
    width: 16px;
    height: 16px;
    background: #000;
    border-radius: 50%;
    position: absolute;
    top: 2px;
    left: 2px;
    transition: transform 0.3s ease;
  }

  .toggle-thumb.active {
    transform: translateX(20px);
  }

  .dark-mode-toggle:hover .toggle-track {
    opacity: 0.8;
  }

  .info-button {
    background: transparent;
    border: none;
    padding: 0;
    font-size: 14px;
    cursor: pointer;
    color: #000;
    transition: opacity 0.3s ease;
    line-height: 1; /* Ensure consistent baseline */
  }
  
  .info-button:hover {
    opacity: 0.7;
  }

  /* Mobile responsive */
  @media (max-width: 768px) {
    .header-right {
      right: 25px; /* Add padding from right edge for mobile */
    }
  }
</style>
