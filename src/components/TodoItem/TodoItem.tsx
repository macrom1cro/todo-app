// import styled from "styled-components";
import Button from "@mui/material/Button";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";

export interface ITodoItemProps {
  id: number;
  text: string;
  isDone: boolean;
  deadline: string;
  onToggleTodo?: (id: number) => void;
  DeleteTodo?: (id: number) => void;
  selectTodoIdForEdit?: (id: number) => void;
}

export default function TodoItem({
  id,
  text,
  isDone,
  deadline,
  onToggleTodo,
  DeleteTodo,
  selectTodoIdForEdit,
}: ITodoItemProps) {
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
          <Typography variant='body2' color='text.secondary'>
            Deadline: {deadline}
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
