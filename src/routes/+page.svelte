<script lang="ts">
	import EnhancedVideoPlayer from '$lib/components/EnhancedVideoPlayer.svelte';
	import type { SanityProject } from '$lib/types/sanity';

	let { data }: { data: { project: SanityProject | null; allProjects: SanityProject[] } } = $props();
</script>

<svelte:head>
	<title>Video Player</title>
</svelte:head>

<main>
	<EnhancedVideoPlayer project={data.project} allProjects={data.allProjects} />
</main>

<style>
	main {
		width: 100%;
		height: 100vh;
		margin: 0;
		padding: 0;
	}
</style>