import { FaExclamationTriangle } from 'react-icons/fa';

const ConfirmationDialog = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'warning'
}) => {
  if (!isOpen) return null;

  const variants = {
    warning: {
      icon: <FaExclamationTriangle className="text-yellow-400" size={24} />,
      confirmButton: 'bg-yellow-600 hover:bg-yellow-700'
    },
    danger: {
      icon: <FaExclamationTriangle className="text-red-400" size={24} />,
      confirmButton: 'bg-red-600 hover:bg-red-700'
    },
    info: {
      icon: <FaExclamationTriangle className="text-blue-400" size={24} />,
      confirmButton: 'bg-blue-600 hover:bg-blue-700'
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg shadow-xl max-w-md w-full m-4">
        <div className="flex items-start space-x-3 mb-4">
          {variants[variant].icon}
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {title}
            </h3>
            <p className="text-gray-500 mt-1">
              {message}
            </p>
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-md ${variants[variant].confirmButton}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog; 