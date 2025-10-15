<script lang="ts">
	import ProjectCarousel from '$lib/components/ProjectCarousel.svelte';
	import Header from '$lib/components/Header.svelte';
	import PageTransition from '$lib/components/PageTransition.svelte';
	import { onMount } from 'svelte';
	import type { SanityProject } from '$lib/types/sanity';

	let { data }: { data: { allProjects: SanityProject[] } } = $props();
	
	// Speed control state
	let speedMultiplier = $state(1);
	
	// Speed control functions
	function updateSpeed(newSpeed: number) {
		speedMultiplier = newSpeed;
		localStorage.setItem('scrollSpeed', newSpeed.toString());
	}

	onMount(() => {
		const savedSpeed = localStorage.getItem('scrollSpeed');
		if (savedSpeed) {
			speedMultiplier = parseFloat(savedSpeed);
		}
	});
</script>

<svelte:head>
	<title>Christopher Mably Portfolio</title>
</svelte:head>

<PageTransition>
	<Header />

	<main>
		<ProjectCarousel projects={data.allProjects} speedMultiplier={speedMultiplier} />
	</main>
</PageTransition>

<!-- Speed Control -->
<div class="speed-control">
	<button 
		class="speed-option" 
		class:active={speedMultiplier === 1}
		onclick={() => updateSpeed(1)}
	>
		1x
	</button>
	<button 
		class="speed-option" 
		class:active={speedMultiplier === 2}
		onclick={() => updateSpeed(2)}
	>
		2x
	</button>
	<button 
		class="speed-option" 
		class:active={speedMultiplier === 3}
		onclick={() => updateSpeed(3)}
	>
		3x
	</button>
	<button 
		class="speed-option" 
		class:active={speedMultiplier === 4}
		onclick={() => updateSpeed(4)}
	>
		4x
	</button>
</div>

<style>
	main {
		height: 100vh;
		background: #fff;
	}
	
	/* Speed Control */
	.speed-control {
		position: fixed;
		bottom: 20px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 9999;
		display: flex;
		gap: 10px;
		background: rgba(255, 255, 255, 0.8);
		padding: 6px 12px;
		border-radius: 5px;
	}

	.speed-option {
		background: transparent;
		border: none;
		color: #000;
		font-size: 12px;
		font-family: system-ui, -apple-system, sans-serif;
		cursor: pointer;
		opacity: 0.3;
		transition: opacity 0.3s ease;
		padding: 3px 6px;
		font-weight: 400;
	}

	.speed-option:hover {
		opacity: 0.6;
	}

	.speed-option.active {
		opacity: 1;
		font-weight: 500;
	}

	/* Mobile responsive */
	@media (max-width: 768px) {
		.speed-control {
			bottom: 15px;
			gap: 10px;
		}
		
		.speed-option {
			font-size: 12px;
		}
	}

	@media (max-width: 480px) {
		.speed-control {
			bottom: 10px;
			gap: 8px;
		}
		
		.speed-option {
			font-size: 11px;
		}
	}
</style>