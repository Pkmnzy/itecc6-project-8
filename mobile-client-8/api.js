import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const API_URL = 'http://192.168.100.9:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getContacts = async (params = {}) => {
  const response = await api.get('/contacts', { params });
  return response;
};

export const getRelationships = async () => {
  const response = await api.get('/relationships');
  return response;
};

export const addContact = async (contactData) => {
  const response = await api.post('/contacts', contactData);
  return response;
};

export const updateContact = async (id, contactData) => {
  const response = await api.put(`/contacts/${id}`, contactData);
  return response;
};

export const deleteContact = async (id) => {
  const response = await api.delete(`/contacts/${id}`);
  return response;
};

export const exportContacts = async (format) => {
  try {
    const response = await api.get(`/contacts-export/${format}`, {
      responseType: 'blob',
    });

    // Create a temporary file
    const fileUri = `${FileSystem.cacheDirectory}contacts.${format}`;
    await FileSystem.writeAsStringAsync(fileUri, response.data, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Share the file
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: format === 'csv' ? 'text/csv' : 'application/json',
        dialogTitle: `Export Contacts as ${format.toUpperCase()}`,
      });
    }

    return response;
  } catch (error) {
    console.error('Export error:', error);
    throw error;
  }
}; 