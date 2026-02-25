import axios, { type AxiosRequestConfig, type Method } from 'axios';

const instance = axios.create({
  baseURL: ENV_CONFIG.API_URL,
  timeout: 10000,
});

instance.interceptors.request.use(
  (config) => {
    // config.headers["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const httpRequest = <T>(url: string, method: Method, config?: AxiosRequestConfig) => {
  return new Promise((resolve, reject) => {
    instance({
      url,
      method,
      ...config,
    })
      .then((res) => {
        resolve(res.data as HttpResponse<T>);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getRequest = <T>(url: string, params?: any, config?: AxiosRequestConfig) => {
  return httpRequest<T>(url, 'GET', { params, ...config });
};

export const postRequest = <T>(url: string, data?: any, config?: AxiosRequestConfig) => {
  return httpRequest<T>(url, 'POST', { data, ...config });
};

export const putRequest = <T>(url: string, data?: any, config?: AxiosRequestConfig) => {
  return httpRequest<T>(url, 'PUT', { data, ...config });
};

export const deleteRequest = <T>(url: string, data?: any, config?: AxiosRequestConfig) => {
  return httpRequest<T>(url, 'DELETE', { data, ...config });
};

export const patchRequest = <T>(url: string, data?: any, config?: AxiosRequestConfig) => {
  return httpRequest<T>(url, 'PATCH', { data, ...config });
};

export default instance;
