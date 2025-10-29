import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
  type AsyncThunk,
} from "@reduxjs/toolkit";
import type { ITodoItem } from "../../components/TodoItem/TodoItem";
import { todosApi } from "../../api/todosApi";
import {
  loadTodosFromStorage,
  saveTodosToStorage,
} from "../../utils/localStorage";
import { FilterStatus, SortingStatus } from "../../components/Filters/Filters";

const TODOS_STORAGE_KEY = "todo-app-tasks";
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 5;

type ThunkApiConfig = {
  rejectValue: string;
  state: unknown;
};

type FetchTodosResponse = {
  data: ITodoItem[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
};

type FetchTodosParams = {
  page?: number;
  limit?: number;
  filter?: FilterStatus;
  sortOrder?: SortingStatus;
};
interface TodosState {
  todos: ITodoItem[];
  error: string | null;
  total: number;
  totalPages: number;
  page: number;
  limit: number;
  filter: FilterStatus;
  sortOrder: SortingStatus;
}

const initializeState = (): TodosState => {
  const initialTodos = loadTodosFromStorage(TODOS_STORAGE_KEY);

  return {
    todos: initialTodos,
    error: null,
    total: initialTodos.length,
    totalPages: Math.ceil(initialTodos.length / DEFAULT_LIMIT),
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
    filter: FilterStatus.ALL,
    sortOrder: SortingStatus.NEWEST,
  };
};

const handleThunkError = (error: unknown): string => {
  return error instanceof Error ? error.message : "An unknown error occurred";
};

const createAppThunk = <Returned, ThunkArg = void>(
  type: string,
  request: (arg: ThunkArg) => Promise<Returned>
): AsyncThunk<Returned, ThunkArg, ThunkApiConfig> =>
  createAsyncThunk<Returned, ThunkArg, ThunkApiConfig>(
    type,
    async (arg, { rejectWithValue }) => {
      try {
        return await request(arg);
      } catch (error) {
        return rejectWithValue(handleThunkError(error));
      }
    }
  );

export const fetchTodos = createAppThunk<FetchTodosResponse, FetchTodosParams>(
  "todos/fetchTodos",
  async ({
    page = DEFAULT_PAGE,
    limit = DEFAULT_LIMIT,
    filter = FilterStatus.ALL,
    sortOrder = SortingStatus.NEWEST,
  }) => {
    const response = await todosApi.getTodos(page, limit, filter, sortOrder);

    return response.data;
  }
);

export const addTodo = createAppThunk<ITodoItem, string>(
  "todos/addTodo",
  async (text: string) => {
    const response = await todosApi.addTodo(text);
    return response.data;
  }
);

export const toggleTodo = createAppThunk<number, number>(
  "todos/toggleTodo",
  async (id: number) => {
    await todosApi.editTodoCompleted(id);
    return id;
  }
);

export const deleteTodo = createAppThunk<number, number>(
  "todos/deleteTodo",
  async (id: number) => {
    await todosApi.deleteTodo(id);
    return id;
  }
);

export const editTodo = createAppThunk<
  { id: number; text: string },
  { id: number; text: string }
>("todos/editTodo", async ({ id, text }) => {
  await todosApi.editTodo(id, text);
  return { id, text };
});

const updateStorage = (state: TodosState): void => {
  saveTodosToStorage(state.todos, TODOS_STORAGE_KEY);
};

const calculatePagination = (state: TodosState): void => {
  state.totalPages = Math.ceil(state.total / state.limit);
};

const resetPagination = (state: TodosState): void => {
  state.page = DEFAULT_PAGE;
};

const todosSlice = createSlice({
  name: "todos",
  initialState: initializeState(),
  reducers: {
    setPage: (state, { payload }: PayloadAction<number>) => {
      state.page = payload;
    },
    setLimit: (state, { payload }: PayloadAction<number>) => {
      state.limit = payload;
      calculatePagination(state);
    },
    setFilter: (state, { payload }: PayloadAction<FilterStatus>) => {
      state.filter = payload;
      resetPagination(state);
    },
    setSortOrder: (state, { payload }: PayloadAction<SortingStatus>) => {
      state.sortOrder = payload;
      resetPagination(state);
    },
    clearError: state => {
      state.error = null;
    },
    saveToLocalStorage: state => {
      updateStorage(state);
    },
    loadFromLocalStorage: state => {
      const storedItems = loadTodosFromStorage(TODOS_STORAGE_KEY);
      state.todos = storedItems;
      state.total = storedItems.length;
      calculatePagination(state);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTodos.pending, state => {
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, { payload }) => {
        state.todos = payload.data;
        state.total = payload.total;
        state.totalPages = payload.totalPages;
        state.limit = payload.limit;
        updateStorage(state);
      })
      .addCase(fetchTodos.rejected, (state, { error }) => {
        state.error = error.message ?? "Failed to fetch todos";
        const storedItems = loadTodosFromStorage(TODOS_STORAGE_KEY);

        if (storedItems.length > 0) {
          state.todos = storedItems;
          state.total = storedItems.length;
          calculatePagination(state);
        }
      })
      .addCase(addTodo.pending, state => {
        state.error = null;
      })
      .addCase(addTodo.fulfilled, (state, { payload }) => {
        state.todos.push(payload);
        state.total += 1;
        calculatePagination(state);
        updateStorage(state);
      })
      .addCase(addTodo.rejected, (state, { error }) => {
        state.error = error.message ?? "Failed to add todo";
      })
      .addCase(toggleTodo.fulfilled, (state, { payload: id }) => {
        const todo = state.todos.find(item => item.id === id);
        if (todo) {
          todo.completed = !todo.completed;
          updateStorage(state);
        }
      })
      .addCase(deleteTodo.fulfilled, (state, { payload: id }) => {
        state.todos = state.todos.filter(item => item.id !== id);
        state.total -= 1;
        calculatePagination(state);
        updateStorage(state);
      })
      .addCase(editTodo.fulfilled, (state, { payload: { id, text } }) => {
        const todo = state.todos.find(item => item.id === id);
        if (todo) {
          todo.text = text;
          updateStorage(state);
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
