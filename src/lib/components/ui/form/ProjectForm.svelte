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

	let {
		data,
		proponents,
		title = 'Novo Projeto',
		description = 'Preencha os dados do projeto.',
		submitLabel = 'Cadastrar Projeto',
		class: className
	}: ProjectFormProps = $props();

	const form = superForm(data, {
		validators: zod4Client(projectSchema)
	});

	const { form: formData, enhance, submitting } = form;

	const triggerContent = $derived(
		proponents.find((p) => p.id === $formData.proponent_id)?.name ?? 'Selecione sua Organização'
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
		if (dateRange.start) $formData.lifetime_start = dateRange.start.toDate(getLocalTimeZone());
		if (dateRange.end) $formData.lifetime_end = dateRange.end.toDate(getLocalTimeZone());
	});
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
						<Form.Label>Orgnanizações</Form.Label>
						<Select.Root type="single" {...props} bind:value={$formData.proponent_id}>
							<Select.Trigger class="w-70">{triggerContent}</Select.Trigger>
							<Select.Content class="max-h-75">
								{#each proponents as p (p.id)}
									<Select.Item value={p.id}>{p.name}</Select.Item>
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
						/>
					{/snippet}
				</Form.Control>
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
</style>
