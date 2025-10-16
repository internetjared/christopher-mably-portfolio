<script lang="ts">
  import { urlFor } from '$lib/sanity';
  import type { SanityProject } from '$lib/types/sanity';

  let { 
    images, 
    position, 
    visible 
  }: { 
    images: SanityProject['topStills']; 
    position: 'top' | 'bottom'; 
    visible: boolean; 
  } = $props();

  // Fixed height and calculate width for 16:9 aspect ratio
  const imageHeight = 100; // Fixed height in pixels
  const imageWidth = $derived(() => {
    return (imageHeight * 16) / 9; // 16:9 aspect ratio (~178px)
  });
</script>

<div 
  class="stills-stripe" 
  class:visible={visible}
  class:top={position === 'top'}
  class:bottom={position === 'bottom'}
>
  {#if images && images.length > 0}
    <div class="stills-container">
      {#each images as still}
        {#if still.asset}
          <img
            src={urlFor(still.asset).width(800).url()}
            alt={still.alt || 'Project still image'}
            class="still-image"
            style="width: {imageWidth}px; height: {imageHeight}px;"
          />
        {/if}
      {/each}
    </div>
  {/if}
</div>

<style>
  .stills-stripe {
    position: relative;
    left: 50%;
    transform: translateX(-50%) translateZ(0);
    width: 100vw;
    opacity: 0;
    transition: opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1);
    z-index: 5;
    pointer-events: none;
    will-change: opacity;
  }

  .stills-stripe.visible {
    opacity: 1;
  }

  .stills-stripe.top {
    order: 1;
  }

  .stills-stripe.bottom {
    order: 3;
  }

  .stills-container {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    width: 100%;
    height: 100%;
  }

  .still-image {
    flex: 0 0 auto;
    object-fit: cover;
    display: block;
    will-change: opacity;
    backface-visibility: hidden;
  }

  /* Hide scrollbar but keep functionality */
  .stills-container::-webkit-scrollbar {
    display: none;
  }

  .stills-container {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  /* Responsive breakpoints */
  @media (max-width: 768px) {
    .still-image {
      height: 80px;
      width: auto;
    }
  }

  @media (min-width: 769px) {
    .still-image {
      height: 100px;
    }
  }
</style>
