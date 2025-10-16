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
  
  // Get hovered project data
  const hoveredProject = $derived(() => {
    if (hoveredProjectIndex === null) return null;
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
  
  onMount(() => {
    // No transform override needed - CSS animation handles everything
    if (stripContainer) {
      void stripContainer.offsetWidth;
    }
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
    <div 
      bind:this={stripContainer}
      class="strip-container" 
      class:paused={hoveredProjectIndex !== null}
      style="animation-duration: {animationDuration};"
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
  }

  .strip-container.paused {
    animation-play-state: paused;
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