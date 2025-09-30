import { useState, type ChangeEvent, type KeyboardEvent } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";

export interface AddTodoProps {
  addTodo: (text: string) => void;
}

const AddTodo = ({ addTodo }: AddTodoProps) => {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setText(value);

    if (error && value.trim() !== "") {
      setError("");
    }
    return;
  };

  const onKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onClick();
    }
  };

  const onClick = () => {
    if (text.trim() === "") {
      setError("The field cannot be empty");
      return;
    }

    addTodo(text);
    setText("");
    setError("");
  };
  return (
    <Grid
      container
      spacing={2}
      direction='row'
      sx={{
        justifyContent: "center",
        marginBottom: 2,
      }}
    >
      <Grid size={{ xs: 12, sm: 8, md: 6 }}>
        <TextField
          type='text'
          id='text'
          size='small'
          name='text'
          value={text}
          onChange={onChange}
          onKeyDown={onKeyPress}
          placeholder='Enter a task'
          label='Add task'
          error={!!error}
          helperText={error}
          fullWidth
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4, md: 1 }}>
        <Button variant='outlined' color='success' onClick={onClick}>
          Add
        </Button>
      </Grid>
    </Grid>
  );
};

export default AddTodo;
