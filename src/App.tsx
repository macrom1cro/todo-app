import { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import TodoList from "./components/TodoList/TodoList";
import Time from "./components/Time/Time";
import AddTodo from "./components/AddTodo/AddTodo";
import type { ITodoItem } from "./components/TodoItem/TodoItem";
import Typography from "@mui/material/Typography";
import { ThemeProvider } from "./context/ThemeContext";
import { ThemeToggle } from "./components/ThemeToggle/ThemeToggle";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import type { Theme } from "./theme/themes";
import { todosApi } from "./api/todosApi";
import Pagination from "@mui/material/Pagination";
import Box from "@mui/material/Box";
import { loadTodosFromStorage, saveTodosToStorage } from "./utils/localStorage";

const TODOS_STORAGE_KEY = "todo-app-tasks";

const AppContainer = styled.div<{ theme: Theme }>`
  background-color: ${props => props.theme.body};
  color: ${props => props.theme.text};
  min-height: 100vh;
  padding: 20px;
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const AppContent = () => {
  const [todos, setTodos] = useState<ITodoItem[]>(() =>
    loadTodosFromStorage(TODOS_STORAGE_KEY)
  );
  const [todoIdForEdit, setTodoIdForEdit] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const [filter, setFilter] = useState<"all" | "completed" | "active">("all");
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [allTodos, setAllTodos] = useState(0);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(
    async (
      page: number = 1,
      limit: number = 5,
      filter: "all" | "completed" | "active" = "all",
      sortOrder: "newest" | "oldest" = "newest"
    ) => {
      setLoading(true);
      try {
        const response = await todosApi.getTodos(
          page,
          limit,
          filter,
          sortOrder
        );
        setTodos(response.data.data);
        setTotalPages(response.data.totalPages);
        setAllTodos(response.data.total);
        setLimit(response.data.limit);

        saveTodosToStorage(response.data.data, TODOS_STORAGE_KEY);
      } catch (err) {
        console.error("Error load todos from api:", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchUsers(page, limit, filter, sortOrder);
  }, [page, allTodos, limit, filter, sortOrder, fetchUsers]);

  const addTodo = async (text: string) => {
    try {
      const response = await todosApi.addTodo(text);
      setTodos([...todos, response.data]);
      setAllTodos(allTodos + 1);
    } catch (err) {
      console.error("Error add todos on api:", err);
    } finally {
      setLoading(false);
    }
  };

  const selectTodoIdForEdit = (id: number | null) => {
    setTodoIdForEdit(id);
  };

  const handleSaveEdit = (id: number, newText: string) => {
    setTodos(
      todos.map(todo => (todo.id === id ? { ...todo, text: newText } : todo))
    );
    setTodoIdForEdit(null);
  };

  const toggleTodo = async (id: number) => {
    try {
      await todosApi.editTodoCompleted(id);
      setTodos(
        todos.map(todo =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    } catch (err) {
      console.error("Error add todos on api:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await todosApi.deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
      setAllTodos(allTodos - 1);
    } catch (err) {
      console.error("Error add todos on api:", err);
    } finally {
      setLoading(false);
    }
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
      <AddTodo addTodo={addTodo} />
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
            <InputLabel>Display pages</InputLabel>
            <Select
              value={limit}
              onChange={e => setLimit(e.target.value as 5 | 10 | 20)}
              label='Display pages'
            >
              <MenuItem value='5'>5</MenuItem>
              <MenuItem value='10'>10</MenuItem>
              <MenuItem value='20'>20</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Sorting</InputLabel>
            <Select
              value={sortOrder}
              onChange={e =>
                setSortOrder(e.target.value as "newest" | "oldest")
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
                setFilter(e.target.value as "all" | "completed" | "active")
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
          onToggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
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
          onChange={handleChange}
        />
      </Box>
    </AppContainer>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
