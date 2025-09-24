import Grid from "@mui/material/Grid";
import TodoItem, { type ITodoItemProps } from "../TodoItem/TodoItem";
import AddTodo from "../AddTodo/AddTodo";
import EditTodo from "../EditTodo/EditTodo";

export interface ITodoListProps {
  title: string;
  items: ITodoItemProps[];
  todoIdForEdit: number;
  onToggleTodo?: (id: number) => void;
  DeleteTodo?: (id: number) => void;
  selectTodoIdForEdit?: (id: number) => void;
}

export default function TodoList({
  title,
  items,
  todoIdForEdit,
  onToggleTodo,
  DeleteTodo,
  selectTodoIdForEdit,
}: ITodoListProps) {
  {items.map((todo)=>{
    if(todo.id===todoIdForEdit) return <EditTodo addTodo={todo}/>
  })}
  return (
    <>
      <h2>{title}</h2>
      <Grid container direction='column' rowSpacing={1}>
        {items.map(todo => (
          <TodoItem
            key={todo.id}
            {...todo}
            onToggleTodo={onToggleTodo}
            DeleteTodo={DeleteTodo}
            selectTodoIdForEdit={selectTodoIdForEdit}
            todoIdForEdit={todoIdForEdit}
          />
        ))}
      </Grid>
    </>
  );
}
