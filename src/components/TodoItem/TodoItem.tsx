import styled from "styled-components";

// import styled from "styled-components"
const ListElements = styled.li`
  list-style: none;
  & input {
    margin-right: 15px;
  }
`;
export interface ITodoItemProps {
  id: number;
  text: string;
  isDone: boolean;
  onToggleTodo?: (id: number) => void;
}

export default function TodoItem({
  id,
  text,
  isDone,
  onToggleTodo,
}: ITodoItemProps) {
  const handleToggleTodo = () => {
    onToggleTodo?.(id);
  };
  return (
    <ListElements>
      <input type='checkbox' checked={isDone} onChange={handleToggleTodo} />
      <span style={{ textDecoration: isDone ? "line-through" : "none" }}>
        {text}
      </span>
    </ListElements>
  );
}
