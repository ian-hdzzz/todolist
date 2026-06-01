import api from "../api";
import { Todo } from "./getTodos";

export const createTodo = async (title: string, description: string): Promise<Todo> => {
  const response = await api.post("/todo/create", { title, description });
  return response.data;
};
