<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import type { ActionData, PageData } from './$types.js';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const defaultPosition = JSON.stringify(
		{
			type: 'Point',
			coordinates: [-52.38, -24.05]
		},
		null,
		2
	);
</script>

<div class="page-container">
	<header class="page-header">
		<h1 class="page-title">Observações</h1>
		<p class="page-description">Cadastre, edite e remova observações vinculadas aos indicadores.</p>
	</header>

	{#if form?.message}
		<p class:success-message={form.success} class:error-message={!form.success}>{form.message}</p>
	{/if}

	<section class="panel">
		<h2>Nova observação</h2>
		<form method="POST" action="?/create" class="create-grid">
			<label>
				<span>Indicador</span>
				<Input name="indicator_id" type="number" min="1" required placeholder="ID do indicador" />
			</label>
			<label>
				<span>Valor</span>
				<Input name="value" type="number" step="any" required placeholder="Valor observado" />
			</label>
			<label>
				<span>Data</span>
				<Input name="date" type="date" required />
			</label>
			<label class="position-field">
				<span>Posição GeoJSON</span>
				<Textarea name="position" value={defaultPosition} required class="geojson-input" />
			</label>
			<Button type="submit">Cadastrar</Button>
		</form>
	</section>

	<section class="panel list-panel">
		<div class="section-heading">
			<h2>Observações cadastradas</h2>
			<span>{data.observations.length} registro(s)</span>
		</div>

		{#if data.observations.length === 0}
			<p class="empty-state">Nenhuma observação cadastrada.</p>
		{:else}
			<div class="observation-list">
				{#each data.observations as observation (observation.id)}
					<article class="observation-row">
						<header>
							<div>
								<strong>Observação #{observation.id}</strong>
								<span>Indicador #{observation.indicatorId}</span>
							</div>
							<div class="actions">
								<Button type="submit" form={`observation-${observation.id}`} size="sm"
									>Salvar</Button
								>
								<form method="POST" action="?/delete">
									<input type="hidden" name="id" value={observation.id} />
									<Button type="submit" variant="destructive" size="sm">Excluir</Button>
								</form>
							</div>
						</header>

						<form
							method="POST"
							action="?/update"
							class="row-form"
							id={`observation-${observation.id}`}
						>
							<input type="hidden" name="id" value={observation.id} />
							<label>
								<span>Indicador</span>
								<Input
									name="indicator_id"
									type="number"
									min="1"
									value={observation.indicatorId}
									required
								/>
							</label>
							<label>
								<span>Valor</span>
								<Input name="value" type="number" step="any" value={observation.value} required />
							</label>
							<label>
								<span>Data</span>
								<Input name="date" type="date" value={observation.date} required />
							</label>
							<label class="position-field">
								<span>Posição GeoJSON</span>
								<Textarea
									name="position"
									value={observation.positionText}
									required
									class="geojson-input"
								/>
							</label>
						</form>
					</article>
				{/each}
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
	.section-heading,
	.observation-row header {
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
	.section-heading span,
	.observation-row span {
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

	.create-grid,
	.row-form {
		display: grid;
		grid-template-columns: minmax(120px, 160px) minmax(120px, 160px) minmax(140px, 180px) 1fr auto;
		gap: 12px;
		align-items: end;
	}

	.row-form {
		grid-template-columns: minmax(120px, 160px) minmax(120px, 160px) minmax(140px, 180px) 1fr;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 6px;
		font-size: 0.8125rem;
		color: var(--muted-foreground);
	}

	.position-field {
		min-width: 260px;
	}

	:global(.geojson-input) {
		min-height: 96px;
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
		font-size: 0.8125rem;
	}

	.observation-list {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.observation-row {
		display: flex;
		flex-direction: column;
		gap: 12px;
		border: 1px solid var(--border);
		border-radius: 8px;
		padding: 14px;
	}

	.observation-row strong,
	.observation-row span {
		display: block;
	}

	.actions {
		display: flex;
		gap: 8px;
		align-items: center;
		white-space: nowrap;
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

	@media (max-width: 920px) {
		.page-container {
			padding: 20px;
		}

		.create-grid,
		.row-form {
			grid-template-columns: 1fr;
		}

		.observation-row header {
			flex-direction: column;
		}
	}
</style>