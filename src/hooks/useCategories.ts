import { useState, useCallback } from "react";
import {
  Category,
  CategoryWithTodos,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "../domain/Category";
import * as categoryApi from "../data/categoryApi";

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesWithTodos, setCategoriesWithTodos] = useState<CategoryWithTodos[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryApi.getCategories();
      setCategories(data);
    } catch (e: any) {
      setError(e.message ?? "Error al cargar listas");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategoriesWithTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryApi.getCategoriesWithTodos();
      setCategoriesWithTodos(data);
      setCategories(data.map(({ todos: _, ...cat }) => cat));
    } catch (e: any) {
      setError(e.message ?? "Error al cargar listas");
    } finally {
      setLoading(false);
    }
  }, []);

  const addCategory = async (
    name: string,
    description: string,
    color: string
  ) => {
    const dto: CreateCategoryDto = { name, description, color };
    const newCat = await categoryApi.createCategory(dto);
    setCategories((prev) => [...prev, newCat]);
    return newCat;
  };

  const editCategory = async (id: string, dto: UpdateCategoryDto) => {
    const updated = await categoryApi.updateCategory(id, dto);
    setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
    return updated;
  };

  const removeCategory = async (id: string) => {
    await categoryApi.deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return {
    categories,
    categoriesWithTodos,
    loading,
    error,
    fetchCategories,
    fetchCategoriesWithTodos,
    addCategory,
    editCategory,
    removeCategory,
  };
};
