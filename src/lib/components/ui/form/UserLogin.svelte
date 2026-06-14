<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { userLoginSchema } from './UserLoginSchema.js';
	import { cn } from '$lib/utils.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { UserLoginProps } from './types.js';
	import { toast } from 'svelte-sonner';

	let {
		data,
		title = 'Entrar',
		description = 'Acesse com seu usuário e senha.',
		submitLabel = 'Entrar',
		class: className
	}: UserLoginProps = $props();

	const form = superForm(data, {
		validators: zod4Client(userLoginSchema),
		onResult({ result }) {
			if (result.type == 'failure') {
				toast.error('Usuário/Senha incorretos');
			}
			else if (result.type === 'error') {
				toast.error('Erro interno');
			}
		}
	});

	const { form: formData, enhance, submitting } = form;
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
			<Form.Field {form} name="username">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Usuário</Form.Label>
						<Input
							{...props}
							bind:value={$formData.username}
							placeholder="Nome do Usuário"
							maxlength={150}
							autocomplete="username"
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="password">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Senha</Form.Label>
						<Input
							{...props}
							type="password"
							bind:value={$formData.password}
							placeholder="Sua senha"
							maxlength={255}
							autocomplete="current-password"
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Card.Footer class="form-footer">
				<Button type="submit" disabled={$submitting}>
					{$submitting ? 'Entrando...' : submitLabel}
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
</style>
