import type { ITodoItem } from "../components/TodoItem/TodoItem";

export const loadTodosFromStorage = (key: string): ITodoItem[] => {
  try {
    const savedTodos = localStorage.getItem(key);
    if (savedTodos) {
      const parsed = JSON.parse(savedTodos);
      return parsed.map((todo: ITodoItem) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
      }));
    }
  } catch (error) {
    console.error("Error load todos from localStorage:", error);
  }
  return [];
};

export const saveTodosToStorage = (todos: ITodoItem[], key: string) => {
  try {
    const todosToSave = todos.map(todo => ({
      ...todo,
      createdAt: todo.createdAt.toISOString(),
    }));
    localStorage.setItem(key, JSON.stringify(todosToSave));
  } catch (error) {
    console.error("Error save todos to localStorage:", error);
  }
};
