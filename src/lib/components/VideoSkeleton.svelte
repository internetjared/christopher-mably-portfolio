<div class="video-skeleton">
  <div class="skeleton-video"></div>
</div>

<style>
  .video-skeleton {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: #000;
    z-index: 100;
    animation: fadeOut 0.3s ease-out 0.2s forwards;
  }
  
  .skeleton-video {
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      #111 0%,
      #222 50%,
      #111 100%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  
  @keyframes fadeOut {
    to {
      opacity: 0;
      pointer-events: none;
    }
  }
</style>
