import { Link } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import {
  Container,
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
} from "@mui/material";
import TodoList from "../../components/TodoList/TodoList";
import AddTodo from "../../components/AddTodo/AddTodo";
import Filters from "../../components/Filters/Filters";
import TodoPagination from "../../components/TodoPagination/TodoPagination";

function HomePage() {
  const { user } = useAppSelector(state => state.auth);

  return (
    <>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            Todo App
          </Typography>
          <Typography variant='body1' sx={{ mr: 2 }}>
            {user?.email}
          </Typography>
          <Button color='inherit' component={Link} to='/profile'>
            Profile
          </Button>
        </Toolbar>
      </AppBar>

      <Container>
        <Box sx={{ marginTop: 4 }}>
          <Typography variant='h4' gutterBottom align='center'>
            My Tasks
          </Typography>

          <AddTodo />
          <Filters />
          <TodoList />
          <TodoPagination />
        </Box>
      </Container>
    </>
  );
}

export default HomePage;
