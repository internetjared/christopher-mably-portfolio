<script lang="ts">
  import { preloadData } from '$app/navigation';
  import { urlFor } from '$lib/sanity';
  import type { SanityProject } from '$lib/types/sanity';
  
  let { projects, speedMultiplier }: { 
    projects: SanityProject[]; 
    speedMultiplier: number;
  } = $props();
  
  // State
  let hoveredProjectIndex = $state<number | null>(null);
  
  // Get Vimeo video ID
  function getVimeoVideoId(vimeoUrl: string): string {
    const match = vimeoUrl.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
    return match ? match[1] : '';
  }

  // Computed animation duration
  const animationDuration = $derived(`${90 / speedMultiplier}s`);
</script>

<div class="strip-wrapper">
  <div 
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
        </a>
        
        <!-- Project Title - Below thumbnail -->
        <div class="project-title-container" class:visible={hoveredProjectIndex === index}>
          {#if project.client}
            <div class="project-client">{project.client.toUpperCase()}</div>
          {/if}
          <div class="project-title">{project.title}</div>
        </div>
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
        </a>
        
        <!-- Project Title - Below thumbnail -->
        <div class="project-title-container" class:visible={hoveredProjectIndex === index + projects.length}>
          {#if project.client}
            <div class="project-client">{project.client.toUpperCase()}</div>
          {/if}
          <div class="project-title">{project.title}</div>
        </div>
      </div>
    {/each}
  </div>
</div>


<style>
  .strip-wrapper {
    width: 100%;
    height: calc(100vh - 80px);
    overflow: hidden;
    display: flex;
    align-items: center;
    position: relative;
  }

  .strip-container {
    display: flex;
    align-items: center;
    gap: 0;
    animation: scroll-left 90s linear infinite;
    width: fit-content;
  }

  .strip-container.paused {
    animation-play-state: paused;
  }

  @keyframes scroll-left {
    from { 
      transform: translateX(0); 
    }
    to { 
      transform: translateX(-50%); 
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
    width: 550px;
    height: 309px; /* 16:9 aspect ratio */
    border-radius: 0;
    overflow: hidden;
    cursor: pointer;
    text-decoration: none;
    background: #000;
    display: block;
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
    opacity: 0;
    transition: opacity 0.3s ease;
    text-align: center;
  }

  .project-title-container.visible {
    opacity: 1;
  }

  .project-client {
    color: #666;
    font-size: 12px;
    font-weight: 500;
    font-family: system-ui, -apple-system, sans-serif;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .project-title {
    color: #000;
    font-size: 18px;
    font-weight: 400;
    font-family: system-ui, -apple-system, sans-serif;
    margin: 0;
  }

  /* Mobile responsive */
  @media (max-width: 768px) {
    .project-link {
      width: 350px;
      height: 197px; /* 16:9 aspect ratio */
    }
    
    .project-title {
      font-size: 16px;
    }
    
    .strip-container {
      gap: 0;
    }
  }

  @media (max-width: 480px) {
    .project-link {
      width: 280px;
      height: 158px; /* 16:9 aspect ratio */
    }
    
    .project-title {
      font-size: 14px;
    }
    
    .strip-container {
      gap: 0;
    }
  }

</style>