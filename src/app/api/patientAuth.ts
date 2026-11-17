export interface PatientAccount {
  id: string;
  name: string;
  email: string;
  birthDate: string;
  healthConsent: boolean;
}

interface Credentials {
  email: string;
  password: string;
}

interface Registration extends Credentials {
  name: string;
  birthDate: string;
  confirmPassword: string;
  termsChoice: 'accept';
  healthConsent: 'accept' | 'decline';
}

async function authRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const unavailable = 'Não foi possível acessar a API de autenticação. Verifique se ela está em execução.';
  let response: Response;
  try {
    response = await fetch(`/api/auth/${path}`, options);
  } catch {
    throw new Error(unavailable);
  }
  const data = await response.json().catch(() => null);
  if (!response.ok || !data) {
    throw new Error(data?.message || unavailable);
  }
  return data as T;
}

function post<T>(path: string, body: object) {
  return authRequest<T>(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export async function getPatientSession(signal: AbortSignal) {
  const { patient } = await authRequest<{ patient: PatientAccount | null }>('session', { signal });
  return patient;
}

export async function logInPatient(credentials: Credentials) {
  const { patient } = await post<{ patient: PatientAccount }>('login', credentials);
  return patient;
}

export function registerPatient(registration: Registration) {
  return post<{ message: string }>('register', registration);
}

export function logOutPatient() {
  return post<Record<string, never>>('logout', {});
}
