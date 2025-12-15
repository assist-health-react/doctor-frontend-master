import { FaTimes } from 'react-icons/fa';
import { Section, ObjectField, formatSectionTitle, getInputType } from './CommonComponents';

const RELATIONSHIP_OPTIONS = ['father', 'mother', 'sibling', 'grandparent'];

const ArrayFieldItem = ({ section, item, index, handleInputChange, handleRemoveItem }) => {
  const fields = Object.keys(item).filter(field => field !== '_id');
  
  return (
    <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
      {section === 'allergies' ? (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Medications
            </label>
            <input
              type="text"
              value={item.medications}
              onChange={(e) => handleInputChange(section, 'medications', e.target.value, index)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter medication allergies"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Food
            </label>
            <input
              type="text"
              value={item.food}
              onChange={(e) => handleInputChange(section, 'food', e.target.value, index)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter food allergies"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Other
            </label>
            <input
              type="text"
              value={item.other}
              onChange={(e) => handleInputChange(section, 'other', e.target.value, index)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter other allergies"
            />
          </div>
        </>
      ) : section === 'familyHistory' ? (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Condition
            </label>
            <input
              type="text"
              value={item.condition}
              onChange={(e) => handleInputChange(section, 'condition', e.target.value, index)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter medical condition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Relationship
            </label>
            <select
              value={item.relationship}
              onChange={(e) => handleInputChange(section, 'relationship', e.target.value, index)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select relationship</option>
              {RELATIONSHIP_OPTIONS.map(option => (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
          </div>
          {item.relationship === 'other' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specify Relationship
              </label>
              <input
                type="text"
                value={item.otherRelationship || ''}
                onChange={(e) => handleInputChange(section, 'otherRelationship', e.target.value, index)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Specify the relationship"
              />
            </div>
          )}
        </>
      ) : (
        fields.map((field) => (
          <div key={field} className={field === 'notes' ? 'md:col-span-2 lg:col-span-3' : ''}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {formatSectionTitle(field)}
            </label>
            {field === 'notes' ? (
              <textarea
                value={item[field]}
                onChange={(e) => handleInputChange(section, field, e.target.value, index)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows={2}
                placeholder="Additional notes"
              />
            ) : field === 'diagnosedAt' || field.toLowerCase().includes('date') ? (
              <input
                type="date"
                value={item[field] || ''}
                onChange={(e) => {
                  console.log(`Date changed for ${field}:`, e.target.value);
                  handleInputChange(section, field, e.target.value, index);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            ) : field === 'status' ? (
              <select
                value={item[field]}
                onChange={(e) => handleInputChange(section, field, e.target.value, index)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="active">Active</option>
                <option value="resolved">Resolved</option>
                <option value="inremission">In Remission</option>
                <option value="chronic">Chronic</option>
              </select>
            ) : (
              <input
                type={getInputType(field)}
                value={item[field]}
                onChange={(e) => handleInputChange(section, field, e.target.value, index)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder={`Enter ${formatSectionTitle(field).toLowerCase()}`}
              />
            )}
          </div>
        ))
      )}
      {index > 0 && (
        <button
          type="button"
          onClick={() => handleRemoveItem(section, index)}
          className="absolute -top-2 -right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
        >
          <FaTimes className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

const SectionContent = ({ section, data, handleInputChange, handleRemoveItem }) => {
  if (Array.isArray(data)) {
    return (
      <div className="space-y-4">
        {data.map((item, index) => (
          <ArrayFieldItem
            key={index}
            section={section}
            item={item}
            index={index}
            handleInputChange={handleInputChange}
            handleRemoveItem={handleRemoveItem}
          />
        ))}
      </div>
    );
  }

  if (typeof data === 'object') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(data)
          .filter(([key]) => key !== '_id')
          .map(([key, value]) => (
            <ObjectField
              key={key}
              section={section}
              field={key}
              value={value}
              handleInputChange={handleInputChange}
            />
          ))}
      </div>
    );
  }

  return null;
};

const DynamicSection = ({ section, data, handleInputChange, handleAddItem, handleRemoveItem }) => {
  return (
    <Section
      title={formatSectionTitle(section)}
      onAdd={() => handleAddItem(section)}
      showAddButton={Array.isArray(data)}
    >
      <SectionContent
        section={section}
        data={data}
        handleInputChange={handleInputChange}
        handleRemoveItem={handleRemoveItem}
      />
    </Section>
  );
};

export default DynamicSection; 