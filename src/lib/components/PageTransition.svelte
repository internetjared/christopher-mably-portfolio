<script lang="ts">
  import { onMount } from 'svelte';
  import { navigating } from '$app/stores';
  
  let isReady = $state(false);
  
  onMount(() => {
    // Small delay to ensure smooth entrance
    requestAnimationFrame(() => {
      isReady = true;
    });
  });
</script>

<div class="page-transition" class:ready={isReady} class:navigating={$navigating}>
  <slot />
</div>

<style>
  .page-transition {
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .page-transition.ready {
    opacity: 1;
    transform: translateY(0);
  }
  
  .page-transition.navigating {
    pointer-events: none;
  }
</style>
