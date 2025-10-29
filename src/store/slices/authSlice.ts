import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import api from "../../api/api";
import { isAxiosError } from "axios";
import TokenManager from "../../utils/tokenManager";

interface User {
  id: number;
  email: string;
  age?: number;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  status: "idle" | "loading" | "failed";
  error: string | null;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  age?: number;
}

interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  refreshToken: localStorage.getItem("refreshToken"),
  status: "idle",
  error: null,
};

interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      const response = await api.post<{
        accessToken: string;
        refreshToken: string;
      }>("/auth/register", userData);
      const { accessToken, refreshToken } = response.data;

      TokenManager.setToken(accessToken);
      TokenManager.setRefreshToken(refreshToken);

      return { token: accessToken, refreshToken };
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || "Registration failed");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: LoginData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", credentials);
      const { accessToken, refreshToken } = response.data;

      TokenManager.setToken(accessToken);
      TokenManager.setRefreshToken(refreshToken);

      return { token: accessToken, refreshToken };
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.error || "Login failed");
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Login failed");
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error || "Failed to fetch profile"
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch profile");
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (passwords: ChangePasswordData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/change-password", passwords);
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error || "Password change failed"
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Password change failed");
    }
  }
);

export const initializeAuth = createAsyncThunk(
  "auth/initialize",
  async (_, { dispatch }) => {
    const token = TokenManager.getToken();
    if (token) {
      try {
        await dispatch(fetchUserProfile()).unwrap();
      } catch (error) {
        TokenManager.clearTokens();
        throw error;
      }
    }
    return { token };
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: state => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.error = null;
      TokenManager.clearTokens();
    },
    clearError: state => {
      state.error = null;
    },
    setTokens: (
      state,
      action: PayloadAction<{ token: string; refreshToken: string }>
    ) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      TokenManager.setToken(action.payload.token);
      TokenManager.setRefreshToken(action.payload.refreshToken);
    },
    updateTokens: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) => {
      state.token = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      TokenManager.updateTokens(action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(registerUser.pending, state => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "idle";
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, state => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "idle";
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchUserProfile.pending, state => {
        state.status = "loading";
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = "idle";
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(changePassword.pending, state => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(changePassword.fulfilled, state => {
        state.status = "idle";
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(initializeAuth.pending, state => {
        state.status = "loading";
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.status = "idle";
        state.token = action.payload.token;
      })
      .addCase(initializeAuth.rejected, state => {
        state.status = "failed";
        state.token = null;
        state.refreshToken = null;
        state.user = null;
      });
  },
});

export const { logout, clearError, setTokens } = authSlice.actions;
export default authSlice.reducer;
