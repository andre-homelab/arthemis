import { z } from 'zod';

const activitySchema = z.object({
   id: z.string(),
   name: z.string().min(2, 'Nome da atividade é obrigatório'),
   description: z.string().min(5, 'Descrição é obrigatória'),
   justification: z.string().min(5, 'Justificativa é obrigatória')
});


const indicatorSchema = z.object({
   id: z.string(),
   location_id: z.string().min(1, 'Vincule a um local'),
   activity_id: z.string().min(1, 'Vincule a uma atividade'),
  
   name: z.string().min(2, 'Nome é obrigatório'),
   unit: z.string().min(1, 'Unidade é obrigatória'),
   value_baseline: z.number().default(0),
   value_reference: z.number().default(0),
   observation_method: z.string().min(10, 'Método de observação é obrigatório'),
   justification: z.string().min(10, 'Justificativa é obrigatória')
})

export const locationSchema = z.object({
	id: z.string(),
	ecosystem: z.string().min(2, 'Ecossistema é obrigatório'),
	extent_ha: z.number().min(0.01, 'A extensão deve ser maior que zero'),
	country: z.string().min(2, 'País é obrigatório'),
	position: z.string().min(2, 'Posição é obrigatório')
});

export const projectSchema = z.object({
	// FK para a tabela proponent — uuid do proponente selecionado
	proponent_id: z.uuid('Selecione uma organização válida'),

	name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(150, 'Nome muito longo'),

	// Objetos Date nativos — convertidos do CalendarDate do RangeCalendar via .toDate()
	lifetime_start: z.date('Data de início é obrigatória'),
	lifetime_end: z.date('Data de término é obrigatória'),

	justification: z.string().min(10, 'Justificativa deve ter pelo menos 10 caracteres'),

	locations: z.array(locationSchema).default([]),
	activities: z.array(activitySchema).default([]),
   	indicators: z.array(indicatorSchema).default([])
}).refine(
	(data) => data.lifetime_end >= data.lifetime_start,
	{
		message: 'A data de término não pode ser anterior à data de início',
		path: ['lifetime_end']
	}
);

export type ProjectSchema = typeof projectSchema;
