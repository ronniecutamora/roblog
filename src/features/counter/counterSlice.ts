// ============================================================================
// COUNTER SLICE - This file defines:
// 1. The shape of counter state (what data it holds)
// 2. The initial/starting state
// 3. How to update the state (reducers/actions)
// ============================================================================

// Import Redux Toolkit functions
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';  // ← TYPE IMPORT

// ============================================================================
// STEP 1: DEFINE THE STATE SHAPE
// ============================================================================

interface CounterState {
  value: number;
}

// ... rest of the file stays the same

// ============================================================================
// STEP 2: SET INITIAL STATE
// ============================================================================

/**
 * Initial state - what the counter looks like when app first loads
 * This is like setting default values
 */
const initialState: CounterState = {
  value: 0  // Start counting from zero
};

// ============================================================================
// STEP 3: CREATE THE SLICE
// ============================================================================

/**
 * createSlice is a Redux Toolkit function that creates:
 * - Action creators (functions to create actions)
 * - Reducer (function that updates state)
 * 
 * Think of a "slice" as ONE piece of your app's state
 * For example: counter slice, user slice, posts slice, etc.
 */
const counterSlice = createSlice({
  
  // -------------------------------------------------------------------------
  // NAME: Identifies this slice (used internally by Redux)
  // -------------------------------------------------------------------------
  name: 'counter',  // Can be any string, but keep it descriptive
  
  // -------------------------------------------------------------------------
  // INITIAL STATE: Starting data
  // -------------------------------------------------------------------------
  initialState,  // Shorthand for: initialState: initialState
  
  // -------------------------------------------------------------------------
  // REDUCERS: Functions that describe HOW to update state
  // -------------------------------------------------------------------------
  reducers: {
    
    /**
     * INCREMENT ACTION
     * Increases counter by 1
     * 
     * @param state - Current state (auto-provided by Redux)
     *                Example: { value: 5 }
     * 
     * How it works:
     * - Redux calls this function when you dispatch increment()
     * - You "mutate" state (thanks to Immer library, it's safe!)
     * - Behind scenes, Redux creates a NEW state object
     */
    increment: (state) => {
      // This looks like mutation, but Immer makes it immutable!
      state.value += 1;
      
      // Example flow:
      // Before: state = { value: 5 }
      // After:  state = { value: 6 }
    },
    
    /**
     * DECREMENT ACTION
     * Decreases counter by 1
     * 
     * @param state - Current state
     */
    decrement: (state) => {
      state.value -= 1;
      
      // Example flow:
      // Before: state = { value: 5 }
      // After:  state = { value: 4 }
    },
    
    /**
     * INCREMENT BY AMOUNT ACTION
     * Increases counter by a specific amount
     * 
     * @param state - Current state
     * @param action - Action object containing the data (payload)
     *                 Example: { type: 'counter/incrementByAmount', payload: 10 }
     * 
     * PayloadAction<number> means:
     * - This action carries extra data (the amount to add)
     * - The data type is a number
     * - Access it via: action.payload
     */
    incrementByAmount: (state, action: PayloadAction<number>) => {
      // action.payload = the number you passed when dispatching
      // Example: dispatch(incrementByAmount(10)) → action.payload = 10
      state.value += action.payload;
      
      // Example flow:
      // Before: state = { value: 5 }, action.payload = 10
      // After:  state = { value: 15 }
    },
    
    /**
     * RESET ACTION
     * Sets counter back to zero
     * 
     * @param state - Current state
     */
    reset: (state) => {
      state.value = 0;
      
      // Example flow:
      // Before: state = { value: 99 }
      // After:  state = { value: 0 }
    },
    
    /**
     * SET VALUE ACTION
     * Sets counter to a specific value
     * 
     * @param state - Current state
     * @param action - Action with payload (the new value)
     */
    setValue: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
      
      // Example flow:
      // Before: state = { value: 5 }, action.payload = 100
      // After:  state = { value: 100 }
    }
  }
});

// ============================================================================
// STEP 4: EXPORT ACTION CREATORS
// ============================================================================

/**
 * Export action creators
 * These are auto-generated functions by Redux Toolkit
 * 
 * What Redux Toolkit creates for you:
 * 
 * increment = () => ({ type: 'counter/increment' })
 * decrement = () => ({ type: 'counter/decrement' })
 * incrementByAmount = (amount: number) => ({ 
 *   type: 'counter/incrementByAmount', 
 *   payload: amount 
 * })
 * reset = () => ({ type: 'counter/reset' })
 * setValue = (value: number) => ({
 *   type: 'counter/setValue',
 *   payload: value
 * })
 * 
 * You just call them: dispatch(increment())
 */
export const { 
  increment, 
  decrement, 
  incrementByAmount, 
  reset,
  setValue 
} = counterSlice.actions;

// ============================================================================
// STEP 5: EXPORT REDUCER
// ============================================================================

/**
 * Export the reducer
 * This is the function Redux calls to update state
 * We'll add this to the store in store.ts
 * 
 * This is a default export (only one per file)
 */
export default counterSlice.reducer;

// ============================================================================
// SUMMARY OF THIS FILE:
// 
// 1. Defined state shape: { value: number }
// 2. Set initial state: { value: 0 }
// 3. Created 5 actions: increment, decrement, incrementByAmount, reset, setValue
// 4. Exported action creators (to use in components)
// 5. Exported reducer (to add to store)
// ============================================================================