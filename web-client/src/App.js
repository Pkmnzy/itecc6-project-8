import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Container, Box, Button, TextField, InputAdornment, IconButton, Paper, Grid, Select, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { getContacts, getRelationships, deleteContact, exportContacts } from './api';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Divider from '@mui/material/Divider';
import ContactForm from './ContactForm';
import { addContact, updateContact } from './api';
import Menu from '@mui/material/Menu';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

function App() {
  const [contacts, setContacts] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
  const [formInitial, setFormInitial] = useState(null);
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchContacts();
    fetchRelationships();
  }, [search, filter]);

  const fetchContacts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getContacts({ search, relationship: filter });
      setContacts(res.data);
    } catch (err) {
      setContacts([]);
      setError('Failed to load contacts.');
    }
    setLoading(false);
  };

  const fetchRelationships = async () => {
    try {
      const res = await getRelationships();
      setRelationships(res.data);
    } catch (err) {
      setRelationships([]);
      setError('Failed to load relationships.');
    }
  };

  const selectedContact = contacts.find(c => c.id === selectedContactId);

  const handleAddClick = () => {
    setFormMode('add');
    setFormInitial(null);
    setFormOpen(true);
  };

  const handleEditClick = (contact) => {
    setFormMode('edit');
    setFormInitial(contact);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
  };

  const handleFormSubmit = async (data) => {
    try {
      if (formMode === 'add') {
        await addContact(data);
        setSuccess('Contact added successfully!');
      } else if (formMode === 'edit' && formInitial) {
        await updateContact(formInitial.id, data);
        setSuccess('Contact updated successfully!');
      }
      setFormOpen(false);
      fetchContacts();
    } catch (err) {
      setError('Error saving contact.');
    }
  };

  const handleDeleteClick = async (contact) => {
    if (window.confirm(`Delete contact "${contact.name}"? This cannot be undone.`)) {
      try {
        await deleteContact(contact.id);
        if (selectedContactId === contact.id) setSelectedContactId(null);
        fetchContacts();
        setSuccess('Contact deleted successfully!');
      } catch (err) {
        setError('Error deleting contact.');
      }
    }
  };

  const handleExportClick = (event) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setExportAnchorEl(null);
  };

  const handleExport = async (format) => {
    try {
      const res = await exportContacts(format);
      let blob, filename;
      if (format === 'csv') {
        blob = new Blob([res.data], { type: 'text/csv' });
        filename = 'contacts.csv';
      } else {
        blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
        filename = 'contacts.json';
      }
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Error exporting contacts.');
    }
    handleExportClose();
  };

  return (
    <Box sx={{ bgcolor: '#f7f9fa', minHeight: '100vh' }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Typography variant="h5" sx={{ fontWeight: 700, flexGrow: 1, color: '#222' }}>
            Contact Manager
          </Typography>
          <Button variant="contained" color="success" startIcon={<PersonAddIcon />}
            sx={{ borderRadius: 1, fontWeight: 600 }} onClick={handleAddClick}>
            Add New Contact
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <TextField
            variant="outlined"
            placeholder="Search contacts..."
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1, bgcolor: 'white' }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Select size="small" displayEmpty startAdornment={<FilterListIcon />} sx={{ minWidth: 120, bgcolor: 'white' }} value={filter} onChange={e => setFilter(e.target.value)}>
            <MenuItem value="">Filter</MenuItem>
            {relationships.map(r => (
              <MenuItem key={r} value={r}>{r}</MenuItem>
            ))}
          </Select>
          <Button variant="contained" color="success" startIcon={<FileDownloadIcon />}
            sx={{ borderRadius: 1, fontWeight: 600 }} onClick={handleExportClick}>
            Export
          </Button>
        </Box>
        <Menu anchorEl={exportAnchorEl} open={!!exportAnchorEl} onClose={handleExportClose}>
          <MenuItem onClick={() => handleExport('json')}>Export as JSON</MenuItem>
          <MenuItem onClick={() => handleExport('csv')}>Export as CSV</MenuItem>
        </Menu>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Paper elevation={1} sx={{ p: 3, minHeight: 500 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Contacts
              </Typography>
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                  <CircularProgress />
                </Box>
              ) : contacts.length === 0 ? (
                <Box textAlign="center" py={6}>
                  <PersonAddIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography>No contacts found.</Typography>
                </Box>
              ) : (
                <Box>
                  {contacts.map(c => (
                    <Box
                      key={c.id}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      bgcolor={selectedContactId === c.id ? '#f5faff' : 'white'}
                      borderRadius={3}
                      boxShadow={selectedContactId === c.id ? 2 : 1}
                      border={selectedContactId === c.id ? '2px solid #90caf9' : '1px solid #eee'}
                      px={3}
                      py={2}
                      mb={2.5}
                      sx={{
                        cursor: 'pointer',
                        transition: 'box-shadow 0.2s, border 0.2s, background 0.2s',
                        '&:hover': { boxShadow: 3, background: '#f1f8e9' },
                      }}
                      onClick={() => setSelectedContactId(c.id)}
                    >
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: '#e1bee7', color: '#222', fontWeight: 700, width: 44, height: 44 }}>
                          {c.name ? c.name[0].toUpperCase() : '?'}
                        </Avatar>
                        <Box>
                          <Typography fontWeight={600} fontSize={17}>{c.name}</Typography>
                          <Typography color="#666" fontSize={15}>{c.email}</Typography>
                        </Box>
                      </Box>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Chip
                          label={c.relationship}
                          size="small"
                          sx={{ bgcolor: c.relationship === 'Work' ? '#e8f5e9' : c.relationship === 'Family' ? '#f3e5f5' : '#e3f2fd', color: '#333', fontWeight: 500, mr: 2, minWidth: 64, justifyContent: 'center' }}
                        />
                        <IconButton edge="end" aria-label="edit" size="small" sx={{ mr: 0.5, bgcolor: '#f5f5f5', borderRadius: 2 }} onClick={e => { e.stopPropagation(); handleEditClick(c); }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton edge="end" aria-label="delete" size="small" sx={{ color: 'error.main', bgcolor: '#f5f5f5', borderRadius: 2 }} onClick={e => { e.stopPropagation(); handleDeleteClick(c); }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} md={7}>
            <Paper elevation={1} sx={{ p: 4, minHeight: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: selectedContact ? 'flex-start' : 'center' }}>
              {selectedContact ? (
                <Box width="100%" maxWidth={400}>
                  <Box display="flex" alignItems="center" mb={3}>
                    <Avatar sx={{ bgcolor: '#e1bee7', color: '#222', fontWeight: 700, width: 56, height: 56, mr: 2 }}>
                      {selectedContact.name ? selectedContact.name[0].toUpperCase() : '?'}
                    </Avatar>
                    <Box>
                      <Typography variant="h5" fontWeight={700}>{selectedContact.name}</Typography>
                      <Chip label={selectedContact.relationship} size="small" sx={{ mt: 1, bgcolor: selectedContact.relationship === 'Work' ? '#e8f5e9' : selectedContact.relationship === 'Family' ? '#f3e5f5' : '#e3f2fd', color: '#333', fontWeight: 500 }} />
                    </Box>
                    <Box flexGrow={1} />
                    <IconButton color="primary" aria-label="edit contact" onClick={() => handleEditClick(selectedContact)}>
                      <EditIcon />
                    </IconButton>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>Email</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{selectedContact.email || '-'}</Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>Phone</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{selectedContact.phone || '-'}</Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>Address</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{selectedContact.address || '-'}</Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>Notes</Typography>
                  <Typography variant="body1">{selectedContact.notes || '-'}</Typography>
                </Box>
              ) : (
                <Box textAlign="center">
                  <PersonAddIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    No Contact Selected
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    Select a contact to view details or add a new contact.
                  </Typography>
                  <Button variant="contained" color="success" startIcon={<PersonAddIcon />}
                    sx={{ borderRadius: 1, fontWeight: 600 }} onClick={handleAddClick}>
                    Add New Contact
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
        <ContactForm
          open={formOpen}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          initialData={formInitial}
          relationships={relationships}
          mode={formMode}
        />
        <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError('')} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert severity="error" onClose={() => setError('')} sx={{ width: '100%' }}>{error}</Alert>
        </Snackbar>
        <Snackbar open={!!success} autoHideDuration={3000} onClose={() => setSuccess('')} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert severity="success" onClose={() => setSuccess('')} sx={{ width: '100%' }}>{success}</Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}

export default App;
