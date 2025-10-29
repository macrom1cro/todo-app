import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setPage } from "../../store/slices/todosSlice";

export default function TodoPagination() {
  const dispatch = useAppDispatch();
  const { totalPages, page, total, todos } = useAppSelector(
    state => state.todos
  );
  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    dispatch(setPage(value));
  };

  const shouldShowPagination = total > 0 && totalPages > 1 && todos.length > 0;

  if (!shouldShowPagination) {
    return null;
  }
  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Pagination
        count={totalPages}
        color='primary'
        variant='outlined'
        shape='rounded'
        size='large'
        page={page}
        onChange={handlePageChange}
      />
    </Box>
  );
}
