import axios from "axios";
import TokenManager from "./tokenManager";

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export const refreshAuthToken = async (): Promise<RefreshTokenResponse> => {
  const refreshToken = TokenManager.getRefreshToken();

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await axios.post<RefreshTokenResponse>(
      "http://localhost:3001/auth/refresh",
      { refreshToken },
      {
        timeout: 10000,
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (error) {
    TokenManager.clearTokens();
    throw error;
  }
};
