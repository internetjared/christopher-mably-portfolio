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
    padding: 30px 0; /* Remove horizontal padding */
    z-index: 100;
    background: linear-gradient(to bottom, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 100%);
  }
  
  .logo {
    position: absolute;
    left: 20px; /* Match carousel padding-left */
    top: 30px;
    cursor: pointer;
  }
  
  .logo img {
    height: 30px;
  }
  
  .info-button {
    position: absolute;
    left: calc(20px + 89vw); /* Align with video right edge */
    top: 40px;
    background: transparent;
    border: none;
    padding: 0;
    font-size: 14px;
    cursor: pointer;
    color: #000;
    transition: opacity 0.3s ease;
    transform: translateX(-100%); /* Position from right edge of text */
    line-height: 1; /* Ensure consistent baseline */
  }
  
  .info-button:hover {
    opacity: 0.7;
  }

  /* Mobile responsive */
  @media (max-width: 768px) {
    .info-button {
      left: calc(20px + 95vw); /* Match mobile video width */
    }
  }
</style>
