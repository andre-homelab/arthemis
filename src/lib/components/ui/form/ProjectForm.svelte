<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { projectSchema } from './ProjectFormSchema.js';
	import { cn } from '$lib/utils.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import type { ProjectFormProps } from './types.js';
	import { getLocalTimeZone } from '@internationalized/date';
	import { RangeCalendar } from '$lib/components/ui/range-calendar/index.js';
	import type { DateRange } from 'bits-ui';
	import { untrack } from 'svelte';
	import FormFieldWrapper from './FormFieldWrapper.svelte';
	import { toast } from 'svelte-sonner';

	let {
		data,
		proponents,
		title = 'Novo Projeto',
		description = 'Preencha os dados do projeto.',
		submitLabel = 'Cadastrar Projeto',
		class: className
	}: ProjectFormProps = $props();

	const form = superForm(data, {
		validators: zod4Client(projectSchema),
		dataType: 'json',
		onResult({ result }) {
			if (result.type === 'success') {
				toast.success(result.data?.message);
			}
			else if (result.type === 'error') {
				toast.error('Erro desconhecido');
			}
		}
	});

	const { form: formData, enhance, submitting } = form;

	const triggerContent = $derived(
		proponents.find((p) => String(p.id) === String($formData.proponent_id))?.name ?? 'Selecione sua Organização'
	);

	/*
	 Estado local do calendário.
	 O RangeCalendar usa objetos CalendarDate do @internationalized/date,
	 não strings — por isso não podemos fazer bind direto no $formData.
	 
	 DateRange = { start: CalendarDate | undefined, end: CalendarDate | undefined }
	 */
	let dateRange = $state<DateRange>({ start: undefined, end: undefined });

	/*
	 Toda vez que o usuário seleciona/altera as datas no calendário,
	 convertemos o CalendarDate para Date nativo com .toDate(getLocalTimeZone())
	 e gravamos nos campos do superForm — que são os que serão submetidos.
	
	 Se a data ainda não foi selecionada (undefined), gravamos string vazia
	 para que o Zod consiga validar e exibir o erro corretamente.
	*/
	$effect(() => {
		const start = dateRange.start;
		const end = dateRange.end;
		untrack(() => {
			if (start) $formData.lifetime_start = start.toDate(getLocalTimeZone());
			if (end) $formData.lifetime_end = end.toDate(getLocalTimeZone());
		});
	});

	if (!$formData.locations) $formData.locations = [];
   	if (!$formData.activities) $formData.activities = [];
    if (!$formData.indicators) $formData.indicators = [];

	function addLocation() {
		$formData.locations = [...$formData.locations, { 
			id: crypto.randomUUID(), ecosystem: '', extent_ha: 0, country: '', position: '' 
		}];
	}

	function removeLocation(index: number) {
		$formData.locations = $formData.locations.filter((_, i) => i !== index);
	}

	function addActivity() {
		$formData.activities = [...$formData.activities, {
			id: crypto.randomUUID(), name: '', description: '', justification: ''
       	}];
   }

   function removeActivity(index: number) {
       $formData.activities = $formData.activities.filter((_, i) => i !== index);
   }

   function addIndicator() {
       $formData.indicators = [...$formData.indicators, {
           id: crypto.randomUUID(), location_id: '', activity_id: '', name: '', unit: '',
           value_baseline: 0, value_reference: 0, observation_method: '', justification: ''
       }];
   }

   function removeIndicator(index: number) {
       $formData.indicators = $formData.indicators.filter((_, i) => i !== index);
   }
</script>

<Card.Root class={cn('form-card', className)}>
	<Card.Header>
		<Card.Title>{title}</Card.Title>
		{#if description}
			<Card.Description>{description}</Card.Description>
		{/if}
	</Card.Header>

	<Card.Content>
		<form method="POST" use:enhance class="form-body">
			<Form.Field {form} name="proponent_id">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Organizações</Form.Label>
						<Select.Root type="single" {...props} bind:value={$formData.proponent_id}>
							<Select.Trigger class="rounded-md max-w-xl w-full">{triggerContent}</Select.Trigger>
							<Select.Content class="max-h-75">
								{#each proponents as p (p.id)}
									<Select.Item value={String(p.id)}>{p.name}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					{/snippet}
				</Form.Control>
				<Form.Description>Organização responsável pelo projeto.</Form.Description>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="name">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Nome do Projeto</Form.Label>
						<Input
							{...props}
							bind:value={$formData.name}
							placeholder="Nome do projeto"
							maxlength={150}
							class = "rounded-md max-w-xl w-full"
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<!--
				Um único bloco para as duas datas.
				O RangeCalendar gerencia start e end junto

				Usamos Form.Field de lifetime_start para hospedar o calendário
				e exibimos os erros de ambos os campos logo abaixo.
			-->
			<div class="dates-section">
				<Label>Vigência do Projeto</Label>

				<RangeCalendar bind:value={dateRange} class="calendar" />

				<!--
					Exibimos as datas selecionadas como texto para o usuário
					ter confirmação visual do que foi escolhido.
				-->
				{#if dateRange.start && dateRange.end}
					<p class="date-summary">
						{dateRange.start.toDate(getLocalTimeZone()).toLocaleDateString('pt-BR')} → {dateRange.end
							.toDate(getLocalTimeZone())
							.toLocaleDateString('pt-BR')}
					</p>
				{/if}

				<!-- Erros de validação de cada campo de data -->
				<Form.Field {form} name="lifetime_start">
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="lifetime_end">
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<Form.Field {form} name="justification">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Justificativa</Form.Label>
						<Textarea
							{...props}
							bind:value={$formData.justification}
							placeholder="Descreva a justificativa do projeto..."
							class = "rounded-md w-full min-h-30 resize-none"
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<FormFieldWrapper
				title="Localizações do Projeto"
				items={$formData.locations}
				itemTitlePrefix="Local"
				addLabel="+ Novo Local"
				onAdd={addLocation}
				onRemove={removeLocation}
			>
				{#snippet children(id)}
					<Form.Field {form} name={`locations[${id}].ecosystem`} class="field">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label class="text-xs">Ecossistema</Form.Label>
								<Input {...props} bind:value={$formData.locations[id].ecosystem} placeholder="Ex: Amazônia" />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name={`locations[${id}].country`} class="field">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label class="text-xs">País</Form.Label>
								<Input {...props} bind:value={$formData.locations[id].country} placeholder="Ex: Brasil" />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name={`locations[${id}].extent_ha`} class="field">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label class="text-xs">Extensão (Hectares)</Form.Label>
								<Input {...props} bind:value={$formData.locations[id].extent_ha} type="number" step="0.01" />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name={`locations[${id}].position`} class="field">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label class="text-xs">Posição / Coordenadas</Form.Label>
								<Input {...props} bind:value={$formData.locations[id].position} placeholder="Ex:" />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				{/snippet}
			</FormFieldWrapper>

			<Form.Field {form} name="locations">
				<Form.FieldErrors />
			</Form.Field>

			<FormFieldWrapper
				title="Atividades do Projeto"
				items={$formData.activities}
				itemTitlePrefix="Atividade"
				addLabel="+ Nova Atividade"
				onAdd={addActivity}
				onRemove={removeActivity}
			>
				{#snippet children(id)}
					<Form.Field {form} name={`activities[${id}].name`} class="w-7/12">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label class="text-xs">Nome</Form.Label>
								<Input {...props} bind:value={$formData.activities[id].name} placeholder="Ex: Remoção de resíduos sólidos" />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name={`activities[${id}].description`} class="field">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label class="text-xs">Descrição</Form.Label>
								<Textarea 
									{...props} 
									bind:value={$formData.activities[id].description} 
									placeholder="Descreva a atividade em detalhes" 
									class="rounded-md w-full min-h-10"
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name={`activities[${id}].justification`} class="field">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label class="text-xs">Justificativa</Form.Label>
								<Textarea 
									{...props} 
									bind:value={$formData.activities[id].justification} 
									placeholder="Por que esta atividade é necessária?" 
									class="rounded-md w-full min-h-10"
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				{/snippet}
			</FormFieldWrapper>

			<Form.Field {form} name="activities">
				<Form.FieldErrors />
			</Form.Field>

			<FormFieldWrapper
				title="Indicadores do Projeto"
				items={$formData.indicators}
				itemTitlePrefix="Indicador"
				addLabel="+ Novo Indicador"
				onAdd={addIndicator}
				onRemove={removeIndicator}
			>
				{#snippet children(id)}
					<Form.Field {form} name={`indicators[${id}].name`} class="field">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label class="text-xs">Nome do Indicador</Form.Label>
								<Input {...props} bind:value={$formData.indicators[id].name} placeholder="Ex: Número de árvores plantadas" />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name={`indicators[${id}].unit`} class="field">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label class="text-xs">Unidade</Form.Label>
								<Input {...props} bind:value={$formData.indicators[id].unit} placeholder="Ex: ha, unidades, %" />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name={`indicators[${id}].location_id`} class="field">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label class="text-xs">Localização</Form.Label>
								<Select.Root type="single" {...props} bind:value={$formData.indicators[id].location_id}>
									<Select.Trigger class="w-full">
										{$formData.locations.find(l => l.id === $formData.indicators[id].location_id)?.ecosystem || 'Selecione o Local...'}
									</Select.Trigger>
									<Select.Content class="max-h-60">
										{#each $formData.locations as loc (loc.id)}
											<Select.Item value={loc.id}>
												{loc.ecosystem ? loc.ecosystem : `Local sem nome`}
											</Select.Item>
										{/each}
									</Select.Content>
								</Select.Root>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name={`indicators[${id}].activity_id`} class="field">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label class="text-xs">Atividade Vinculada</Form.Label>
								<Select.Root type="single" {...props} bind:value={$formData.indicators[id].activity_id}>
									<Select.Trigger class="w-full">
										{$formData.activities.find(a => a.id === $formData.indicators[id].activity_id)?.name || 'Selecione a Atividade...'}
									</Select.Trigger>
									<Select.Content class="max-h-60">
										{#each $formData.activities as act (act.id)}
											<Select.Item value={act.id}>
												{act.name ? act.name : `Atividade sem nome`}
											</Select.Item>
										{/each}
									</Select.Content>
								</Select.Root>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name={`indicators[${id}].value_baseline`} class="field">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label class="text-xs">Valor Baseline</Form.Label>
								<Input {...props} bind:value={$formData.indicators[id].value_baseline} type="number" step="0.01" />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name={`indicators[${id}].value_reference`} class="field">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label class="text-xs">Valor de Referência (Meta)</Form.Label>
								<Input {...props} bind:value={$formData.indicators[id].value_reference} type="number" step="0.01" />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name={`indicators[${id}].observation_method`} class="field">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label class="text-xs">Método de Observação</Form.Label>
								<Textarea 
									{...props} 
									bind:value={$formData.indicators[id].observation_method} 
									placeholder="Como este indicador será medido?" 
									class="resize-none"
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name={`indicators[${id}].justification`} class="field">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label class="text-xs">Justificativa</Form.Label>
								<Textarea 
									{...props} 
									bind:value={$formData.indicators[id].justification} 
									placeholder="Por que este indicador é relevante?" 
									class="resize-none"
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				{/snippet}
			</FormFieldWrapper>

			<Form.Field {form} name="indicators">
				<Form.FieldErrors />
			</Form.Field>
		
			<Card.Footer class="form-footer">
				<Button type="submit" disabled={$submitting}>
					{$submitting ? 'Salvando...' : submitLabel}
				</Button>
			</Card.Footer>
		</form>
	</Card.Content>
</Card.Root>

<style>
	:global(.form-card) {
		border-radius: 12px !important;
	}

	.form-body {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.dates-section {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	:global(.calendar) {
		align-self: flex-start;
	}

	.date-summary {
		font-size: 0.875rem;
		color: var(--muted-foreground);
		margin: 0;
	}

	:global(.form-footer) {
		padding-left: 0 !important;
		padding-right: 0 !important;
		padding-bottom: 0 !important;
	}

	:global(.field) {
		width: 100%;
		@media (width >= 48rem /* 768px */) {
        	width: calc(50% - 0.5rem /* 8px */);
    	}
	}
</style>
