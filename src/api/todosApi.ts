import api from "./api";

export const todosApi = {
  getTodos: (
    page: number = 1,
    limit: number = 100,
    filter: "active" | "completed" | "all" = "all"
  ) => api.get(`/todos?page=${page}&limit=${limit}&filter=${filter}`),
  addTodo: (text: string) => api.post(`/todos`, { text }),
  editTodo: (id: number, text: string, completed: boolean) =>
    api.post(`/todos/${id}`, { text, completed }),
  editTodoCompleted: (id: number) => api.post(`/todos/${id}/toggle`),
  deleteTodo: (id: number) => api.delete(`/todos/${id}`),
};

// export const getTodos = async (
//   page: number,
//   limit: number,
//   filter: "active" | "completed" | "all"
// ) => {
//   const response = await axios.get(
//     `${API_URL}/todos?page=${page}&limit=${limit}&filter=${filter}`
//   );
//   return response.data;
// };

// export const addTodo = async (text: string) => {
//   await axios.post(`${API_URL}/todos`, { text });
// };

// export const editTodo = async (
//   id: number,
//   text: string,
//   completed: boolean
// ) => {
//   await axios.post(`${API_URL}/todos/${id}`, { text, completed });
// };

// export const editTodoCompleted = async (id: number) => {
//   await axios.post(`${API_URL}/todos/${id}/toggle`);
// };

// export const deleteTodo = async (id: number) => {
//   await axios.delete(`${API_URL}/todos/${id}`);
// };
