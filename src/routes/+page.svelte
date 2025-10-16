<script lang="ts">
	import ProjectCarousel from '$lib/components/ProjectCarousel.svelte';
	import Header from '$lib/components/Header.svelte';
	import type { SanityProject } from '$lib/types/sanity';

	let { data }: { data: { allProjects: SanityProject[] } } = $props();
	
	// Category filter state
	let selectedCategory = $state<string | null>(null);
	
	// Filter projects based on selected category
	const filteredProjects = $derived(() => {
		if (!selectedCategory) {
			return data.allProjects;
		}
		return data.allProjects.filter(project => project.category === selectedCategory);
	});
	
	// Category filter functions
	function selectCategory(category: string) {
		if (selectedCategory === category) {
			// Deselect if clicking the same category
			selectedCategory = null;
		} else {
			selectedCategory = category;
		}
	}
</script>

<svelte:head>
	<title>Christopher Mably Portfolio</title>
</svelte:head>

<Header isHomepage={true} />

<!-- Category Filter -->
<div class="category-filter">
	<button 
		class="category-button" 
		class:active={selectedCategory === 'commercial'}
		onclick={() => selectCategory('commercial')}
	>
		COMMERCIAL
	</button>
	<span class="separator">|</span>
	<button 
		class="category-button" 
		class:active={selectedCategory === 'narrative'}
		onclick={() => selectCategory('narrative')}
	>
		NARRATIVE
	</button>
</div>

<main>
	<ProjectCarousel projects={filteredProjects()} />
</main>

<!-- Contact Link -->
<div class="contact-control">
	<a href="/info" class="contact-link">CONTACT</a>
</div>

<style>
	main {
		height: 100vh;
		background: #fff;
	}
	
	/* Category Filter */
	.category-filter {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 20px;
		padding: 5px 0;
		background: #fff;
	}
	
	.category-button {
		background: transparent;
		border: none;
		color: #000;
		font-size: 12px;
		font-family: 'Mynaruse', system-ui, -apple-system, sans-serif;
		font-weight: 300;
		cursor: pointer;
		opacity: 0.4;
		transition: opacity 0.3s ease;
		text-transform: uppercase;
	}
	
	.category-button:hover {
		opacity: 0.7;
	}
	
	.category-button.active {
		opacity: 1;
	}
	
	.separator {
		color: #000;
		font-size: 12px;
		font-family: 'Mynaruse', system-ui, -apple-system, sans-serif;
		font-weight: 300;
		opacity: 0.4;
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