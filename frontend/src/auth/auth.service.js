// frontend/src/auth/auth.service.js
import { API_ENDPOINT } from '@/config/serverApiConfig';
import axios from 'axios';
import errorHandler from '@/request/errorHandler';
import successHandler from '@/request/successHandler';

// ---------- LOGIN ----------
export const login = async ({ loginData }) => {
  try {
    const response = await axios.post(
      `${API_ENDPOINT}/login?timestamp=${new Date().getTime()}`,
      loginData,
      { headers: { 'Content-Type': 'application/json' } }
    );

    const { status, data } = response;

    successHandler(
      { data, status },
      {
        notifyOnSuccess: false,
        notifyOnFailed: true,
      }
    );
    return data;
  } catch (error) {
    return errorHandler(error);
  }
};

// ---------- REGISTER ----------
export const register = async ({ registerData }) => {
  try {
    const response = await axios.post(`${API_ENDPOINT}/register`, registerData, {
      headers: { 'Content-Type': 'application/json' },
    });

    const { status, data } = response;

    successHandler(
      { data, status },
      {
        notifyOnSuccess: true,
        notifyOnFailed: true,
      }
    );
    return data;
  } catch (error) {
    return errorHandler(error);
  }
};

// ---------- VERIFY EMAIL ----------
export const verify = async ({ userId, emailToken }) => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/verify/${userId}/${emailToken}`, {
      headers: { 'Content-Type': 'application/json' },
    });

    const { status, data } = response;

    successHandler(
      { data, status },
      {
        notifyOnSuccess: true,
        notifyOnFailed: true,
      }
    );
    return data;
  } catch (error) {
    return errorHandler(error);
  }
};

// ---------- RESET PASSWORD ----------
export const resetPassword = async ({ resetPasswordData }) => {
  try {
    const response = await axios.post(`${API_ENDPOINT}/resetpassword`, resetPasswordData, {
      headers: { 'Content-Type': 'application/json' },
    });

    const { status, data } = response;

    successHandler(
      { data, status },
      {
        notifyOnSuccess: true,
        notifyOnFailed: true,
      }
    );
    return data;
  } catch (error) {
    return errorHandler(error);
  }
};

// ---------- LOGOUT ----------
export const logout = async () => {
  axios.defaults.withCredentials = true;
  try {
    const response = await axios.post(
      `${API_ENDPOINT}/logout?timestamp=${new Date().getTime()}`,
      null,
      { headers: { 'Content-Type': 'application/json' } }
    );

    const { status, data } = response;

    successHandler(
      { data, status },
      {
        notifyOnSuccess: false,
        notifyOnFailed: true,
      }
    );
    return data;
  } catch (error) {
    return errorHandler(error);
  }
};
