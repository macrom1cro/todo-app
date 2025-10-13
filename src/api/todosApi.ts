import api from "./api";

export const todosApi = {
  getTodos: (
    page: number = 1,
    limit: number = 5,
    filter: "active" | "completed" | "all" = "all",
    sorting: "newest" | "oldest" = "newest"
  ) =>
    api.get("/todos", {
      params: { page, limit, filter, sorting }
    }),
  addTodo: (text: string) => api.post(`/todos`, { text }),
  editTodo: (id: number, text: string) =>
    api.put(`/todos/${id}`, { text}),
  editTodoCompleted: (id: number) => api.patch(`/todos/${id}/toggle`),
  deleteTodo: (id: number) => api.delete(`/todos/${id}`),
};
