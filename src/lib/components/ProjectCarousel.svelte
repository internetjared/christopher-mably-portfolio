<script lang="ts">
  import { preloadData } from '$app/navigation';
  import { urlFor } from '$lib/sanity';
  import type { SanityProject } from '$lib/types/sanity';
  
  let { projects }: { projects: SanityProject[] } = $props();
  
  // State
  let currentIndex = $state(0);
  let isDragging = $state(false);
  let startX = $state(0);
  let currentTranslate = $state(0);
  let prevTranslate = $state(0);
  
  // Get Vimeo video ID
  function getVimeoVideoId(vimeoUrl: string): string {
    const match = vimeoUrl.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
    return match ? match[1] : '';
  }
  
  // Navigation functions
  function goToNext() {
    if (currentIndex < projects.length - 1) {
      currentIndex++;
    } else {
      currentIndex = 0; // Loop back to first
    }
    preloadData(`/project/${projects[currentIndex].slug.current}`);
  }
  
  function goToPrev() {
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = projects.length - 1; // Loop to last
    }
    preloadData(`/project/${projects[currentIndex].slug.current}`);
  }
  
  // Drag/swipe handlers
  let dragStartTime = $state(0);

  function handleTouchStart(e: TouchEvent) {
    isDragging = true;
    startX = e.touches[0].clientX;
    dragStartTime = Date.now();
  }
  
  function handleTouchMove(e: TouchEvent) {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    // Apply resistance for better feel
    currentTranslate = prevTranslate + diff * 0.8;
  }
  
  function handleTouchEnd() {
    isDragging = false;
    const movedBy = currentTranslate - prevTranslate;
    const dragDuration = Date.now() - dragStartTime;
    
    // Calculate velocity (pixels per millisecond)
    const velocity = movedBy / dragDuration;
    
    // Thresholds for single-video navigation:
    // - 80px distance OR
    // - 0.5 pixels/ms velocity (fast swipe)
    const threshold = 80;
    const velocityThreshold = 0.5;
    
    // IMPORTANT: Only move one video at a time
    if (movedBy < -threshold || velocity < -velocityThreshold) {
      goToNext(); // Move to next (only one video)
    } else if (movedBy > threshold || velocity > velocityThreshold) {
      goToPrev(); // Move to previous (only one video)
    }
    // If threshold not met, snap back to current video
    
    // Reset translate values
    prevTranslate = 0;
    currentTranslate = 0;
  }
  
  // Mouse drag handlers (for desktop)
  function handleMouseDown(e: MouseEvent) {
    isDragging = true;
    startX = e.clientX;
    dragStartTime = Date.now();
  }
  
  function handleMouseMove(e: MouseEvent) {
    if (!isDragging) return;
    const currentX = e.clientX;
    const diff = currentX - startX;
    currentTranslate = prevTranslate + diff * 0.8;
  }
  
  function handleMouseUp() {
    handleTouchEnd();
  }
  
  // Keyboard navigation
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'ArrowLeft') goToPrev();
  }

  // Reactive effect to manage video preloading
  $effect(() => {
    // This ensures videos are preloaded when currentIndex changes
    const prevIndex = (currentIndex - 1 + projects.length) % projects.length;
    const nextIndex = (currentIndex + 1) % projects.length;
    
    // Preload data for adjacent projects
    preloadData(`/project/${projects[prevIndex].slug.current}`);
    preloadData(`/project/${projects[nextIndex].slug.current}`);
  });
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="carousel-container">
  <!-- Carousel Track -->
  <div 
    class="carousel-track"
    role="region"
    aria-label="Project carousel"
    tabindex="0"
    style="transform: translateX(calc(-{currentIndex} * (90vw + 40px)))"
    ontouchstart={handleTouchStart}
    ontouchmove={handleTouchMove}
    ontouchend={handleTouchEnd}
    onmousedown={handleMouseDown}
    onmousemove={handleMouseMove}
    onmouseup={handleMouseUp}
    onmouseleave={handleMouseUp}
  >
    {#each projects as project, index}
      <div class="carousel-item" class:active={index === currentIndex}>
        <!-- Thumbnail/Video Container -->
        <a 
          href="/project/{project.slug.current}"
          class="project-link"
          onmouseenter={() => preloadData(`/project/${project.slug.current}`)}
        >
          <div class="media-container">
            <!-- Thumbnail Image (always visible) -->
            {#if project.thumbnail && project.thumbnail.asset}
              <img 
                src={urlFor(project.thumbnail).width(1200).url()}
                alt={project.thumbnail.alt || project.title}
                class="thumbnail"
                class:hidden={index === currentIndex}
              />
            {/if}
            
        <!-- Auto-playing Video (preload for current, previous, and next) -->
        {#if getVimeoVideoId(project.vimeoUrl)}
          {@const videoId = getVimeoVideoId(project.vimeoUrl)}
          {@const isPrevious = index === (currentIndex - 1 + projects.length) % projects.length}
          {@const isNext = index === (currentIndex + 1) % projects.length}
          {@const shouldPreload = index === currentIndex || isPrevious || isNext}
          
          {#if shouldPreload}
            <iframe
              src="https://player.vimeo.com/video/{videoId}?autoplay=1&muted=1&loop=1&controls=0&background=1"
              class="video-player"
              class:visible={index === currentIndex}
              frameborder="0"
              allow="autoplay"
              title="{project.title}"
            ></iframe>
          {/if}
        {/if}
          </div>
          
          <!-- Title and Arrows Container -->
          <div class="title-arrows-container">
            <h3 class="project-title">{project.title}</h3>
            
            <!-- Navigation Arrows (only visible for active item) -->
            {#if index === currentIndex}
              <div class="nav-arrows-bottom">
                <button 
                  class="nav-arrow nav-arrow-left" 
                  onclick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    goToPrev();
                  }} 
                  aria-label="Previous project"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M15 18l-6-6 6-6"/>
                  </svg>
                </button>

                <button 
                  class="nav-arrow nav-arrow-right" 
                  onclick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    goToNext();
                  }} 
                  aria-label="Next project"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </button>
              </div>
            {/if}
          </div>
        </a>
      </div>
    {/each}
  </div>
</div>

<style>
  .carousel-container {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: flex-start; /* Changed from center */
    padding: 105px 0 60px; /* Increased top padding to 105px to avoid header overlap */
  }
  
  .carousel-track {
    display: flex;
    gap: 40px;
    transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94); /* Smoother easing */
    padding-left: 20px; /* Align with logo (logo is at left: 20px) */
    cursor: grab;
    will-change: transform;
  }
  
  .carousel-track:active {
    cursor: grabbing;
    transition: none; /* No transition during drag */
  }
  
  .carousel-item {
    position: relative; /* For absolute positioning of arrows */
    flex-shrink: 0;
    width: 90vw; /* Increased from 80vw to fill more of the frame */
    max-width: 1400px; /* Increased from 1200px */
    opacity: 0.3; /* Dimmed peek preview */
    transform: scale(0.95);
    transition: opacity 0.4s ease, transform 0.4s ease; /* Match carousel transition */
    pointer-events: none;
  }
  
  .carousel-item.active {
    opacity: 1;
    transform: scale(1);
    pointer-events: auto;
  }
  
  .project-link {
    display: flex;
    flex-direction: column;
    gap: 20px;
    text-decoration: none;
    color: inherit;
  }

  .title-arrows-container {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    width: 100%;
  }
  
  .media-container {
    position: relative;
    aspect-ratio: 16/9;
    border-radius: 10px;
    overflow: hidden;
    background: #f0f0f0;
  }
  
  .thumbnail, .video-player {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: opacity 0.5s ease;
  }
  
  .thumbnail.hidden {
    opacity: 0;
  }
  
  .video-player {
    pointer-events: none;
    opacity: 0;
  }

  .video-player.visible {
    opacity: 1;
  }
  
  .project-title {
    margin: 0;
    color: #000;
    font-size: 18px;
    font-weight: 400;
    font-family: system-ui, -apple-system, sans-serif;
    text-align: left;
    padding-top: 4px; /* Small padding for breathing room */
  }
  
  /* Navigation Arrows - Inline with Title */
  .nav-arrows-bottom {
    display: flex;
    gap: 12px;
    align-items: center;
    pointer-events: auto;
  }

  .nav-arrow {
    background: none;
    border: none;
    color: #000;
    cursor: pointer;
    padding: 0;
    pointer-events: auto;
    opacity: 0.7;
    transition: opacity 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-arrow:hover {
    opacity: 1;
  }

  .nav-arrow svg {
    width: 20px; /* Increased from 16px */
    height: 20px; /* Increased from 16px */
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .carousel-container {
      padding: 105px 0 50px; /* Increased top padding to 105px for mobile too */
    }
    
    .carousel-track {
      padding-left: 20px; /* Match logo position on mobile */
    }
    
    .carousel-item {
      width: 95vw; /* Increased from 85vw to fill more of mobile frame */
    }
    
    .nav-arrow svg {
      width: 18px; /* Increased from 14px */
      height: 18px; /* Increased from 14px */
    }
    
    .project-title {
      font-size: 16px;
    }
  }
</style>
