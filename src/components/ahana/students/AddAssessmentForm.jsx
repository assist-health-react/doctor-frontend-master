import { useState } from 'react';
import { IoMdClose } from 'react-icons/io';

const AddAssessmentForm = ({ isOpen, onClose, student }) => {
  const [formData, setFormData] = useState({
    type: '',
    date: '',
    notes: '',
    attachments: []
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Add Assessment</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <IoMdClose className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Student Name</label>
            <div className="mt-1 text-sm text-gray-900">{student?.name}</div>
          </div>
          {/* Add your assessment form fields here */}
        </div>
      </div>
    </div>
  );
};

export default AddAssessmentForm; 