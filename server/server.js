
const express = require('express');
const cors = require('cors');
const { Client } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'hellforge_secret_key_666';

// Database Connection
const isLocal = process.env.DATABASE_URL && process.env.DATABASE_URL.includes('localhost');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: isLocal ? false : {
    rejectUnauthorized: false
  }
});

client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Connection error', err.stack));

// --- MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- AUTH ROUTES ---

// Register
app.post('/api/auth/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await client.query(
            'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
            [email, hashedPassword]
        );
        const user = result.rows[0];
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
        res.json({ user, token });
    } catch (err) {
        if (err.code === '23505') { // Unique violation
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: err.message });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) return res.status(400).json({ error: 'User not found' });

        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
        res.json({ user: { id: user.id, email: user.email }, token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- PROTECTED DATA ROUTES ---

// 1. GET ALL DATA (Sync)
app.get('/api/sync', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const tasksRes = await client.query('SELECT * FROM tasks WHERE user_id = $1', [userId]);
    // For subtasks, strictly we should join or filter by task ownership, but checking task parentage in DB is safer
    const subtasksRes = await client.query(`
        SELECT s.* FROM subtasks s 
        JOIN tasks t ON s.task_id = t.id 
        WHERE t.user_id = $1
    `, [userId]);
    
    const transRes = await client.query('SELECT * FROM transactions WHERE user_id = $1', [userId]);
    const notesRes = await client.query('SELECT * FROM notes WHERE user_id = $1', [userId]);
    const ritualsRes = await client.query('SELECT * FROM rituals WHERE user_id = $1', [userId]);
    const sigilsRes = await client.query('SELECT * FROM sigils WHERE user_id = $1', [userId]);

    const tasks = tasksRes.rows.map(task => ({
      ...task,
      subtasks: subtasksRes.rows.filter(st => st.task_id === task.id)
    }));

    res.json({
      tasks,
      transactions: transRes.rows,
      notes: notesRes.rows,
      rituals: ritualsRes.rows,
      sigils: sigilsRes.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. TASKS
app.post('/api/tasks', authenticateToken, async (req, res) => {
  const { id, title, description, originalDescription, deadline, difficulty, isCompleted, createdAt, sigilId, subtasks } = req.body;
  const userId = req.user.id;
  
  try {
    await client.query(`
      INSERT INTO tasks (id, user_id, title, description, original_description, deadline, difficulty, is_completed, created_at, sigil_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        deadline = EXCLUDED.deadline,
        difficulty = EXCLUDED.difficulty,
        is_completed = EXCLUDED.is_completed,
        sigil_id = EXCLUDED.sigil_id
    `, [id, userId, title, description, originalDescription, deadline, difficulty, isCompleted, createdAt, sigilId]);

    await client.query('DELETE FROM subtasks WHERE task_id = $1', [id]);
    if (subtasks && subtasks.length > 0) {
        for (const st of subtasks) {
            await client.query(
                'INSERT INTO subtasks (id, task_id, title, is_completed) VALUES ($1, $2, $3, $4)',
                [st.id, id, st.title, st.isCompleted]
            );
        }
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/tasks/:id', authenticateToken, async (req, res) => {
    try {
        await client.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. TRANSACTIONS
app.post('/api/transactions', authenticateToken, async (req, res) => {
    const { id, title, amount, type, date, sigilId } = req.body;
    try {
        await client.query(`
            INSERT INTO transactions (id, user_id, title, amount, type, date, sigil_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (id) DO UPDATE SET
                title = EXCLUDED.title,
                amount = EXCLUDED.amount,
                type = EXCLUDED.type,
                date = EXCLUDED.date,
                sigil_id = EXCLUDED.sigil_id
        `, [id, req.user.id, title, amount, type, date, sigilId]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/transactions/:id', authenticateToken, async (req, res) => {
    try {
        await client.query('DELETE FROM transactions WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. SIGILS
app.post('/api/sigils', authenticateToken, async (req, res) => {
    const { id, title, color } = req.body;
    try {
        await client.query(`
            INSERT INTO sigils (id, user_id, title, color) VALUES ($1, $2, $3, $4)
            ON CONFLICT (id) DO NOTHING
        `, [id, req.user.id, title, color]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. RITUALS
app.post('/api/rituals', authenticateToken, async (req, res) => {
    const { id, title, streak, lastPerformed } = req.body;
    try {
        await client.query(`
            INSERT INTO rituals (id, user_id, title, streak, last_performed)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (id) DO UPDATE SET
                streak = EXCLUDED.streak,
                last_performed = EXCLUDED.last_performed
        `, [id, req.user.id, title, streak, lastPerformed]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 6. NOTES
app.post('/api/notes', authenticateToken, async (req, res) => {
    const { id, title, content, createdAt, updatedAt, sigilId } = req.body;
    try {
        await client.query(`
            INSERT INTO notes (id, user_id, title, content, created_at, updated_at, sigil_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (id) DO UPDATE SET
                title = EXCLUDED.title,
                content = EXCLUDED.content,
                updated_at = EXCLUDED.updated_at,
                sigil_id = EXCLUDED.sigil_id
        `, [id, req.user.id, title, content, createdAt, updatedAt, sigilId]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/notes/:id', authenticateToken, async (req, res) => {
    try {
        await client.query('DELETE FROM notes WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Beliarg Server running on port ${PORT}`);
});
