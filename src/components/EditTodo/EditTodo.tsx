import {
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  useEffect,
} from "react";
import Button from "@mui/material/Button";
import type { ITodoItemProps } from "../TodoItem/TodoItem";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";

interface EditTodoProps {
  todo: ITodoItemProps;
  onSaveEdit: (id: number, newText: string) => void;
  onCancel: () => void;
}

export default function EditTodo({
  todo,
  onSaveEdit,
  onCancel,
}: EditTodoProps) {
  const [editedText, setEditedText] = useState(todo.text);

  useEffect(() => {
    setEditedText(todo.text);
  }, [todo]);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEditedText(event.target.value);
  };

  const onKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && editedText.trim() !== "") {
      onSaveEdit(todo.id, editedText);
    }
    if (event.key === "Escape") {
      onCancel();
    }
  };

  const onSave = () => {
    if (editedText.trim() !== "") {
      onSaveEdit(todo.id, editedText);
    }
  };
  return (
    <Grid
      container
      spacing={2}
      sx={{
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 2,
      }}
    >
      <Grid size={{ xs: 12, sm: 8, md: 6 }}>
        <TextField
          type='text'
          size='small'
          value={editedText}
          onChange={onChange}
          onKeyDown={onKeyPress}
          placeholder='Editing task'
          fullWidth
          label='Edit'
          autoFocus
        />
      </Grid>

      <Grid size={{ xs: 6, sm: 2, md: 1 }}>
        <Button
          variant='outlined'
          color='success'
          onClick={onSave}
          disabled={editedText.trim() === ""}
          fullWidth
        >
          Сохранить
        </Button>
      </Grid>

      <Grid size={{ xs: 6, sm: 2, md: 1 }}>
        <Button variant='outlined' color='error' onClick={onCancel} fullWidth>
          Отмена
        </Button>
      </Grid>
    </Grid>
  );
}
