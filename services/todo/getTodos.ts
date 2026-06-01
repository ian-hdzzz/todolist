import api from "../api";

export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export const getTodos = async (): Promise<Todo[]> => {
  const response = await api.get("/todo/getUser");
  return response.data;
};
