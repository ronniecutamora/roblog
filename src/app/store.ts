import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import blogReducer from '../features/blog/blogSlice';
import commentReducer from '../features/comment/commentSlice';
/**
 * Redux Store Configuration
 * * This is the central repository for the application's global state.
 * It combines all individual 'slices' (auth, blog, etc.) into one main 'reducer'.
 */
export const store = configureStore({
  reducer: {
    // Manages user authentication, session data, and login errors
    auth: authReducer,
    // Manages blog posts, loading states for lists, and post creation
    blog: blogReducer,
    // Manages comments from blog posts
    comment: commentReducer,
 
  }
});
/**
 * RootState Type
 * * A TypeScript type that represents the entire shape of the Redux store.
 * Use this in 'useSelector' hooks to get full auto-complete for your state.
 */
export type RootState = ReturnType<typeof store.getState>;
/**
 * AppDispatch Type
 * * The specific type for the store's dispatch function.
 * This is used to type the 'useDispatch' hook, ensuring that 
 * Thunks and Actions are handled correctly by TypeScript.
 */
export type AppDispatch = typeof store.dispatch;
