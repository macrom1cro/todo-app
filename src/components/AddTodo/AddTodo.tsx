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
  const [isAdding, setIsAdding] = useState(false);

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
  const validateTodo = (text: string): string | null => {
    if (!text.trim()) return "The field cannot be empty";
    if (text.length > 100) return "Task is too long (max 100 characters)";
    return null;
  };

  const onClick = async () => {
    const validationError = validateTodo(text);
    if (validationError) {
      setError(validationError);
      return;
    }
    setIsAdding(true);
    try {
      await addTodo(text);
      setText("");
      setError("");
    } catch (error) {
      console.error(error);
      setError("Failed to add task");
    } finally {
      setTimeout(() => {
        setIsAdding(false);
      }, 500);
    }
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
        <Button
          variant='outlined'
          color='success'
          onClick={onClick}
          disabled={isAdding}
        >
          {isAdding ? "Adding..." : "Add"}
        </Button>
      </Grid>
    </Grid>
  );
};

export default AddTodo;
