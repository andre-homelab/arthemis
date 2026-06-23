import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { observationSchema } from '$lib/components/ui/form/ObservationFormSchema.js';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types.js';

export const load: PageServerLoad = async (event) => {
	const token = event.cookies.get('arthemis_token');

	if (!token) {
		throw redirect(303, '/login');
	}

	return {
		form: await superValidate(zod4(observationSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const token = event.cookies.get('arthemis_token');

		if (!token) {
			throw redirect(303, '/login');
		}

		const form = await superValidate(event, zod4(observationSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		// Como o endpoint do backend ainda não está pronto, apenas simulamos o sucesso.
		return {
			form,
			success: true,
			message: 'Observação validada com sucesso (Simulação)!'
		};
	}
};
