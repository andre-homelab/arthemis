import { z } from 'zod';

export const userLoginSchema = z.object({
	email: z.email('E-mail inválido').max(150, 'E-mail muito longo'),
	password: z.string().min(1, 'Informe sua senha').max(255, 'Senha muito longa')
});

export type UserLoginSchema = typeof userLoginSchema;
