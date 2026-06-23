<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import RecordActions from '$lib/components/RecordActions.svelte';
	import ProponentForm from '$lib/components/ui/form/ProponentForm.svelte';
	import type { ActionData, PageData } from './$types.js';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<div class="page-container">
	<header class="page-header">
		<h1 class="page-title">Organizações</h1>
		<p class="page-description">Cadastre, edite e remova as organizações do sistema.</p>
	</header>

	{#if form?.message}
		<p class:success-message={form.success} class:error-message={!form.success}>{form.message}</p>
	{/if}

	<ProponentForm data={data.form} action="?/create" />

	<section class="panel list-panel">
		<div class="section-heading">
			<h2>Organizações cadastradas</h2>
			<span>{data.organizations.length} registro(s)</span>
		</div>

		{#if data.organizations.length === 0}
			<p class="empty-state">Nenhuma organização cadastrada.</p>
		{:else}
			<div class="table-wrap">
				<table>
					<thead>
						<tr>
							<th>ID</th>
							<th>Nome</th>
							<th>E-mail</th>
							<th>Ações</th>
						</tr>
					</thead>
					<tbody>
						{#each data.organizations as organization (organization.id)}
							<tr>
								<td>{organization.id}</td>
								<td colspan="2">
									<form
										method="POST"
										action="?/update"
										class="row-form"
										id={`organization-${organization.id}`}
									>
										<input type="hidden" name="id" value={organization.id} />
										<Input name="name" value={organization.name} required maxlength={150} />
										<Input
											name="email"
											type="email"
											value={organization.email}
											required
											maxlength={150}
										/>
									</form>
								</td>
								<td class="actions-cell">
									<RecordActions
										updateFormId={`organization-${organization.id}`}
										deleteId={organization.id}
									/>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</section>
</div>

<style>
	.page-container {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 32px;
		gap: 24px;
		width: 100%;
		max-width: 1120px;
	}

	.page-header,
	.section-heading {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		align-items: flex-start;
	}

	.page-header {
		flex-direction: column;
	}

	.page-title {
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--foreground);
		margin: 0;
	}

	.page-description,
	.empty-state,
	.section-heading span {
		font-size: 0.875rem;
		color: var(--muted-foreground);
		margin: 0;
	}

	.panel {
		display: flex;
		flex-direction: column;
		gap: 16px;
		border: 1px solid var(--border);
		border-radius: 8px;
		padding: 20px;
		background: var(--card);
	}

	h2 {
		font-size: 1rem;
		font-weight: 600;
		margin: 0;
	}

	.row-form {
		display: grid;
		grid-template-columns: minmax(180px, 1fr) minmax(220px, 1fr);
		gap: 12px;
		align-items: center;
	}

	.table-wrap {
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th,
	td {
		padding: 10px 8px;
		border-bottom: 1px solid var(--border);
		text-align: left;
		vertical-align: bottom;
	}

	th {
		font-size: 0.75rem;
		color: var(--muted-foreground);
		font-weight: 600;
	}

	.actions-cell {
		width: 158px;
		min-width: 158px;
		white-space: nowrap;
		vertical-align: middle;
	}

	.success-message,
	.error-message {
		border-radius: 8px;
		padding: 10px 12px;
		font-size: 0.875rem;
	}

	.success-message {
		background: color-mix(in srgb, var(--primary) 12%, transparent);
		color: var(--primary);
	}

	.error-message {
		background: color-mix(in srgb, var(--destructive) 12%, transparent);
		color: var(--destructive);
	}

	@media (max-width: 760px) {
		.page-container {
			padding: 20px;
		}

		.row-form {
			grid-template-columns: 1fr;
		}
	}
</style>
