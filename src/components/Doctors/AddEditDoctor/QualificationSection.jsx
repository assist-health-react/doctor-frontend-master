import { languageOptions } from '../utils';
import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const QualificationSection = ({ 
  formData, 
  handleQualificationChange,
  handleLanguageChange 
}) => {
  const [qualificationInput, setQualificationInput] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const value = qualificationInput.trim();
      if (value && !formData.qualification.includes(value)) {
        handleQualificationChange([...formData.qualification, value]);
        setQualificationInput('');
      }
    }
  };

  const handleRemoveQualification = (index) => {
    const newQualifications = formData.qualification.filter((_, i) => i !== index);
    handleQualificationChange(newQualifications);
  };

  const handleInputChange = (e) => {
    setQualificationInput(e.target.value);
  };

  const handleAddQualification = () => {
    const value = qualificationInput.trim();
    if (value && !formData.qualification.includes(value)) {
      handleQualificationChange([...formData.qualification, value]);
      setQualificationInput('');
    }
  };

  return (
    <>
      {/* Qualifications */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Qualifications *
        </label>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={qualificationInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type qualification and press Enter"
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleAddQualification}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {formData.qualification.map((qual, index) => (
              <div
                key={index}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
              >
                {qual}
                <button
                  type="button"
                  onClick={() => handleRemoveQualification(index)}
                  className="p-0.5 hover:bg-blue-200 rounded-full"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
          {formData.qualification.length === 0 && (
            <p className="text-sm text-gray-500">Add at least one qualification</p>
          )}
        </div>
      </div>

      {/* Languages */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Languages Spoken *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border border-gray-300 rounded-lg">
          {languageOptions.map(language => (
            <button
              key={language}
              type="button"
              onClick={() => handleLanguageChange(language)}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                formData.languagesSpoken.includes(language)
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {language}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default QualificationSection; 