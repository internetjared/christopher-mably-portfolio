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
	<Header isHomepage={true} />

	<main>
		<ProjectCarousel projects={data.allProjects} />
	</main>
</PageTransition>

<!-- Contact Link -->
<div class="contact-control">
	<a href="/info" class="contact-link">CONTACT</a>
</div>

<style>
	main {
		height: 100vh;
		background: #fff;
	}
	
	/* Contact Control */
	.contact-control {
		position: fixed;
		bottom: 20px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 9999;
		background: rgba(255, 255, 255, 0.8);
		padding: 6px 12px;
		border-radius: 5px;
	}

	.contact-link {
		color: #000;
		font-size: 12px;
		font-family: 'Mynaruse', system-ui, -apple-system, sans-serif;
		text-decoration: none;
		font-weight: 100;
		transition: opacity 0.3s ease;
	}

	.contact-link:hover {
		opacity: 0.6;
	}

	/* Mobile responsive */
	@media (max-width: 768px) {
		.contact-control {
			bottom: 15px;
		}
		
		.contact-link {
			font-size: 12px;
		}
	}

	@media (max-width: 480px) {
		.contact-control {
			bottom: 10px;
		}
		
		.contact-link {
			font-size: 11px;
		}
	}
</style>