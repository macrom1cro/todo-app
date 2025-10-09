import type { ITodoItemProps } from "../components/TodoItem/TodoItem";
import axios from "axios";

const API_URL = "http://localhost:3001";

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

export const fetchTodos = async (
  page: number,
  limit: number,
  filter: "active" | "completed" | "all"
) => {
  const response = await axios.get(
    `${API_URL}/todos?page=${page}&limit=${limit}&filter=${filter}`
  );
  return response.data;
};

export const addTodo = async (text : string) => {
  await axios.post(`${API_URL}/todos`, { text });
};

export const deleteTodo = async (id : number) => {
  await axios.delete(`${API_URL}/todos/${id}`);
};
