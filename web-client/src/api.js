import axios from 'axios';

const API_BASE = 'http://localhost:3001/api';

export const getContacts = (params) => axios.get(`${API_BASE}/contacts`, { params });
export const getContact = (id) => axios.get(`${API_BASE}/contacts/${id}`);
export const addContact = (data) => axios.post(`${API_BASE}/contacts`, data);
export const updateContact = (id, data) => axios.put(`${API_BASE}/contacts/${id}`, data);
export const deleteContact = (id) => axios.delete(`${API_BASE}/contacts/${id}`);
export const getRelationships = () => axios.get(`${API_BASE}/relationships`);
export const exportContacts = (format = 'json') => axios.get(`${API_BASE}/contacts-export/${format}`, { responseType: format === 'csv' ? 'blob' : 'json' }); 