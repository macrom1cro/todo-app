// import styled from "styled-components";
import Button from "@mui/material/Button";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
// interface SpanProps {
//   $isDone: boolean;
// }

// const ListElements = styled.li`
//   list-style: none;
//   display: flex;
//   flex-flow: row nowrap;
//   justify-content: space-between;
//   align-items: center;
//   /* gap: 1rem; */
// `;
// const ListElementsSpan = styled.span<SpanProps>`
//   text-decoration: ${({ $isDone }) => ($isDone ? "line-through" : "none")};
// `;
export interface ITodoItemProps {
  id: number;
  text: string;
  isDone: boolean;
  onToggleTodo?: (id: number) => void;
  DeleteTodo?: (id: number) => void;
  selectTodoIdForEdit?: (id: number) => void;
}

export default function TodoItem({
  id,
  text,
  isDone,
  onToggleTodo,
  DeleteTodo,
  selectTodoIdForEdit,
}: ITodoItemProps) {
  // const handleToggleTodo = () => {
  //   onToggleTodo?.(id);
  // };
  // const onClick = () => {
  //   DeleteTodo?.(id);
  // };
  return (
    <>
      <Grid
        container
        spacing={1}
        columns={6}
        sx={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid size='auto'>
          <Checkbox
            checked={isDone}
            onChange={() => {
              onToggleTodo?.(id);
            }}
          />
        </Grid>
        <Grid size={2}>
          <Typography
            variant='h6'
            sx={{
              wordWrap: "break-word",
              textDecoration: () => (isDone ? "line-through" : "none"),
            }}
          >
            {text}
          </Typography>
        </Grid>
        <Grid container spacing={1} size='auto'>
          <Button
            variant='outlined'
            color='primary'
            onClick={() => {
              selectTodoIdForEdit?.(id);
            }}
          >
            Edit
          </Button>
          <Button
            variant='outlined'
            color='error'
            onClick={() => {
              DeleteTodo?.(id);
            }}
          >
            Delete <DeleteForeverIcon />
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
