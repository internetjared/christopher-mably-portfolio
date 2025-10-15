<script lang="ts">
  import { goto } from '$app/navigation';
</script>

<header>
  <button class="logo" onclick={() => goto('/')} aria-label="Go to homepage">
    <div class="logo-text">
      <div class="main-text">Christopher Mably</div>
      <div class="sub-text">CSC</div>
    </div>
  </button>
  
  <button class="info-button" onclick={() => goto('/info')}>
    Info
  </button>
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
  

  .info-button {
    background: transparent;
    border: none;
    padding: 0;
    font-size: 14px;
    cursor: pointer;
    color: #000;
    transition: opacity 0.3s ease;
    line-height: 1;
    margin-left: auto;
  }
  
  .info-button:hover {
    opacity: 0.7;
  }
</style>
