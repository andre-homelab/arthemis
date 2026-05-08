import type { SuperValidated, Infer } from 'sveltekit-superforms';
import type { ProponentSchema } from './schema.js';

export interface ProponentFormProps {
	// Dados do formulário vindos do load function via superValidate
	data: SuperValidated<Infer<ProponentSchema>>;
	// Título exibido no card do formulário
	title?: string;
	// Subtítulo/descrição exibida abaixo do título
	description?: string;
	// Texto do botão de submit
	submitLabel?: string;
	// Classe CSS adicional para o card externo
	class?: string;
}