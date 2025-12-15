import { FaPlus, FaTimes, FaUpload, FaSpinner } from 'react-icons/fa';

// Define consistent styles
export const sectionStyles = {
  wrapper: "bg-white rounded-lg border shadow-sm mb-6",
  header: "p-4 border-b bg-gray-50 flex justify-between items-center",
  headerTitle: "flex items-center space-x-2",
  icon: "text-blue-500 text-xl",
  title: "text-lg font-medium text-gray-900",
  addButton: "inline-flex items-center px-3 py-1.5 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors",
  content: "p-4 space-y-4",
  inputWrapper: "flex flex-col",
  label: "text-sm font-medium text-gray-700 mb-1",
  input: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors",
  select: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors",
  textarea: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors",
  deleteButton: "absolute -top-2 -right-2 bg-red-100 rounded-full p-1.5 text-red-500 hover:bg-red-200 hover:text-red-600 transition-colors",
  itemWrapper: "bg-white border rounded-lg p-4 relative hover:shadow-md transition-shadow",
};

export const Section = ({ title, children, onAdd, showAddButton }) => (
  <div className="bg-white rounded-lg border shadow-sm">
    <div className="px-4 py-3 border-b bg-gray-50 flex justify-between items-center">
      <h3 className="text-lg font-medium text-gray-800">{title}</h3>
      {showAddButton && (
        <button
          type="button"
          onClick={onAdd}
          className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          <FaPlus className="w-4 h-4" /> Add
        </button>
      )}
    </div>
    <div className="p-4">{children}</div>
  </div>
);

export const DetailField = ({ label, value }) => (
  <div>
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <div className="mt-1 p-2 bg-gray-50 rounded-md text-gray-900">{value || '-'}</div>
  </div>
);

export const ObjectField = ({ section, field, value, handleInputChange }) => {
  // Skip rendering if field is _id
  if (field === '_id') return null;

  if (section === 'lifestyleHabits') {
    const options = {
      smoking: ['never', 'occasional', 'daily'],
      alcoholConsumption: ['never', 'occasional', 'daily'],
      exercise: ['never', 'occasional', 'daily']
    };

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {formatSectionTitle(field)}
        </label>
        <select
          value={value}
          onChange={(e) => handleInputChange(section, field, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select {formatSectionTitle(field)}</option>
          {options[field]?.map(option => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (section === 'healthInsurance' && field === 'expiryDate') {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Insurance Expiry Date
        </label>
        <input
          type="date"
          value={value}
          onChange={(e) => handleInputChange(section, field, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {formatSectionTitle(field)}
      </label>
      {typeof value === 'boolean' ? (
        <select
          value={value.toString()}
          onChange={(e) => handleInputChange(section, field, e.target.value === 'true')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => handleInputChange(section, field, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder={`Enter ${formatSectionTitle(field).toLowerCase()}`}
        />
      )}
    </div>
  );
};

export const formatSectionTitle = (section) => {
  return section
    .split(/(?=[A-Z])/)
    .join(' ')
    .replace(/^\w/, (c) => c.toUpperCase());
};

export const getInputType = (field) => {
  // Check for various date field names
  if (field === 'diagnosedAt' || 
      field.toLowerCase().includes('date') || 
      field === 'dateReceived') {
    return 'date';
  }
  return 'text';
};

export const UploadSection = ({ title, onFileSelect, onTitleChange, onRemove, error, isUploading, localFile }) => {
  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter document title"
            required
          />
        </div>
        
        <div className="flex items-center gap-4">
          <label className="flex-1">
            <div className="flex items-center justify-center px-4 py-2 border border-gray-300 border-dashed rounded-md cursor-pointer hover:bg-gray-50">
              {isUploading ? (
                <>
                  <FaSpinner className="w-5 h-5 text-gray-400 mr-2 animate-spin" />
                  <span className="text-sm text-gray-600">Uploading...</span>
                </>
              ) : (
                <>
                  <FaUpload className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{localFile ? localFile.name : 'Choose file'}</span>
                </>
              )}
              <input
                type="file"
                className="hidden"
                onChange={(e) => onFileSelect(e.target.files[0])}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                disabled={isUploading}
              />
            </div>
          </label>
          {onRemove && !isUploading && (
            <button
              type="button"
              onClick={onRemove}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
}; 