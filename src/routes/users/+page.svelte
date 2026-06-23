<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import RecordActions from '$lib/components/RecordActions.svelte';
	import UserForm from '$lib/components/ui/form/UserForm.svelte';
	import type { ActionData, PageData } from './$types.js';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const roles = [
		{ value: 'admin', label: 'Administrador' },
		{ value: 'manager', label: 'Gerente' },
		{ value: 'visitor', label: 'Visitante' }
	] as const;
</script>

<div class="page-container">
	<header class="page-header">
		<h1 class="page-title">Usuários</h1>
		<p class="page-description">
			Cadastre, edite e remova perfis de usuários vinculados às organizações.
		</p>
	</header>

	{#if form?.message}
		<p class:success-message={form.success} class:error-message={!form.success}>{form.message}</p>
	{/if}

	<UserForm data={data.form} proponents={data.proponents} action="?/create" />

	<section class="panel list-panel">
		<div class="section-heading">
			<h2>Usuários cadastrados</h2>
			<span>{data.users.length} registro(s)</span>
		</div>

		{#if data.users.length === 0}
			<p class="empty-state">Nenhum usuário cadastrado.</p>
		{:else}
			<div class="table-wrap">
				<table>
					<thead>
						<tr>
							<th>Usuário</th>
							<th>Dados</th>
							<th>Ações</th>
						</tr>
					</thead>
					<tbody>
						{#each data.users as user (user.id)}
							<tr>
								<td>
									<strong>{user.username}</strong>
									<span>{user.id}</span>
								</td>
								<td>
									<form method="POST" action="?/update" class="row-form" id={`user-${user.id}`}>
										<input type="hidden" name="id" value={user.id} />
										<label>
											<span>Organização</span>
											<select name="proponent_id" required value={user.proponentId}>
												{#each data.proponents as proponent (proponent.id)}
													<option value={proponent.id}>{proponent.name}</option>
												{/each}
											</select>
										</label>
										<label>
											<span>Usuário</span>
											<Input name="username" value={user.username} required maxlength={150} />
										</label>
										<label>
											<span>E-mail</span>
											<Input
												name="email"
												type="email"
												value={user.email}
												required
												maxlength={150}
											/>
										</label>
										<label>
											<span>Perfil</span>
											<select name="role" required value={user.role}>
												{#each roles as role (role.value)}
													<option value={role.value}>{role.label}</option>
												{/each}
											</select>
										</label>
									</form>
								</td>
								<td class="actions-cell">
									<RecordActions updateFormId={`user-${user.id}`} deleteId={user.id} />
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
		max-width: 1180px;
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
	.section-heading span,
	td span {
		font-size: 0.875rem;
		color: var(--muted-foreground);
		margin: 0;
	}

	td strong,
	td span {
		display: block;
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
		grid-template-columns: repeat(4, minmax(140px, 1fr));
		gap: 10px;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 6px;
		font-size: 0.8125rem;
		color: var(--muted-foreground);
	}

	select {
		height: 36px;
		width: 100%;
		border: 1px solid transparent;
		border-radius: 18px;
		background: color-mix(in srgb, var(--foreground) 6%, transparent);
		color: var(--foreground);
		padding: 0 12px;
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

	@media (max-width: 900px) {
		.page-container {
			padding: 20px;
		}

		.row-form {
			grid-template-columns: 1fr;
		}
	}
</style>
