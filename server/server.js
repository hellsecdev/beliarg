import express from 'express';
import cors from 'cors';
import { Client } from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'hellforge_secret_key_666';

// Database Connection
const isLocal = process.env.DATABASE_URL && process.env.DATABASE_URL.includes('localhost');

let client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: isLocal ? false : {
    rejectUnauthorized: false
  }
});

// Helper function to ensure DB connection
const ensureConnection = async () => {
  try {
    // Try a simple query to check if connection is alive
    await client.query('SELECT 1');
  } catch (err) {
    console.log('Connection lost, reconnecting to PostgreSQL...');
    try {
      // End the old connection if it exists
      try {
        await client.end();
      } catch (e) {
        // Ignore errors when ending
      }
      // Create a new client
      client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: isLocal ? false : {
          rejectUnauthorized: false
        }
      });
      await client.connect();
      console.log('Reconnected to PostgreSQL');
      
      // Re-attach event handlers
      client.on('error', (err) => {
        console.error('PostgreSQL client error:', err.message);
        console.error('Error code:', err.code);
      });
      
      client.on('end', () => {
        console.warn('PostgreSQL connection ended');
      });
    } catch (reconnectErr) {
      console.error('Reconnection error:', reconnectErr.message);
      throw reconnectErr;
    }
  }
};

// Database migration: ensure completed_at column exists
const ensureCompletedAtColumn = async () => {
  try {
    await ensureConnection();
    // Check if column exists
    const checkResult = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='tasks' AND column_name='completed_at'
    `);
    
    if (checkResult.rows.length === 0) {
      console.log('Adding completed_at column to tasks table...');
      await client.query(`
        ALTER TABLE tasks 
        ADD COLUMN completed_at TIMESTAMP
      `);
      console.log('Column completed_at added successfully');
    } else {
      console.log('Column completed_at already exists');
    }
  } catch (err) {
    console.error('Migration error:', err.message);
    // Don't throw - allow server to start even if migration fails
  }
};

client.connect()
  .then(async () => {
    console.log('Connected to PostgreSQL');
    await ensureCompletedAtColumn();
  })
  .catch(err => {
    console.error('Initial connection error:', err.message);
    console.error('Stack:', err.stack);
  });

// Handle connection errors
client.on('error', (err) => {
  console.error('PostgreSQL client error:', err.message);
  console.error('Error code:', err.code);
});

client.on('end', () => {
  console.warn('PostgreSQL connection ended');
});

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
        await ensureConnection();
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await client.query(
            'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
            [email, hashedPassword]
        );
        const user = result.rows[0];
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
        res.json({ user, token });
    } catch (err) {
        console.error('Register error:', err.message);
        console.error('Error code:', err.code);
        console.error('Stack:', err.stack);
        if (err.code === '23505') { // Unique violation
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: err.message || 'Registration failed' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        await ensureConnection();
        const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) return res.status(400).json({ error: 'User not found' });

        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
        res.json({ user: { id: user.id, email: user.email }, token });
    } catch (err) {
        console.error('Login error:', err.message);
        console.error('Error code:', err.code);
        console.error('Stack:', err.stack);
        res.status(500).json({ error: err.message || 'Login failed' });
    }
});

// --- PROTECTED DATA ROUTES ---

// 1. GET ALL DATA (Sync)
app.get('/api/sync', authenticateToken, async (req, res) => {
  try {
    await ensureConnection();
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
    
    // Table is created manually via SQL migration
    // Just query the table
    let achievementsRes;
    try {
        achievementsRes = await client.query('SELECT * FROM achievements WHERE user_id = $1', [userId]);
    } catch (achievementsErr) {
        console.error('Achievements table error (non-critical):', achievementsErr.message);
        // If table doesn't exist, return empty array
        achievementsRes = { rows: [] };
    }

    // Convert task fields from snake_case to camelCase and convert timestamps
    const tasks = tasksRes.rows.map(task => {
      // Convert timestamps to milliseconds
      const createdAt = task.created_at ? new Date(task.created_at).getTime() : Date.now();
      // Deadline is TIMESTAMP, convert to ISO string (YYYY-MM-DD format for date input)
      let deadline = '';
      if (task.deadline) {
        if (typeof task.deadline === 'string') {
          deadline = task.deadline;
        } else {
          deadline = new Date(task.deadline).toISOString().split('T')[0];
        }
      }
      
      // Convert is_completed boolean (PostgreSQL returns true/false or 't'/'f')
      const isCompleted = task.is_completed === true || task.is_completed === 't' || task.is_completed === 1 || task.is_completed === 'true';
      
      // Convert completed_at timestamp to milliseconds
      const completedAt = task.completed_at ? new Date(task.completed_at).getTime() : undefined;
      
      return {
        id: task.id,
        title: task.title,
        description: task.description,
        originalDescription: task.original_description || undefined,
        deadline,
        difficulty: task.difficulty,
        isCompleted,
        createdAt,
        completedAt,
        sigilId: task.sigil_id || undefined,
        subtasks: subtasksRes.rows
          .filter(st => st.task_id === task.id)
          .map(st => ({
            id: st.id,
            title: st.title,
            isCompleted: st.is_completed === true || st.is_completed === 't' || st.is_completed === 1 || st.is_completed === 'true'
          }))
      };
    });

    // Convert numeric fields to numbers (PostgreSQL returns numeric as strings)
    const transactions = transRes.rows.map(tr => ({
      ...tr,
      amount: typeof tr.amount === 'string' ? parseFloat(tr.amount) : (typeof tr.amount === 'number' ? tr.amount : 0)
    }));

    // Convert notes fields from snake_case to camelCase
    const notes = notesRes.rows.map(note => {
      const createdAt = note.created_at ? new Date(note.created_at).getTime() : Date.now();
      const updatedAt = note.updated_at ? new Date(note.updated_at).getTime() : Date.now();
      return {
        id: note.id,
        title: note.title,
        content: note.content,
        createdAt,
        updatedAt,
        sigilId: note.sigil_id || undefined
      };
    });

    // Convert rituals fields from snake_case to camelCase
    const rituals = ritualsRes.rows.map(ritual => {
      // last_performed is DATE type, convert to timestamp (start of day)
      const lastPerformed = ritual.last_performed ? new Date(ritual.last_performed).getTime() : 0;
      return {
        id: ritual.id,
        title: ritual.title,
        streak: ritual.streak || 0,
        lastPerformed
      };
    });

    // Sigils should be fine as-is (id, title, color), but ensure consistency
    const sigils = sigilsRes.rows.map(sigil => ({
      id: sigil.id,
      title: sigil.title,
      color: sigil.color
    }));

    // Convert achievements fields from snake_case to camelCase
    const achievements = achievementsRes.rows.map(a => ({
      id: a.id,
      userId: a.user_id,
      type: a.type,
      unlockedAt: a.unlocked_at ? parseInt(a.unlocked_at) : undefined,
      progress: a.progress || 0,
      target: a.target || 0
    }));

    res.json({
      tasks,
      transactions,
      notes,
      rituals,
      sigils,
      achievements
    });
  } catch (err) {
    console.error('Sync error:', err.message);
    console.error('Error code:', err.code);
    console.error('Stack:', err.stack);
    res.status(500).json({ error: err.message || 'Failed to sync data' });
  }
});

// Helper function to convert timestamp to PostgreSQL TIMESTAMP
const toTimestamp = (value) => {
  // Handle null, undefined, empty string, or 0
  if (value === null || value === undefined || value === '' || value === 0) {
    return null;
  }
  // If it's a number (timestamp in milliseconds), convert to Date then to ISO string
  if (typeof value === 'number') {
    // Check if it's a valid timestamp (not 0, not NaN, and reasonable date range)
    if (isNaN(value) || value <= 0) {
      return null;
    }
    const date = new Date(value);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return null;
    }
    return date.toISOString();
  }
  // If it's already a string, try to parse it
  if (typeof value === 'string') {
    // Check if it's a timestamp number as string
    if (/^\d+$/.test(value)) {
      const numValue = parseInt(value);
      if (numValue <= 0 || isNaN(numValue)) {
        return null;
      }
      const date = new Date(numValue);
      if (isNaN(date.getTime())) {
        return null;
      }
      return date.toISOString();
    }
    // Otherwise assume it's already in ISO format
    return value;
  }
  return value;
};

// 2. TASKS
app.post('/api/tasks', authenticateToken, async (req, res) => {
  const { id, title, description, originalDescription, deadline, difficulty, isCompleted, createdAt, completedAt, sigilId, subtasks } = req.body;
  const userId = req.user.id;
  
  try {
    await ensureConnection();
    const createdAtTimestamp = toTimestamp(createdAt);
    const deadlineTimestamp = deadline ? toTimestamp(deadline) : null;
    const completedAtTimestamp = completedAt ? toTimestamp(completedAt) : null;
    
    await client.query(`
      INSERT INTO tasks (id, user_id, title, description, original_description, deadline, difficulty, is_completed, created_at, completed_at, sigil_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        deadline = EXCLUDED.deadline,
        difficulty = EXCLUDED.difficulty,
        is_completed = EXCLUDED.is_completed,
        completed_at = EXCLUDED.completed_at,
        sigil_id = EXCLUDED.sigil_id
    `, [id, userId, title, description, originalDescription, deadlineTimestamp, difficulty, isCompleted, createdAtTimestamp, completedAtTimestamp, sigilId]);

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
    console.error('Save task error:', err.message);
    console.error('Error code:', err.code);
    console.error('Task ID:', id);
    console.error('User ID:', userId);
    console.error('Stack:', err.stack);
    res.status(500).json({ error: err.message || 'Failed to save task' });
  }
});

app.delete('/api/tasks/:id', authenticateToken, async (req, res) => {
    try {
        await ensureConnection();
        await client.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
        res.json({ success: true });
    } catch (err) {
        console.error('Delete task error:', err.message);
        console.error('Error code:', err.code);
        console.error('Stack:', err.stack);
        res.status(500).json({ error: err.message || 'Failed to delete task' });
    }
});

// 3. TRANSACTIONS
app.post('/api/transactions', authenticateToken, async (req, res) => {
    const { id, title, amount, type, date, sigilId } = req.body;
    try {
        await ensureConnection();
        
        // Validate and sanitize amount
        let amountValue = null;
        if (amount !== null && amount !== undefined) {
            const numAmount = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
            if (!isNaN(numAmount) && isFinite(numAmount)) {
                // Limit to reasonable range to prevent overflow (max 9999999999999999.99 for numeric(20,2))
                if (numAmount > 9999999999999999.99) {
                    return res.status(400).json({ error: 'Amount too large. Maximum is 9,999,999,999,999,999.99' });
                }
                if (numAmount < -9999999999999999.99) {
                    return res.status(400).json({ error: 'Amount too small. Minimum is -9,999,999,999,999,999.99' });
                }
                amountValue = numAmount;
            } else {
                return res.status(400).json({ error: 'Invalid amount value' });
            }
        }
        
        // Convert date to proper format (date field is DATE type, not TIMESTAMP)
        let dateValue = null;
        if (date && date !== 0 && date !== '0') {
            if (typeof date === 'number') {
                if (!isNaN(date) && date > 0) {
                    const dateObj = new Date(date);
                    if (!isNaN(dateObj.getTime())) {
                        dateValue = dateObj.toISOString().split('T')[0]; // Extract YYYY-MM-DD
                    }
                }
            } else if (typeof date === 'string') {
                if (/^\d+$/.test(date)) {
                    // Timestamp as string
                    const numValue = parseInt(date);
                    if (numValue > 0 && !isNaN(numValue)) {
                        const dateObj = new Date(numValue);
                        if (!isNaN(dateObj.getTime())) {
                            dateValue = dateObj.toISOString().split('T')[0];
                        }
                    }
                } else {
                    // Already a date string, try to parse and format
                    const dateObj = new Date(date);
                    if (!isNaN(dateObj.getTime())) {
                        dateValue = dateObj.toISOString().split('T')[0];
                    } else {
                        // Assume it's already in YYYY-MM-DD format
                        dateValue = date;
                    }
                }
            }
        }
        
        await client.query(`
            INSERT INTO transactions (id, user_id, title, amount, type, date, sigil_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (id) DO UPDATE SET
                title = EXCLUDED.title,
                amount = EXCLUDED.amount,
                type = EXCLUDED.type,
                date = EXCLUDED.date,
                sigil_id = EXCLUDED.sigil_id
        `, [id, req.user.id, title, amountValue, type, dateValue, sigilId]);
        res.json({ success: true });
    } catch (err) {
        console.error('Save transaction error:', err.message);
        console.error('Error code:', err.code);
        console.error('Stack:', err.stack);
        res.status(500).json({ error: err.message || 'Failed to save transaction' });
    }
});

app.delete('/api/transactions/:id', authenticateToken, async (req, res) => {
    try {
        await ensureConnection();
        await client.query('DELETE FROM transactions WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
        res.json({ success: true });
    } catch (err) {
        console.error('Delete transaction error:', err.message);
        console.error('Error code:', err.code);
        console.error('Stack:', err.stack);
        res.status(500).json({ error: err.message || 'Failed to delete transaction' });
    }
});

// 4. SIGILS
app.post('/api/sigils', authenticateToken, async (req, res) => {
    const { id, title, color } = req.body;
    try {
        await ensureConnection();
        await client.query(`
            INSERT INTO sigils (id, user_id, title, color) VALUES ($1, $2, $3, $4)
            ON CONFLICT (id) DO NOTHING
        `, [id, req.user.id, title, color]);
        res.json({ success: true });
    } catch (err) {
        console.error('Save sigil error:', err.message);
        console.error('Error code:', err.code);
        console.error('Stack:', err.stack);
        res.status(500).json({ error: err.message || 'Failed to save sigil' });
    }
});

// 5. RITUALS
app.post('/api/rituals', authenticateToken, async (req, res) => {
    const { id, title, streak, lastPerformed } = req.body;
    try {
        await ensureConnection();
        // Convert lastPerformed to DATE format (YYYY-MM-DD)
        let lastPerformedDate = null;
        if (lastPerformed && lastPerformed !== 0 && lastPerformed !== '0') {
            if (typeof lastPerformed === 'number') {
                if (!isNaN(lastPerformed) && lastPerformed > 0) {
                    const dateObj = new Date(lastPerformed);
                    if (!isNaN(dateObj.getTime())) {
                        lastPerformedDate = dateObj.toISOString().split('T')[0];
                    }
                }
            } else if (typeof lastPerformed === 'string') {
                if (/^\d+$/.test(lastPerformed)) {
                    const numValue = parseInt(lastPerformed);
                    if (numValue > 0 && !isNaN(numValue)) {
                        const dateObj = new Date(numValue);
                        if (!isNaN(dateObj.getTime())) {
                            lastPerformedDate = dateObj.toISOString().split('T')[0];
                        }
                    }
                } else {
                    // Try to parse as date string
                    const dateObj = new Date(lastPerformed);
                    if (!isNaN(dateObj.getTime())) {
                        lastPerformedDate = dateObj.toISOString().split('T')[0];
                    } else {
                        // Assume it's already in YYYY-MM-DD format
                        lastPerformedDate = lastPerformed;
                    }
                }
            }
        }
        
        await client.query(`
            INSERT INTO rituals (id, user_id, title, streak, last_performed)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (id) DO UPDATE SET
                streak = EXCLUDED.streak,
                last_performed = EXCLUDED.last_performed
        `, [id, req.user.id, title, streak, lastPerformedDate]);
        res.json({ success: true });
    } catch (err) {
        console.error('Save ritual error:', err.message);
        console.error('Error code:', err.code);
        console.error('Stack:', err.stack);
        res.status(500).json({ error: err.message || 'Failed to save ritual' });
    }
});

// 6. NOTES
app.post('/api/notes', authenticateToken, async (req, res) => {
    const { id, title, content, createdAt, updatedAt, sigilId } = req.body;
    try {
        await ensureConnection();
        
        // Validate content length (max 300 characters)
        if (content && content.length > 300) {
            return res.status(400).json({ error: 'Content cannot exceed 300 characters' });
        }
        
        const createdAtTimestamp = toTimestamp(createdAt);
        const updatedAtTimestamp = toTimestamp(updatedAt);
        
        // Ensure content is truncated to 300 characters
        const truncatedContent = content ? content.substring(0, 300) : content;
        
        await client.query(`
            INSERT INTO notes (id, user_id, title, content, created_at, updated_at, sigil_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (id) DO UPDATE SET
                title = EXCLUDED.title,
                content = EXCLUDED.content,
                updated_at = EXCLUDED.updated_at,
                sigil_id = EXCLUDED.sigil_id
        `, [id, req.user.id, title, truncatedContent, createdAtTimestamp, updatedAtTimestamp, sigilId]);
        res.json({ success: true });
    } catch (err) {
        console.error('Save note error:', err.message);
        console.error('Error code:', err.code);
        console.error('Stack:', err.stack);
        res.status(500).json({ error: err.message || 'Failed to save note' });
    }
});

app.delete('/api/notes/:id', authenticateToken, async (req, res) => {
    try {
        await ensureConnection();
        await client.query('DELETE FROM notes WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
        res.json({ success: true });
    } catch (err) {
        console.error('Delete note error:', err.message);
        console.error('Error code:', err.code);
        console.error('Stack:', err.stack);
        res.status(500).json({ error: err.message || 'Failed to delete note' });
    }
});

// --- ACHIEVEMENTS ROUTES ---

// Get all achievements for user
app.get('/api/achievements', authenticateToken, async (req, res) => {
    try {
        await ensureConnection();
        const userId = req.user.id;
        
        // Table is created manually via SQL migration
        // Just query the table
        let achievementsRes;
        try {
            achievementsRes = await client.query(
                'SELECT * FROM achievements WHERE user_id = $1 ORDER BY unlocked_at DESC NULLS LAST, type',
                [userId]
            );
        } catch (selectErr) {
            console.error('Failed to select achievements:', selectErr.message);
            // If table doesn't exist, return empty array
            achievementsRes = { rows: [] };
        }
        
        // Convert to camelCase
        const achievements = achievementsRes.rows.map(a => ({
            id: a.id,
            userId: a.user_id,
            type: a.type,
            unlockedAt: a.unlocked_at ? parseInt(a.unlocked_at) : undefined,
            progress: a.progress || 0,
            target: a.target || 0
        }));
        
        res.json(achievements);
    } catch (err) {
        console.error('Get achievements error:', err.message);
        console.error('Error code:', err.code);
        console.error('Stack:', err.stack);
        res.status(500).json({ error: err.message || 'Failed to get achievements' });
    }
});

// Check/Update achievement
app.post('/api/achievements/check', authenticateToken, async (req, res) => {
    try {
        await ensureConnection();
        const { type, progress, target } = req.body;
        const userId = req.user.id;
        
        // Table is created manually via SQL migration
        // Check if achievement exists
        let existingRes;
        try {
            existingRes = await client.query(
                'SELECT * FROM achievements WHERE user_id = $1 AND type = $2',
                [userId, type]
            );
        } catch (selectErr) {
            console.error('Failed to select achievement:', selectErr.message);
            // If table doesn't exist, return error
            return res.status(500).json({ success: false, error: 'Achievements table not available' });
        }
        
        const isUnlocked = progress >= target;
        const unlockedAt = isUnlocked ? Date.now() : null;
        
        try {
            if (existingRes.rows.length > 0) {
                // Update existing achievement
                const existing = existingRes.rows[0];
                // Only update unlocked_at if it's being unlocked now (wasn't unlocked before)
                const newUnlockedAt = (isUnlocked && !existing.unlocked_at) ? unlockedAt : existing.unlocked_at;
                
                await client.query(
                    `UPDATE achievements 
                     SET progress = $1, target = $2, unlocked_at = COALESCE($3, unlocked_at)
                     WHERE user_id = $4 AND type = $5`,
                    [progress, target, newUnlockedAt, userId, type]
                );
            } else {
                // Insert new achievement
                await client.query(
                    `INSERT INTO achievements (user_id, type, unlocked_at, progress, target)
                     VALUES ($1, $2, $3, $4, $5)
                     ON CONFLICT (user_id, type) DO UPDATE SET
                        progress = EXCLUDED.progress,
                        target = EXCLUDED.target,
                        unlocked_at = COALESCE(EXCLUDED.unlocked_at, achievements.unlocked_at)`,
                    [userId, type, unlockedAt, progress, target]
                );
            }
        } catch (updateErr) {
            console.error('Failed to update achievement (non-critical):', updateErr.message);
            return res.json({ success: false, error: 'Failed to save achievement' });
        }
        
        res.json({ success: true, unlocked: isUnlocked });
    } catch (err) {
        console.error('Check achievement error:', err.message);
        console.error('Error code:', err.code);
        console.error('Stack:', err.stack);
        res.status(500).json({ error: err.message || 'Failed to check achievement' });
    }
});

// Serve static files from the React app (but not API routes)
const distPath = path.join(__dirname, '..', 'dist');
app.use((req, res, next) => {
  // Skip static files for API routes
  if (req.path.startsWith('/api')) {
    return next();
  }
  // Use express.static middleware
  return express.static(distPath)(req, res, next);
});

// SPA fallback: send all non-API requests to index.html
app.get('*', (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Beliarg Server running on port ${PORT}`);
});
