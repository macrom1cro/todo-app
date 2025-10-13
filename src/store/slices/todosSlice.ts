// store/slices/todosSlice.ts
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { ITodoItem } from "../../components/TodoItem/TodoItem";
import { todosApi } from "../../api/todosApi";
import {
  loadTodosFromStorage,
  saveTodosToStorage,
} from "../../utils/localStorage";

const TODOS_STORAGE_KEY = "todo-app-tasks";
interface TodosState {
  todos: ITodoItem[];
  error: string | null;
  total: number;
  totalPages: number;
  page: number;
  limit: number;
  filter: "all" | "completed" | "active";
  sortOrder: "newest" | "oldest";
}

const initialTodos = loadTodosFromStorage(TODOS_STORAGE_KEY);

const initialState: TodosState = {
  todos: initialTodos,
  error: null,
  total: 0,
  totalPages: 0,
  page: 1,
  limit: 5,
  filter: "all",
  sortOrder: "newest",
};

export const fetchTodos = createAsyncThunk<
  {
    data: ITodoItem[];
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  },
  {
    page?: number;
    limit?: number;
    filter?: "all" | "completed" | "active";
    sortOrder?: "newest" | "oldest";
  }, // Argument type
  { rejectValue: string } // Reject type
>(
  "todos/fetchTodos",
  async ({
    page = 1,
    limit = 5,
    filter = "all",
    sortOrder = "newest",
  }: {
    page?: number;
    limit?: number;
    filter?: "all" | "completed" | "active";
    sortOrder?: "newest" | "oldest";
  }) => {
    const response = await todosApi.getTodos(page, limit, filter, sortOrder);

    return response.data;
  }
);

export const addTodo = createAsyncThunk<
  ITodoItem,
  string,
  { rejectValue: string }
>("todos/addTodo", async (text: string) => {
  const response = await todosApi.addTodo(text);
  return response.data;
});

export const toggleTodo = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("todos/toggleTodo", async (id: number) => {
  await todosApi.editTodoCompleted(id);
  return id;
});

export const deleteTodo = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("todos/deleteTodo", async (id: number) => {
  await todosApi.deleteTodo(id);
  return id;
});

export const editTodo = createAsyncThunk<
  { id: number; text: string },
  { id: number; text: string },
  { rejectValue: string }
>("todos/editTodo", async ({ id, text }: { id: number; text: string }) => {
  await todosApi.editTodo(id, text);
  return { id, text };
});

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    setFilter: (
      state,
      action: PayloadAction<"all" | "completed" | "active">
    ) => {
      state.filter = action.payload;
      state.page = 1;
    },
    setSortOrder: (state, action: PayloadAction<"newest" | "oldest">) => {
      state.sortOrder = action.payload;
      state.page = 1;
    },
    clearError: state => {
      state.error = null;
    },
    saveToLocalStorage: state => {
      saveTodosToStorage(state.todos, TODOS_STORAGE_KEY);
    },
    loadFromLocalStorage: state => {
      const storedItems = loadTodosFromStorage(TODOS_STORAGE_KEY);
      state.todos = storedItems;
      state.total = storedItems.length;
      state.totalPages = Math.ceil(storedItems.length / state.limit);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTodos.pending, state => {
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.todos = action.payload.data;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.limit = action.payload.limit;
        saveTodosToStorage(action.payload.data, TODOS_STORAGE_KEY);
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch todos";
        const storedItems = loadTodosFromStorage(TODOS_STORAGE_KEY);
        if (storedItems.length > 0) {
          state.todos = storedItems;
          state.total = storedItems.length;
          state.totalPages = Math.ceil(storedItems.length / state.limit);
        }
      })
      .addCase(addTodo.pending, state => {
        state.error = null;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.todos.push(action.payload);
        state.total += 1;
        saveTodosToStorage(state.todos, TODOS_STORAGE_KEY);
      })
      .addCase(addTodo.rejected, (state, action) => {
        state.error = action.error.message || "Failed to add todo";
      })
      .addCase(toggleTodo.fulfilled, (state, action) => {
        const todo = state.todos.find(item => item.id === action.payload);
        if (todo) {
          todo.completed = !todo.completed;
          saveTodosToStorage(state.todos, TODOS_STORAGE_KEY);
        }
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter(item => item.id !== action.payload);
        state.total -= 1;
        saveTodosToStorage(state.todos, TODOS_STORAGE_KEY);
      })
      .addCase(editTodo.fulfilled, (state, action) => {
        const todo = state.todos.find(item => item.id === action.payload.id);
        if (todo) {
          todo.text = action.payload.text;
          saveTodosToStorage(state.todos, TODOS_STORAGE_KEY);
        }
      });
  },
});

export const {
  setPage,
  setLimit,
  setFilter,
  setSortOrder,
  clearError,
  saveToLocalStorage,
  loadFromLocalStorage,
} = todosSlice.actions;
export default todosSlice.reducer;
