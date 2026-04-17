import axios, { type AxiosResponse } from 'axios';

// Base URL: https://lightfocus.baole.space/api
// LF functions append: /api/v1/tasks
// Final URL: https://lightfocus.baole.space/api/api/v1/tasks
export const request = axios.create({
  baseURL: 'https://lightfocus.baole.space/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

request.interceptors.response.use(
  (res: AxiosResponse) => res.data,
  async (res: AxiosResponse) => {
    if (res.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    //TODO fix typing issues
    if ((res as any)?.response?.data?.detail) {
      (res as any).message = (res as any).response.data.detail;
    }

    throw res;
  },
);

request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
