<script lang="ts">
	import EnhancedVideoPlayer from '$lib/components/EnhancedVideoPlayer.svelte';
	import type { SanityProject } from '$lib/types/sanity';

	let { data }: { data: { project: SanityProject; allProjects: SanityProject[] } } = $props();
</script>

<svelte:head>
	<title>{data.project.title}</title>
</svelte:head>

<main>
	{#key data.project._id}
		<EnhancedVideoPlayer project={data.project} allProjects={data.allProjects} />
	{/key}
</main>

<style>
	main {
		width: 100%;
		height: 100vh;
		margin: 0;
		padding: 0;
	}
</style>