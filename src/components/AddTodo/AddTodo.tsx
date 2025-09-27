import { useState, type ChangeEvent } from "react";
import Button from "@mui/material/Button";
import type { ITodoItemProps } from "../TodoItem/TodoItem";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";

interface AddTodoProps {
  addTodo: ({ text }: Omit<ITodoItemProps, "id" | "isDone"| "deadline">) => void;
}

const DEFAULT_TODO = {
  text: "",
};

const AddTodo = ({ addTodo }: AddTodoProps) => {
  const [todo, setTodo] = useState(DEFAULT_TODO);
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setTodo({ ...todo, [name]: value });
  };
  const onClick = () => {
    addTodo({ text: todo.text });
    setTodo(DEFAULT_TODO);
  };
  return (
    <>
      <Grid
        container
        spacing={2}
        direction='row'
        sx={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TextField
          type='text'
          id='text'
          size='small'
          name='text'
          value={todo.text}
          onChange={onChange}
        />
        <Button variant='outlined' color='success' onClick={onClick}>
          Add
        </Button>
      </Grid>
    </>
  );
};

export default AddTodo;
