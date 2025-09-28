import type { ITodoItemProps } from "../components/TodoItem/TodoItem";

export const loadTodosFromStorage = (key: string): ITodoItemProps[] => {
  try {
    const savedTodos = localStorage.getItem(key);
    if (savedTodos) {
      const parsed = JSON.parse(savedTodos);
      return parsed.map((todo: ITodoItemProps) => ({
        ...todo,
        date: new Date(todo.date),
      }));
    }
  } catch (error) {
    console.error("Error load todos from localStorage:", error);
  }
  return [];
};

export const saveTodosToStorage = (todos: ITodoItemProps[], key: string) => {
  try {
    const todosToSave = todos.map(todo => ({
      ...todo,
      date: todo.date.toISOString(),
    }));
    localStorage.setItem(key, JSON.stringify(todosToSave));
  } catch (error) {
    console.error("Error save todos to localStorage:", error);
  }
};