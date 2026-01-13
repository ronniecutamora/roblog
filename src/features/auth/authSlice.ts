import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, User } from "../../types";
import { supabase } from "../../lib/supabase";

const initialState: AuthState = {
    user: null,
    loading: false,
    error: null
}

//check if user is already logged in
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

// Register new user
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

// Login user
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

// Logout user
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

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error=null;
        },
    },
    extraReducers: (builder) => {
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