import api from "../api";

export const deleteTodo = async (id: string): Promise<void> => {
  await api.delete(`/todo/deleteTodo/${id}`);
};
