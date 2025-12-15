import React from 'react'
import { FaTimes } from 'react-icons/fa'

export const Modal = ({ title, children, onClose, actions }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <div className="flex items-center gap-2">
              {actions}
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-500"
              >
                <FaTimes size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-full">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const ConfirmationModal = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onCancel}></div>
        
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md">
          <div className="px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500">{message}</p>
          </div>
          
          <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 rounded-b-lg">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal 