import { useState, type ChangeEvent } from "react";
import Button from '@mui/material/Button';
import type { ITodoItemProps } from "../TodoItem/TodoItem";


interface AddTodoProps {
  addTodo: ({ text }: Omit<ITodoItemProps, "id" | "isDone">) => void;
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
      <input
        type='text'
        id='text'
        name='text'
        value={todo.text}
        onChange={onChange}
      ></input>
      <Button variant="outlined" color="success" onClick={onClick}>Add</Button>
    </>
  );
};
// #endregion

export default AddTodo;
