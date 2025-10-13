<script lang="ts">
  import { goto } from '$app/navigation';
</script>

<header>
  <div class="logo" onclick={() => goto('/')}>
    <img 
      src="https://iili.io/KjiTMH7.png" 
      alt="Mably Logo"
      style="filter: brightness(0);"
    />
  </div>
  
  <button class="info-button" onclick={() => goto('/info')}>
    Info
  </button>
</header>

<style>
  header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30px 40px;
    z-index: 100;
    background: linear-gradient(to bottom, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 100%);
  }
  
  .logo {
    cursor: pointer;
  }
  
  .logo img {
    height: 30px;
  }
  
  .info-button {
    background: transparent;
    border: 1px solid #000;
    padding: 10px 30px;
    font-size: 14px;
    cursor: pointer;
    border-radius: 20px;
    transition: all 0.3s ease;
  }
  
  .info-button:hover {
    background: #000;
    color: #fff;
  }
</style>
