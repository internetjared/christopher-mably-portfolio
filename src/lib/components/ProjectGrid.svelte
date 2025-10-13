<script lang="ts">
  import { goto } from '$app/navigation';
  import { urlFor } from '$lib/sanity';
  import type { SanityProject } from '$lib/types/sanity';
  
  let { projects }: { projects: SanityProject[] } = $props();
  
  // Hover state management
  let hoveredProject: string | null = $state(null);
  
  function getVimeoVideoId(vimeoUrl: string): string {
    const match = vimeoUrl.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
    return match ? match[1] : '';
  }
  
  function navigateToProject(slug: string) {
    goto(`/project/${slug}`);
  }
</script>

<div class="project-grid">
  {#each projects as project, index}
    <div 
      class="project-item"
      class:large={index % 5 === 0}
      onmouseenter={() => hoveredProject = project._id}
      onmouseleave={() => hoveredProject = null}
      onclick={() => navigateToProject(project.slug.current)}
      role="button"
      tabindex="0"
      onkeydown={(e) => e.key === 'Enter' && navigateToProject(project.slug.current)}
    >
      <!-- Thumbnail -->
      {#if project.thumbnail}
        <img 
          src={urlFor(project.thumbnail).width(800).url()}
          alt={project.thumbnail.alt || project.title}
          class="thumbnail"
          class:hidden={hoveredProject === project._id}
        />
      {/if}
      
      <!-- Video on hover -->
      {#if hoveredProject === project._id}
        {@const videoId = getVimeoVideoId(project.vimeoUrl)}
        {#if videoId}
          <iframe
            src="https://player.vimeo.com/video/{videoId}?autoplay=1&muted=1&loop=1&controls=0&background=1"
            class="video-hover"
            frameborder="0"
            allow="autoplay"
            title="{project.title} preview"
          ></iframe>
        {/if}
      {/if}
      
      <!-- Project Title -->
      <div class="project-title">{project.title}</div>
    </div>
  {/each}
</div>

<style>
  .project-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    padding: 100px 40px 40px;
    max-width: 1600px;
    margin: 0 auto;
  }
  
  .project-item {
    position: relative;
    aspect-ratio: 16/9;
    border-radius: 10px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.3s ease;
  }
  
  .project-item:hover {
    transform: scale(1.02);
  }
  
  .project-item.large {
    grid-column: span 2;
  }
  
  .thumbnail, .video-hover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .thumbnail.hidden {
    opacity: 0;
  }
  
  .project-title {
    position: absolute;
    bottom: 20px;
    left: 20px;
    color: white;
    font-size: 18px;
    font-weight: 500;
    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
    z-index: 10;
  }
  
  /* Responsive design */
  @media (max-width: 768px) {
    .project-grid {
      grid-template-columns: 1fr;
      padding: 100px 20px 20px;
    }
    
    .project-item.large {
      grid-column: span 1;
    }
  }
  
  @media (min-width: 769px) and (max-width: 1024px) {
    .project-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .project-item.large {
      grid-column: span 2;
    }
  }
</style>
