import axios from "axios";
import { getToken, setStoredUser } from "../context/auth";

const BE_BASE_URL = 'http://localhost:8007'

const axiosInstance = axios.create({
  baseURL: BE_BASE_URL,
})

axiosInstance.interceptors.request.use(
  (config) => {
    config.headers.Authorization = "Bearer " + getToken('access')
    // console.log(config)
    return config
  }, 
  (error) => {
    return Promise.reject(error);
  }
)

let isRefreshing = false
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const refreshToken = getToken('refresh')
    if (error.response.status === 401 && refreshToken && !isRefreshing) {
      isRefreshing = true

      const data = {
        refresh: refreshToken
      }

      await axios
      .post(`${BE_BASE_URL}/api/auth/token/refresh/`, data)
      .then((res) => {
        setStoredUser(res.data)
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${res.data.access}`
      })

      error.config.headers.Authorization = "Bearer " + getToken('access')
      return axiosInstance(error.config)
    }
    isRefreshing = false
    return Promise.reject(error)
  }
)

export default axiosInstance