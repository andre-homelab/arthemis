/**
 * Estruturas de dados e contratos compartilhados entre o frontend e a API.
 */

export type AuthUser = {
	/** Identificador único do usuário (UUID gerado no serviço de autenticação). */
	sub: string;
	/** Nome de usuário/login. */
	username: string;
	/** Perfil/Nível de acesso atribuído ao usuário. */
	role: 'admin' | 'manager' | 'visitor';
};

export type LoginResponse = {
	/** Token JWT de acesso assinado. */
	token: string;
};

export type ProponentResponse = {
	ID?: number;
	id?: number;
	Name?: string;
	name?: string;
	Email?: string;
	email?: string;
};

export type UserResponse = {
	id?: string;
	proponent_id?: number;
	proponent?: ProponentResponse;
	username?: string;
	email?: string;
	role?: 'admin' | 'manager' | 'visitor';
};

export type ObservationResponse = {
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

export type IndicatorResponse = {
	ID?: number;
	id?: number;
	locationID?: number;
	location_id?: number;
	LocationID?: number;
	activityID?: number;
	activity_id?: number;
	ActivityID?: number;
	Name?: string;
	name?: string;
	Unit?: string;
	unit?: string;
	ValueBaseline?: number;
	valueBaseline?: number;
	ValueReference?: number;
	valueReference?: number;
	ObservationMethod?: string;
	observationMethod?: string;
	Justification?: string;
	justification?: string;
};

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

export type IndicatorRecord = {
	id: string;
	locationId: number;
	activityId: number;
	name: string;
	unit: string;
	valueBaseline: number;
	valueReference: number;
	observationMethod: string;
	justification: string;
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
