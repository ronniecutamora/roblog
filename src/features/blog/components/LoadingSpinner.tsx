interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <svg 
            className="animate-spin h-12 w-12 text-primary-500 mx-auto mb-4" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4" 
              fill="none" 
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
            />
          </svg>
          <p className="text-gray-600 font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
}