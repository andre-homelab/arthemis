import type { PageServerLoad, Actions } from './$types.js';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { proponentSchema } from '$lib/components/ui/form/ProponentFormschema.js';
import { fail, redirect } from '@sveltejs/kit';
import { createProponent } from '$lib/server/arthemis-api.js';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod4(proponentSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const token = event.cookies.get('arthemis_token');
		if (!token) {
			redirect(303, '/login');
		}

		const form = await superValidate(zod4(proponentSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await createProponent(form.data, token);
		} catch(error: unknown) {
			return fail(500, { form });
		}

		return { form };
	}
};
