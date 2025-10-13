<script lang="ts">
  import ProjectGrid from '$lib/components/ProjectGrid.svelte';
  import Header from '$lib/components/Header.svelte';
  import type { SanityProject } from '$lib/types/sanity';

  let { data }: { data: { allProjects: SanityProject[] } } = $props();
</script>

<svelte:head>
  <title>Christopher Mably Portfolio</title>
</svelte:head>

<Header />

<main>
  <ProjectGrid projects={data.allProjects} />
</main>

<style>
  main {
    min-height: 100vh;
    background: #fff;
  }
</style>