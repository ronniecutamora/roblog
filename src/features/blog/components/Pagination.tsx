/**
 * Properties for the Pagination component.
 * @property {number} currentPage - The index of the page currently being viewed.
 * @property {number} totalPages - The total count of available pages based on data volume.
 * @property {(page: number) => void} onPageChange - Callback function triggered when a user selects a different page.
 */

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * Pagination Component
 * * * Provides a user interface for navigating through multi-page lists.
 * * FEATURES:
 * - Smart Hiding: Returns 'null' if there is only one page, keeping the UI clean.
 * - Dynamic Button Mapping: Automatically generates numbered buttons based on the 'totalPages' count.
 * - Boundary Protection: Disables 'Previous' on the first page and 'Next' on the last page.
 * - Active State Styling: Highlights the current page number so the user never feels lost.
 */
export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    /**
   * GUARD CLAUSE:
   * If there is only one page of content, pagination is unnecessary. 
   * Returning null removes it from the DOM entirely.
   */
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center gap-2 flex-wrap">
      {/* PREVIOUS BUTTON:
          Decrements the current page. Disabled if we are already at the start.
      */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      {/* PAGE NUMBERS:
          1. [...Array(totalPages)] creates a temporary array of a specific length.
          2. .map() loops through that array to create a button for every page number.
      */}
      {[...Array(totalPages)].map((_, index) => {
        const pageNumber = index + 1;
        return (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentPage === pageNumber
                ? 'bg-primary-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {pageNumber}
          </button>
        );
      })}
      {/* NEXT BUTTON:
          Increments the current page. Disabled if we are at the end of the list.
      */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}