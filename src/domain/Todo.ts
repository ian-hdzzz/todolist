import { Category } from "./Category";

export type TodoPriority = "LOW" | "MEDIUM" | "HIGH";

export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: TodoPriority;
  dueDate?: string;
  categories: Category[];
}

export interface CreateTodoDto {
  title: string;
  description: string;
  priority: TodoPriority;
  categories: string[];
}

export interface UpdateTodoDto {
  title?: string;
  description?: string;
  priority?: TodoPriority;
  categories?: string[];
  completed?: boolean;
}
