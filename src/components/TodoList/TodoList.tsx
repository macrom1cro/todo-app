import Grid from "@mui/material/Grid";
import TodoItem, { type ITodoItem } from "../TodoItem/TodoItem";
import EditTodo from "../EditTodo/EditTodo";
// import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useEffect, useState } from "react";
import { deleteTodo, editTodo, fetchTodos, setPage } from "../../store/slices/todosSlice";

// export interface ITodoListProps {
//   todos: ITodoItem[];
//   todoIdForEdit: number | null;
//   onToggleTodo: (id: number) => void;
//   onDeleteTodo: (id: number) => void;
//   onEditTodo: (id: number | null) => void;
//   onSaveEdit: (id: number, newText: string) => void;
// }

export default function TodoList() {
  const {
  todos: todos,
  // totalPages,
  page,
  limit,
  filter,
  sortOrder,
} = useAppSelector(state => state.todos);
  const [todoIdForEdit, setTodoIdForEdit] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const todoForEdit =
    todoIdForEdit !== null
      ? todos.find(todo => todo.id === todoIdForEdit)
      : undefined;
  
      const dispatch = useAppDispatch();
  


  useEffect(() => {
    setLoading(true);
    setError("");
    try {
      dispatch(fetchTodos({ page, limit, filter, sortOrder }));
    } catch (err) {
      console.error(err);
      setError("No fetchTodos");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  }, [dispatch, page, limit, filter, sortOrder]);

  const handleToggleTodo = async (id: number) => {
    try {
      await dispatch(toggleTodo(id)).unwrap();
    } catch (err) {
      console.error("Error toggling todo:", err);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await dispatch(deleteTodo(id)).unwrap();
      if (todos.length === 1 && page > 1) {
        dispatch(setPage(page - 1));
      } else {
        dispatch(fetchTodos({ page, limit, filter, sortOrder }));
      }
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  const handleSaveEdit = async (id: number, newText: string) => {
    try {
      await dispatch(editTodo({ id, text: newText })).unwrap();
      setTodoIdForEdit(null);
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  const selectTodoIdForEdit = (id: number | null) => {
    setTodoIdForEdit(id);
  };
  return (
    <Box sx={{ mb: 4 }}>
      {todoForEdit && onSaveEdit && onEditTodo && (
        <EditTodo
          todo={todoForEdit}
          onSaveEdit={onSaveEdit}
          onCancel={() => onEditTodo(null)}
        />
      )}
      <Grid container direction='column'>
        {todos.map(todo => (
          <Grid key={todo.id} sx={{ width: "100%" }}>
            <TodoItem
              todo={todo}
              onToggleTodo={onToggleTodo}
              onDeleteTodo={onDeleteTodo}
              onEditTodo={onEditTodo}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}