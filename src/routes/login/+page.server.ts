import type { PageServerLoad, Actions } from './$types.js';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { userLoginSchema } from '$lib/components/ui/form/UserLoginSchema.js';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod4(userLoginSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod4(userLoginSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		// TODO: buscar usuário por e-mail no banco de dados.
		// TODO: comparar form.data.password com o password_hash salvo.
		// TODO: criar uma sessão/cookie e redirecionar o usuário autenticado.

		console.log('Tentativa de login:', { email: form.data.email });

		return { form };
	}
};
