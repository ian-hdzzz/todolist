export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface CategoryWithTodos extends Category {
  todos: Array<{
    id: string;
    title: string;
    description: string;
    completed: boolean;
    priority: string;
    dueDate?: string;
    categories: Category[];
  }>;
}

export interface CreateCategoryDto {
  name: string;
  description: string;
  color: string;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
  color?: string;
}
