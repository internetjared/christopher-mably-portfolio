<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { preloadData } from '$app/navigation';
	import type { SanityProject } from '$lib/types/sanity';
	
	// Props
	let { project, allProjects }: { project: SanityProject | null; allProjects: SanityProject[] } = $props();
	
	// State
	let player: any = null;
	let isPlaying = $state(true);
	let duration = $state(0);
	let currentTime = $state(0);
	let progress = $state(0);
	let lastUpdateTime = $state(0);
	let animationFrame: number | null = null;
	let showControls = $state(true);
	let hideTimeout: ReturnType<typeof setTimeout> | null = null;
	let showCredits = $state(false);
	let isMuted = $state(true);
	let isInitializing = $state(false);
	let isFullscreen = $state(false);
	let isDraggingProgress = $state(false);
	let hoverTime = $state(0);
	let showHoverTime = $state(false);

	// Utility function to extract Vimeo video ID
	function getVimeoVideoId(vimeoUrl: string): string {
		const match = vimeoUrl.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
		return match ? match[1] : '';
	}

	// Navigation helper functions
	function getPreviousProject(): SanityProject | null {
		if (!project || !allProjects.length) return null;
		const currentIndex = allProjects.findIndex(p => p._id === project._id);
		if (currentIndex === -1) return null;
		const prevIndex = currentIndex === 0 ? allProjects.length - 1 : currentIndex - 1;
		return allProjects[prevIndex];
	}

	function getNextProject(): SanityProject | null {
		if (!project || !allProjects.length) return null;
		const currentIndex = allProjects.findIndex(p => p._id === project._id);
		if (currentIndex === -1) return null;
		const nextIndex = currentIndex === allProjects.length - 1 ? 0 : currentIndex + 1;
		return allProjects[nextIndex];
	}

	function navigateToProject(targetProject: SanityProject | null) {
		if (!targetProject?.slug?.current) return;
		goto(`/project/${targetProject.slug.current}`);
	}

	// Preload adjacent project data
	$effect(() => {
		if (allProjects.length > 1) {
			const prevProject = getPreviousProject();
			const nextProject = getNextProject();
			
			if (prevProject?.slug?.current) {
				preloadData(`/project/${prevProject.slug.current}`);
			}
			if (nextProject?.slug?.current) {
				preloadData(`/project/${nextProject.slug.current}`);
			}
		}
	});



		// Load Vimeo Player API
	onMount(() => {
		// Check if Vimeo Player API is already loaded
		if ((window as any).Vimeo) {
			// API already loaded, initialize immediately
			initializePlayer();
		} else {
			// Load the API script
		const script = document.createElement('script');
		script.src = 'https://player.vimeo.com/api/player.js';
		script.onload = () => {
				initializePlayer();
		};
		document.head.appendChild(script);
		}

		// Hide controls after 3 seconds of inactivity (only if playing)
		if (isPlaying) {
			hideTimeout = setTimeout(() => {
			showControls = false;
		}, 2000);
		}

		return () => {
			if (player) {
				player.destroy();
			}
			if (hideTimeout) {
				clearTimeout(hideTimeout);
			}
		};
	});

	onDestroy(() => {
		stopSmoothProgress();
	});

	function initializePlayer() {
		// Prevent multiple simultaneous initializations
		if (isInitializing) {
			return;
		}
		
		isInitializing = true;
		
		if (!project?.vimeoUrl) {
			console.warn('No vimeoUrl for project:', project);
			isInitializing = false;
			return;
		}

		const videoId = getVimeoVideoId(project.vimeoUrl);
		if (!videoId) {
			console.warn('No video ID found for URL:', project.vimeoUrl);
			isInitializing = false;
			return;
		}

		const iframe = document.getElementById('vimeo-player') as HTMLIFrameElement;
		if (!iframe) {
			console.warn('Vimeo iframe not found');
			isInitializing = false;
			return;
		}

		// Clean up existing player before creating new one
		if (player) {
			try {
				player.destroy();
			} catch (error) {
				console.warn('Error destroying existing player:', error);
			}
			player = null;
		}

		try {
			player = new (window as any).Vimeo.Player(iframe);
		} catch (error) {
			console.error('Error creating Vimeo player:', error);
			isInitializing = false;
			return;
		}

		// Player events
		player.on('loaded', () => {
					player.getDuration().then((dur: number) => {
						duration = dur;
			});
			// Set sound to off by default
			player.setVolume(0);
			isMuted = true;
			// Start smooth progress animation since video autoplays
			if (isPlaying) {
				startSmoothProgress();
			}
			isInitializing = false; // Mark initialization complete
		});

		player.on('timeupdate', (data: any) => {
			// Store the accurate time from Vimeo for reference
			lastUpdateTime = data.seconds;
		});

				player.on('play', () => {
					isPlaying = true;
					startSmoothProgress();
				});

				player.on('pause', () => {
					isPlaying = false;
					stopSmoothProgress();
				});

				player.on('ended', () => {
					isPlaying = false;
			stopSmoothProgress();
		});
	}

	// Toggle play/pause
	function togglePlayPause() {
		if (!player) {
			console.warn('Player not initialized yet');
			return;
		}
		
		// Check if player is still valid
		if (isInitializing) {
			console.warn('Player is still initializing, please wait...');
			return;
		}
		
			try {
				if (isPlaying) {
					player.pause().catch((error: any) => {
						console.error('Error pausing video:', error);
					});
				// Clear any existing timeout and keep controls visible when paused
				if (hideTimeout) {
					clearTimeout(hideTimeout);
					hideTimeout = null;
				}
				showControls = true;
				} else {
					player.play().catch((error: any) => {
						console.error('Error playing video:', error);
					});
				}
			} catch (error) {
			console.error('Error toggling play/pause:', error);
		}
	}

	// Show controls on mouse move and hide after 3 seconds of inactivity (only when playing)
	function handleMouseMove() {
		showControls = true;
		
		// Clear existing timeout
		if (hideTimeout) {
			clearTimeout(hideTimeout);
		}
		
		// Only set timeout to hide if video is playing
		if (isPlaying) {
			hideTimeout = setTimeout(() => {
			showControls = false;
		}, 2000);
		}
	}

	// Modal functions
	function openCredits() {
		showCredits = true;
	}

	function closeModals() {
		showCredits = false;
	}

	// Toggle sound
	function toggleSound() {
		if (player) {
			if (isMuted) {
				player.setVolume(1);
				isMuted = false;
			} else {
				player.setVolume(0);
				isMuted = true;
			}
		}
	}

	// Fullscreen functionality
	function toggleFullscreen() {
		const container = document.querySelector('.video-player-container') as HTMLElement;
		if (!container) return;

		if (!document.fullscreenElement) {
			container.requestFullscreen().catch((err) => {
				console.error('Error attempting to enable fullscreen:', err);
			});
		} else {
			document.exitFullscreen();
		}
	}

	// Listen for fullscreen changes
	onMount(() => {
		const handleFullscreenChange = () => {
			isFullscreen = !!document.fullscreenElement;
		};

		document.addEventListener('fullscreenchange', handleFullscreenChange);

		return () => {
			document.removeEventListener('fullscreenchange', handleFullscreenChange);
		};
	});

	// Enhanced progress bar handlers with drag support
	function handleProgressMouseDown(event: MouseEvent) {
		if (!player || !duration) return;
		isDraggingProgress = true;
		updateProgressFromMouse(event);
		// Prevent text selection while dragging
		event.preventDefault();
	}

	function handleProgressMouseMove(event: MouseEvent) {
		if (!player || !duration) return;
		
		// Update hover time preview
		const progressBar = event.currentTarget as HTMLElement;
		const rect = progressBar.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const percentage = Math.max(0, Math.min(1, x / rect.width));
		hoverTime = percentage * duration;
		showHoverTime = true;
		
		// Update video position if dragging
		if (isDraggingProgress) {
			updateProgressFromMouse(event);
		}
	}

	function handleProgressMouseLeave() {
		showHoverTime = false;
	}

	function updateProgressFromMouse(event: MouseEvent) {
		if (!player || !duration) return;
		const progressBar = event.currentTarget as HTMLElement;
		const rect = progressBar.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const percentage = Math.max(0, Math.min(1, x / rect.width));
		const newTime = percentage * duration;
		player.setCurrentTime(newTime);
	}

	// Global mouse up handler to stop dragging
	onMount(() => {
		const handleGlobalMouseUp = () => {
			isDraggingProgress = false;
		};
		
		window.addEventListener('mouseup', handleGlobalMouseUp);
		
		return () => {
			window.removeEventListener('mouseup', handleGlobalMouseUp);
		};
	});


	// Ultra-smooth progress animation functions (like Canada Canada)
	function startSmoothProgress() {
		if (animationFrame) {
			cancelAnimationFrame(animationFrame);
		}
		animateProgress();
	}

	function stopSmoothProgress() {
		if (animationFrame) {
			cancelAnimationFrame(animationFrame);
			animationFrame = null;
		}
	}

	function animateProgress() {
		if (player && isPlaying && duration > 0) {
			// Get current time from player for accuracy
			player.getCurrentTime().then((time: number) => {
				currentTime = time;
				progress = (time / duration) * 100;
			}).catch(() => {
				// Handle any errors gracefully
			});
		}
		// Continue animation loop for ultra-smooth updates
		animationFrame = requestAnimationFrame(animateProgress);
	}


	// Format time helper
	function formatTime(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}
</script>

<div class="video-player-container" class:modal-open={showCredits} onmousemove={handleMouseMove}>
	{#if project?.vimeoUrl}
		{@const videoId = getVimeoVideoId(project.vimeoUrl)}
		{#if videoId}
		<iframe
				id="vimeo-player"
				src="https://player.vimeo.com/video/{videoId}?autoplay=1&muted=1&loop=0&controls=0&background=1"
				width="100%"
				height="100%"
			frameborder="0"
			allow="autoplay; fullscreen; picture-in-picture"
			allowfullscreen
		></iframe>
		{/if}
	{/if}


	<!-- Play/Pause Button -->
	<div class="play-pause-overlay" class:visible={showControls}>
		<button class="play-pause-button" onclick={togglePlayPause}>
			{#if isPlaying}
				<!-- Pause Icon -->
				<svg width="65" height="65" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round">
					<rect x="6" y="4" width="4" height="16"/>
					<rect x="14" y="4" width="4" height="16"/>
				</svg>
			{:else}
				<!-- Play Icon -->
				<svg width="65" height="65" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round">
					<polygon points="8 5, 19 12, 8 19"/>
				</svg>
			{/if}
		</button>
	</div>

	<!-- Project Title and Links -->
	<div class="title-overlay" class:visible={showControls && !showCredits}>
		<div class="title-container">
			<h1 class="project-title">{project?.title || ''}</h1>
	</div>
		<div class="links-container">
			<button class="link-button" onclick={openCredits}>CREDITS</button>
					</div>
				</div>

	<!-- Progress bar with time and sound controls -->
	<div class="progress-container" class:visible={showControls}>
		<div class="time-display">
			{formatTime(currentTime)} — {formatTime(duration)}
	</div>
		<div 
			class="progress-bar" 
			class:dragging={isDraggingProgress}
			onmousedown={handleProgressMouseDown}
			onmousemove={handleProgressMouseMove}
			onmouseleave={handleProgressMouseLeave}
		>
			<div class="progress-fill" style="width: {progress}%"></div>
			{#if showHoverTime}
				<div class="hover-time" style="left: {(hoverTime / duration) * 100}%">
					{formatTime(hoverTime)}
			</div>
			{/if}
		</div>
		<button class="sound-button" onclick={toggleSound}>
			{#if isMuted}
				<!-- Muted Icon -->
				<svg viewBox="0 0 24 24" fill="currentColor">
					<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
				</svg>
			{:else}
				<!-- Unmuted Icon -->
				<svg viewBox="0 0 24 24" fill="currentColor">
					<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
				</svg>
			{/if}
		</button>
		<button class="fullscreen-button" onclick={toggleFullscreen} aria-label="Toggle fullscreen">
			{#if isFullscreen}
				<!-- Exit Fullscreen Icon -->
				<svg viewBox="0 0 24 24" fill="currentColor">
					<path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
				</svg>
			{:else}
				<!-- Enter Fullscreen Icon -->
				<svg viewBox="0 0 24 24" fill="currentColor">
					<path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
				</svg>
			{/if}
		</button>
	</div>


	<!-- Logo (shown when paused, clickable to homepage) -->
	<div class="logo-overlay" class:visible={!isPlaying}>
		<a href="/" class="logo-link">
			<div class="logo-text">
				<div class="main-text">Christopher Mably</div>
				<div class="sub-text">CSC</div>
				</div>
		</a>
		</div>

	<!-- Close Button (top-right) -->
	<div class="close-button-overlay" class:visible={showControls}>
		<a href="/" class="close-button" aria-label="Back to homepage">
			<svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round">
				<path d="M18 6L6 18M6 6l12 12"/>
			</svg>
		</a>
			</div>

	<!-- Navigation Arrows -->
	{#if allProjects.length > 1}
		<div class="nav-arrows" class:visible={showControls}>
			<button 
				class="nav-arrow nav-arrow-left" 
				onclick={() => navigateToProject(getPreviousProject())}
				aria-label="Previous project"
			>
				<svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round">
					<path d="M15 18l-6-6 6-6"/>
				</svg>
			</button>

			<button 
				class="nav-arrow nav-arrow-right" 
				onclick={() => navigateToProject(getNextProject())}
				aria-label="Next project"
			>
				<svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round">
					<path d="M9 18l6-6-6-6"/>
				</svg>
			</button>
		</div>
	{/if}

	<!-- Navigation Thumbnails (always loaded, shown when paused) -->
	{#if allProjects.length > 1}
		<div class="nav-thumbnails" class:visible={!isPlaying}>
			{#if getPreviousProject()}
				{@const prevProject = getPreviousProject()}
				{@const prevVideoId = getVimeoVideoId(prevProject.vimeoUrl)}
				{#if prevVideoId}
					<div 
						class="nav-thumbnail nav-thumbnail-left"
						onclick={() => navigateToProject(prevProject)}
						role="button"
						tabindex="0"
						onkeydown={(e) => e.key === 'Enter' && navigateToProject(prevProject)}
					>
						<div class="thumbnail-container">
							<iframe
								src="https://player.vimeo.com/video/{prevVideoId}?autoplay=1&muted=1&loop=1&controls=0&background=1"
								frameborder="0"
								allow="autoplay"
								title="{prevProject.title} preview"
							></iframe>
						</div>
						<div class="thumbnail-title">{prevProject.title}</div>
					</div>
				{/if}
			{/if}

			{#if getNextProject()}
				{@const nextProject = getNextProject()}
				{@const nextVideoId = getVimeoVideoId(nextProject.vimeoUrl)}
				{#if nextVideoId}
					<div 
						class="nav-thumbnail nav-thumbnail-right"
						onclick={() => navigateToProject(nextProject)}
							role="button"
							tabindex="0"
						onkeydown={(e) => e.key === 'Enter' && navigateToProject(nextProject)}
					>
						<div class="thumbnail-container">
							<iframe
								src="https://player.vimeo.com/video/{nextVideoId}?autoplay=1&muted=1&loop=1&controls=0&background=1"
								frameborder="0"
								allow="autoplay"
								title="{nextProject.title} preview"
							></iframe>
						</div>
						<div class="thumbnail-title">{nextProject.title}</div>
				</div>
				{/if}
			{/if}
		</div>
	{/if}


	<!-- Credits Modal -->
	{#if showCredits}
		<div class="modal-overlay" onclick={closeModals}>
			<div class="modal-content" onclick={(e) => e.stopPropagation()}>
				<div class="modal-title">{project?.title || ''}</div>
				<div class="modal-text">
					{#if project?.credits && project.credits.length > 0}
						{#each project.credits as credit}
							<div class="credit-item">
								<span class="credit-role">{credit.role}</span>
								<span class="credit-name">{credit.name}</span>
							</div>
						{/each}
					{:else}
						No credits available.
					{/if}
				</div>
				<button class="modal-close-button" onclick={closeModals}>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
						<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
					</svg>
				</button>
			</div>
		</div>
	{/if}
</div>

<style>
	.video-player-container {
		position: relative;
		width: 100%;
		height: 100vh;
		background: #000;
		overflow: hidden;
	}

	.video-player-container iframe {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border: none;
		pointer-events: none;
		transition: filter 0.3s ease;
	}

	.video-player-container.modal-open iframe {
		filter: blur(8px);
	}

	/* Play/Pause Button */
	.play-pause-overlay {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 40;
	opacity: 0;
	transition: opacity 0.3s ease;
		pointer-events: none; /* Changed from auto */
}

	.play-pause-overlay.visible {
	opacity: 1;
		pointer-events: auto; /* Enable when visible */
}

	.play-pause-button {
		width: 100px;
		height: 100px;
	border: none;
		background: transparent;
	color: white;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
		transition: all 0.2s ease;
}

	.play-pause-button:hover {
	transform: scale(1.1);
}

	/* Project Title */
	.title-overlay {
		position: absolute;
		bottom: 80px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 45;
		opacity: 0;
		transition: opacity 0.3s ease;
		pointer-events: auto;
	}

	.title-overlay.visible {
		opacity: 1;
	}

	.title-container {
		display: flex;
		flex-direction: column;
		gap: 4px;
		align-items: center;
	}


	.project-title {
		color: #fff;
		font-size: 24px;
		font-weight: 300;
		font-family: 'Mynaruse', system-ui, -apple-system, sans-serif;
		text-align: center;
		margin: 0 0 10px 0;
	}

	.links-container {
		display: flex;
		justify-content: center;
		gap: 0px;
	}

	.link-button {
		background: none;
		border: none;
		color: #fff;
		font-size: 9.6px;
		font-weight: 300;
		font-family: 'Mynaruse', system-ui, -apple-system, sans-serif;
		letter-spacing: 1px;
		text-transform: uppercase;
		cursor: pointer;
		padding: 8px 12px;
		transition: opacity 0.2s ease;
		pointer-events: auto;
		z-index: 46;
		position: relative;
	}

	.link-button:hover {
		opacity: 0.7;
	}

	.progress-container {
		position: absolute;
		bottom: 20px;
		left: 20px;
		right: 20px;
		display: flex;
		align-items: center;
		gap: 15px;
		z-index: 50;
		opacity: 0;
		transition: opacity 0.3s ease;
		pointer-events: auto;
	}

	.progress-container.visible {
		opacity: 1;
	}

	.progress-bar {
		flex: 1;
		height: 4px;
		background: rgba(255, 255, 255, 0.3);
		border-radius: 2px;
		overflow: visible;
		cursor: pointer;
		pointer-events: auto;
		z-index: 51;
		position: relative;
		transition: height 0.2s ease, transform 0.2s ease;
	}

	.progress-bar:hover {
		height: 8px;
		transform: translateY(-2px);
	}

	.progress-bar.dragging {
		height: 8px;
		transform: translateY(-2px);
	}

	.progress-fill {
		height: 100%;
		background: white;
		border-radius: 2px;
		transition: width 0.05s ease;
		will-change: width;
		pointer-events: none;
	}

	.hover-time {
		position: absolute;
		bottom: 12px;
		transform: translateX(-50%);
		background: rgba(0, 0, 0, 0.8);
		color: white;
		padding: 4px 8px;
		border-radius: 4px;
		font-size: 11px;
		white-space: nowrap;
		pointer-events: none;
		z-index: 100;
	}

	.time-display {
		color: white;
		font-size: 14px;
		font-family: monospace;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
		pointer-events: auto;
		z-index: 51;
		position: relative;
	}

	.sound-button {
		background: transparent;
		border: none;
		color: white;
		cursor: pointer;
		padding: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: opacity 0.2s ease;
		width: 24px;
		height: 24px;
		pointer-events: auto;
		z-index: 51;
		position: relative;
	}

	.sound-button:hover {
		opacity: 0.7;
	}

	.sound-button svg {
		width: 16px;
		height: 16px;
	}

	.fullscreen-button {
		background: transparent;
		border: none;
		color: white;
		cursor: pointer;
		padding: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: opacity 0.2s ease;
		width: 24px;
		height: 24px;
		pointer-events: auto;
		z-index: 51;
		position: relative;
		margin-left: 8px;
	}

	.fullscreen-button:hover {
		opacity: 0.7;
	}

	.fullscreen-button svg {
		width: 16px;
		height: 16px;
	}



	/* Logo */
	.logo-overlay {
		position: absolute;
		top: 20px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 70;
		opacity: 0;
		transition: opacity 0.3s ease;
		pointer-events: none;
	}

	.logo-overlay.visible {
		opacity: 1;
		pointer-events: auto;
	}

	.logo-text {
		display: flex;
		flex-direction: row;
		align-items: baseline;
		line-height: 1;
		gap: 8px;
		font-family: 'Mynaruse', system-ui, -apple-system, sans-serif;
	}

	.main-text {
		font-size: 23px;
		font-weight: 300;
		color: #fff;
		font-family: 'Mynaruse', system-ui, -apple-system, sans-serif;
		text-transform: uppercase;
	}

	.sub-text {
		font-size: 12px;
		font-weight: 100;
		color: #fff;
		font-family: 'Mynaruse', system-ui, -apple-system, sans-serif;
	}

	/* Logo Link */
	.logo-link {
		display: block;
		cursor: pointer;
		transition: opacity 0.2s ease;
		text-decoration: none;
	}

	.logo-link:hover {
		opacity: 0.8;
	}

	/* Close Button (top-right) */
	.close-button-overlay {
		position: absolute;
		top: 20px; /* Changed from 30px to match logo */
		right: 40px;
		z-index: 70;
		opacity: 0;
		transition: opacity 0.3s ease;
		pointer-events: auto;
	}

	.close-button-overlay.visible {
		opacity: 1;
	}

	.close-button {
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		text-decoration: none;
		cursor: pointer;
		transition: opacity 0.2s ease;
	}

	.close-button:hover {
		opacity: 0.7; /* Simple opacity reduction, no background */
	}

	.close-button svg {
		width: 24px;
		height: 24px;
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.play-pause-button {
			width: 85px;
			height: 85px;
		}

		.title-overlay {
			bottom: 70px;
		}

		.project-title {
			font-size: 20px;
		}

		.links-container {
			gap: 0px;
		}

		.link-button {
			font-size: 8.8px;
		}


		.logo-overlay {
			top: 15px;
			left: 50%;
			transform: translateX(-50%);
		}

		.main-text {
			font-size: 16px;
		}
		
		.sub-text {
			font-size: 11px;
		}

		.close-button-overlay {
			top: 15px; /* Match logo position on mobile */
		}

		.progress-container {
			bottom: 15px;
			left: 15px;
			right: 15px;
			gap: 10px;
		}

		.time-display {
			font-size: 12px;
		}
	}

	@media (max-width: 480px) {
		.play-pause-button {
			width: 70px;
			height: 70px;
		}

		.title-overlay {
			bottom: 60px;
		}

		.project-title {
			font-size: 18px;
		}

		.links-container {
			gap: 0px;
		}

		.link-button {
			font-size: 8px;
		}

		.progress-container {
			bottom: 10px;
			left: 10px;
			right: 10px;
			gap: 8px;
		}

		.progress-bar {
			height: 3px;
		}

		.time-display {
			font-size: 11px;
		}


		.logo-overlay {
			top: 10px;
			left: 50%;
			transform: translateX(-50%);
		}

		.main-text {
			font-size: 14px;
		}
		
		.sub-text {
			font-size: 10px;
		}

		.close-button-overlay {
			top: 10px; /* Match logo position on smaller screens */
		}
	}

	/* Modal Styles */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.8);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		animation: fadeIn 0.3s ease;
	}

	.modal-content {
		background: transparent;
		padding: 40px;
		max-width: 600px;
		max-height: 70vh;
		overflow-y: auto;
		position: relative;
		animation: slideIn 0.3s ease;
		margin: 20px;
	}

	.modal-title {
		color: #fff;
		font-size: 24px;
		font-weight: 400;
		font-family: system-ui, -apple-system, sans-serif;
		text-align: center;
		margin-bottom: 20px;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
	}

	.modal-title {
		color: #fff;
		font-size: 20px;
		font-weight: 300;
		font-family: 'Mynaruse', system-ui, -apple-system, sans-serif;
		text-align: center;
		margin-bottom: 30px;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
		text-transform: uppercase;
	}

	.modal-text {
		color: #fff;
		font-size: 13px;
		line-height: 1.5;
		font-family: 'Mynaruse', system-ui, -apple-system, sans-serif;
		text-align: center;
		margin-bottom: 30px;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
		max-height: 60vh;
		overflow-y: auto;
	}

	.credit-item {
		margin-bottom: 8px;
		line-height: 1.6;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
		max-width: 600px;
		margin-left: auto;
		margin-right: auto;
	}

	.credit-role {
		font-weight: 300;
		text-align: right;
	}

	.credit-name {
		font-weight: 300;
		text-align: left;
	}

	.modal-close-button {
		display: block;
		margin: 0 auto;
		background: none;
		border: none;
		color: #fff;
		cursor: pointer;
		padding: 10px;
		border-radius: 50%;
		transition: all 0.2s ease;
		opacity: 0.8;
	}

	.modal-close-button:hover {
		opacity: 0.7;
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	@keyframes slideIn {
		from { 
			opacity: 0;
			transform: translateY(-20px);
		}
		to { 
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Responsive modal */
	@media (max-width: 768px) {
		.modal-content {
			padding: 30px;
			margin: 15px;
		}

		.modal-title {
			font-size: 18px;
		}

		.modal-text {
			font-size: 12px;
		}
	}

	@media (max-width: 480px) {
		.modal-content {
			padding: 20px;
			margin: 10px;
		}

		.modal-title {
			font-size: 16px;
		}

		.modal-text {
			font-size: 11px;
		}
	}

	/* Navigation Arrows */
	.nav-arrows {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		pointer-events: none;
		opacity: 0;
		transition: opacity 0.3s ease;
		z-index: 60;
	}

	.nav-arrows.visible {
		opacity: 1;
	}

	.nav-arrow {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		background: transparent;
		border: none;
		color: white;
		cursor: pointer;
		padding: 12px;
		pointer-events: auto;
		opacity: 0.7;
		transition: opacity 0.3s ease;
	}

	.nav-arrow:hover {
		opacity: 1;
	}

	.nav-arrow-left {
		left: 20px;
	}

	.nav-arrow-right {
		right: 20px;
	}

	.nav-arrow svg {
		width: 48px;
		height: 48px;
	}


	/* Navigation Thumbnails */
	.nav-thumbnails {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		pointer-events: none;
		z-index: 65;
		opacity: 0;
		visibility: hidden;
		transition: opacity 0.3s ease, visibility 0.3s ease;
	}

	.nav-thumbnails.visible {
		opacity: 1;
		visibility: visible;
	}

	.nav-thumbnails.visible .nav-thumbnail {
		pointer-events: auto;
	}

	.nav-thumbnail {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		width: 200px;
		cursor: pointer;
		pointer-events: auto;
		display: flex;
		flex-direction: column;
	}

	.nav-thumbnail-left {
		left: 120px; /* Position next to left arrow (arrow is at 20px + 48px width + 20px gap = 88px, so 120px gives good spacing) */
	}

	.nav-thumbnail-right {
		right: 120px; /* Position next to right arrow */
	}

	.thumbnail-container {
		width: 100%;
		aspect-ratio: 16/9;
		overflow: hidden;
		background: #000;
		position: relative;
	}

	.thumbnail-container iframe {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 100%;
		height: 100%;
		border: none;
		pointer-events: none;
	}

	.thumbnail-title {
		margin-top: 12px;
		color: white;
		font-size: 12px;
		text-align: center;
		font-family: 'Mynaruse', system-ui, -apple-system, sans-serif;
		font-weight: 300;
	}
</style>