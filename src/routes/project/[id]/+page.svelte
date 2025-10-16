<script lang="ts">
	import EnhancedVideoPlayer from '$lib/components/EnhancedVideoPlayer.svelte';
	import VideoSkeleton from '$lib/components/VideoSkeleton.svelte';
	import type { SanityProject } from '$lib/types/sanity';
	
	let { data }: { data: { project: SanityProject; allProjects: SanityProject[] } } = $props();
	
	let showSkeleton = $state(true);
	let currentProjectId = $state(data.project._id);
	
	// Detect project changes
	$effect(() => {
		if (data.project._id !== currentProjectId) {
			showSkeleton = true;
			currentProjectId = data.project._id;
			// Hide skeleton after short delay
			setTimeout(() => {
				showSkeleton = false;
			}, 300);
		} else {
			showSkeleton = false;
		}
	});
</script>

<svelte:head>
	<title>{data.project.title}</title>
</svelte:head>

<main>
	{#if showSkeleton}
		<VideoSkeleton />
	{/if}
	
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
		position: relative;
	}
</style>