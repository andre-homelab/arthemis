import { env } from '$env/dynamic/private';

/**
 * URL base para a API de Autenticação (Arthemis Auth).
 * Responsável por gerenciar credenciais, registros de credenciais e tokens JWT.
 * Fallback padrão: http://localhost:6769
 */
const AUTH_BASE_URL = env.ARTHEMIS_AUTH_URL;

/**
 * URL base para a API de Negócio (Arthemis Brain).
 * Responsável por gerenciar proponentes (organizações), projetos e perfis de usuários.
 * Fallback padrão: http://localhost:8081
 */
const BRAIN_BASE_URL = env.ARTHEMIS_BRAIN_URL;

/**
 * Estrutura de usuário retornada pelo serviço de autenticação após o registro.
 */
type AuthUser = {
	/** Identificador único do usuário (UUID gerado no serviço de autenticação). */
	sub: string;
	/** Nome de usuário/login. */
	username: string;
	/** Perfil/Nível de acesso atribuído ao usuário. */
	role: 'admin' | 'manager' | 'visitor';
};

/**
 * Resposta padrão retornada pelo endpoint de login do serviço de autenticação.
 */
type LoginResponse = {
	/** Token JWT de acesso assinado. */
	token: string;
};

/**
 * Formato bruto retornado pelo banco/API do Brain para proponentes (organizações).
 * Suporta formatos em PascalCase (GORM) e camelCase.
 */
type ProponentResponse = {
	ID?: number;
	id?: number;
	Name?: string;
	name?: string;
};

/**
 * Tipo exportado e formatado para ser consumido nos componentes de seleção (Select) do frontend.
 */
export type ProponentOption = {
	/** Identificador único convertido para string. */
	id: string;
	/** Nome de exibição da organização proponente. */
	name: string;
};

export type CreationResponse = {
	ID?: number;
	id?: number;
	/** Permite que a API retorne outros campos além dos acima */
	[key: string]: unknown;
}

export type CreateProponentInput = {
	name: string;
	email: string;
};

export type CreateProjectProponentInput = {
	projectId: number;
	proponentId: number;
	role: string;
};

export type CreateProjectInput = {
	proponentId: number;
	name: string;
	justification: string;
	lifetimeStart: Date;
	lifetimeEnd: Date;  
};

export type CreateLocationInput = {
	projectId: number; 
	ecosystem: string;
	country: string;
	extentHa: number;   
	position: string;
};

export type CreateActivityInput = {
	projectId: number; 
	name: string;
	description: string;
	justification: string;
};

export type CreateIndicatorInput = {
	projectId: number;         
	locationId: number;    
	activityId: number;     
	name: string;
	unit: string;
	valueBaseline: number; 
	valueReference: number;   
	observationMethod: string;
	justification: string;
};

/**
 * Auxiliar para analisar erros retornados das APIs.
 * Tenta decodificar o JSON buscando por campos comuns de erro (`error` ou `message`).
 * Se não for um JSON válido ou estiver vazio, retorna um fallback padrão ou o corpo bruto em texto.
 *
 * @param response Objeto Response retornado pelo fetch.
 * @param fallback Mensagem genérica a ser usada em caso de falha de parsing do erro.
 * @returns Mensagem de erro amigável extraída da resposta.
 */
async function parseError(response: Response, fallback: string): Promise<string> {
	const body = await response.text();

	if (!body) {
		return fallback;
	}

	try {
		const parsed = JSON.parse(body) as { error?: string; message?: string };
		return parsed.message ?? parsed.error ?? fallback;
	} catch {
		return body;
	}
}

/**
 * Registra um novo usuário no serviço de autenticação (Auth).
 * Este passo apenas cria as credenciais e o perfil de acesso no banco de auth.
 *
 * @param input Dados necessários para o registro (username, password, role).
 * @throws {Error} Se o registro falhar ou se o nome de usuário já existir.
 * @returns Os dados do usuário registrado gerados pelo serviço de autenticação.
 */
export async function registerAuthUser(input: {
	username: string;
	password: string;
	role: 'admin' | 'manager' | 'visitor';
}): Promise<AuthUser> {
	const response = await fetch(`${AUTH_BASE_URL}/register/`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(input)
	});

	if (!response.ok) {
		throw new Error(await parseError(response, 'Erro ao cadastrar usuário no auth.'));
	}

	return (await response.json()) as AuthUser;
}

/**
 * Realiza a autenticação (login) de um usuário no serviço de autenticação.
 *
 * @param input Credenciais de acesso do usuário (username, password).
 * @throws {Error} Se as credenciais forem inválidas ou o servidor estiver indisponível.
 * @returns O token JWT retornado pelo serviço.
 */
export async function loginAuthUser(input: {
	username: string;
	password: string;
}): Promise<LoginResponse> {
	const response = await fetch(`${AUTH_BASE_URL}/login/`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(input)
	});

	if (!response.ok) {
		throw new Error(await parseError(response, 'Usuário ou senha inválidos.'));
	}

	return (await response.json()) as LoginResponse;
}

/**
 * Cria o perfil estendido do usuário no serviço de negócio (Brain).
 * Vincula o ID gerado pelo Auth à organização proponente (`proponent_id`) e outras informações de perfil.
 *
 * @param input Dados completos do usuário para persistência no Brain, incluindo o token JWT de autenticação.
 * @throws {Error} Se o servidor do Brain rejeitar os dados ou se houver falha de validação.
 */
export async function createBrainUser(input: {
	id: string;
	proponent_id: number;
	username: string;
	email: string;
	role: 'admin' | 'manager' | 'visitor';
	token: string;
}): Promise<unknown> {
	const response = await fetch(`${BRAIN_BASE_URL}/user/create`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${input.token}`
		},
		body: JSON.stringify({
			id: input.id,
			proponent_id: input.proponent_id,
			username: input.username,
			email: input.email,
			role: input.role
		})
	});

	if (!response.ok) {
		throw new Error(await parseError(response, 'Erro ao cadastrar usuário no brain.'));
	}

	return response.json();
}

export async function createProponent(input: CreateProponentInput, token: string): Promise<unknown> {
	const response = await fetch(`${BRAIN_BASE_URL}/proponent/create`, {
		method: 'POST',
		headers: { 
			'Content-Type': 'application/json', 
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify(input)
	});

	if (!response.ok) {
		throw new Error(await parseError(response, 'Erro ao cadastrar organização.'));
	}

	return response.json();
}

export async function createProjectProponent(input: CreateProjectProponentInput[], token: string): Promise<number[] | null> {
	const projectId = input[0].projectId;

	const response = await fetch(`${BRAIN_BASE_URL}/project/${projectId}/add_proponent`, {
		method: 'POST',
		headers: { 
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}` 
		},
		body: JSON.stringify(input.map(p => ({
			ProjectID: p.projectId,
			ProponentID: p.proponentId,
			Role: p.role
		})))
	});

	if (!response.ok) {
		throw new Error(await parseError(response, 'Erro ao criar organização do projeto.'));
	}
	
	const projectProponentIds = await response.json();
	return projectProponentIds;
}

/**
 * Lista todas as organizações proponentes cadastradas no serviço Brain.
 * É usado principalmente para preencher seletores (Select) nos formulários de cadastro.
 *
 * @param token Opcional. Token JWT para autorização da chamada à API.
 * @returns Lista de opções de proponentes formatadas `{ id, name }`. Se falhar, retorna uma lista vazia.
 */
export async function listProponents(token?: string): Promise<ProponentOption[]> {
	const response = await fetch(`${BRAIN_BASE_URL}/proponent/`, {
		headers: token ? { Authorization: `Bearer ${token}` } : undefined
	});

	if (!response.ok) {
		return [];
	}

	const proponents = (await response.json()) as ProponentResponse[];

	return proponents
		.map((proponent) => ({
			id: String(proponent.id ?? proponent.ID ?? ''),
			name: proponent.name ?? proponent.Name ?? ''
		}))
		.filter((proponent) => proponent.id && proponent.name);
}


export async function createProject(input: CreateProjectInput, token: string): Promise<number | null> {
	const response = await fetch(`${BRAIN_BASE_URL}/project/create`, {
		method: 'POST',
		headers: { 
			'Content-Type': 'application/json', 
			Authorization: `Bearer ${token}` 
		},
		body: JSON.stringify({
			ProponentID: input.proponentId,
			Name: input.name,
			Justification: input.justification,
			LifetimeStart: input.lifetimeStart,
			LifetimeEnd: input.lifetimeEnd
		})
	});

	if (!response.ok) {
		throw new Error(await parseError(response, 'Erro ao criar projeto.'));
	}

	const projectId = await response.json(); 	
	return projectId
}

export async function createLocation(input: CreateLocationInput[], token: string): Promise<number[] | null> {
	const response = await fetch(`${BRAIN_BASE_URL}/location/create`, {
		method: 'POST',
		headers: { 
			'Content-Type': 'application/json', 
			Authorization: `Bearer ${token}`
		 },
		body: JSON.stringify(input.map(l => ({
			ProjectID: l.projectId,
			Ecosystem: l.ecosystem,
			Country: l.country,
			Extent: l.extentHa,
			Position: JSON.parse(l.position)
		})))
	});
	
	if (!response.ok) { 
		throw new Error(await parseError(response, 'Erro ao criar localização.'));
	}

	const locationIds = await response.json(); 	
	return locationIds
}

export async function createActivity(input: CreateActivityInput[], token: string): Promise<number[] | null> {
	const response = await fetch(`${BRAIN_BASE_URL}/activity/create`, {
		method: 'POST',
		headers: { 
			'Content-Type': 'application/json',
			 Authorization: `Bearer ${token}` 
			},
		body: JSON.stringify(input.map(a => ({
			ProjectID: a.projectId,
			Name: a.name,
			Description: a.description,
			Justification: a.justification
		})))
	});

	if (!response.ok) {
		throw new Error(await parseError(response, 'Erro ao criar atividade.'));
	}
	
	const activityIds = await response.json(); 	
	return activityIds;
}

export async function createIndicator(input: CreateIndicatorInput[], token: string): Promise<number[] | null> {
	const response = await fetch(`${BRAIN_BASE_URL}/indicator/create`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
		body: JSON.stringify(input.map(i => ({
			ProjectID: i.projectId,                 
			LocationID: i.locationId,              
			ActivityID: i.activityId,             
			Name: i.name,
			Unit: i.unit,
			ValueBaseline: i.valueBaseline,        
			ValueReference: i.valueReference,    
			ObservationMethod: i.observationMethod,
			Justification: i.justification
		})))
	});
	
	if (!response.ok) {
		throw new Error(await parseError(response, 'Erro ao criar indicador.'));
	}

	const indicatorIds = await response.json(); 	
	return indicatorIds;
}