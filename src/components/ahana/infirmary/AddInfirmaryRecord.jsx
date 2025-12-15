import { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { FaPlus, FaTimes } from 'react-icons/fa';
import Select from 'react-select';

const tablets = [
  { value: 'paracetamol', label: 'Paracetamol' },
  { value: 'ibuprofen', label: 'Ibuprofen' },
  { value: 'aspirin', label: 'Aspirin' },
  { value: 'cetirizine', label: 'Cetirizine' },
  { value: 'antacid', label: 'Antacid' },
  { value: 'omeprazole', label: 'Omeprazole' },
  { value: 'ranitidine', label: 'Ranitidine' },
  { value: 'metronidazole', label: 'Metronidazole' },
  { value: 'amoxicillin', label: 'Amoxicillin' },
  { value: 'azithromycin', label: 'Azithromycin' },
  { value: 'loratadine', label: 'Loratadine' },
  { value: 'diphenhydramine', label: 'Diphenhydramine' }
];

const customStyles = {
  menu: (provided) => ({
    ...provided,
    maxHeight: '200px',
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: '200px',
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: '8px'
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1',
      borderRadius: '4px'
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#888',
      borderRadius: '4px'
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: '#555'
    }
  })
};

const AddInfirmaryRecord = ({ isOpen, onClose, student }) => {
  const [records, setRecords] = useState([{
    consentFrom: '',
    consentDate: new Date().toISOString().split('T')[0],
    consentTime: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
    complaints: '',
    otherComplaint: '',
    details: '',
    treatment: '',
    tablet: null,
    quantity: ''
  }]);
  
  if (!isOpen) return null;

  const handleAddMore = () => {
    setRecords([...records, {
      consentFrom: '',
      consentDate: new Date().toISOString().split('T')[0],
      consentTime: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      complaints: '',
      otherComplaint: '',
      details: '',
      treatment: '',
      tablet: null,
      quantity: ''
    }]);
  };

  const handleRemoveRecord = (index) => {
    setRecords(records.filter((_, i) => i !== index));
  };

  const handleInputChange = (index, field, value) => {
    const newRecords = [...records];
    newRecords[index][field] = value;
    setRecords(newRecords);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your submit logic here
    console.log({ student, records });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="px-6 py-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
            <h2 className="text-xl font-semibold text-gray-800">Add Infirmary Record</h2>
            <button 
              type="button" 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700"
            >
              <IoMdClose className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            {/* Student Info Section */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Student ID</label>
                  <p className="text-gray-900 font-medium">{student?.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Student Name</label>
                  <p className="text-gray-900 font-medium">{student?.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Class & Section</label>
                  <p className="text-gray-900 font-medium">{student?.class} - {student?.section}</p>
                </div>
              </div>
            </div>

            {/* Records Section */}
            <div className="space-y-4">
              {records.map((record, index) => (
                <div key={index} className="relative bg-gray-50 rounded-lg p-4 border">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Consent From *
                      </label>
                      <select
                        value={record.consentFrom}
                        onChange={(e) => handleInputChange(index, 'consentFrom', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select Consent From</option>
                        <option value="Parent">Parent</option>
                        <option value="Guardian">Guardian</option>
                        <option value="Teacher">Teacher</option>
                        <option value="School Authority">School Authority</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Consent Date *
                      </label>
                      <input
                        type="date"
                        value={record.consentDate}
                        onChange={(e) => handleInputChange(index, 'consentDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Consent Time *
                      </label>
                      <input
                        type="time"
                        value={record.consentTime}
                        onChange={(e) => handleInputChange(index, 'consentTime', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Complaints *
                      </label>
                      <select
                        value={record.complaints}
                        onChange={(e) => handleInputChange(index, 'complaints', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select Complaint</option>
                        <option value="Fever">Fever</option>
                        <option value="Headache">Headache</option>
                        <option value="Stomach Pain">Stomach Pain</option>
                        <option value="Injury">Injury</option>
                        <option value="Others">Others</option>
                      </select>
                      {record.complaints === 'Others' && (
                        <input
                          type="text"
                          value={record.otherComplaint}
                          onChange={(e) => handleInputChange(index, 'otherComplaint', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Specify complaint"
                          required
                        />
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Details *
                      </label>
                      <input
                        type="text"
                        value={record.details}
                        onChange={(e) => handleInputChange(index, 'details', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter details"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Treatment *
                      </label>
                      <input
                        type="text"
                        value={record.treatment}
                        onChange={(e) => handleInputChange(index, 'treatment', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter treatment"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tablets
                      </label>
                      <Select
                        value={record.tablet}
                        onChange={(value) => handleInputChange(index, 'tablet', value)}
                        options={tablets}
                        className="w-full"
                        placeholder="Search tablets..."
                        isClearable
                        styles={customStyles}
                        maxMenuHeight={200}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity
                      </label>
                      <input
                        type="text"
                        value={record.quantity}
                        onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter quantity (e.g., 1 tablet)"
                      />
                    </div>
                  </div>

                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveRecord(index)}
                      className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200"
                      title="Remove"
                    >
                      <FaTimes className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add More Button */}
            <button
              type="button"
              onClick={handleAddMore}
              className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center w-full"
            >
              <FaPlus className="mr-2" /> Add More Records
            </button>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t flex justify-end gap-4 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInfirmaryRecord; 