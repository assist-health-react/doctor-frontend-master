import { FaNotesMedical } from 'react-icons/fa';

const EmptyMedicalHistory = ({ onClose }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
    <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
      <FaNotesMedical className="mx-auto text-gray-400 text-6xl mb-4" />
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        No Medical History
      </h3>
      <p className="text-gray-600 mb-6">
        This member doesn't have any medical history records yet.
      </p>
      <button
        onClick={onClose}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Close
      </button>
    </div>
  </div>
);

export default EmptyMedicalHistory; 