import { z } from 'zod';

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
}).refine(
	(data) => data.lifetime_end >= data.lifetime_start,
	{
		message: 'A data de término não pode ser anterior à data de início',
		path: ['lifetime_end']
	}
);

export type ProjectSchema = typeof projectSchema;
