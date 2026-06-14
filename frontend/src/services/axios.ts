import axios from 'axios';

import { getToken, setStoredUser } from '../context/auth';

const BE_BASE_URL = import.meta.env.VITE_BE_BASE_URL

const axiosInstance = axios.create({
  baseURL: BE_BASE_URL,
})

axiosInstance.interceptors.request.use(
  (config) => {
    if (getToken('access')) {
      config.headers.Authorization = "Bearer " + getToken('access')
    }
    return config
  }, 
  (error) => {
    return Promise.reject(error);
  }
)

let isRefreshing = false
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    const refreshToken = getToken('refresh')
    if (error.response?.status === 401 && refreshToken && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Push this request into the queue
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers['Authorization'] = 'Bearer ' + token;
              resolve(axiosInstance(originalRequest));
            },
            reject: (err: any) => {
              reject(err);
            }
          });
        });
      }

      isRefreshing = true

      return new Promise(async (resolve, reject) => {
        try {
          const res = await axios.post(`${BE_BASE_URL}/api/auth/token/refresh/`, {
            refresh: refreshToken
          });

          setStoredUser(res.data)
          const newAccessToken = res.data.access;
          axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`

          processQueue(null, newAccessToken);
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          resolve(axiosInstance(originalRequest));
        } catch (err) {
          processQueue(err, null)
          setStoredUser(null)
          window.dispatchEvent(new CustomEvent('auth:session:expired'))
          reject(err)
        } finally {
          isRefreshing = false
        }
      })
    }

    return Promise.reject(error)
  }
)

export default axiosInstance