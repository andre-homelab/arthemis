import type { PageServerLoad, Actions } from './$types.js';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { userSchema } from '$lib/components/ui/form/UserFormSchema.js';
import { fail } from '@sveltejs/kit';
import {
	createBrainUser,
	listProponents,
	loginAuthUser,
	registerAuthUser
} from '$lib/server/arthemis-api.js';

/**
 * Função de carga da página de usuários (load).
 * Busca a lista de organizações proponentes registradas para alimentar o formulário de seleção
 * e inicializa a validação do formulário com o schema do Zod via sveltekit-superforms.
 *
 * @param event Contexto do servidor SvelteKit, incluindo cookies para verificação de token.
 * @returns Um objeto com a instância vazia do formulário de usuário e a lista de proponentes cadastrados.
 */
export const load: PageServerLoad = async ({ locals }) => {
	const token = locals.token;
	
	try {
		// Carrega proponentes ativos a partir da API do Brain, enviando o token JWT
		const proponents = await listProponents(token);

		return {
			form: await superValidate(zod4(userSchema)),
			proponents
		};
	} catch(error: unknown){
		return {
			form: await superValidate(zod4(userSchema)),
			proponents: []
		};
	}
};

/**
 * Ações de formulário do SvelteKit (Form Actions).
 * Gerencia a requisição POST para o cadastro completo de um novo usuário.
 */
export const actions: Actions = {
	/**
	 * Ação de criação de usuário padrão (default).
	 * Executa um fluxo em 3 etapas integrando os microsserviços do sistema:
	 * 1. Registra a credencial no serviço de Autenticação (Auth).
	 * 2. Faz o login automático para recuperar um token JWT válido.
	 * 3. Cria a entidade de usuário estendida com seu perfil no serviço de negócios (Brain).
	 */
	default: async (event) => {
		// Valida os dados da submissão usando o Zod (UserFormSchema) no backend
		const form = await superValidate(event, zod4(userSchema));

		// Retorna erro 400 em caso de dados de formulário inconsistentes
		if (!form.valid) {
			return fail(400, { form });
		}

		// Valida se o ID da organização proponente vinculada é um número inteiro válido
		const proponentID = Number(form.data.proponent_id);
		if (!Number.isInteger(proponentID) || proponentID <= 0) {
			return fail(400, { form });
		}

		try {
			// Passo 1: Registra as credenciais de autenticação básica (usuário/senha/função) no Auth Service
			const authUser = await registerAuthUser({
				username: form.data.username,
				password: form.data.password,
				role: form.data.role
			});

			// Passo 2: Efetua login com o usuário criado para obter o token JWT de acesso
			const { token } = await loginAuthUser({
				username: form.data.username,
				password: form.data.password
			});

			// Passo 3: Cria o registro estendido do usuário na API do Brain (associação com proponente e e-mail)
			// O UUID do Auth Service (`authUser.sub`) é usado como ID principal do usuário no Brain para manter a consistência.
			await createBrainUser({
				id: authUser.sub,
				proponent_id: proponentID,
				username: form.data.username,
				email: form.data.email,
				role: form.data.role,
				token
			});

			// Define o cookie de acesso ativo com as credenciais do usuário cadastrado
			event.cookies.set('arthemis_token', token, {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				secure: event.url.protocol === 'https:',
				maxAge: 60 * 60 * 24 // 24 horas
			});
		} catch (error: unknown) {
			// Se qualquer uma das etapas falhar (ex: usuário duplicado ou timeout das APIs),
			// cancela a operação e retorna o formulário preenchido com a mensagem de erro
			return fail(400, { form });
		}

		// Retorna o formulário limpo em caso de sucesso absoluto
		return { form };
	}
};
