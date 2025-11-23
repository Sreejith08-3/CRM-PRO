// frontend/src/config/serverApiConfig.js
// Ensures API_ENDPOINT is an absolute backend URL.
const VITE_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_BASE_URL)
  ? String(import.meta.env.VITE_BASE_URL)
  : (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8888');

const VITE_API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE)
  ? String(import.meta.env.VITE_API_BASE)
  : (typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? '' : 'http://localhost:8888');

export const BASE_URL = VITE_BASE.replace(/\/$/, '');
export const API_BASE_URL = VITE_API_BASE.replace(/\/$/, '');
export const API_PREFIX = '/api';
export const API_ENDPOINT = `${API_BASE_URL}${API_PREFIX}`; // guaranteed absolute URL

export const FILE_BASE_URL = `${BASE_URL}/files`;
export const DOWNLOAD_BASE_URL = `${API_BASE_URL}/download/`;

export default {
  BASE_URL,
  API_BASE_URL,
  API_PREFIX,
  API_ENDPOINT,
  FILE_BASE_URL,
  DOWNLOAD_BASE_URL,
};
