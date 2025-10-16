<script lang="ts">
  import { preloadData } from '$app/navigation';
  import { urlFor } from '$lib/sanity';
  import StillImagesStripe from './StillImagesStripe.svelte';
  import { onMount } from 'svelte';
  import type { SanityProject } from '$lib/types/sanity';
  
  let { projects }: { 
    projects: SanityProject[]; 
  } = $props();
  
  // State
  let hoveredProjectIndex = $state<number | null>(null);
  let isDragging = $state(false);
  let dragStartX = $state(0);
  let dragCurrentX = $state(0);
  let dragOffset = $state(0);
  let velocity = $state(0);
  let lastDragX = $state(0);
  let lastDragTime = $state(0);
  let animationOffset = $state(0);
  let dragThreshold = 5; // pixels to move before considering it a drag
  let hasMoved = $state(false);
  let clickStartTime = $state(0);
  
  // Get hovered project data
  const hoveredProject = $derived(() => {
    if (hoveredProjectIndex === null || isDragging) return null;
    return projects[hoveredProjectIndex % projects.length];
  });
  
  // Get Vimeo video ID
  function getVimeoVideoId(vimeoUrl: string): string {
    const match = vimeoUrl.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
    return match ? match[1] : '';
  }

  // Fixed animation duration for 0.7x speed
  const animationDuration = '171s';
  
  // Container references
  let stripWrapper: HTMLElement;
  let stripContainer: HTMLElement;
  
  // Drag handlers
  function handleDragStart(e: MouseEvent | TouchEvent) {
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    
    // Reset drag state
    hasMoved = false;
    clickStartTime = Date.now();
    dragStartX = clientX;
    lastDragX = clientX;
    lastDragTime = Date.now();
    velocity = 0;
    
    // Capture current animation position
    if (stripContainer) {
      const computedStyle = getComputedStyle(stripContainer);
      const transform = computedStyle.transform;
      if (transform && transform !== 'none') {
        const matrix = new DOMMatrix(transform);
        animationOffset = matrix.m41; // translateX value
      } else {
        animationOffset = 0;
      }
    }
    
    // Disable hover during potential drag
    hoveredProjectIndex = null;
  }
  
  function handleDragMove(e: MouseEvent | TouchEvent) {
    if (hasMoved) {
      // Already dragging, continue
      if (!isDragging) return;
      e.preventDefault();
      
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      dragCurrentX = clientX - dragStartX;
      dragOffset = dragCurrentX;
      
      // Calculate velocity for momentum
      const now = Date.now();
      const timeDelta = now - lastDragTime;
      if (timeDelta > 0) {
        velocity = (clientX - lastDragX) / timeDelta;
      }
      lastDragX = clientX;
      lastDragTime = now;
    } else {
      // Check if movement exceeds threshold
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const moveDistance = Math.abs(clientX - dragStartX);
      
      if (moveDistance > dragThreshold) {
        // Start dragging
        isDragging = true;
        hasMoved = true;
        e.preventDefault();
        
        dragCurrentX = clientX - dragStartX;
        dragOffset = dragCurrentX;
      }
    }
  }
  
  function handleDragEnd(e: MouseEvent | TouchEvent) {
    if (isDragging) {
      // Was dragging, apply momentum
      isDragging = false;
      applyMomentum();
    } else if (hasMoved) {
      // Moved but didn't exceed threshold, treat as click
      // Let the link handle navigation
    } else {
      // No movement, treat as click
      // Let the link handle navigation
    }
    
    // Reset state
    hasMoved = false;
    isDragging = false;
  }
  
  function applyMomentum() {
    const friction = 0.95;
    const minVelocity = 0.1;
    
    function animate() {
      if (Math.abs(velocity) < minVelocity) {
        velocity = 0;
        dragOffset = 0; // Reset drag offset
        return;
      }
      
      dragOffset += velocity * 16; // 16ms per frame
      velocity *= friction;
      
      requestAnimationFrame(animate);
    }
    
    if (Math.abs(velocity) >= minVelocity) {
      requestAnimationFrame(animate);
    } else {
      // No momentum, reset immediately
      dragOffset = 0;
    }
  }
  
  onMount(() => {
    // No transform override needed - CSS animation handles everything
    if (stripContainer) {
      void stripContainer.offsetWidth;
    }
    
    // Global mouse/touch listeners
    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);
    window.addEventListener('touchmove', handleDragMove);
    window.addEventListener('touchend', handleDragEnd);
    
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('touchend', handleDragEnd);
    };
  });
</script>

<div class="carousel-wrapper">
  <!-- Film Strip -->
  <div bind:this={stripWrapper} class="strip-wrapper">
    <!-- Top Stills Stripe -->
    {#if hoveredProject()}
      {@const currentProject = hoveredProject()}
      {#if currentProject && currentProject.topStills && currentProject.topStills.length > 0}
        <StillImagesStripe 
          images={currentProject.topStills} 
          position="top"
          visible={hoveredProjectIndex !== null}
        />
      {/if}
    {/if}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div 
      bind:this={stripContainer}
      class="strip-container" 
      class:paused={hoveredProjectIndex !== null || isDragging}
      class:dragging={isDragging}
      style="animation-duration: {animationDuration}; {isDragging || velocity !== 0 ? `animation: none; transform: translateX(${animationOffset + dragOffset}px) translateZ(0);` : ''}"
      onmousedown={handleDragStart}
      ontouchstart={handleDragStart}
    >
    <!-- First set of projects for seamless loop -->
    {#each projects as project, index}
      <div class="project-item">
        <a 
          href="/project/{project.slug.current}"
          class="project-link"
          onmouseenter={() => hoveredProjectIndex = index}
          onmouseleave={() => hoveredProjectIndex = null}
          onclick={() => preloadData(`/project/${project.slug.current}`)}
        >
          <!-- Thumbnail Image -->
          {#if project.thumbnail?.asset}
            <img 
              src={urlFor(project.thumbnail).width(800).url()}
              alt={project.title}
              class="thumbnail"
              class:hidden={hoveredProjectIndex === index}
            />
          {/if}
          
          <!-- Auto-playing Video (preloaded) -->
          {#if getVimeoVideoId(project.vimeoUrl)}
            <iframe
              src="https://player.vimeo.com/video/{getVimeoVideoId(project.vimeoUrl)}?autoplay=1&muted=1&loop=1&controls=0&background=1"
              class="video-player"
              class:visible={hoveredProjectIndex === index}
              frameborder="0"
              allow="autoplay"
              title={project.title}
            ></iframe>
          {/if}
          
          <!-- Project Title - Overlay on thumbnail -->
          <div class="project-title-overlay" class:visible={hoveredProjectIndex === index}>
            <div class="project-title">{project.title}</div>
            {#if project.secondaryThumbnailText}
              <div class="project-secondary-text">{project.secondaryThumbnailText}</div>
            {/if}
          </div>
        </a>
      </div>
    {/each}
    
    <!-- Second set of projects for seamless loop -->
    {#each projects as project, index}
      <div class="project-item">
        <a 
          href="/project/{project.slug.current}"
          class="project-link"
          onmouseenter={() => hoveredProjectIndex = index + projects.length}
          onmouseleave={() => hoveredProjectIndex = null}
          onclick={() => preloadData(`/project/${project.slug.current}`)}
        >
          <!-- Thumbnail Image -->
          {#if project.thumbnail?.asset}
            <img 
              src={urlFor(project.thumbnail).width(800).url()}
              alt={project.title}
              class="thumbnail"
              class:hidden={hoveredProjectIndex === index + projects.length}
            />
          {/if}
          
          <!-- Auto-playing Video (preloaded) -->
          {#if getVimeoVideoId(project.vimeoUrl)}
            <iframe
              src="https://player.vimeo.com/video/{getVimeoVideoId(project.vimeoUrl)}?autoplay=1&muted=1&loop=1&controls=0&background=1"
              class="video-player"
              class:visible={hoveredProjectIndex === index + projects.length}
              frameborder="0"
              allow="autoplay"
              title={project.title}
            ></iframe>
          {/if}
          
          <!-- Project Title - Overlay on thumbnail -->
          <div class="project-title-overlay" class:visible={hoveredProjectIndex === index + projects.length}>
            <div class="project-title">{project.title}</div>
            {#if project.secondaryThumbnailText}
              <div class="project-secondary-text">{project.secondaryThumbnailText}</div>
            {/if}
          </div>
        </a>
      </div>
    {/each}
    
    </div>
    
    <!-- Bottom Stills Stripe -->
    {#if hoveredProject()}
      {@const currentProject = hoveredProject()}
      {#if currentProject && currentProject.bottomStills && currentProject.bottomStills.length > 0}
        <StillImagesStripe 
          images={currentProject.bottomStills} 
          position="bottom"
          visible={hoveredProjectIndex !== null}
        />
      {/if}
    {/if}
  </div>
</div>


<style>
  .carousel-wrapper {
    position: relative;
    width: 100%;
    height: calc(100vh - 150px);
    container-type: inline-size;
  }

  .strip-wrapper {
    width: 100%;
    height: calc(100vh - 150px);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    position: relative;
    gap: 80px;
  }

  .strip-container {
    display: flex;
    align-items: center;
    gap: 0;
    animation: scroll-left 120s linear infinite;
    width: fit-content;
    position: relative;
    order: 2;
    will-change: transform;
    cursor: grab;
    user-select: none;
    -webkit-user-select: none;
  }

  .strip-container.paused {
    animation-play-state: paused;
  }

  .strip-container.dragging {
    cursor: grabbing;
    animation-play-state: paused;
  }

  .strip-container.dragging .project-link {
    pointer-events: none;
  }

  /* Still images ordering and spacing */
  .strip-wrapper :global(.stills-stripe.top) {
    order: 1;
  }

  .strip-wrapper :global(.stills-stripe.bottom) {
    order: 3;
  }

  @keyframes scroll-left {
    0% { 
      transform: translateX(0) translateZ(0);  /* Start at 0 */
    }
    100% { 
      transform: translateX(-50%) translateZ(0);  /* Move exactly one set */
    }
  }

  .project-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    flex-shrink: 0;
  }

  .project-link {
    position: relative;
    width: clamp(500px, 40vw, 600px);
    height: clamp(281px, 22.5vw, 338px); /* 16:9 aspect ratio */
    border-radius: 0;
    overflow: hidden;
    cursor: pointer;
    text-decoration: none;
    background: #000;
    display: block;
    transition: width 0.3s ease, height 0.3s ease;
  }

  .thumbnail {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 1;
    transition: opacity 0.3s ease;
  }

  .thumbnail.hidden {
    opacity: 0;
  }

  .video-player {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  .video-player.visible {
    opacity: 1;
  }

  .project-title-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 15px;
    opacity: 0;
    transition: opacity 0.3s ease;
    text-align: center;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  }

  .project-title-overlay.visible {
    opacity: 1;
  }

  .project-secondary-text {
    color: #fff;
    font-size: 14px;
    font-weight: 300;
    font-family: 'Mynaruse', system-ui, -apple-system, sans-serif;
    margin-top: 4px;
  }

  .project-title {
    color: #fff;
    font-size: 18px;
    font-weight: 300;
    font-family: 'Mynaruse', system-ui, -apple-system, sans-serif;
    text-transform: uppercase;
    margin: 0;
  }

  /* Mobile responsive */
  @media (max-width: 768px) {
    .strip-wrapper {
      gap: 40px; /* Reduce gap on mobile */
    }
    
    .project-link {
      width: clamp(350px, 50vw, 500px);
      height: clamp(197px, 28.125vw, 281px); /* 16:9 aspect ratio */
    }
    
    .project-title {
      font-size: 16px;
    }
    
  }

  @media (max-width: 480px) {
    .project-link {
      width: clamp(280px, 60vw, 400px);
      height: clamp(157px, 33.75vw, 225px);
    }
    
    .project-title {
      font-size: 14px;
    }
  }

</style>