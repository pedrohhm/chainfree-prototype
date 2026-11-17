import { randomUUID } from 'node:crypto';
import { promisify } from 'node:util';
import { Router } from 'express';
import { readCredentials, readRegistration } from './auth-input.mjs';
import { hashPassword, verifyPassword } from './password.mjs';

const patientFields = `
  u.id, u.nome_completo AS name, u.email,
  DATE_FORMAT(u.data_nascimento, '%Y-%m-%d') AS birthDate,
  a.consentimento_saude AS healthConsent`;
const patientTables = `
  FROM usuario u
  JOIN paciente p ON p.usuario_id = u.id
  JOIN autenticacao_paciente a ON a.paciente_id = p.usuario_id`;
const invalidCredentials = { message: 'E-mail ou senha inválidos.' };

function publicPatient({ id, name, email, birthDate, healthConsent }) {
  return { id, name, email, birthDate, healthConsent: healthConsent === 1 };
}

async function registerPatient(pool, { name, birthDate, email, password, healthConsent }) {
  const id = randomUUID();
  const passwordHash = await hashPassword(password);
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    await connection.execute(
      `INSERT INTO usuario (id, criado_em, nome_completo, data_nascimento, email)
       VALUES (?, CURRENT_TIMESTAMP(6), ?, ?, ?)`,
      [id, name, birthDate, email],
    );
    await connection.execute('INSERT INTO paciente (usuario_id) VALUES (?)', [id]);
    await connection.execute(
      `INSERT INTO autenticacao_paciente (paciente_id, senha_hash, versao_termos, consentimento_saude)
       VALUES (?, ?, ?, ?)`,
      [id, passwordHash, '1.0', healthConsent ? 1 : 0],
    );
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export function createPatientAuthRouter(pool, cookieName, cookieOptions) {
  const router = Router();

  router.post('/register', async (req, res) => {
    const registration = readRegistration(req.body ?? {});
    try {
      await registerPatient(pool, registration);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY' && error.sqlMessage?.includes('uq_usuario_email_ativo')) {
        return res.status(409).json({ message: 'Já existe uma conta ativa com este e-mail.' });
      }
      throw error;
    }
    return res.status(201).json({ message: 'Cadastro realizado. Entre com seu e-mail e senha.' });
  });

  router.post('/login', async (req, res) => {
    const { email, password } = readCredentials(req.body ?? {});
    const [[row]] = await pool.execute(
      `SELECT ${patientFields}, a.senha_hash AS passwordHash ${patientTables}
       WHERE (CASE WHEN u.status_conta = 'ATIVA' THEN LOWER(TRIM(u.email)) ELSE NULL END) = ?`,
      [email],
    );
    const passwordMatches = await verifyPassword(password, row?.passwordHash);
    if (!row || !passwordMatches) {
      return res.status(401).json(invalidCredentials);
    }

    const [recorded] = await pool.execute(
      `UPDATE autenticacao_paciente a
       JOIN usuario u ON u.id = a.paciente_id
       SET a.ultimo_login_em = CURRENT_TIMESTAMP(6)
       WHERE a.paciente_id = ? AND u.status_conta = 'ATIVA' AND a.senha_hash = ?`,
      [row.id, row.passwordHash],
    );
    if (!recorded.affectedRows) return res.status(401).json(invalidCredentials);

    await promisify(req.session.regenerate).call(req.session);
    req.session.patientId = row.id;
    await promisify(req.session.save).call(req.session);
    return res.json({ patient: publicPatient(row) });
  });

  router.get('/session', async (req, res) => {
    if (!req.session.patientId) return res.json({ patient: null });

    const [[row]] = await pool.execute(
      `SELECT ${patientFields} ${patientTables} WHERE u.id = ? AND u.status_conta = 'ATIVA'`,
      [req.session.patientId],
    );
    return res.json({ patient: row ? publicPatient(row) : null });
  });

  router.post('/logout', async (req, res) => {
    await promisify(req.session.destroy).call(req.session);
    res.clearCookie(cookieName, cookieOptions);
    return res.json({});
  });

  return router;
}
