<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { SanityProject } from '$lib/types/sanity';

	// Props
	let { project, allProjects }: { project: SanityProject | null; allProjects: SanityProject[] } = $props();

	// State
	let player: any = null;
	let isPlaying = $state(true);
	let duration = $state(0);
	let currentTime = $state(0);
	let progress = $state(0);
	let showControls = $state(true);
	let hideTimeout: ReturnType<typeof setTimeout> | null = null;
	let showOverview = $state(false);
	let showCredits = $state(false);
	let isMuted = $state(true);
	let animationFrame: number | null = null;

	// Utility function to extract Vimeo video ID
	function getVimeoVideoId(vimeoUrl: string): string {
		const match = vimeoUrl.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
		return match ? match[1] : '';
	}

	// Load Vimeo Player API
	onMount(() => {
		const script = document.createElement('script');
		script.src = 'https://player.vimeo.com/api/player.js';
		script.onload = () => {
			initializePlayer();
		};
		document.head.appendChild(script);

		// Hide controls after 3 seconds of inactivity
		hideTimeout = setTimeout(() => {
			showControls = false;
		}, 3000);

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
		stopProgressAnimation();
	});

	function initializePlayer() {
		if (!project?.vimeoUrl) return;

		const videoId = getVimeoVideoId(project.vimeoUrl);
		if (!videoId) return;

		const iframe = document.getElementById('vimeo-player') as HTMLIFrameElement;
		if (!iframe) return;

		player = new (window as any).Vimeo.Player(iframe);

		// Player events
		player.on('loaded', () => {
			player.getDuration().then((dur: number) => {
				duration = dur;
			});
			// Set sound to off by default
			player.setVolume(0);
			isMuted = true;
			// Start smooth progress animation since video autoplays
			startProgressAnimation();
		});

		player.on('timeupdate', (data: any) => {
			// Keep this for time display updates, but use smooth animation for progress
			currentTime = data.seconds;
		});

		player.on('play', () => {
			isPlaying = true;
			startProgressAnimation();
		});

		player.on('pause', () => {
			isPlaying = false;
			stopProgressAnimation();
		});

		player.on('ended', () => {
			isPlaying = false;
			stopProgressAnimation();
		});
	}

	// Toggle play/pause
	function togglePlayPause() {
		if (player) {
			if (isPlaying) {
				player.pause();
			} else {
				player.play();
			}
		}
	}

	// Show controls on mouse move and hide after 3 seconds of inactivity
	function handleMouseMove() {
		showControls = true;
		
		// Clear existing timeout
		if (hideTimeout) {
			clearTimeout(hideTimeout);
		}
		
		// Set new timeout to hide after 3 seconds
		hideTimeout = setTimeout(() => {
			showControls = false;
		}, 3000);
	}

	// Modal functions
	function openOverview() {
		showOverview = true;
		showCredits = false;
	}

	function openCredits() {
		showCredits = true;
		showOverview = false;
	}

	function closeModals() {
		showOverview = false;
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

	// Handle progress bar click for seeking
	function handleProgressClick(event: MouseEvent) {
		if (!player || !duration) return;
		
		const progressBar = event.currentTarget as HTMLElement;
		const rect = progressBar.getBoundingClientRect();
		const clickX = event.clientX - rect.left;
		const percentage = clickX / rect.width;
		const newTime = percentage * duration;
		
		player.setCurrentTime(newTime);
	}

	// Navigation functions
	function getPreviousProject() {
		if (!project || !allProjects.length) return null;
		
		const currentIndex = allProjects.findIndex(p => p._id === project._id);
		if (currentIndex === -1) return null;
		
		// Get previous project (loop to last if at first)
		const prevIndex = currentIndex === 0 ? allProjects.length - 1 : currentIndex - 1;
		return allProjects[prevIndex];
	}

	function getNextProject() {
		if (!project || !allProjects.length) return null;
		
		const currentIndex = allProjects.findIndex(p => p._id === project._id);
		if (currentIndex === -1) return null;
		
		// Get next project (loop to first if at last)
		const nextIndex = currentIndex === allProjects.length - 1 ? 0 : currentIndex + 1;
		return allProjects[nextIndex];
	}

	function navigateToProject(targetProject: SanityProject | null) {
		if (!targetProject) return;
		goto(`/project/${targetProject.slug.current}`);
	}

	// Smooth progress animation
	function animateProgress() {
		if (player && isPlaying && duration > 0) {
			player.getCurrentTime().then((time: number) => {
				currentTime = time;
				progress = (time / duration) * 100;
			});
		}
		animationFrame = requestAnimationFrame(animateProgress);
	}

	// Start/stop smooth animation
	function startProgressAnimation() {
		if (animationFrame) {
			cancelAnimationFrame(animationFrame);
		}
		animateProgress();
	}

	function stopProgressAnimation() {
		if (animationFrame) {
			cancelAnimationFrame(animationFrame);
			animationFrame = null;
		}
	}

	// Format time helper
	function formatTime(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}
</script>

<div class="video-player-container" class:modal-open={showOverview || showCredits} onmousemove={handleMouseMove}>
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
				<svg width="50" height="50" viewBox="0 0 24 24" fill="currentColor">
					<path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
				</svg>
			{:else}
				<!-- Play Icon -->
				<svg width="50" height="50" viewBox="0 0 24 24" fill="currentColor">
					<path d="M8 5v14l11-7z"/>
				</svg>
			{/if}
		</button>
	</div>

	<!-- Project Title and Links -->
	<div class="title-overlay" class:visible={showControls}>
		<h1 class="project-title">{project?.title || ''}</h1>
		<div class="links-container">
			<button class="link-button" onclick={openOverview}>OVERVIEW</button>
			<button class="link-button" onclick={openCredits}>CREDITS</button>
		</div>
	</div>

	<!-- Progress bar with time and sound controls -->
	<div class="progress-container" class:visible={showControls}>
		<div class="time-display">
			{formatTime(currentTime)} / {formatTime(duration)}
		</div>
		<div class="progress-bar" onclick={handleProgressClick}>
			<div class="progress-fill" style="width: {progress}%"></div>
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
	</div>

	<!-- Navigation Arrows -->
	{#if allProjects.length > 1}
		<!-- Previous Project Arrow -->
		<button 
			class="nav-arrow nav-arrow-left" 
			onclick={() => navigateToProject(getPreviousProject())}
			aria-label="Previous project"
		>
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round">
				<path d="M15 18l-6-6 6-6"/>
			</svg>
		</button>

		<!-- Next Project Arrow -->
		<button 
			class="nav-arrow nav-arrow-right" 
			onclick={() => navigateToProject(getNextProject())}
			aria-label="Next project"
		>
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round">
				<path d="M9 18l6-6-6-6"/>
			</svg>
		</button>
	{/if}

	<!-- Overview Modal -->
	{#if showOverview}
		<div class="modal-overlay" onclick={closeModals}>
			<div class="modal-content" onclick={(e) => e.stopPropagation()}>
				<div class="modal-text">
					{project?.overview || 'No overview available.'}
				</div>
				<button class="close-button" onclick={closeModals}>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
						<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
					</svg>
				</button>
			</div>
		</div>
	{/if}

	<!-- Credits Modal -->
	{#if showCredits}
		<div class="modal-overlay" onclick={closeModals}>
			<div class="modal-content" onclick={(e) => e.stopPropagation()}>
				<div class="modal-text">
					{project?.credits || 'No credits available.'}
				</div>
				<button class="close-button" onclick={closeModals}>
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
		pointer-events: auto;
	}

	.play-pause-overlay.visible {
		opacity: 1;
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

	.project-title {
		color: #fff;
		font-size: 19.2px;
		font-weight: 600;
		text-align: center;
		margin: 0 0 10px 0;
		font-family: system-ui, -apple-system, sans-serif;
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
		font-weight: 500;
		letter-spacing: 1px;
		text-transform: uppercase;
		cursor: pointer;
		padding: 8px 12px;
		font-family: system-ui, -apple-system, sans-serif;
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
		overflow: hidden;
		cursor: pointer;
		pointer-events: auto;
		z-index: 51;
		position: relative;
	}

	.progress-fill {
		height: 100%;
		background: white;
		border-radius: 2px;
		transition: width 0.05s linear;
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

	/* Navigation Arrows */
	.nav-arrow {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		background: transparent;
		border: none;
		color: white;
		cursor: pointer;
		padding: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: opacity 0.3s ease;
		z-index: 60;
		opacity: 0.7;
	}

	.nav-arrow:hover {
		opacity: 1;
	}

	.nav-arrow-left {
		left: 5px;
	}

	.nav-arrow-right {
		right: 5px;
	}

	.nav-arrow svg {
		width: 72px;
		height: 72px;
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
			font-size: 16px;
		}

		.links-container {
			gap: 0px;
		}

		.link-button {
			font-size: 8.8px;
		}

		.nav-arrow {
			padding: 8px;
		}

		.nav-arrow-left {
			left: 3px;
		}

		.nav-arrow-right {
			right: 3px;
		}

		.nav-arrow svg {
			width: 60px;
			height: 60px;
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
			font-size: 14.4px;
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

		.nav-arrow {
			padding: 6px;
		}

		.nav-arrow-left {
			left: 2px;
		}

		.nav-arrow-right {
			right: 2px;
		}

		.nav-arrow svg {
			width: 48px;
			height: 48px;
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

	.modal-text {
		color: #fff;
		font-size: 16px;
		line-height: 1.6;
		font-family: system-ui, -apple-system, sans-serif;
		text-align: center;
		margin-bottom: 30px;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
	}

	.close-button {
		position: absolute;
		bottom: -50px;
		left: 50%;
		transform: translateX(-50%);
		background: none;
		border: none;
		color: #fff;
		cursor: pointer;
		padding: 10px;
		border-radius: 50%;
		transition: all 0.2s ease;
	}

	.close-button:hover {
		background: rgba(255, 255, 255, 0.2);
		transform: translateX(-50%) scale(1.1);
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

		.modal-text {
			font-size: 14px;
		}
	}

	@media (max-width: 480px) {
		.modal-content {
			padding: 20px;
			margin: 10px;
		}

		.modal-text {
			font-size: 13px;
		}
	}
</style>