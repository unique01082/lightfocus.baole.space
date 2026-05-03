import axios, { type AxiosResponse } from 'axios';

export const request = axios.create({
  baseURL: 'http://localhost:3000',
  // baseURL: 'https://lightfocus.baole.space/core',
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
