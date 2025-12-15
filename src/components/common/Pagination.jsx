import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-1 mx-1 rounded-md ${
            currentPage === i
              ? 'bg-blue-500 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-md ${
          currentPage === 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <FaChevronLeft className="w-4 h-4" />
      </button>
      {renderPageNumbers()}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-md ${
          currentPage === totalPages
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <FaChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}; 