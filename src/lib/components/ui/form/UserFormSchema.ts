import { z } from 'zod';

export const userSchema = z.object({
	// FK para a tabela proponent: uuid do proponente selecionado
	proponent_id: z.uuid('Selecione uma organização válida'),
	email: z.email('E-mail inválido').max(150, 'E-mail muito longo'),
	password_hash: z
		.string()
		.min(8, 'Senha deve ter pelo menos 8 caracteres')
		.max(255, 'Senha muito longa'),
	role: z.enum(['admin', 'manager', 'visitor'])
});

export type UserSchema = typeof userSchema;
