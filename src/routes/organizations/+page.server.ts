import type { PageServerLoad, Actions } from './$types.js';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { proponentSchema } from '$lib/components/ui/form/ProponentFormschema.js';
import { fail, redirect } from '@sveltejs/kit';
import axios from 'axios';
import { createTypeReferenceDirectiveResolutionCache } from 'typescript';

const GATEWAY_URL = "http://localhost";

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

		// Refactor with API's auth method
		const token = null;

		if (!token) {
			throw redirect(303, '/login');
		}

		try {
			await axios.post(`${GATEWAY_URL}/brain/proponent/create`, form.data, {
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			});
            
            return { form, success: true, message: "Organização cadastrada!" };
		}
		catch(error: unknown) {
			return fail(500, { 
				form, 
				message: error instanceof Error ? error : 'Erro interno.'
			});
		}
	}
};
