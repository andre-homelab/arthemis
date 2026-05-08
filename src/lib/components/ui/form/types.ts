import type { SuperValidated, Infer } from 'sveltekit-superforms';
import type { ProponentSchema } from './ProponentFormschema.js';
import type { ProjectSchema } from './ProjectFormSchema.js';

// Props para os componentes do formulário das Organizações
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

// Props para os componentes do formulário dos Projetos

// Proponente disponível para seleção no formulário.
// Vem do load() do +page.server.ts, buscado do banco.
export interface ProponentOption {
	id: string;
	name: string;
}

export interface ProjectFormProps {
	// Dados do formulário vindos do load() via superValidate
	data: SuperValidated<Infer<ProjectSchema>>;
	// Lista de proponentes para o campo de seleção
	proponents: ProponentOption[];
	// Título exibido no card do formulário
	title?: string;
	// Subtítulo/descrição exibida abaixo do título
	description?: string;
	// Texto do botão de submit
	submitLabel?: string;
	// Classe CSS adicional para o card externo
	class?: string;
}