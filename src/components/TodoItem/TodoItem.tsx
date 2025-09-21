import styled from "styled-components";
import Button from "../Button/Button";

interface SpanProps {
  isDone: boolean;
}

const ListElements = styled.li`
  list-style: none;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  /* gap: 1rem; */
`;
const ListElementsSpan = styled.span<SpanProps>`
  text-decoration: ${({ isDone }) => (isDone ? "line-through" : "none")};
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
      <Button>Редактировать</Button>
      <Button>Удалить</Button>
      <input type='checkbox' checked={isDone} onChange={handleToggleTodo} />
      <ListElementsSpan isDone={isDone}>{text}</ListElementsSpan>
    </ListElements>
  );
}
