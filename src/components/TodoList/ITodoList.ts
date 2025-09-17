import type { ITodoItem } from "../TodoItem/ITodoItem";

export interface ITodoList {
  title: string;
  items: ITodoItem[];
  onToggleTodo: (id: number) => void;
}
