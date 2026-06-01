import client from "./client";
import {
  Category,
  CategoryWithTodos,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "../domain/Category";

export const getCategories = (): Promise<Category[]> =>
  client.get<Category[]>("/categories").then((r) => r.data);

export const getCategoriesWithTodos = (): Promise<CategoryWithTodos[]> =>
  client.get<CategoryWithTodos[]>("/categories/with-todos").then((r) => r.data);

export const getCategoryById = (id: string): Promise<Category> =>
  client.get<Category>(`/categories/${id}`).then((r) => r.data);

export const createCategory = (dto: CreateCategoryDto): Promise<Category> =>
  client.post<Category>("/categories", dto).then((r) => r.data);

export const updateCategory = (
  id: string,
  dto: UpdateCategoryDto
): Promise<Category> =>
  client.patch<Category>(`/categories/${id}`, dto).then((r) => r.data);

export const deleteCategory = (id: string): Promise<void> =>
  client.delete(`/categories/${id}`).then(() => undefined);
