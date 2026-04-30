export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'User' | 'Host' | 'Admin';
    profession: string;
    phone: string;
    refId: string;
    emailVerified: boolean;
    phoneVerified: boolean;
  };
}

export interface RegisterRequest {
  email: string;
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'User' | 'Host' | 'Admin';
  profession?: string;
}

export interface GoogleAuthRequest {
  idToken: string;
}

class AuthService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://skills-k6pv.onrender.com';

  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      console.log('🔐 Login API call to:', `${this.baseUrl}/api/auth/login`);

      const response = await fetch(`${this.baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('❌ Login error:', error);
        throw new Error(error.message || 'Login failed');
      }

      const result = await response.json();
      console.log('✅ Login successful');

      return result;
    } catch (error) {
      console.error('❌ Login service error:', error);
      throw error;
    }
  }

  async register(data: RegisterRequest): Promise<{ message: string }> {
    try {
      console.log('📝 Register API call to:', `${this.baseUrl}/api/auth/register`);

      const response = await fetch(`${this.baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('❌ Registration error:', error);
        throw new Error(error.message || 'Registration failed');
      }

      const result = await response.json();
      console.log('✅ Registration successful');

      return result;
    } catch (error) {
      console.error('❌ Registration service error:', error);
      throw error;
    }
  }

  async googleAuth(data: GoogleAuthRequest): Promise<LoginResponse> {
    try {
      console.log('🔐 Google Auth API call to:', `${this.baseUrl}/api/auth/google`);

      const response = await fetch(`${this.baseUrl}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('❌ Google auth error:', error);
        throw new Error(error.message || 'Google authentication failed');
      }

      const result = await response.json();
      console.log('✅ Google authentication successful');

      return result;
    } catch (error) {
      console.error('❌ Google auth service error:', error);
      throw error;
    }
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send reset email');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async verifyResetToken(token: string): Promise<{ message: string; token: string }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/auth/verify-reset-password-token?token=${token}`,
        { method: 'GET' }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Invalid or expired reset token');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(token: string, password: string, confirmPassword: string): Promise<{ message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ password, confirmPassword }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to reset password');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  clearToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  }

  getAuthHeader(): { Authorization: string } | {} {
    const token = this.getToken();
    if (!token) return {};
    return {
      Authorization: `Bearer ${token}`,
    };
  }
}

export const authService = new AuthService();
