<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/Sidebar.svelte';

	let sidebarOpen = $state(true);
	let { children } = $props();
</script>

<Sidebar.Provider bind:open={sidebarOpen}>
	<div class="bg-background text-foreground flex h-screen w-full overflow-hidden">
		<AppSidebar />
		{#if !sidebarOpen}
			<div class="sidebar-collapsed-trigger">
				<Sidebar.Trigger />
			</div>
		{/if}
		<div class="flex flex-1 flex-col overflow-hidden">
			<main class="flex flex-1 flex-col overflow-auto">
				{@render children()}
			</main>
		</div>
	</div>
</Sidebar.Provider>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<style>
	.sidebar-collapsed-trigger {
		width: 3rem;
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding-top: 0.75rem;
		border-right: 1px solid var(--border);
		background: var(--sidebar);
		flex-shrink: 0;
	}
</style>
