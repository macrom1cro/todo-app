import { useState } from "react";
import "./App.css";
import { startTodoList } from "./assets/data";
import TodoList from "./components/TodoList/TodoList";
import Time from "./components/Time/Time";
import AddTodo from "./components/AddTodo/AddTodo";
import type { ITodoItemProps } from "./components/TodoItem/TodoItem";
import Typography from "@mui/material/Typography";

function App() {
  const [todos, setTodos] = useState(startTodoList);
  const [todoIdForEdit, setTodoIdForEdit] = useState<number | null>(null);
  const addTodo = ({
    text,
  }: Omit<ITodoItemProps, "id" | "isDone" | "deadline">) => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 10);
    setTodos([
      ...todos,
      {
        id: todos.length > 0 ? todos[todos.length - 1].id + 1 : 1,
        text,
        isDone: false,
        deadline: currentDate.toISOString().slice(0, 10),
      },
    ]);
  };
  const DeleteTodo = (id: number) => {
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

  const getOverdueTodos = () => {
    const today = new Date();
    return todos.filter(
      todo => !todo.isDone && new Date(todo.deadline) < today
    );
  };
  const getActualTodos = () => {
    const today = new Date();
    return todos.filter(
      todo => !todo.isDone && new Date(todo.deadline) >= today
    );
  };
  const getCompletedTodos = () => {
    return todos.filter(todo => todo.isDone);
  };
  const toggleTodo = (id: number) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, isDone: !todo.isDone };
      } else {
        return todo;
      }
    });
    setTodos(updatedTodos);
  };

  return (
    <>
      <Time />
      <Typography variant='h1'>Todo List</Typography>
      <AddTodo addTodo={addTodo} />

      <TodoList
        title='Overdue'
        items={getOverdueTodos()}
        onToggleTodo={toggleTodo}
        DeleteTodo={DeleteTodo}
        selectTodoIdForEdit={selectTodoIdForEdit}
        todoIdForEdit={todoIdForEdit}
        onSaveEdit={handleSaveEdit}
      />
      <TodoList
        title='Actual'
        items={getActualTodos()}
        onToggleTodo={toggleTodo}
        DeleteTodo={DeleteTodo}
        selectTodoIdForEdit={selectTodoIdForEdit}
        todoIdForEdit={todoIdForEdit}
        onSaveEdit={handleSaveEdit}
      />
      <TodoList
        title='Completed'
        items={getCompletedTodos()}
        onToggleTodo={toggleTodo}
        DeleteTodo={DeleteTodo}
        selectTodoIdForEdit={selectTodoIdForEdit}
        todoIdForEdit={todoIdForEdit}
        onSaveEdit={handleSaveEdit}
      />
    </>
  );
}

export default App;
