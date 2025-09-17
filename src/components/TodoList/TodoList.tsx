import type { ITodoList } from "../TodoList/ITodoList";
import TodoItem from "../TodoItem/TodoItem";


export default function TodoList({ title, items, onToggleTodo }: ITodoList) {
  return (
    <>
      <h2>{title}</h2>
      <ul>
        {items.map(todo => {
          <TodoItem key={todo.id} {...todo} onToggleTodo={onToggleTodo} />;
        })}
      </ul>
    </>
  );
}
