import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { projectSchema } from '$lib/components/ui/form/ProjectFormSchema.js';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad, } from './$types.js';
import { 
    listProponents, 
    createProject, 
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
			const projectData = {
                proponentId: Number(form.data.proponent_id),
                name: form.data.name,
                justification: form.data.justification,
                lifetimeStart: form.data.lifetime_start,
                lifetimeEnd: form.data.lifetime_end
            };
            
            const projectId = await createProject(projectData, token);
			if (!projectId) throw new Error("Erro ao cadastrar Projeto.");

			const locationIdMap = new Map<string, number>();
			
			for (const location of form.data.locations) {
                const locationId = await createLocation({
					projectId: projectId,
                    ecosystem: location.ecosystem,
                    country: location.country,
                    extentHa: location.extent_ha,
                    position: location.position
                }, token);
                
				if (!locationId) throw new Error(`Não foi possível recuperar o ID da localização: ${location.ecosystem}`);
				
				locationIdMap.set(location.id, Number(locationId));
            }

			const activityIdMap = new Map<string, number>();

			for (const activity of form.data.activities) {
                const activityId = await createActivity({
					projectId: projectId,
                    name: activity.name,
                    description: activity.description,
                    justification: activity.justification
                }, token);
                
				if (!activityId) throw new Error(`Não foi possível recuperar o ID da atividade: ${activity.name}`);
				
				activityIdMap.set(activity.id, Number(activityId));
            }

			for (const indicator of form.data.indicators) {
                const realLocationId = locationIdMap.get(indicator.location_id);
                const realActivityId = activityIdMap.get(indicator.activity_id);

                if (!realLocationId || !realActivityId) {
                    throw new Error("Erro: Localização ou Atividade não encontrada para o Indicador");
                }

                await createIndicator({
                    projectId: projectId,
                    locationId: realLocationId,
                    activityId: realActivityId,
                    name: indicator.name,
                    unit: indicator.unit,
                    valueBaseline: indicator.value_baseline,
                    valueReference: indicator.value_reference,
                    observationMethod: indicator.observation_method,
                    justification: indicator.justification
                }, token);
            }


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

