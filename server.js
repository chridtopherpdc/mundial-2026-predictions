const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Crear tablas si no existen
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id TEXT PRIMARY KEY,
      nombre TEXT NOT NULL,
      equipo_fav TEXT,
      jugador_fav TEXT,
      creado_en TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS predicciones (
      id SERIAL PRIMARY KEY,
      usuario_id TEXT,
      categoria TEXT NOT NULL,
      valor TEXT NOT NULL,
      actualizado_en TIMESTAMP DEFAULT NOW(),
      UNIQUE(usuario_id, categoria)
    );
    CREATE TABLE IF NOT EXISTS partidos (
      id SERIAL PRIMARY KEY,
      usuario_id TEXT,
      partido_id INTEGER NOT NULL,
      goles_local INTEGER DEFAULT 0,
      goles_visitante INTEGER DEFAULT 0,
      actualizado_en TIMESTAMP DEFAULT NOW(),
      UNIQUE(usuario_id, partido_id)
    );
    CREATE TABLE IF NOT EXISTS bracket (
      id SERIAL PRIMARY KEY,
      usuario_id TEXT,
      fase TEXT NOT NULL,
      equipo_ganador TEXT NOT NULL,
      actualizado_en TIMESTAMP DEFAULT NOW(),
      UNIQUE(usuario_id, fase)
    );
  `);
  console.log('✅ Base de datos lista');
}

// ── RUTAS API ──────────────────────────────────────

// Guardar/actualizar usuario
app.post('/api/usuario', async (req, res) => {
  const { id, nombre, equipo_fav, jugador_fav } = req.body;
  try {
    await pool.query(`
      INSERT INTO usuarios (id, nombre, equipo_fav, jugador_fav)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (id) DO UPDATE
      SET nombre=$2, equipo_fav=$3, jugador_fav=$4
    `, [id, nombre, equipo_fav, jugador_fav]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }) }
});

// Guardar predicción
app.post('/api/prediccion', async (req, res) => {
  const { usuario_id, categoria, valor } = req.body;
  try {
    await pool.query(`
      INSERT INTO predicciones (usuario_id, categoria, valor)
      VALUES ($1, $2, $3)
      ON CONFLICT (usuario_id, categoria) DO UPDATE SET valor=$3, actualizado_en=NOW()
    `, [usuario_id, categoria, valor]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }) }
});

// Guardar resultado partido
app.post('/api/partido', async (req, res) => {
  const { usuario_id, partido_id, goles_local, goles_visitante } = req.body;
  try {
    await pool.query(`
      INSERT INTO partidos (usuario_id, partido_id, goles_local, goles_visitante)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (usuario_id, partido_id) DO UPDATE
      SET goles_local=$3, goles_visitante=$4, actualizado_en=NOW()
    `, [usuario_id, partido_id, goles_local, goles_visitante]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }) }
});

// Guardar bracket
app.post('/api/bracket', async (req, res) => {
  const { usuario_id, fase, equipo_ganador } = req.body;
  try {
    await pool.query(`
      INSERT INTO bracket (usuario_id, fase, equipo_ganador)
      VALUES ($1, $2, $3)
      ON CONFLICT (usuario_id, fase) DO UPDATE SET equipo_ganador=$3, actualizado_en=NOW()
    `, [usuario_id, fase, equipo_ganador]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }) }
});

// Obtener todos los datos de un usuario
app.get('/api/datos/:usuario_id', async (req, res) => {
  const { usuario_id } = req.params;
  try {
    const [u, p, pa, b] = await Promise.all([
      pool.query('SELECT * FROM usuarios WHERE id=$1', [usuario_id]),
      pool.query('SELECT * FROM predicciones WHERE usuario_id=$1', [usuario_id]),
      pool.query('SELECT * FROM partidos WHERE usuario_id=$1', [usuario_id]),
      pool.query('SELECT * FROM bracket WHERE usuario_id=$1', [usuario_id]),
    ]);
    res.json({
      usuario: u.rows[0] || null,
      predicciones: p.rows,
      partidos: pa.rows,
      bracket: b.rows
    });
  } catch (e) { res.status(500).json({ error: e.message }) }
});

// Ranking — todos los usuarios con sus predicciones
app.get('/api/ranking', async (req, res) => {
  try {
    const usuarios = await pool.query('SELECT * FROM usuarios ORDER BY creado_en DESC');
    const predicciones = await pool.query('SELECT * FROM predicciones');
    const partidos = await pool.query('SELECT COUNT(*) as total, usuario_id FROM partidos GROUP BY usuario_id');
    res.json({ usuarios: usuarios.rows, predicciones: predicciones.rows, partidos: partidos.rows });
  } catch (e) { res.status(500).json({ error: e.message }) }
});

// Servir React en producción
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await initDB();
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
