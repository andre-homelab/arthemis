import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { projectSchema } from '$lib/components/ui/form/ProjectFormSchema.js';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad, } from './$types.js';
import axios from "axios";

const GATEWAY_URL = "http://localhost";

export const load: PageServerLoad = async ({ cookies }) => {
	// Get token from cookies; cookie will need to be set on login (https://svelte.dev/tutorial/kit/cookies)
	// const token = cookies.get('auth');

	const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiYWRtaW4iOnRydWUsImlhdCI6MTcxNjMxMTUwMCwiZXhwIjoxNzg3MTQ5MTEwfQ.Y-DphiHWtaletioE6SdBZ6hXuSKBslA8PifCrX5mPrk";

	if(!token) {
		// Redirect to login
	}

	// Mock
	// const proponents = [
	// 	{ id: '00000000-0000-0000-0000-000000000001', name: 'Organização Exemplo A' },
	// 	{ id: '00000000-0000-0000-0000-000000000002', name: 'Organização Exemplo B' }
	// ];

	try {
		// Get proponents (what are the endpoints?)
		const response = await axios.post(`${GATEWAY_URL}/auth/register`, {
			data: {
				"password": "merdafudida",
				"role": "admin",
				"username": "gustavo",
			}
		});

		return {
			form: await superValidate(zod4(projectSchema)),
			proponents: response.data
		};
	}
	catch (err: unknown) {
		if (axios.isAxiosError(err)) {
			console.log('get error: ', err.message);
		}

		return {
			form: await superValidate(zod4(projectSchema)),
			proponents: []
		};
	}
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod4(projectSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		// TODO: salvar no banco de dados
		try {
			const response = axios.post(`${GATEWAY_URL}/brain/project`)
		} 
		catch (err: unknown) {
			if (axios.isAxiosError(err)) {
				console.log('post error: ', err.message);
			}
		}

		console.log('Projeto cadastrado:', form.data);

		return { form };
	}
};
