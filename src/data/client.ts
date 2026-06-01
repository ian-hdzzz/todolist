import axios from "axios";
import { auth } from "./firebase";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8080";

const client = axios.create({
  baseURL: API_URL,
  timeout: 8000,
});

// REQUEST INTERCEPTOR — agrega JWT de Firebase automáticamente
client.interceptors.request.use(
  async (config) => {
    config.headers.Accept = "application/json";
    const token = await auth.currentUser?.getIdToken();
    console.log("[API] currentUser:", auth.currentUser?.email ?? "null");
    console.log("[API] token:", token ? token.slice(0, 30) + "..." : "NONE");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR — manejo global de errores HTTP
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) console.warn("[API] No autorizado");
    if (error.response?.status === 500) console.warn("[API] Error del servidor");
    return Promise.reject(error);
  }
);

export default client;
