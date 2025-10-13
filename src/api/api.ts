import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  response => response,
  error => {
    const message = error.response?.data?.message || error.message;
    console.error("API Error:", message);
    
    return Promise.reject({ 
      message, 
      status: error.response?.status,
      code: error.code 
    });
  }
);

export default api;
