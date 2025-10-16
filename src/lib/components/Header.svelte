<script lang="ts">
  import { goto } from '$app/navigation';
  
  let { isHomepage = false }: { isHomepage?: boolean } = $props();
</script>

<header class:homepage={isHomepage}>
  <button class="logo" onclick={() => goto('/')} aria-label="Go to homepage">
    <div class="logo-text">
      <div class="main-text">Christopher Mably</div>
      <div class="sub-text">CSC</div>
    </div>
  </button>
  
</header>

<style>
  header {
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 30px 40px;
    z-index: 100;
    background: #fff;
    max-width: 2000px;
    margin: 0 auto;
  }
  
  header.homepage {
    justify-content: center;
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
    font-weight: 300;
    color: #000;
    font-family: 'Mynaruse', system-ui, -apple-system, sans-serif;
  }
  
  .sub-text {
    font-size: 12px;
    font-weight: 100;
    color: #000;
    font-family: 'Mynaruse', system-ui, -apple-system, sans-serif;
  }
  



  /* Mobile responsive */
  @media (max-width: 768px) {
    header {
      padding: 20px 25px;
    }
  }
</style>
