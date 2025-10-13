import Grid from "@mui/material/Grid";
import TodoItem, { type ITodoItem } from "../TodoItem/TodoItem";
import EditTodo from "../EditTodo/EditTodo";
// import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export interface ITodoListProps {
  todos: ITodoItem[];
  todoIdForEdit: number | null;
  onToggleTodo?: (id: number) => void;
  deleteTodo?: (id: number) => void;
  selectTodoIdForEdit?: (id: number | null) => void;
  onSaveEdit?: (id: number, newText: string) => void;
}

export default function TodoList({
  todos,
  todoIdForEdit,
  onToggleTodo,
  deleteTodo,
  selectTodoIdForEdit,
  onSaveEdit,
}: ITodoListProps) {
  const todoForEdit =
    todoIdForEdit !== null
      ? todos.find(todo => todo.id === todoIdForEdit)
      : undefined;
  return (
    <Box sx={{ mb: 4 }}>
      {todoForEdit && onSaveEdit && selectTodoIdForEdit && (
        <EditTodo
          todo={todoForEdit}
          onSaveEdit={onSaveEdit}
          onCancel={() => selectTodoIdForEdit(null)}
        />
      )}
      <Grid container direction='column'>
        {todos.map(todo => (
          <Grid key={todo.id} sx={{ width: "100%" }}>
            <TodoItem
              {...todo}
              onToggleTodo={onToggleTodo}
              deleteTodo={deleteTodo}
              selectTodoIdForEdit={selectTodoIdForEdit}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
