import { useState } from "react";
import "./App.css";
import { startTodoList } from "./assets/data";
import TodoList from "./components/TodoList/TodoList";
import Time from "./components/Time/Time";

function App() {
  const [todos, setTodos] = useState(startTodoList);

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
      <h1>Todo List</h1> <Time />
      <TodoList
        title='Overdue'
        items={getOverdueTodos()}
        onToggleTodo={toggleTodo}
      />
      <TodoList
        title='Actual'
        items={getActualTodos()}
        onToggleTodo={toggleTodo}
      />
      <TodoList
        title='Completed'
        items={getCompletedTodos()}
        onToggleTodo={toggleTodo}
      />
    </>
  );
}

export default App;
