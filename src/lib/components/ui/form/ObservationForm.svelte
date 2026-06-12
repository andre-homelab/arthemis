<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { observationSchema } from './ObservationFormSchema.js';
	import { cn } from '$lib/utils.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { ObservationProps } from './types.js';
	import { CalendarDate, getLocalTimeZone, today, type DateValue } from '@internationalized/date';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import { untrack } from 'svelte';

	let {
		data,
		title = 'Observação',
		description = 'Insira os dados da observação.',
		submitLabel = 'Salvar',
		class: className
	}: ObservationProps = $props();

	const form = superForm(data, {
		validators: zod4Client(observationSchema),
		dataType: 'json'
	});

	const { form: formData, enhance, submitting } = form;

	function toCalendarDate(date: Date | string | undefined) {
		if (!date) return today(getLocalTimeZone());

		const parsedDate = date instanceof Date ? date : new Date(date);
		if (Number.isNaN(parsedDate.getTime())) return today(getLocalTimeZone());

		return new CalendarDate(
			parsedDate.getFullYear(),
			parsedDate.getMonth() + 1,
			parsedDate.getDate()
		);
	}

	let selectedDate = $state<DateValue | undefined>(toCalendarDate($formData.date));
	let positionText = $state(
		typeof $formData.position === 'string'
			? $formData.position
			: JSON.stringify(
					$formData.position ?? {
						type: 'Feature',
						geometry: {
							type: 'Point',
							coordinates: [125.6, 10.1]
						},
						properties: {
							name: 'Dinagat Islands'
						}
					},
					null,
					2
				)
	);

	$effect(() => {
		const date = selectedDate;
		untrack(() => {
			if (date) $formData.date = date.toDate(getLocalTimeZone());
		});
	});

	$effect(() => {
		const position = positionText;
		untrack(() => {
			$formData.position = position as never;
		});
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
			<Form.Field {form} name="indicator_id">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Indicador</Form.Label>
						<Input
							{...props}
							bind:value={$formData.indicator_id}
							placeholder="Selecione um indicador"
							maxlength={150}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="value">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Valor</Form.Label>
						<Input
							{...props}
							type="number"
							bind:value={$formData.value}
							placeholder="Valor da observação"
							maxlength={255}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="date">
				<Form.Label>Data</Form.Label>
				<Calendar
					type="single"
					bind:value={selectedDate}
					class="rounded-md border shadow-sm"
					captionLayout="dropdown"
					locale="pt-BR"
				/>
				{#if selectedDate}
					<p class="date-summary">
						{selectedDate.toDate(getLocalTimeZone()).toLocaleDateString('pt-BR')}
					</p>
				{/if}
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="position">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Posição</Form.Label>
						<Textarea
							{...props}
							bind:value={positionText}
							placeholder="GeoJSON da observação"
							class="min-h-36 rounded-md font-mono text-sm"
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

	:global(.form-footer) {
		padding-left: 0 !important;
		padding-right: 0 !important;
		padding-bottom: 0 !important;
	}

	.date-summary {
		color: var(--muted-foreground);
		font-size: 0.875rem;
		margin: 8px 0 0;
	}
</style>
