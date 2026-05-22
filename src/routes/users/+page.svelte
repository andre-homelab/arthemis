<script lang="ts">
	import UserForm from '$lib/components/ui/form/UserForm.svelte';
	import type { PageData } from './$types.js';

	let { data }: { data: PageData } = $props();
</script>

<div class="page-container">
	<header class="page-header">
		<h1 class="page-title">Usuários</h1>
		<p class="page-description">Cadastre os usuários vinculados às organizações proponentes.</p>
	</header>

	<UserForm data={data.form} proponents={data.proponents} />
</div>

<style>
	.page-container {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 32px;
		gap: 24px;
		max-width: 640px;
	}

	.page-header {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.page-title {
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--foreground);
		margin: 0;
	}

	.page-description {
		font-size: 0.875rem;
		color: var(--muted-foreground);
		margin: 0;
	}
</style>
