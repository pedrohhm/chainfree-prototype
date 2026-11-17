import { randomBytes } from 'node:crypto';
import express from 'express';
import session from 'express-session';
import mysql from 'mysql2/promise';
import { AuthInputError } from './auth-input.mjs';
import { createPatientAuthRouter } from './patient-auth.mjs';

if (!process.env.DB_USER) {
  console.error('Defina DB_USER e DB_PASSWORD no arquivo .env.');
  process.exit(1);
}

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  database: process.env.DB_NAME || 'chainfree',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD ?? '',
  charset: 'utf8mb4',
  connectTimeout: 5000,
  connectionLimit: 5,
});

try {
  await pool.query('SELECT paciente_id FROM autenticacao_paciente LIMIT 0');
} catch (error) {
  console.error(`Falha ao conectar à base de autenticação (${error.code ?? error.name}). Confira o .env e a migração SQL.`);
  await pool.end();
  process.exit(1);
}

const app = express();
const cookieName = 'chainfree.session';
const cookieOptions = { httpOnly: true, sameSite: 'lax', path: '/' };

app.disable('x-powered-by');
app.use('/api/auth', (req, res, next) => {
  res.set('Cache-Control', 'no-store');
  if (req.method === 'POST' && !req.is('application/json')) {
    return res.status(415).json({ message: 'Envie os dados em formato JSON.' });
  }
  return next();
});
app.use('/api/auth',
  express.json({ limit: '8kb' }),
  session({
    name: cookieName,
    secret: randomBytes(32).toString('hex'),
    resave: false,
    saveUninitialized: false,
    cookie: { ...cookieOptions, maxAge: 8 * 60 * 60 * 1000 },
  }),
  createPatientAuthRouter(pool, cookieName, cookieOptions),
);

app.use((error, _req, res, _next) => {
  if (error instanceof AuthInputError) {
    return res.status(400).json({ message: error.message });
  }
  if (error.status >= 400 && error.status < 500) {
    return res.status(error.status).json({ message: 'A solicitação contém dados inválidos.' });
  }

  console.error('Falha na autenticação:', error.code ?? error.name);
  return res.status(503).json({ message: 'Não foi possível acessar a conta. Confira a API e o MySQL e tente novamente.' });
});

const port = Number(process.env.API_PORT || 3001);
app.listen(port, '127.0.0.1', () => {
  console.log(`API de autenticação em http://127.0.0.1:${port}`);
});
