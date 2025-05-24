const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const PORT = 3001;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: '', 
  database: 'contact_manager',
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL database');
});

app.use(cors());
app.use(bodyParser.json());

// Get all contacts (with optional search/filter)
app.get('/api/contacts', (req, res) => {
  const { search, relationship } = req.query;
  let sql = `
    SELECT contacts.*, relationships.name AS relationship
    FROM contacts
    LEFT JOIN relationships ON contacts.relationship_id = relationships.id
    WHERE 1=1
  `;
  let params = [];
  if (search) {
    sql += ' AND (contacts.name LIKE ? OR contacts.email LIKE ? OR contacts.phone LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (relationship) {
    sql += ' AND relationships.name = ?';
    params.push(relationship);
  }
  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get a single contact
app.get('/api/contacts/:id', (req, res) => {
  const sql = `
    SELECT contacts.*, relationships.name AS relationship
    FROM contacts
    LEFT JOIN relationships ON contacts.relationship_id = relationships.id
    WHERE contacts.id = ?
  `;
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Contact not found' });
    res.json(results[0]);
  });
});

// Add a new contact
app.post('/api/contacts', (req, res) => {
  console.log('Received data:', req.body); 
  const { name, email, phone, address, relationship, notes } = req.body;
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Name is required.' });
  }
  
  db.query('SELECT id FROM relationships WHERE name = ?', [relationship], (err, results) => {
    if (err) {
      console.error('Relationship validation error:', err);
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) return res.status(400).json({ error: 'Invalid relationship.' });
    const relationship_id = results[0].id;
    const sql = 'INSERT INTO contacts (name, email, phone, address, relationship_id, notes) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [name, email, phone, address, relationship_id, notes], (err, result) => {
      if (err) {
        console.error('Insert contact error:', err);
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: result.insertId, name, email, phone, address, relationship, notes });
    });
  });
});

// Update a contact
app.put('/api/contacts/:id', (req, res) => {
  const { name, email, phone, address, relationship, notes } = req.body;
  if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
    return res.status(400).json({ error: 'Name is required.' });
  }
  db.query('SELECT id FROM relationships WHERE name = ?', [relationship], (err, results) => {
    if (err) {
      console.error('Relationship validation error:', err);
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) return res.status(400).json({ error: 'Invalid relationship.' });
    const relationship_id = results[0].id;
    const sql = 'UPDATE contacts SET name=?, email=?, phone=?, address=?, relationship_id=?, notes=? WHERE id=?';
    db.query(sql, [name, email, phone, address, relationship_id, notes, req.params.id], (err, result) => {
      if (err) {
        console.error('Update contact error:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: req.params.id, name, email, phone, address, relationship, notes });
    });
  });
});

// Delete a contact
app.delete('/api/contacts/:id', (req, res) => {
  db.query('DELETE FROM contacts WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Get all relationship options from the relationships table
app.get('/api/relationships', (req, res) => {
  db.query('SELECT name FROM relationships', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    const relationships = results.map(r => r.name);
    res.json(relationships);
  });
});

app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
}); 