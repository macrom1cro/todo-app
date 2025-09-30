import { useState, useEffect } from "react";
import styled from "styled-components";
import TodoList from "./components/TodoList/TodoList";
import Time from "./components/Time/Time";
import AddTodo from "./components/AddTodo/AddTodo";
import type { ITodoItemProps } from "./components/TodoItem/TodoItem";
import Typography from "@mui/material/Typography";
import { loadTodosFromStorage, saveTodosToStorage } from "./utils/localStorage";
import { ThemeProvider } from "./context/ThemeContext";
import { ThemeToggle } from "./components/ThemeToggle/ThemeToggle";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import type { Theme } from "./theme/themes";

const TODOS_STORAGE_KEY = "todo-app-tasks";

const AppContainer = styled.div<{ theme: Theme }>`
  background-color: ${props => props.theme.body};
  color: ${props => props.theme.text};
  min-height: 100vh;
  padding: 20px;
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const AppContent = () => {
  const [todos, setTodos] = useState<ITodoItemProps[]>(() =>
    loadTodosFromStorage(TODOS_STORAGE_KEY)
  );
  const [todoIdForEdit, setTodoIdForEdit] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [filter, setFilter] = useState<"all" | "completed" | "active">("all");

  useEffect(() => {
    saveTodosToStorage(todos, TODOS_STORAGE_KEY);
  }, [todos]);

  const addTodo = (text: string) => {
    setTodos([
      ...todos,
      {
        id: todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1,
        text,
        isDone: false,
        date: new Date(),
      },
    ]);
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
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

  const getSortedAndFilteredTodos = () => {
    let filteredTodos = todos;

    if (filter === "completed") {
      filteredTodos = todos.filter(todo => todo.isDone);
    } else if (filter === "active") {
      filteredTodos = todos.filter(todo => !todo.isDone);
    }

    const sortedTodos = [...filteredTodos].sort((a, b) => {
      if (sortOrder === "newest") {
        return b.date.getTime() - a.date.getTime();
      } else {
        return a.date.getTime() - b.date.getTime();
      }
    });

    return sortedTodos;
  };
  const toggleTodo = (id: number) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, isDone: !todo.isDone } : todo
      )
    );
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
        {" "}
        <Typography
          variant='h6'
          sx={{ textAlign: "center", mb: 2, color: "inherit" }}
        >
          All Task: {todos.length}
        </Typography>
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

      <TodoList
        items={getSortedAndFilteredTodos()}
        onToggleTodo={toggleTodo}
        deleteTodo={deleteTodo}
        selectTodoIdForEdit={selectTodoIdForEdit}
        todoIdForEdit={todoIdForEdit}
        onSaveEdit={handleSaveEdit}
      />
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
