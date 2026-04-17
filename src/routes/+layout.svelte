<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/Sidebar.svelte';

	let { children } = $props();
</script>

<Sidebar.Provider>
	<div class="bg-background text-foreground flex h-screen w-full overflow-hidden">
		<AppSidebar />
		<div class="flex flex-1 flex-col overflow-hidden">
			<header class="flex h-12 items-center border-b px-4">
				<Sidebar.Trigger />
			</header>
			<main class="flex flex-1 flex-col overflow-auto">
				{@render children()}
			</main>
		</div>
	</div>
</Sidebar.Provider>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
