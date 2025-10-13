import { useState, useEffect } from "react";
import styled from "styled-components";
import TodoList from "./components/TodoList/TodoList";
import Time from "./components/Time/Time";
import AddTodo from "./components/AddTodo/AddTodo";
import Typography from "@mui/material/Typography";
import { ThemeProvider } from "./context/ThemeContext";
import { ThemeToggle } from "./components/ThemeToggle/ThemeToggle";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import type { Theme } from "./theme/themes";
import Pagination from "@mui/material/Pagination";
import Box from "@mui/material/Box";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import {
  addTodo,
  deleteTodo,
  editTodo,
  fetchTodos,
  setFilter,
  setLimit,
  setPage,
  setSortOrder,
  toggleTodo,
} from "./store/slices/todosSlice";

const AppContainer = styled.div<{ theme: Theme }>`
  background-color: ${props => props.theme.body};
  color: ${props => props.theme.text};
  min-height: 100vh;
  padding: 20px;
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const AppContent = () => {
  const dispatch = useAppDispatch();
  const {
    todos: todos,
    loading,
    total: allTodos,
    totalPages,
    page,
    limit,
    filter,
    sortOrder,
  } = useAppSelector(state => state.todos);

  const [todoIdForEdit, setTodoIdForEdit] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchTodos({ page, limit, filter, sortOrder }));
  }, [dispatch, page, limit, filter, sortOrder]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    dispatch(setPage(value));
  };

  const handleAddTodo = async (text: string) => {
    try {
      await dispatch(addTodo(text)).unwrap();
      dispatch(fetchTodos({ page, limit, filter, sortOrder }));
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

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
      setTodoIdForEdit(id);
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  const selectTodoIdForEdit = (id: number | null) => {
    setTodoIdForEdit(id);
  };
  return (
    <AppContainer>
      <ThemeToggle />
      <Time />
      <Typography
        variant='h1'
        component='h1'
        sx={{ textAlign: "center", mb: 4, color: "inherit" }}
      >
        Todo List
      </Typography>
      <AddTodo addTodo={handleAddTodo} />
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={3}
        sx={{ mb: 3, justifyContent: "space-between", alignItems: "center" }}
      >
        <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
          <Typography
            variant='h6'
            sx={{ textAlign: "center", mb: 2, color: "inherit" }}
          >
            All Task: {allTodos}
          </Typography>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Show on page</InputLabel>
            <Select
              value={limit}
              onChange={e => dispatch(setLimit(Number(e.target.value)))}
              label='ShowOnPage'
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Sorting</InputLabel>
            <Select
              value={sortOrder}
              onChange={e =>
                dispatch(setSortOrder(e.target.value as "newest" | "oldest"))
              }
              label='Sorting'
            >
              <MenuItem value='newest'>New tasks first</MenuItem>
              <MenuItem value='oldest'>Old tasks first</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Filter</InputLabel>
            <Select
              value={filter}
              onChange={e =>
                dispatch(
                  setFilter(e.target.value as "all" | "completed" | "active")
                )
              }
              label='Filter'
            >
              <MenuItem value='all'>All tasks</MenuItem>
              <MenuItem value='active'>Unready</MenuItem>
              <MenuItem value='completed'>Ready</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Stack>
      {loading ? (
        <Typography
          variant='h6'
          sx={{ textAlign: "center", mb: 2, color: "inherit" }}
        >
          loading...
        </Typography>
      ) : (
        <TodoList
          items={todos}
          onToggleTodo={handleToggleTodo}
          deleteTodo={handleDeleteTodo}
          selectTodoIdForEdit={selectTodoIdForEdit}
          todoIdForEdit={todoIdForEdit}
          onSaveEdit={handleSaveEdit}
        />
      )}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Pagination
          count={totalPages}
          color='primary'
          variant='outlined'
          shape='rounded'
          size='large'
          page={page}
          onChange={handlePageChange}
        />
      </Box>
    </AppContainer>
  );
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
