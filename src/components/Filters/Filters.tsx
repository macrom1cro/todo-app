import Stack from "@mui/material/Stack";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { setFilter, setLimit, setSortOrder } from "../../store/slices/todosSlice";

export default function Filters () {
  const dispatch = useAppDispatch();
  const { limit, sortOrder, filter, total: allTodos,} = useAppSelector(state => state.todos);
  
  return (
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={3}
        sx={{ mb: 3, justifyContent: "space-between", alignItems: "center" }}
      >
        <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
          <Typography
            variant='h6'
            sx={{ textAlign: "center", mb: 2, color: "inherit" }}
          >
            All Task: {allTodos}
          </Typography>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Show on page</InputLabel>
            <Select
              value={limit}
              onChange={e => dispatch(setLimit(Number(e.target.value)))}
              label='ShowOnPage'
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Sorting</InputLabel>
            <Select
              value={sortOrder}
              onChange={e =>
                dispatch(setSortOrder(e.target.value as "newest" | "oldest"))
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
                dispatch(
                  setFilter(e.target.value as "all" | "completed" | "active")
                )
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
  );
};