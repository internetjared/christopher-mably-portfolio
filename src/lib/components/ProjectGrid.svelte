<script lang="ts">
  import { urlFor } from '$lib/sanity';
  import type { SanityProject } from '$lib/types/sanity';
  
  let { projects }: { projects: SanityProject[] } = $props();
  
  // Hover state management
  let hoveredProject: string | null = $state(null);
  
  function getVimeoVideoId(vimeoUrl: string): string {
    const match = vimeoUrl.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
    return match ? match[1] : '';
  }
</script>

<div class="project-grid">
  {#each projects as project, index}
    <div 
      class="project-item"
      class:large={index % 5 === 0}
    >
      <!-- Thumbnail Container (clickable) -->
      <a 
        href="/project/{project.slug.current}"
        class="thumbnail-container"
        onmouseenter={() => hoveredProject = project._id}
        onmouseleave={() => hoveredProject = null}
      >
        <!-- Thumbnail Image -->
        {#if project.thumbnail && project.thumbnail.asset}
          <img 
            src={urlFor(project.thumbnail).width(800).url()}
            alt={project.thumbnail.alt || project.title}
            class="thumbnail"
            class:faded={hoveredProject === project._id}
          />
        {:else}
          <!-- Fallback placeholder when no thumbnail -->
          <div class="thumbnail-placeholder">
            <span>No Image</span>
          </div>
        {/if}
        
        <!-- Preloaded Video (always present, hidden until hover) -->
        {@const videoId = getVimeoVideoId(project.vimeoUrl)}
        {#if videoId}
          <iframe
            src="https://player.vimeo.com/video/{videoId}?autoplay=1&muted=1&loop=1&controls=0&background=1"
            class="video-hover"
            class:visible={hoveredProject === project._id}
            frameborder="0"
            allow="autoplay"
            title="{project.title} preview"
          ></iframe>
        {/if}
      </a>
      
      <!-- Project Title (below thumbnail) -->
      <a href="/project/{project.slug.current}" class="project-title-link">
        <h3 class="project-title">{project.title}</h3>
      </a>
    </div>
  {/each}
</div>

<style>
  .project-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 40px; /* Increased from 20px */
    padding: 100px 40px 40px;
    max-width: 1600px;
    margin: 0 auto;
  }
  
  .project-item {
    display: flex;
    flex-direction: column;
    gap: 12px; /* Space between thumbnail and title */
  }
  
  .project-item.large {
    grid-column: span 2;
  }
  
  .thumbnail-container {
    position: relative;
    aspect-ratio: 16/9;
    border-radius: 10px;
    overflow: hidden;
    display: block;
    transition: transform 0.3s ease;
  }
  
  .thumbnail-container:hover {
    transform: scale(1.02);
  }
  
  .thumbnail, .video-hover, .thumbnail-placeholder {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: opacity 0.5s ease;
  }
  
  .thumbnail-placeholder {
    background: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    font-size: 14px;
  }
  
  .thumbnail.faded {
    opacity: 0;
  }
  
  .video-hover {
    opacity: 0;
    pointer-events: none;
  }
  
  .video-hover.visible {
    opacity: 1;
  }
  
  .project-title-link {
    text-decoration: none;
    color: inherit;
  }
  
  .project-title {
    margin: 0;
    color: #000;
    font-size: 16px;
    font-weight: 400;
    font-family: system-ui, -apple-system, sans-serif;
    transition: opacity 0.2s ease;
  }
  
  .project-title-link:hover .project-title {
    opacity: 0.7;
  }
  
  /* Responsive design */
  @media (max-width: 768px) {
    .project-grid {
      grid-template-columns: 1fr;
      padding: 100px 20px 20px;
      gap: 30px; /* Slightly less gap on mobile */
    }
    
    .project-item.large {
      grid-column: span 1;
    }
  }
  
  @media (min-width: 769px) and (max-width: 1024px) {
    .project-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 35px;
    }
    
    .project-item.large {
      grid-column: span 2;
    }
  }
</style>
