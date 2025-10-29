import styled from "styled-components";
import TodoList from "./components/TodoList/TodoList";
import Time from "./components/Time/Time";
import AddTodo from "./components/AddTodo/AddTodo";
import { ThemeProvider } from "./context/ThemeContext";
import { ThemeToggle } from "./components/ThemeToggle/ThemeToggle";
import type { Theme } from "./theme/themes";
import { Provider } from "react-redux";
import { store } from "./store/store";
import Filters from "./components/Filters/Filters";
import TodoPagination from "./components/TodoPagination/TodoPagination";
import Text from "./components/Text/Text";

const AppContainer = styled.div<{ theme: Theme }>`
  background-color: ${props => props.theme.body};
  color: ${props => props.theme.text};
  min-height: 100vh;
  padding: 20px;
  transition: background-color 0.3s ease, color 0.3s ease;
`;

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppContainer>
          <ThemeToggle />
          <Time />
          <Text variant='h1' mb={4} text='Todo List' />
          <AddTodo />
          <Filters />
          <TodoList />
          <TodoPagination />
        </AppContainer>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
