<script lang="ts">
	import ProjectCarousel from '$lib/components/ProjectCarousel.svelte';
	import Header from '$lib/components/Header.svelte';
	import PageTransition from '$lib/components/PageTransition.svelte';
	import type { SanityProject } from '$lib/types/sanity';

	let { data }: { data: { allProjects: SanityProject[] } } = $props();
</script>

<svelte:head>
	<title>Christopher Mably Portfolio</title>
</svelte:head>

<PageTransition>
	<Header />

	<main>
		<ProjectCarousel projects={data.allProjects} />
	</main>
</PageTransition>

<style>
	main {
		min-height: 100vh;
		background: #fff;
	}
</style>