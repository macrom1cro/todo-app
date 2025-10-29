import { configureStore } from "@reduxjs/toolkit";
import todosReducer from "./slices/todosSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    todos: todosReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
