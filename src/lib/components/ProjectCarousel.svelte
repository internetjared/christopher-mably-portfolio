<script lang="ts">
  import { preloadData } from '$app/navigation';
  import { urlFor } from '$lib/sanity';
  import type { SanityProject } from '$lib/types/sanity';
  
  let { projects }: { projects: SanityProject[] } = $props();
  
  // State
  let hoveredProjectIndex = $state<number | null>(null);
  
  // Get Vimeo video ID
  function getVimeoVideoId(vimeoUrl: string): string {
    const match = vimeoUrl.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
    return match ? match[1] : '';
  }
</script>

<div class="grid-container">
  {#each projects as project, index}
    <div class="grid-item-wrapper">
      <a 
        href="/project/{project.slug.current}"
        class="grid-item"
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
      </a>
      
      <!-- Project Title - Outside the grid item -->
      <div class="project-title-container">
        {#if project.client}
          <div class="project-client">{project.client.toUpperCase()}</div>
        {/if}
        <div class="project-title">{project.title}</div>
      </div>
    </div>
  {/each}
</div>

<style>
  .grid-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: auto;
    gap: 50px;
    padding: 20px;
    width: 100%;
    max-width: 2000px;
    margin: 0 auto;
  }

  .grid-item-wrapper {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .grid-item {
    position: relative;
    border-radius: 10px; /* Same as before */
    overflow: hidden;
    cursor: pointer;
    text-decoration: none;
    background: #000;
    aspect-ratio: 16/9; /* 16:9 aspect ratio */
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

  .project-title-container {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .project-client {
    color: #666;
    font-size: 12px;
    font-weight: 500;
    font-family: system-ui, -apple-system, sans-serif;
    text-align: left;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .project-title {
    color: #000;
    font-size: 18px;
    font-weight: 400;
    font-family: system-ui, -apple-system, sans-serif;
    text-align: left;
    margin: 0;
  }

  /* Mobile: Stack vertically */
  @media (max-width: 768px) {
    .grid-container {
      grid-template-columns: 1fr;
      grid-template-rows: auto;
      gap: 15px;
      height: auto;
      padding: 15px;
    }
    
    .grid-item-wrapper {
      gap: 8px;
    }
    
    .grid-item {
      min-height: 300px;
    }
    
    .project-title {
      font-size: 16px;
    }
  }
</style>