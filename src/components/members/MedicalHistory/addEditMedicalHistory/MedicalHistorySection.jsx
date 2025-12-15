import { FaNotesMedical, FaPlus, FaTimes } from 'react-icons/fa';

const MedicalHistorySection = ({ data, handleInputChange, handleAddItem, handleRemoveItem }) => {
  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="px-4 py-3 border-b bg-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
          <FaNotesMedical className="text-blue-500" />
          Medical History
        </h3>
        <button
          type="button"
          onClick={() => handleAddItem('medicalHistory')}
          className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          <FaPlus className="w-4 h-4" /> Add Condition
        </button>
      </div>
      <div className="p-4">
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Condition *
                </label>
                <input
                  type="text"
                  value={item.condition}
                  onChange={(e) => handleInputChange('medicalHistory', 'condition', e.target.value, index)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter condition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Diagnosis Date *
                </label>
                <input
                  type="date"
                  value={item.diagnosisDate}
                  onChange={(e) => handleInputChange('medicalHistory', 'diagnosisDate', e.target.value, index)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  value={item.status}
                  onChange={(e) => handleInputChange('medicalHistory', 'status', e.target.value, index)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="active">Active</option>
                  <option value="resolved">Resolved</option>
                  <option value="chronic">Chronic</option>
                  <option value="remission">In Remission</option>
                </select>
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Treatment
                </label>
                <input
                  type="text"
                  value={item.treatment}
                  onChange={(e) => handleInputChange('medicalHistory', 'treatment', e.target.value, index)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter treatment details"
                />
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={item.notes}
                  onChange={(e) => handleInputChange('medicalHistory', 'notes', e.target.value, index)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Additional notes"
                  rows={2}
                />
              </div>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => handleRemoveItem('medicalHistory', index)}
                  className="absolute -top-2 -right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MedicalHistorySection; 