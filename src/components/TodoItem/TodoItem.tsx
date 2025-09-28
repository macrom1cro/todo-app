import Button from "@mui/material/Button";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import styled from "styled-components";
import type { Theme } from "../../theme/themes";

const TodoContainer = styled.div<{ theme: Theme }>`
  background-color: ${props => props.theme.todoBackground};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  transition: all 0.3s ease;
`;

export interface ITodoItemProps {
  id: number;
  text: string;
  isDone: boolean;
  date: string;
  onToggleTodo?: (id: number) => void;
  deleteTodo?: (id: number) => void;
  selectTodoIdForEdit?: (id: number) => void;
}

export default function TodoItem({
  id,
  text,
  isDone,
  date,
  onToggleTodo,
  deleteTodo,
  selectTodoIdForEdit,
}: ITodoItemProps) {
  return (
    <TodoContainer>
      <Paper elevation={2} sx={{ p: 1 }}>
        <Box sx={{ width: "100%", mb: 2 }}>
          <Grid
            container
            spacing={2}
            sx={{
              justifyContent: "center",
              alignItems: "center",
              p: 2,
              flexWrap: "nowrap",
            }}
          >
            <Grid>
              <Checkbox
                checked={isDone}
                onChange={() => {
                  onToggleTodo?.(id);
                }}
              />
            </Grid>
            <Grid sx={{ minWidth: 0, overflow: "hidden" }}>
              <Typography
                variant='h6'
                sx={{
                  wordWrap: "break-word",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  textDecoration: () => (isDone ? "line-through" : "none"),
                  whiteSpace: "normal",
                }}
              >
                {text}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                date: {date}
              </Typography>
            </Grid>
            <Grid sx={{ flexShrink: 0 }}>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "nowrap" }}>
                <Button
                  variant='outlined'
                  color='primary'
                  onClick={() => {
                    selectTodoIdForEdit?.(id);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant='outlined'
                  color='error'
                  onClick={() => {
                    deleteTodo?.(id);
                  }}
                >
                  Delete <DeleteForeverIcon />
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </TodoContainer>
  );
}
