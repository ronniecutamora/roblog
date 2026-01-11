// ============================================================================
// REDUX STORE - This file creates the Redux store
// The store is the central place where ALL app state lives
// Think of it as a database for your React app
// ============================================================================

// Import configureStore from Redux Toolkit
import { configureStore } from '@reduxjs/toolkit';

// Import the counter reducer we created
import counterReducer from '../features/counter/counterSlice';
import themeReducer from '../features/theme/themeSlice';
import todoReducer from '../features/todo/todoSlice';

// ============================================================================
// CREATE THE STORE
// ============================================================================

/**
 * configureStore creates the Redux store
 * 
 * The store holds the entire state tree of your app
 * Only ONE store should exist in your app
 * 
 * Configuration object has a 'reducer' key which maps:
 * slice name → reducer function
 */
export const store = configureStore({
  // The 'reducer' object defines your state structure
  reducer: {
    
    /**
     * Key 'counter' = slice name in state
     * Value counterReducer = the reducer function
     * 
     * This means your state will look like:
     * {
     *   counter: {
     *     value: 0
     *   }
     * }
     * 
     * To access counter value: state.counter.value
     */
    counter: counterReducer,
    theme: themeReducer,
    todo: todoReducer
    
    // If you had more slices, you'd add them here:
    // user: userReducer,
    // posts: postsReducer,
    // 
    // State would be:
    // {
    //   counter: { value: 0 },
    //   user: { name: '', email: '' },
    //   posts: { items: [] }
    // }
  }
});

// ============================================================================
// TYPESCRIPT TYPES FOR BETTER AUTOCOMPLETE
// ============================================================================

/**
 * RootState type
 * 
 * This extracts the TypeScript type of the entire state tree
 * Used in components for type-safe state access
 * 
 * How it works:
 * 1. store.getState is a function that returns current state
 * 2. typeof store.getState gets the TYPE of that function
 * 3. ReturnType<...> extracts what the function returns
 * 
 * Result: RootState = {
 *   counter: { value: number }
 * }
 * 
 * Why do this?
 * - TypeScript autocomplete in VS Code
 * - Catches typos: state.conter.value → error!
 * - Shows available properties when you type state.
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * AppDispatch type
 * 
 * This is the type of the dispatch function
 * Used for type-safe dispatching in components
 * 
 * Why do this?
 * - Ensures you dispatch valid actions
 * - TypeScript checks action types
 */
export type AppDispatch = typeof store.dispatch;

// ============================================================================
// SUMMARY OF THIS FILE:
// 
// 1. Created the Redux store
// 2. Added counter reducer to the store
// 3. Exported TypeScript types for type safety
// 
// State structure:
// {
//   counter: {
//     value: 0
//   }
// }
// ============================================================================