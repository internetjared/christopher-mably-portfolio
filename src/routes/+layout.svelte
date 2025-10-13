<script>
  import '../app.css';
  import { navigating } from '$app/stores';
</script>

<!-- Optional: Global loading indicator -->
{#if $navigating}
  <div class="global-loading"></div>
{/if}

<slot />

<style>
  .global-loading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, white, transparent);
    z-index: 9999;
    animation: loading 1s ease-in-out infinite;
  }
  
  @keyframes loading {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
</style>