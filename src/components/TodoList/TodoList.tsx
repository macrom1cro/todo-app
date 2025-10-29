import Grid from "@mui/material/Grid";
import TodoItem from "../TodoItem/TodoItem";
import EditTodo from "../EditTodo/EditTodo";
// import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useCallback, useEffect, useState } from "react";
import {
  deleteTodo,
  editTodo,
  fetchTodos,
  setPage,
  toggleTodo,
} from "../../store/slices/todosSlice";
import Text from "../Text/Text";

export default function TodoList() {
  const {
    todos: todos,
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

  const handleToggleTodo = useCallback(
    async (id: number) => {
      try {
        await dispatch(toggleTodo(id)).unwrap();
      } catch (err) {
        console.error("Error toggling todo:", err);
      }
    },
    [dispatch]
  );

  const handleDeleteTodo = useCallback(
    async (id: number) => {
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
    },
    [dispatch, todos.length, page, limit, filter, sortOrder]
  );

  const handleSaveEdit = useCallback(
    async (id: number, newText: string) => {
      try {
        await dispatch(editTodo({ id, text: newText })).unwrap();
        setTodoIdForEdit(null);
      } catch (err) {
        console.error("Error adding todo:", err);
      }
    },
    [dispatch]
  );

  return (
    <>
      {error && <Text variant='h6' mb={2} text={error} />}
      {loading ? (
        <Text variant='h6' mb={2} text='loading...' />
      ) : (
        <Box sx={{ mb: 4 }}>
          {todoForEdit && handleSaveEdit && todoIdForEdit && (
            <EditTodo
              todo={todoForEdit}
              onSaveEdit={handleSaveEdit}
              onCancel={() => setTodoIdForEdit(null)}
            />
          )}
          <Grid container direction='column'>
            {todos.map(todo => (
              <Grid key={todo.id} sx={{ width: "100%" }}>
                <TodoItem
                  todo={todo}
                  onToggleTodo={handleToggleTodo}
                  onDeleteTodo={handleDeleteTodo}
                  onEditTodo={setTodoIdForEdit}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </>
  );
}
