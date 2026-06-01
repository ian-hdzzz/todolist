import client from "./client";
import { Todo, CreateTodoDto, UpdateTodoDto } from "../domain/Todo";

export const getUserTodos = (): Promise<Todo[]> =>
  client.get<Todo[]>("/todos").then((r) => r.data);

export const createTodo = (dto: CreateTodoDto): Promise<Todo> =>
  client.post<Todo>("/todos", dto).then((r) => r.data);

export const updateTodo = (id: string, dto: UpdateTodoDto): Promise<Todo> =>
  client.patch<Todo>(`/todos/${id}`, dto).then((r) => r.data);

export const deleteTodo = (id: string): Promise<void> =>
  client.delete(`/todos/${id}`).then(() => undefined);

export const getTodoById = (id: string): Promise<Todo> =>
  client.get<Todo>(`/todos/${id}`).then((r) => r.data);

export const searchTodos = (
  search: string,
  priority?: string,
  completed?: boolean
): Promise<Todo[]> => {
  const params: Record<string, unknown> = {};
  if (priority) params.priority = priority;
  if (completed !== undefined) params.completed = completed;
  return client
    .get<Todo[]>(`/todos/search/${encodeURIComponent(search)}`, { params })
    .then((r) => r.data);
};

export const addComment = (
  todoId: string,
  content: string
): Promise<string> =>
  client
    .post<string>(`/todos/${todoId}/comments`, { content })
    .then((r) => r.data);
