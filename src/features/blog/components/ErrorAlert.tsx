
/**
 * Properties for the ErrorAlert component.
 * @property {string} message - The error message text to be displayed to the user.
 * @property {() => void} [onDismiss] - Optional callback function. If provided, an '×' 
 * button will appear, allowing the user to close the alert.
 */
interface ErrorAlertProps {
  message: string;
  onDismiss?: () => void;
}

/**
 * ErrorAlert Component
 * * * A standardized, accessible way to show error feedback across the app.
 * * FEATURES:
 * - High-visibility styling (Red theme) using Tailwind CSS.
 * - Conditional Action: Only shows a close button if a dismiss handler is passed.
 * - Flexbox Layout: Keeps the message on the left and the close button on the right.
 */
export default function ErrorAlert({ message, onDismiss }: ErrorAlertProps) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex justify-between items-center">
      <span>{message}</span>
      {onDismiss && (
        <button 
          onClick={onDismiss}
          className="text-red-700 hover:text-red-900 font-bold"
        >
          ×
        </button>
      )}
    </div>
  );
}