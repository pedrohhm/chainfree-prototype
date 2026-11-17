import { format } from 'date-fns';

export class AuthInputError extends Error {}

const emailFormat = /^[a-z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/;

export function readCredentials({ email, password }) {
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  const [localPart] = normalizedEmail.split('@');
  if (normalizedEmail.length > 254 || localPart.length > 64 || !emailFormat.test(normalizedEmail) ||
      localPart.startsWith('.') || localPart.endsWith('.') || localPart.includes('..')) {
    throw new AuthInputError('Informe um e-mail válido.');
  }

  if (typeof password !== 'string' || password.length < 6 || password.length > 128) {
    throw new AuthInputError('A senha deve ter entre 6 e 128 caracteres.');
  }

  return { email: normalizedEmail, password };
}

export function readRegistration(body) {
  const { email, password } = readCredentials(body);
  const { name, birthDate, confirmPassword, termsChoice, healthConsent } = body;
  const fullName = typeof name === 'string' ? name.trim() : '';
  if (!fullName || fullName.length > 150) {
    throw new AuthInputError('Informe seu nome completo com até 150 caracteres.');
  }

  const today = new Date();
  const date = typeof birthDate === 'string' ? new Date(`${birthDate}T00:00:00Z`) : null;
  if (
    !date || !Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== birthDate ||
    birthDate < '1000-01-01' || birthDate > format(today, 'yyyy-MM-dd')
  ) {
    throw new AuthInputError('Informe uma data de nascimento válida.');
  }
  const years = today.getFullYear() - date.getUTCFullYear();
  const beforeBirthday = format(today, 'MM-dd') < birthDate.slice(5);
  if (years - Number(beforeBirthday) < 18) {
    throw new AuthInputError('É necessário ter 18 anos ou mais para criar uma conta.');
  }

  if (password !== confirmPassword) {
    throw new AuthInputError('As senhas não coincidem. Confira os dois campos de senha.');
  }
  if (termsChoice !== 'accept') {
    throw new AuthInputError('É necessário concordar com os Termos de Uso para criar a conta.');
  }
  if (healthConsent !== 'accept' && healthConsent !== 'decline') {
    throw new AuthInputError('Informe separadamente sua decisão sobre o tratamento de dados de saúde.');
  }

  return { name: fullName, birthDate, email, password, healthConsent: healthConsent === 'accept' };
}
