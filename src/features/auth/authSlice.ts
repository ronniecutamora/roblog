import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, User } from "../../types";
import { supabase } from "../../lib/supabase";

/**
 * Initial state for the authentication slice.
 * Tracks the current user, global loading status, and any auth-related errors.
 */
const initialState: AuthState = {
    user: null,
    loading: false,
    error: null
}

/**
 * checkAuth Thunk
 * * Runs on app startup to see if a user has a valid session saved in the browser.
 * * Uses Supabase to retrieve the session.
 */
export const checkAuth = createAsyncThunk(
    'auth/checkAuth',
    async (_, { rejectWithValue }) => {
        try {
            const { data:{ session } } = await supabase.auth.getSession();
            if (session?.user){
                return {
                    id: session.user.id,
                    email: session.user.email!,
                };
            }
            return null;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * register Thunk
 * * Creates a new user account in Supabase using email and password.
 * @param {email, password} - User credentials.
 */
export const register = createAsyncThunk(
  'auth/register',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        return {
          id: data.user.id,
          email: data.user.email!,
        };
      }

      throw new Error('Registration failed');
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * login Thunk
 * * Authenticates an existing user with Supabase.
 * @param {email, password} - User credentials.
 */
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        return {
          id: data.user.id,
          email: data.user.email!,
        };
      }

      throw new Error('Login failed');
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * logout Thunk
 * * Ends the Supabase session and signs the user out of the application.
 */
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Auth Slice
 * * Handles the synchronous and asynchronous state updates for authentication.
 */
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        /**
         * Clears the current error message from the state.
         * Useful for removing old error alerts when switching between Login/Register pages.
         */
        clearError: (state) => {
            state.error=null;
        },
    },
    extraReducers: (builder) => {
        /**
         * ASYNC REDUCERS:
         * Each thunk (checkAuth, register, login, logout) has three states:
         * 1. PENDING: Set loading to true and clear old errors.
         * 2. FULFILLED: Request succeeded; update user data and stop loading.
         * 3. REJECTED: Request failed; store the error message and stop loading.
         */
        
        // Check auth
        builder.addCase(checkAuth.pending, (state) => {
            state.loading=true;
        });
        builder.addCase(checkAuth.fulfilled, (state, action: PayloadAction<User | null>) => {
            state.loading = false;
            state.user = action.payload;
        });
        builder.addCase(checkAuth.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Register
        builder.addCase(register.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
            state.loading = false;
            state.user = action.payload;
        });
        builder.addCase(register.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Login
        builder.addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
            state.loading = false;
            state.user = action.payload;
        });
        builder.addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Logout
        builder.addCase(logout.fulfilled, (state) => {
            state.user = null;
            state.loading = false;
            state.error = null;
        });

    }
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;