import Grid from "@mui/material/Grid";
import TodoItem, { type ITodoItemProps } from "../TodoItem/TodoItem";
import EditTodo from "../EditTodo/EditTodo";
import Typography from "@mui/material/Typography";

export interface ITodoListProps {
  title: string;
  items: ITodoItemProps[];
  todoIdForEdit: number | null;
  onToggleTodo?: (id: number) => void;
  DeleteTodo?: (id: number) => void;
  selectTodoIdForEdit?: (id: number | null) => void;
  onSaveEdit?: (id: number, newText: string) => void;
}

export default function TodoList({
  title,
  items,
  todoIdForEdit,
  onToggleTodo,
  DeleteTodo,
  selectTodoIdForEdit,
  onSaveEdit,
}: ITodoListProps) {
  const todoForEdit =
    todoIdForEdit !== null
      ? items.find(todo => todo.id === todoIdForEdit)
      : undefined;
  return (
    <>
      <Typography variant='h3'>{title}</Typography>
      
      {todoForEdit && onSaveEdit && selectTodoIdForEdit && (
        <EditTodo
          todo={todoForEdit}
          onSaveEdit={onSaveEdit}
          onCancel={() => selectTodoIdForEdit(null)}
        />
      )}
      <Grid container direction='column' rowSpacing={2}>
        {items.map(todo => (
          <TodoItem
            key={todo.id}
            {...todo}
            onToggleTodo={onToggleTodo}
            DeleteTodo={DeleteTodo}
            selectTodoIdForEdit={selectTodoIdForEdit}
          />
        ))}
      </Grid>
    </>
  );
}