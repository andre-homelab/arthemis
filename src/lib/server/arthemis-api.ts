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
	Email?: string;
	email?: string;
};

type UserResponse = {
	id?: string;
	proponent_id?: number;
	proponent?: ProponentResponse;
	username?: string;
	email?: string;
	role?: 'admin' | 'manager' | 'visitor';
};

type ObservationResponse = {
	ID?: number;
	id?: number;
	IndicatorID?: number;
	indicatorID?: number;
	indicator_id?: number;
	Value?: number;
	value?: number;
	Date?: string;
	date?: string;
	Position?: unknown;
	position?: unknown;
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

export type ProponentRecord = ProponentOption & {
	email: string;
};

export type UserRecord = {
	id: string;
	proponentId: string;
	proponentName: string;
	username: string;
	email: string;
	role: 'admin' | 'manager' | 'visitor';
};

export type ObservationRecord = {
	id: string;
	indicatorId: string;
	value: number;
	date: string;
	position: unknown;
	positionText: string;
};

export type CreationResponse = {
	ID?: number;
	id?: number;
	/** Permite que a API retorne outros campos além dos acima */
	[key: string]: unknown;
};

export type CreateProponentInput = {
	name: string;
	email: string;
};

export type UpdateProponentInput = CreateProponentInput;

export type UpdateUserInput = {
	proponentId: number;
	username: string;
	email: string;
	role: 'admin' | 'manager' | 'visitor';
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

export type CreateObservationInput = {
	indicatorId: number;
	value: number;
	date: Date;
	position: unknown;
};

export type UpdateObservationInput = CreateObservationInput;

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

function authorizationHeaders(token: string): HeadersInit {
	return {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`
	};
}

function toDateInputValue(value: string | undefined): string {
	if (!value) {
		return '';
	}

	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return value.slice(0, 10);
	}

	return date.toISOString().slice(0, 10);
}

function normalizeProponent(proponent: ProponentResponse): ProponentRecord {
	return {
		id: String(proponent.id ?? proponent.ID ?? ''),
		name: proponent.name ?? proponent.Name ?? '',
		email: proponent.email ?? proponent.Email ?? ''
	};
}

function normalizeUser(user: UserResponse): UserRecord {
	const proponent = user.proponent ? normalizeProponent(user.proponent) : undefined;

	return {
		id: user.id ?? '',
		proponentId: String(user.proponent_id ?? proponent?.id ?? ''),
		proponentName: proponent?.name ?? '',
		username: user.username ?? '',
		email: user.email ?? '',
		role: user.role ?? 'visitor'
	};
}

function normalizeObservation(observation: ObservationResponse): ObservationRecord {
	const position = observation.position ?? observation.Position ?? null;

	return {
		id: String(observation.id ?? observation.ID ?? ''),
		indicatorId: String(
			observation.indicator_id ?? observation.indicatorID ?? observation.IndicatorID ?? ''
		),
		value: Number(observation.value ?? observation.Value ?? 0),
		date: toDateInputValue(observation.date ?? observation.Date),
		position,
		positionText: JSON.stringify(position, null, 2)
	};
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
		headers: authorizationHeaders(input.token),
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

export async function createProponent(
	input: CreateProponentInput,
	token: string
): Promise<unknown> {
	const response = await fetch(`${BRAIN_BASE_URL}/proponent/create`, {
		method: 'POST',
		headers: authorizationHeaders(token),
		body: JSON.stringify(input)
	});

	if (!response.ok) {
		throw new Error(await parseError(response, 'Erro ao cadastrar organização.'));
	}

	return response.json();
}

export async function updateProponent(
	id: string,
	input: UpdateProponentInput,
	token: string
): Promise<ProponentRecord> {
	const response = await fetch(`${BRAIN_BASE_URL}/proponent/update/${id}`, {
		method: 'PATCH',
		headers: authorizationHeaders(token),
		body: JSON.stringify({
			Name: input.name,
			Email: input.email
		})
	});

	if (!response.ok) {
		throw new Error(await parseError(response, 'Erro ao atualizar organização.'));
	}

	return normalizeProponent((await response.json()) as ProponentResponse);
}

export async function deleteProponent(id: string, token: string): Promise<boolean> {
	const response = await fetch(`${BRAIN_BASE_URL}/proponent/delete/${id}`, {
		method: 'DELETE',
		headers: { Authorization: `Bearer ${token}` }
	});

	if (!response.ok) {
		throw new Error(await parseError(response, 'Erro ao excluir organização.'));
	}

	return (await response.json()) as boolean;
}

/**
 * Lista todas as organizações proponentes cadastradas no serviço Brain.
 * É usado principalmente para preencher seletores (Select) nos formulários de cadastro.
 *
 * @param token Opcional. Token JWT para autorização da chamada à API.
 * @returns Lista de opções de proponentes formatadas `{ id, name }`. Se falhar, retorna uma lista vazia.
 */
export async function listProponents(token?: string): Promise<ProponentRecord[]> {
	const response = await fetch(`${BRAIN_BASE_URL}/proponent/`, {
		headers: token ? { Authorization: `Bearer ${token}` } : undefined
	});

	if (!response.ok) {
		return [];
	}

	const proponents = (await response.json()) as ProponentResponse[];

	return proponents.map(normalizeProponent).filter((proponent) => proponent.id && proponent.name);
}

export async function listUsers(token: string): Promise<UserRecord[]> {
	const response = await fetch(`${BRAIN_BASE_URL}/user/`, {
		headers: { Authorization: `Bearer ${token}` }
	});

	if (!response.ok) {
		throw new Error(await parseError(response, 'Erro ao listar usuários.'));
	}

	const users = (await response.json()) as UserResponse[];

	return users.map(normalizeUser).filter((user) => user.id);
}

export async function updateUser(
	id: string,
	input: UpdateUserInput,
	token: string
): Promise<UserRecord> {
	const response = await fetch(`${BRAIN_BASE_URL}/user/update/${id}`, {
		method: 'PATCH',
		headers: authorizationHeaders(token),
		body: JSON.stringify({
			proponent_id: input.proponentId,
			username: input.username,
			email: input.email,
			role: input.role
		})
	});

	if (!response.ok) {
		throw new Error(await parseError(response, 'Erro ao atualizar usuário.'));
	}

	return normalizeUser((await response.json()) as UserResponse);
}

export async function deleteUser(id: string, token: string): Promise<boolean> {
	const response = await fetch(`${BRAIN_BASE_URL}/user/delete/${id}`, {
		method: 'DELETE',
		headers: { Authorization: `Bearer ${token}` }
	});

	if (!response.ok) {
		throw new Error(await parseError(response, 'Erro ao excluir usuário.'));
	}

	return (await response.json()) as boolean;
}

export async function createProject(
	input: CreateProjectInput,
	token: string
): Promise<number | null> {
	const response = await fetch(`${BRAIN_BASE_URL}/project/create`, {
		method: 'POST',
		headers: authorizationHeaders(token),
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
	console.log(projectId);
	return projectId;
}

export async function createLocation(
	input: CreateLocationInput,
	token: string
): Promise<number | null> {
	const response = await fetch(`${BRAIN_BASE_URL}/location/create`, {
		method: 'POST',
		headers: authorizationHeaders(token),
		body: JSON.stringify({
			ProjectID: input.projectId,
			Ecosystem: input.ecosystem,
			Country: input.country,
			Extent: input.extentHa,
			Position: JSON.parse(input.position)
		})
	});

	if (!response.ok) {
		throw new Error(await parseError(response, 'Erro ao criar localização.'));
	}

	const locationId = await response.json();
	return locationId;
}

export async function createActivity(
	input: CreateActivityInput,
	token: string
): Promise<number | null> {
	const response = await fetch(`${BRAIN_BASE_URL}/activity/create`, {
		method: 'POST',
		headers: authorizationHeaders(token),
		body: JSON.stringify({
			ProjectID: input.projectId,
			Name: input.name,
			Description: input.description,
			Justification: input.justification
		})
	});

	if (!response.ok) {
		throw new Error(await parseError(response, 'Erro ao criar atividade.'));
	}

	const activityId = await response.json();
	return activityId;
}

export async function createIndicator(
	input: CreateIndicatorInput,
	token: string
): Promise<number | null> {
	const response = await fetch(`${BRAIN_BASE_URL}/indicator/create`, {
		method: 'POST',
		headers: authorizationHeaders(token),
		body: JSON.stringify({
			ProjectID: input.projectId,
			LocationID: input.locationId,
			ActivityID: input.activityId,
			Name: input.name,
			Unit: input.unit,
			ValueBaseline: input.valueBaseline,
			ValueReference: input.valueReference,
			ObservationMethod: input.observationMethod,
			Justification: input.justification
		})
	});

	if (!response.ok) {
		throw new Error(await parseError(response, 'Erro ao criar indicador.'));
	}

	const indicatorId = await response.json();
	return indicatorId;
}

export async function createObservations(
	input: CreateObservationInput[],
	token: string
): Promise<number[]> {
	const response = await fetch(`${BRAIN_BASE_URL}/observation/create`, {
		method: 'POST',
		headers: authorizationHeaders(token),
		body: JSON.stringify(
			input.map((observation) => ({
				IndicatorID: observation.indicatorId,
				Value: observation.value,
				Date: observation.date,
				Position: observation.position
			}))
		)
	});

	if (!response.ok) {
		throw new Error(await parseError(response, 'Erro ao cadastrar observação.'));
	}

	return (await response.json()) as number[];
}

export async function listObservations(token: string): Promise<ObservationRecord[]> {
	const response = await fetch(`${BRAIN_BASE_URL}/observation/`, {
		headers: { Authorization: `Bearer ${token}` }
	});

	if (!response.ok) {
		if (response.status === 404) {
			return [];
		}

		throw new Error(await parseError(response, 'Erro ao listar observações.'));
	}

	const observations = (await response.json()) as ObservationResponse[];

	return observations.map(normalizeObservation).filter((observation) => observation.id);
}

export async function updateObservation(
	id: string,
	input: UpdateObservationInput,
	token: string
): Promise<ObservationRecord> {
	const response = await fetch(`${BRAIN_BASE_URL}/observation/update/${id}`, {
		method: 'PATCH',
		headers: authorizationHeaders(token),
		body: JSON.stringify({
			IndicatorID: input.indicatorId,
			Value: input.value,
			Date: input.date,
			Position: input.position
		})
	});

	if (!response.ok) {
		throw new Error(await parseError(response, 'Erro ao atualizar observação.'));
	}

	return normalizeObservation((await response.json()) as ObservationResponse);
}

export async function deleteObservation(id: string, token: string): Promise<boolean> {
	const response = await fetch(`${BRAIN_BASE_URL}/observation/delete/${id}`, {
		method: 'DELETE',
		headers: { Authorization: `Bearer ${token}` }
	});

	if (!response.ok) {
		throw new Error(await parseError(response, 'Erro ao excluir observação.'));
	}

	return (await response.json()) as boolean;
}
