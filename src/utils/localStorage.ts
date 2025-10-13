import type { ITodoItem } from "../components/TodoItem/TodoItem";

export const loadTodosFromStorage = (key: string): ITodoItem[] => {
  try {
    const savedTodos = localStorage.getItem(key);
    if (savedTodos) {
      const parsed = JSON.parse(savedTodos);
      return parsed.map((todo: ITodoItem) => ({
        ...todo,
        createdAt: new Date(todo.createdAt).toISOString(),
      }));
    }
  } catch (error) {
    console.error("Error load todos from localStorage:", error);
  }
  return [];
};

export const saveTodosToStorage = (todos: ITodoItem[], key: string) => {
  try {
    localStorage.setItem(key, JSON.stringify(todos));
  } catch (error) {
    console.error("Error save todos to localStorage:", error);
  }
};

export const loadThemeToStorage = (key: string): "light" | "dark" => {
  try {
    const saveTheme = localStorage.getItem(key);
    if (saveTheme) {
      const parsed = JSON.parse(saveTheme);
      console.log(parsed)
      return parsed;
    }
  } catch (error) {
    console.error("Error save theme to localStorage:", error);
  }
  return "light";
};

export const saveThemeToStorage = (theme: "light" | "dark", key: string) => {
  try {
    localStorage.setItem(key, JSON.stringify(theme));
  } catch (error) {
    console.error("Error save todos to localStorage:", error);
  }
};
