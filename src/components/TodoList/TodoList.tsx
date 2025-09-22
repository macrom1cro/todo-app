import TodoItem, { type ITodoItemProps } from "../TodoItem/TodoItem";

export interface ITodoListProps {
  title: string;
  items: ITodoItemProps[];
  onToggleTodo?: (id: number) => void;
}

export default function TodoList({
  title,
  items,
  onToggleTodo,
}: ITodoListProps) {

  return (
    <>
      <h2>{title}</h2>
      <ul>
        {items.map(todo => (
          <TodoItem key={todo.id} {...todo} onToggleTodo={onToggleTodo} />
        ))}
      </ul>
    </>
  );
}
