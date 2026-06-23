import type { Actions, PageServerLoad } from './$types.js';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { observationSchema } from '$lib/components/ui/form/ObservationFormSchema.js';
import {
	createObservations,
	deleteObservation,
	listObservations,
	updateObservation,
	listIndicators
} from '$lib/server/arthemis-api.js';

function requiredString(data: FormData, key: string): string {
	const value = data.get(key);
	return typeof value === 'string' ? value.trim() : '';
}

function parsePositiveNumber(value: string): number | null {
	const number = Number(value);
	return Number.isFinite(number) && number > 0 ? number : null;
}

function parsePosition(value: string): unknown {
	return JSON.parse(value);
}

export const load: PageServerLoad = async ({ cookies }) => {
	const token = cookies.get('arthemis_token');

	if (!token) {
		throw redirect(303, '/login');
	}

	return {
		form: await superValidate(zod4(observationSchema)),
		observations: await listObservations(token),
		indicators: await listIndicators(token)
	};
};

export const actions: Actions = {
	create: async (event) => {
		const token = event.cookies.get('arthemis_token');

		if (!token) {
			throw redirect(303, '/login');
		}

		const form = await superValidate(event, zod4(observationSchema));

		if (!form.valid) {
			return fail(400, { form, message: 'Revise os dados da observação.' });
		}

		try {
			const indicatorId = Number(form.data.indicator_id);
			const value = form.data.value;
			const date = form.data.date;
			const position = form.data.position;

			const observationIds = await createObservations(
				[
					{
						indicatorId,
						value,
						date,
						position
					}
				],
				token
			);

			return {
				form,
				success: true,
				message: 'Observação cadastrada com sucesso!',
				observationIds
			};
		} catch (error: unknown) {
			return fail(500, {
				form,
				message: error instanceof Error ? error.message : 'Erro interno.'
			});
		}
	},

	update: async (event) => {
		const token = event.cookies.get('arthemis_token');

		if (!token) {
			throw redirect(303, '/login');
		}

		const data = await event.request.formData();
		const id = requiredString(data, 'id');
		const indicatorId = parsePositiveNumber(requiredString(data, 'indicator_id'));
		const value = Number(requiredString(data, 'value'));
		const dateValue = requiredString(data, 'date');
		const positionText = requiredString(data, 'position');

		if (!id || !indicatorId || !Number.isFinite(value) || !dateValue || !positionText) {
			return fail(400, { message: 'Revise os dados da observação antes de atualizar.' });
		}

		try {
			await updateObservation(
				id,
				{
					indicatorId,
					value,
					date: new Date(`${dateValue}T12:00:00`),
					position: parsePosition(positionText)
				},
				token
			);

			return { success: true, message: 'Observação atualizada com sucesso!' };
		} catch (error: unknown) {
			return fail(500, {
				message: error instanceof Error ? error.message : 'Erro ao atualizar observação.'
			});
		}
	},

	delete: async (event) => {
		const token = event.cookies.get('arthemis_token');

		if (!token) {
			throw redirect(303, '/login');
		}

		const data = await event.request.formData();
		const id = requiredString(data, 'id');

		if (!id) {
			return fail(400, { message: 'Observação inválida.' });
		}

		try {
			await deleteObservation(id, token);
			return { success: true, message: 'Observação excluída com sucesso!' };
		} catch (error: unknown) {
			return fail(500, {
				message: error instanceof Error ? error.message : 'Erro ao excluir observação.'
			});
		}
	}
};