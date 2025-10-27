import { FilterStatus, SortingStatus } from "../components/Filters/Filters";
import api from "./api";

export const todosApi = {
  getTodos: (
    page: number = 1,
    limit: number = 5,
    filter: FilterStatus = FilterStatus.ALL,
    sorting: SortingStatus = SortingStatus.NEWEST
  ) =>
    api.get("/todos", {
      params: { page, limit, filter, sorting },
    }),
  addTodo: (text: string) => api.post(`/todos`, { text }),
  editTodo: (id: number, text: string) => api.put(`/todos/${id}`, { text }),
  editTodoCompleted: (id: number) => api.patch(`/todos/${id}/toggle`),
  deleteTodo: (id: number) => api.delete(`/todos/${id}`),
};
