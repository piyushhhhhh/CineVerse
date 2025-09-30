
import { Movie } from '@/data/movies';

const API_BASE_URL = 'http://127.0.0.1:5000/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends AuthCredentials {
  name: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  favorites: string[];
}

const getQueryParams = (params) =>
  Object.keys(params)
    .map((key) => {
      if (!Array.isArray(params[key])) {
        return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
      } else {
        const queryString = params[key]
          .map(
            (item) =>
              `${encodeURIComponent(key)}[]=${encodeURIComponent(item)}`,
          )
          .join('&');
        return queryString;
      }
    })
    .join('&');


async function fetchApi<T>(
  endpoint: string,
  method: 'GET' | "POST" = 'GET',
  payload?: unknown,
): Promise<ApiResponse<T>> {
  let url = `${API_BASE_URL}${endpoint}`;

  if(method === 'GET' && !!payload) {
    url += `?${getQueryParams(payload)}`;
  }
  
  try {
    const response = await fetch(url, {
      method: method,
      body: method === 'GET' ? null : JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error(`API error (${endpoint}):`, error);
    const errorMessage = error instanceof Error ? error.message : 'Network error';
    return { success: false, error: errorMessage };
  }
}

// Movies API functions
export const moviesApi = {
  // Get all movies
  getAll: async (): Promise<ApiResponse<Movie[]>> => {
    try {
      const {data} = await fetchApi<Movie[]>("/movies");
      
      return {success: true, data: data};
    } catch (error) {
      console.error('Error fetching movies:', error);
      return { success: false, error: 'Failed to load movies' };
    }
  },
  
  // Get a movie by ID
  getById: async (id: string): Promise<ApiResponse<Movie>> => {
    try {
      const { data } = await fetchApi<Movie>(`/movies/${id}`);
      
      if (!data) {
        return { success: false, error: 'Movie not found' };
      }
      
      return { success: true, data: data };
    } catch (error) {
      return { success: false, error: 'Failed to load movie' };
    }
  },
  
  // Search movies by name
  search: async (query: string): Promise<ApiResponse<Movie[]>> => {
    try {
      const {data} = await fetchApi<Movie[]>(`/movies/search/${query}`);
      return { success: true, data: data };
    } catch (error) {
      return { success: false, error: 'Search failed' };
    }
  },
  
  // Get movies by genre
  getByGenre: async (genre: string): Promise<ApiResponse<Movie[]>> => {
    try {
      const { data } = await fetchApi<Movie[]>(`/movies/genre/${genre}`);
      return { success: true, data: data };
    } catch (error) {
      return { success: false, error: 'Failed to load genre movies' };
    }
  },

  // Get movies by mood
  getByMood: async (mood: string): Promise<ApiResponse<Movie[]>> => {
    try {
      const { data } = await fetchApi<Movie[]>(`/movies/mood/${mood}`);
      return { success: true, data: data };
    } catch (error) {
      return { success: false, error: 'Failed to load mood movies' };
    }
  },

  // Get recommended movies
  getRecommended: async (userId: string, mood?: string): Promise<ApiResponse<Movie[]>> => {
    try {
      const {data} = await fetchApi<Movie[]>(`/movies/recommended/${userId}`);
      return { success: true, data: data };
    } catch (error) {
      return { success: false, error: 'Failed to load recommendations' };
    }
  },

  // Get AI recommendations
  getAiRecommendations: async (movieName: string): Promise<ApiResponse<Movie[]>> => {
    try {
      console.log("debug line 1.......");
      const { data } = await fetchApi<Movie[]>(`/movies/ai/recommendations/${movieName}`);
      return { success: true, data: data };
    } catch (error) {
      return { success: false, error: 'Failed to load AI recommendations' };
    }
  },

  // AI Search by user prompt
  aiSearch: async (prompt: string): Promise<ApiResponse<Movie[]>> => {
    try {
      const { data } = await fetchApi<Movie[]>(`/movies/ai-search`, "POST", { prompt });
      return { success: true, data: data };
    } catch (error) {
      return { success: false, error: 'Failed to load AI search results' };
    }
  }
};

// Authentication API functions
export const authApi = {
  // Login user
  login: async (credentials: AuthCredentials): Promise<ApiResponse<User>> => {
    try {
      const { data } = await fetchApi<User>("/auth/login", "POST", credentials)
      if (!data) {
        return { success: false, error: 'Invalid email or password' };
      }
      return { success: true, data: data };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  },
  
  // Register a new user
  signup: async (userData: SignupCredentials): Promise<ApiResponse<User>> => {
    try {
      const { data } = await fetchApi<User>("/auth/signup", "POST", userData)
      return { success: true, data: data };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    }
  },
  
  // Update user favorites
  updateFavorites: async (userId: string, favorites: string[]): Promise<ApiResponse<User>> => {
    try {
      const { data } = await fetchApi<User>(`/auth/users/${userId}/favorites`, "POST", {
        favorites: favorites
      })
      return { success: true, data: data };
    } catch (error) {
      return { success: false, error: 'Failed to update favorites' };
    }
  }
};
