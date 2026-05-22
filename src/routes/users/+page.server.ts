import type { PageServerLoad, Actions } from './$types.js';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { userSchema } from '$lib/components/ui/form/UserFormSchema.js';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	// TODO: buscar do banco de dados
	// Ex: const proponents = await db.select({ id: proponent.id, name: proponent.name }).from(proponent);
	const proponents = [
		{ id: '00000000-0000-0000-0000-000000000001', name: 'Organização Exemplo A' },
		{ id: '00000000-0000-0000-0000-000000000002', name: 'Organização Exemplo B' }
	];

	return {
		form: await superValidate(zod4(userSchema)),
		proponents
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod4(userSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		// TODO: gerar hash da senha antes de salvar no banco de dados
		// Ex: await db.insert(users).values({ id: crypto.randomUUID(), ...form.data, password_hash });

		console.log('Usuário cadastrado:', form.data);

		return { form };
	}
};
