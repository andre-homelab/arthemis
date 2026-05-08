import type { PageServerLoad, Actions } from './$types.js';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { proponentSchema } from '$lib/components/ui/proponent/schema.js';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod4(proponentSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod4(proponentSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		// TODO: salvar no banco de dados
		// Ex: await db.insert(proponents).values({ id: crypto.randomUUID(), ...form.data });

		console.log('Organização cadastrada:', form.data);

		return { form };
	}
};