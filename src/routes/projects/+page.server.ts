import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { projectSchema } from '$lib/components/ui/form/ProjectFormSchema.js';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad, } from './$types.js';
import { 
    listProponents, 
    createProject, 
	createProjectProponent,
    createLocation, 
    createActivity, 
    createIndicator, 
} from '$lib/server/arthemis-api.js';


export const load: PageServerLoad = async ({ cookies }) => {
	const token = cookies.get('arthemis_token');

	if(!token) {
		throw redirect(303, '/login');
	}

	try {
		const proponents = await listProponents(token);

		return {
			form: await superValidate(zod4(projectSchema)),
			proponents
		};
	}
	catch (error: unknown) {
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

		const token = event.cookies.get('arthemis_token');
		
		if (!token) {
			throw redirect(303, '/login');
		}
	
		try {            
            const projectId = await createProject({
                proponentId: Number(form.data.proponent_id),
                name: form.data.name,
                justification: form.data.justification,
                lifetimeStart: form.data.lifetime_start,
                lifetimeEnd: form.data.lifetime_end
            }, token);
			
			if (!projectId) throw new Error("Erro ao cadastrar Projeto.");

			if (form.data.projectProponents.length > 0) {
				const projectProponents = form.data.projectProponents.map(p => ({
					projectId: projectId,
					proponentId: Number(p.proponent_id),
					role: p.role
				}));

				await createProjectProponent(projectProponents, token);
			}

			const locations = form.data.locations.map(l => ({
				projectId: projectId,
				ecosystem: l.ecosystem,
				country: l.country,
				extentHa: l.extent_ha,
				position: l.position
			}));
			
			const locationIdMap = new Map<string, number>();
			const locationIds = await createLocation(locations, token);

			if (!locationIds) throw new Error("Erro ao cadastrar Localizações.");

			form.data.locations.forEach((l, i) => {
				locationIdMap.set(l.id, locationIds[i]);
			})

			const activities = form.data.activities.map(a => ({
					projectId: projectId,
                    name: a.name,
                    description: a.description,
                    justification: a.justification
			}));

			const activityIdMap = new Map<string, number>();
			const activityIds = await createActivity(activities, token);
                
			if (!activityIds) throw new Error("Erro ao cadastrar Atividades.");
			
			form.data.activities.forEach((a, i) => {
				activityIdMap.set(a.id, activityIds[i]);
			})

			const indicators = form.data.indicators.map(i => {
				const locationId = locationIdMap.get(i.location_id);
				const activityId = activityIdMap.get(i.activity_id);

				if (!locationId || !activityId) throw new Error("Erro ao cadastrar Indicadores.")

				return {
					projectId: projectId,
					locationId: locationId,
					activityId: activityId,
					name: i.name,
					unit: i.unit,
					valueBaseline: i.value_baseline,
					valueReference: i.value_reference,
					observationMethod: i.observation_method,
					justification: i.justification
				};
			});

            await createIndicator(indicators, token);

			return { form, success: true, message: "Projeto cadastrado com sucesso!" };
		} 
		catch (error: unknown) {
			console.log(error);

			return fail(500, { 
				form, 
				message: error instanceof Error ? error.message : 'Erro interno.'
			});
		}
	}
};

