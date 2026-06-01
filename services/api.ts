// Slide 12 — Instancia de Axios (baseURL + timeout)
// Slide 13 — Interceptores de request y response

import axios from "axios";
import { auth } from "./firebase";

const api = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 5000,
});

// REQUEST INTERCEPTOR — agrega JWT de Firebase a cada petición automáticamente
api.interceptors.request.use(
  async (config) => {
    const newConfig = { ...config };
    newConfig.headers.accept = "application/json";
    const token = await auth.currentUser?.getIdToken();
    if (token) newConfig.headers.Authorization = `Bearer ${token}`;
    return newConfig;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR — maneja errores globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) console.warn("No autorizado");
    if (error.response?.status === 500) console.warn("Error del servidor");
    return Promise.reject(error);
  }
);

export default api;
