export interface ITodoItem {
  id: number;
  text: string;
  isDone: boolean;
  onToggleTodo: (id: number) => void;
};