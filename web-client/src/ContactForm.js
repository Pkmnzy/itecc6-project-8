import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Box } from '@mui/material';

const emptyContact = {
  name: '',
  email: '',
  phone: '',
  address: '',
  relationship: '',
  notes: '',
};

export default function ContactForm({ open, onClose, onSubmit, initialData, relationships, mode }) {
  const [form, setForm] = useState(emptyContact);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(initialData || emptyContact);
    setErrors({});
  }, [initialData, open]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Invalid email';
    return errs;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    onSubmit(form);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{mode === 'edit' ? 'Edit Contact' : 'Add New Contact'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            label="Full name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            error={!!errors.name}
            helperText={errors.name}
          />
          <Box display="flex" gap={2}>
            <TextField
              label="Email address"
              name="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              label="Phone number"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Box>
          <TextField
            label="Address"
            name="address"
            value={form.address}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Relationship"
            name="relationship"
            value={form.relationship}
            onChange={handleChange}
            select
            fullWidth
            margin="normal"
          >
            <MenuItem value="">Select relationship</MenuItem>
            {relationships.map(r => (
              <MenuItem key={r} value={r}>{r}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Notes"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            minRows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="success">
            {mode === 'edit' ? 'Save Changes' : 'Add Contact'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
} 