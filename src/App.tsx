// ============================================================================
// COUNTER COMPONENT - Uses Redux to display and update counter
// ============================================================================

// Import React hooks from react-redux
import { useSelector, useDispatch } from 'react-redux';

// Import TypeScript type for state - NOTE: import type
import type { RootState } from './app/store';  // ← TYPE IMPORT

// Import action creators
import { 
  increment, 
  decrement, 
  incrementByAmount, 
  reset,
  setValue 
} from './features/counter/counterSlice';


// Import useState for the input field
import { useState } from 'react';

function App() {
  
  // ==========================================================================
  // READING FROM REDUX STORE - useSelector
  // ==========================================================================
  
  /**
   * useSelector - READ data from Redux store
   * 
   * How it works:
   * 1. Takes a function (called selector)
   * 2. Selector receives full Redux state
   * 3. Selector returns the piece of state you want
   * 4. Component re-renders when that piece changes
   * 
   * Syntax: useSelector((state: RootState) => state.sliceName.property)
   * 
   * Example state in store:
   * {
   *   counter: { value: 5 }
   * }
   * 
   * Selector function:
   * (state: RootState) => state.counter.value
   *  ^^^^                 ^^^^^^^^^^^^^^^^^^
   *  Full state           Return just the value
   * 
   * Result: count = 5
   */
  const count = useSelector((state: RootState) => state.counter.value);
  
  // ==========================================================================
  // WRITING TO REDUX STORE - useDispatch
  // ==========================================================================
  
  /**
   * useDispatch - SEND actions to Redux store
   * 
   * Returns the dispatch function
   * Use dispatch to send actions: dispatch(actionCreator())
   * 
   * Example:
   * dispatch(increment())  → sends { type: 'counter/increment' }
   * dispatch(reset())      → sends { type: 'counter/reset' }
   * dispatch(incrementByAmount(10)) → sends { type: 'counter/incrementByAmount', payload: 10 }
   */
  const dispatch = useDispatch();
  
  // ==========================================================================
  // LOCAL STATE FOR INPUT FIELD
  // ==========================================================================
  
  /**
   * Local React state for the input field
   * This is NOT Redux state - just local to this component
   * Used to control the input value before dispatching to Redux
   */
  const [inputValue, setInputValue] = useState<string>('');
  
  // ==========================================================================
  // EVENT HANDLERS
  // ==========================================================================
  
  /**
   * Handle custom increment
   * Takes value from input field and increments by that amount
   */
  const handleCustomIncrement = () => {
    // Convert string input to number
    const amount = parseInt(inputValue);
    
    // Check if it's a valid number
    if (!isNaN(amount)) {
      // Dispatch action with the amount
      dispatch(incrementByAmount(amount));
      
      // Clear input field
      setInputValue('');
    }
  };
  
  /**
   * Handle set value
   * Sets counter to a specific value from input
   */
  const handleSetValue = () => {
    const value = parseInt(inputValue);
    
    if (!isNaN(value)) {
      dispatch(setValue(value));
      setInputValue('');
    }
  };
  
  // ==========================================================================
  // RENDER UI
  // ==========================================================================
  
  return (
    <div style={{ 
      padding: '2rem', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      
      {/* HEADER */}
      <h1 style={{ textAlign: 'center', color: '#2c5aa0' }}>
        Redux Counter Example
      </h1>
      
      {/* DISPLAY CURRENT COUNT */}
      <div style={{
        fontSize: '4rem',
        fontWeight: 'bold',
        textAlign: 'center',
        margin: '2rem 0',
        color: count >= 0 ? '#27ae60' : '#e74c3c'
      }}>
        {count}
      </div>
      
      {/* BASIC BUTTONS */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        
        {/* 
          INCREMENT BUTTON
          Calls: dispatch(increment())
          Action sent: { type: 'counter/increment' }
          Reducer runs: state.value += 1
        */}
        <button 
          onClick={() => dispatch(increment())}
          style={{
            padding: '1rem 2rem',
            fontSize: '1rem',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          + Increment
        </button>
        
        {/* 
          DECREMENT BUTTON
          Calls: dispatch(decrement())
          Action sent: { type: 'counter/decrement' }
          Reducer runs: state.value -= 1
        */}
        <button 
          onClick={() => dispatch(decrement())}
          style={{
            padding: '1rem 2rem',
            fontSize: '1rem',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          - Decrement
        </button>
        
        {/* 
          INCREMENT BY 5 BUTTON
          Calls: dispatch(incrementByAmount(5))
          Action sent: { type: 'counter/incrementByAmount', payload: 5 }
          Reducer runs: state.value += action.payload (which is 5)
        */}
        <button 
          onClick={() => dispatch(incrementByAmount(5))}
          style={{
            padding: '1rem 2rem',
            fontSize: '1rem',
            backgroundColor: '#9b59b6',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          + Add 5
        </button>
        
        {/* 
          RESET BUTTON
          Calls: dispatch(reset())
          Action sent: { type: 'counter/reset' }
          Reducer runs: state.value = 0
        */}
        <button 
          onClick={() => dispatch(reset())}
          style={{
            padding: '1rem 2rem',
            fontSize: '1rem',
            backgroundColor: '#95a5a6',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          🔄 Reset
        </button>
      </div>
      
      {/* CUSTOM INPUT SECTION */}
      <div style={{
        border: '2px solid #ecf0f1',
        borderRadius: '10px',
        padding: '1.5rem',
        backgroundColor: '#f8f9fa'
      }}>
        <h3 style={{ marginTop: 0 }}>Custom Operations</h3>
        
        <div style={{ marginBottom: '1rem' }}>
          {/* 
            INPUT FIELD
            This is local React state (NOT Redux)
            Controlled input: value and onChange
          */}
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter a number..."
            style={{
              padding: '0.75rem',
              fontSize: '1rem',
              width: '100%',
              border: '2px solid #bdc3c7',
              borderRadius: '5px',
              boxSizing: 'border-box'
            }}
          />
        </div>
        
        <div style={{ 
          display: 'flex', 
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          {/* 
            INCREMENT BY CUSTOM AMOUNT
            Gets value from input, converts to number, dispatches action
          */}
          <button 
            onClick={handleCustomIncrement}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              backgroundColor: '#16a085',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              flex: 1
            }}
          >
            ➕ Add This Amount
          </button>
          
          {/* 
            SET TO CUSTOM VALUE
            Gets value from input, sets counter to that exact value
          */}
          <button 
            onClick={handleSetValue}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              backgroundColor: '#f39c12',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              flex: 1
            }}
          >
            = Set To This Value
          </button>
        </div>
      </div>
      
      {/* INFO SECTION */}
      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#e8f5e9',
        borderRadius: '5px',
        fontSize: '0.9rem'
      }}>
        <strong>How it works:</strong>
        <ul style={{ margin: '0.5rem 0' }}>
          <li>Click buttons to dispatch actions to Redux</li>
          <li>Redux reducer updates the store</li>
          <li>Component re-renders with new value</li>
          <li>Current count is read from Redux store via useSelector</li>
        </ul>
      </div>
    </div>
  );
}

export default App;

// ============================================================================
// SUMMARY OF COMPONENT:
// 
// 1. useSelector - Read count from Redux store
// 2. useDispatch - Get dispatch function to send actions
// 3. Buttons dispatch different actions:
//    - increment() → adds 1
//    - decrement() → subtracts 1
//    - incrementByAmount(5) → adds 5
//    - reset() → sets to 0
//    - setValue(value) → sets to specific value
// 4. Component re-renders automatically when count changes in Redux
// 
// Redux Flow:
// Button Click → dispatch(action) → Reducer runs → State updates → Component re-renders
// ============================================================================