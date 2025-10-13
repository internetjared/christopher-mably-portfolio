<script lang="ts">
	import EnhancedVideoPlayer from '$lib/components/EnhancedVideoPlayer.svelte';
	import type { SanityProject } from '$lib/types/sanity';

	let { data }: { data: { project: SanityProject; allProjects: SanityProject[] } } = $props();
</script>

<svelte:head>
	<title>{data.project.title}</title>
</svelte:head>

<main>
	{#if data?.project}
		{#key data.project._id}
			<EnhancedVideoPlayer project={data.project} allProjects={data.allProjects} />
		{/key}
	{:else}
		<div style="color: white; padding: 20px; background: #000; height: 100vh; display: flex; align-items: center; justify-content: center;">
			Loading project...
		</div>
	{/if}
</main>

<style>
	main {
		width: 100%;
		height: 100vh;
		margin: 0;
		padding: 0;
		position: relative;
		z-index: 1;
	}
</style>