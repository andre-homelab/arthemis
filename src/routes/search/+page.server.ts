import type { PageServerLoad } from './$types.js';
import { redirect } from '@sveltejs/kit';
import { listProponents, listUsers, listObservations } from '$lib/server/arthemis-api.js';

export const load: PageServerLoad = async ({ cookies }) => {
	const token = cookies.get('arthemis_token');

	if (!token) {
		throw redirect(303, '/login');
	}

	const [organizations, users, observations] = await Promise.all([
		listProponents(token),
		listUsers(token),
		listObservations(token)
	]);

	return {
		organizations,
		users,
		observations
	};
};
