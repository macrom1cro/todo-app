class TokenManager {
  private static readonly TOKEN_KEY = "auth_token";
  private static readonly REFRESH_TOKEN_KEY = "refresh_token";

  static setToken(token: string): void {
    try {
      sessionStorage.setItem(this.TOKEN_KEY, token);
    } catch (error) {
      console.warn("sessionStorage not available:", error);
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  static getToken(): string | null {
    return (
      sessionStorage.getItem(this.TOKEN_KEY) ||
      localStorage.getItem(this.TOKEN_KEY)
    );
  }

  static setRefreshToken(token: string): void {
    try {
      sessionStorage.setItem(this.REFRESH_TOKEN_KEY, token);
    } catch (error) {
      console.log(error);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
    }
  }

  static getRefreshToken(): string | null {
    return (
      sessionStorage.getItem(this.REFRESH_TOKEN_KEY) ||
      localStorage.getItem(this.REFRESH_TOKEN_KEY)
    );
  }

  static clearTokens(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  static updateTokens(tokens: { accessToken: string; refreshToken: string }): void {
    this.setToken(tokens.accessToken);
    this.setRefreshToken(tokens.refreshToken);
  }

  static hasValidRefreshToken(): boolean {
    return !!this.getRefreshToken();
  }
}

export default TokenManager;