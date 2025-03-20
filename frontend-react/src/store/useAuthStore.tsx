import { create } from "zustand"
import axios, { AxiosError } from "axios"
const API_URL = "http://localhost:5050/api/v1/auth"

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
})
export const handleApiError = <T extends { message: string }>(
  error: unknown,
  defaultMessage: string = "Error en la solicitud"
): string => {
  let errorMessage: string;

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<T>;
    errorMessage = axiosError.response?.data?.message || defaultMessage;
  } else if (error instanceof Error) {
    errorMessage = error.message || defaultMessage;
  } else {
    errorMessage = defaultMessage;
  }
  return errorMessage;
};

interface AuthStoreType {
  signup: (email: string, password: string, name: string) => Promise<void>
  isCheckingAuth: boolean
  isLoading: boolean
  error: null | string
  user: null | unknown
  isAuthenticated: boolean
  verifyEmail: (code: string) => Promise<unknown>
  checkAuth: () => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}
export const useAuthStore = create<AuthStoreType>((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  signup: async (email: string, password: string, name: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.post(`/signup`, { email, password, name })
      set({ user: response.data.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      const errorMessage = handleApiError(error)
      set({ error: errorMessage, isLoading: false })
    }
  },
  verifyEmail: async (code: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.post(`/verify-email`, { code })
      set({ user: response.data.user, isAuthenticated: true, isLoading: false })
      return response.data
    } catch (error) {
      const errorMessage = handleApiError(error)
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },
  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null })
    try {
      const response = await api.get(`/check-auth`)
      set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      set({ error: null, isCheckingAuth: false, isAuthenticated: false })
    }
  },
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.post(`/login`, { email, password })
      console.log(response)
      set({ user: response.data.user, isAuthenticated: true, isLoading: false, error: null })
    } catch (error) {
      const errorMessage = handleApiError(error)
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },
  logout: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await api.get(`${API_URL}/logout`);
      console.log(response)
			set({ user: null, isAuthenticated: false, error: null, isLoading: false });
		} catch (error) {
      const errorMessage = handleApiError(error)
			set({ error: errorMessage, isLoading: false });
			throw error;
		}
	}
}))