import type { ITodoItemProps } from "../components/TodoItem/TodoItem";

export const loadTodosFromStorage = (key: string) => {
  try {
    const savedTodos = localStorage.getItem(key);
    if (savedTodos) {
      return JSON.parse(savedTodos);
    }
  } catch (error) {
    console.error("Error load todos from localStorage:", error);
  }
};

export const saveTodosToStorage = (todos: ITodoItemProps[], key: string) => {
  try {
    localStorage.setItem(key, JSON.stringify(todos));
  } catch (error) {
    console.error("Error save todos to localStorage:", error);
  }
};