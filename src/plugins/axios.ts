import axios, { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    'Content-type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401) {
      Cookies.remove(process.env.VUE_APP_COOKIE_TOKEN_NAME);
      // eslint-disable-next-line import/no-cycle
      const store = await import('@/store');
      store.default.commit('authStore/SET_IS_LOGGED', false);
      const router = await import('@/router');
      await router.default.push({ name: 'login' });
      return Promise.reject(error);
    }
    return Promise.reject(error);
  },
);

export default apiClient;
