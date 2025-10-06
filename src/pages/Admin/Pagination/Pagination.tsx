import React, { useState } from 'react'
type PaginationProps = {
  pageIndex: number;
  totalPages: number;
  setPage: React.Dispatch<React.SetStateAction<number>> ;
};
export default function PaginationComponent({ pageIndex, totalPages, setPage }: PaginationProps) {

    const handlePrev = () => {
        if (pageIndex > 1) setPage((pageIndex) => pageIndex - 1);
    };

    const handleNext = () => {
        if (pageIndex < totalPages) setPage((pageIndex) => pageIndex + 1);
    };

    const [inputPage, setInputPage] = useState("");

    const handleGoToPage = () => {
        setPage(Number(inputPage));
    }

    return (
        <div>
            <div className="flex justify-center items-center mt-6 gap-4">
                <button
                    onClick={handlePrev}
                    disabled={pageIndex === 1}
                    className={`px-4 py-2 rounded-md font-medium ${pageIndex === 1
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                >
                    Prev
                </button>

                <span className="text-gray-700">
                    Page <span className="font-semibold">{pageIndex}</span> of{' '}
                    <span className="font-semibold">{totalPages}</span>
                </span>

                

                <button
                    onClick={handleNext}
                    disabled={pageIndex === totalPages}
                    className={`px-4 py-2 rounded-md font-medium ${pageIndex === totalPages
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                >
                    Next
                </button>

                {/* Go to page */}
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        min={1}
                        max={totalPages}
                        placeholder=""
                        value={inputPage}
                        onChange={(e) => setInputPage(e.target.value)}
                        // onKeyDown={handleKeyDown}
                        className="w-20 px-2 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        onClick={handleGoToPage}
                        className="px-3 py-1 bg-orange-400 text-white text-sm rounded hover:bg-orange-500"
                    >
                        Go
                    </button>
                </div>
            </div>
        </div>
    )
}
