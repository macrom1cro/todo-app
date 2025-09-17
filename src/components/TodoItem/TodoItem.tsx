// import styled from "styled-components";

import type { ITodoItem } from "./ITodoItem";



const TodoItem = ({ id, text, isDone, onToggleTodo }: ITodoItem) => {
  const handleToggleTodo = () => {
    onToggleTodo?.(id);
  };
  return (
    <li>
      <input type='checkbox' checked={isDone} onChange={handleToggleTodo} />
      <span style={{ textDecoration: isDone ? "line-through" : "none" }}>
        {text}
      </span>
    </li>
  );
};

export default TodoItem;
