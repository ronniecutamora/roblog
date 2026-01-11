// ============================================================================
// MAIN ENTRY POINT - This file renders the app
// We wrap the app with <Provider> to give Redux to all components
// ============================================================================

import React from 'react';
import ReactDOM from 'react-dom/client';

// Import Provider from react-redux
// Provider is a React component that makes Redux store available to the app
import { Provider } from 'react-redux';

// Import the store we created
import { store } from './app/store';

// Import our App component
import App from './App';
import ThemeToggle from './components/ThemeToggle';
import Todo from './features/todo/Todo';
import './index.css';

// ============================================================================
// RENDER THE APP
// ============================================================================

/**
 * Render the React app
 * 
 * Structure:
 * <Provider store={store}>   ← Gives Redux to React
 *   <App />                   ← Your app
 * </Provider>
 * 
 * Why Provider?
 * - React doesn't know about Redux by default
 * - Provider uses React Context to inject the store
 * - All child components can now use useSelector and useDispatch
 * 
 * Without Provider:
 * - useSelector would throw error: "could not find store"
 * 
 * With Provider:
 * - Any component can access Redux store!
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Provider makes store available to ALL components inside */}
    <Provider store={store}>
      {/* Your entire app goes inside Provider */}
      <ThemeToggle/>
      <Todo/>
    </Provider>
  </React.StrictMode>
);

// ============================================================================
// SUMMARY:
// Provider wraps your app and gives Redux access to all components
// ============================================================================