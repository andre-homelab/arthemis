<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/ui/sidebar/AppSidebar.svelte';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import { page } from '$app/state';

	let sidebarOpen = $state(true);
	let { children } = $props();
</script>

<Toaster />

<Sidebar.Provider bind:open={sidebarOpen}>
	<div class="bg-background text-foreground flex h-screen w-full overflow-hidden">
		<AppSidebar />
		{#if !sidebarOpen}
			<div class="sidebar-collapsed-trigger animate-in fade-in slide-in-from-left-4 duration-300">
				<Sidebar.Trigger />
			</div>
		{/if}
		<div class="flex flex-1 flex-col overflow-auto">
			<main class="flex flex-1 flex-col">
				{#key page.url.pathname}
					<div class="flex flex-1 flex-col animate-in fade-in slide-in-from-bottom-3 duration-500 ease-out">
						{@render children()}
					</div>
				{/key}
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
