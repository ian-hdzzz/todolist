import { useState, useCallback } from "react";
import { Todo, CreateTodoDto, UpdateTodoDto, TodoPriority } from "../domain/Todo";
import * as todoApi from "../data/todoApi";

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await todoApi.getUserTodos();
      setTodos(data);
    } catch (e: any) {
      setError(e.message ?? "Error al cargar tareas");
    } finally {
      setLoading(false);
    }
  }, []);

  const addTodo = async (
    title: string,
    description: string,
    categoryIds: string[] = [],
    priority: TodoPriority = "MEDIUM",
    dueDate?: string
  ) => {
    const dto: CreateTodoDto = {
      title,
      description,
      categories: categoryIds,
      priority,
      ...(dueDate ? { dueDate } : {}),
    };
    const newTodo = await todoApi.createTodo(dto);
    setTodos((prev) => [newTodo, ...prev]);
    return newTodo;
  };

  const editTodo = async (id: string, dto: UpdateTodoDto) => {
    const updated = await todoApi.updateTodo(id, dto);
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  };

  const removeTodo = async (id: string) => {
    await todoApi.deleteTodo(id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  // Toggle optimista con persistencia real en backend
  const toggleTodo = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    const newCompleted = !todo.completed;

    // Actualización optimista
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: newCompleted } : t))
    );
    try {
      await todoApi.updateTodo(id, { completed: newCompleted });
    } catch {
      // Revertir si falla
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: todo.completed } : t))
      );
    }
  };

  return {
    todos,
    loading,
    error,
    fetchTodos,
    addTodo,
    editTodo,
    removeTodo,
    toggleTodo,
  };
};
