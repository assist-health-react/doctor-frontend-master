import React from 'react'
import { FaTimes } from 'react-icons/fa'
import Select from 'react-select'

const SchoolForm = ({ 
  newSchool, 
  setNewSchool, 
  newGrade, 
  setNewGrade, 
  grades,
  handleAddGrade,
  handleRemoveGrade,
  handleRemoveSection,
  handleAddSchool,
  handleCancelAddSchool,
  handleLogoChange,
  regionOptions,
  handlePincodeChange,
  isLoadingRegions
}) => {
  // Create a state object to store new section data for each grade
  const [newSections, setNewSections] = React.useState({})

  const handleAddSection = (gradeIndex) => {
    const gradeSection = newSections[gradeIndex] || { name: '', studentsCount: 0 }
    
    if (!gradeSection.name || gradeSection.studentsCount <= 0) {
      return
    }

    setNewSchool(prev => {
      const updatedGrades = [...prev.grades]
      updatedGrades[gradeIndex] = {
        ...updatedGrades[gradeIndex],
        section: [
          ...updatedGrades[gradeIndex].section,
          {
            name: gradeSection.name,
            studentsCount: parseInt(gradeSection.studentsCount)
          }
        ]
      }
      return {
        ...prev,
        grades: updatedGrades
      }
    })

    // Reset only this grade's section form
    setNewSections(prev => ({
      ...prev,
      [gradeIndex]: { name: '', studentsCount: 0 }
    }))
  }

  const handleUpdateSection = (gradeIndex, sectionIndex, field, value) => {
    setNewSchool(prev => {
      const updatedGrades = [...prev.grades]
      const updatedSections = [...updatedGrades[gradeIndex].section]
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        [field]: field === 'studentsCount' ? parseInt(value) || 0 : value
      }
      updatedGrades[gradeIndex] = {
        ...updatedGrades[gradeIndex],
        section: updatedSections
      }
      return {
        ...prev,
        grades: updatedGrades
      }
    })
  }

  // Handle new section input changes for a specific grade
  const handleNewSectionChange = (gradeIndex, field, value) => {
    setNewSections(prev => ({
      ...prev,
      [gradeIndex]: {
        ...prev[gradeIndex] || { name: '', studentsCount: 0 },
        [field]: field === 'studentsCount' ? (parseInt(value) || 0) : value
      }
    }))
  }

  // Clean up sections state when removing a grade
  const handleGradeRemove = (index) => {
    handleRemoveGrade(index)
    setNewSections(prev => {
      const updated = { ...prev }
      delete updated[index]
      return updated
    })
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-4 space-y-6">
          {/* Basic Information Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Basic Information</h3>
            <div className="flex gap-8">
              {/* Logo Section */}
              <div className="w-1/3">
                <label className="block text-sm font-medium text-gray-700 mb-2">School Logo</label>
                <div className="flex flex-col space-y-4">
                  {(newSchool.logoPreview || newSchool.logo) ? (
                    <div className="relative w-32 h-32">
                      <img
                        src={newSchool.logoPreview || newSchool.logo}
                        alt="School Logo Preview"
                        className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        onClick={() => setNewSchool(prev => ({ ...prev, logo: null, logoPreview: null }))}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-sm"
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                      <div className="text-center">
                        <input
                          type="file"
                          id="logo"
                          accept="image/*"
                          onChange={handleLogoChange}
                          className="hidden"
                        />
                        <label
                          htmlFor="logo"
                          className="cursor-pointer inline-flex flex-col items-center"
                        >
                          <div className="p-2 rounded-full bg-blue-50 mb-2">
                            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </div>
                          <span className="text-sm text-gray-600">Upload Logo</span>
                        </label>
                        <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* School Details Section */}
              <div className="w-2/3 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      School Name *
                    </label>
                    <input
                      type="text"
                      value={newSchool.name}
                      onChange={(e) => setNewSchool(prev => ({ 
                        ...prev, 
                        name: e.target.value.trim() 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter school name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Number *
                    </label>
                    <input
                      type="tel"
                      value={newSchool.contactNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setNewSchool(prev => ({ 
                          ...prev, 
                          contactNumber: value
                        }))
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter 10-digit contact number"
                      pattern="[0-9]{10}"
                      maxLength="10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={newSchool.description}
                    onChange={(e) => setNewSchool(prev => ({ 
                      ...prev, 
                      description: e.target.value 
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter school description"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={newSchool.email}
                      onChange={(e) => setNewSchool(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <input
                      type="url"
                      value={newSchool.website}
                      onChange={(e) => setNewSchool(prev => ({ ...prev, website: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter website URL"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Principal Details Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Principal Details</h3>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Principal Name *
                </label>
                <input
                  type="text"
                  value={newSchool.principal.name}
                  onChange={(e) => setNewSchool(prev => ({
                    ...prev,
                    principal: { ...prev.principal, name: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter principal name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Principal Email *
                </label>
                <input
                  type="email"
                  value={newSchool.principal.email}
                  onChange={(e) => setNewSchool(prev => ({
                    ...prev,
                    principal: { ...prev.principal, email: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter principal email"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Principal Phone Number *
                </label>
                <input
                  type="tel"
                  value={newSchool.principal.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setNewSchool(prev => ({
                      ...prev,
                      principal: { ...prev.principal, phone: value }
                    }))
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter 10-digit phone number"
                  pattern="[0-9]{10}"
                  maxLength="10"
                  required
                />
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Address Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={newSchool.address.description}
                  onChange={(e) => setNewSchool(prev => ({
                    ...prev,
                    address: { ...prev.address, description: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  required
                  placeholder="Enter detailed address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Landmark
                </label>
                <input
                  type="text"
                  value={newSchool.address.landmark}
                  onChange={(e) => setNewSchool(prev => ({
                    ...prev,
                    address: { ...prev.address, landmark: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Near hospital, school, etc."
                />
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    value={newSchool.address.pin_code}
                    onChange={(e) => {
                      handlePincodeChange(e);
                      setNewSchool(prev => ({
                        ...prev,
                        address: { ...prev.address, pin_code: e.target.value }
                      }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    maxLength="6"
                    pattern="[0-9]{6}"
                    placeholder="Enter 6-digit PIN code"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Region *
                  </label>
                  <Select
                    value={newSchool.address.region ? { value: newSchool.address.region, label: newSchool.address.region } : null}
                    onChange={(selected) => setNewSchool(prev => ({
                      ...prev,
                      address: { ...prev.address, region: selected.value }
                    }))}
                    options={regionOptions}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    required
                    isDisabled={!newSchool.address.pin_code || regionOptions.length === 0}
                    isLoading={isLoadingRegions}
                    placeholder="Enter PIN code to load regions"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    value={newSchool.address.city}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    required
                    readOnly
                    placeholder="Auto-populated from PIN code"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    value={newSchool.address.state}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    required
                    readOnly
                    placeholder="Auto-populated from PIN code"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country *
                  </label>
                  <input
                    type="text"
                    value={newSchool.address.country}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    required
                    readOnly
                    placeholder="India"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Grades Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Grades</h3>
            <div className="space-y-4">
              {newSchool.grades.map((grade, gradeIndex) => (
                <div key={gradeIndex} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h5 className="text-base font-medium text-gray-800">{grade.class}</h5>
                    <button
                      type="button"
                      onClick={() => handleGradeRemove(gradeIndex)}
                      className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <FaTimes />
                    </button>
                  </div>
                  
                  {/* Sections */}
                  <div className="space-y-3">
                    {grade.section.map((section, sectionIndex) => (
                      <div key={sectionIndex} className="flex items-center gap-4 bg-white p-3 rounded-lg border border-gray-200">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={section.name}
                            onChange={(e) => handleUpdateSection(gradeIndex, sectionIndex, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Section name"
                            required
                          />
                        </div>
                        <div className="w-40">
                          <input
                            type="number"
                            value={section.studentsCount}
                            onChange={(e) => handleUpdateSection(gradeIndex, sectionIndex, 'studentsCount', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Students"
                            min="0"
                            required
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveSection(gradeIndex, sectionIndex)}
                          className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                    
                    {/* Add Section Form */}
                    <div className="flex items-center gap-4 p-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={(newSections[gradeIndex]?.name || '')}
                          onChange={(e) => handleNewSectionChange(gradeIndex, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Section name"
                        />
                      </div>
                      <div className="w-40">
                        <input
                          type="number"
                          value={newSections[gradeIndex]?.studentsCount || ''}
                          onChange={(e) => handleNewSectionChange(gradeIndex, 'studentsCount', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Students"
                          min="0"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddSection(gradeIndex)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!newSections[gradeIndex]?.name || (newSections[gradeIndex]?.studentsCount || 0) <= 0}
                      >
                        Add Section
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Add Grade Button */}
              <div className="flex items-center gap-4 mt-6">
                <div className="flex-1">
                  <select
                    value={newGrade.class}
                    onChange={(e) => setNewGrade(prev => ({ ...prev, class: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a grade</option>
                    {grades
                      .filter(grade => !newSchool.grades.some(g => g.class === grade))
                      .map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={handleAddGrade}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!newGrade.class}
                >
                  Add Grade
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with action buttons */}
      <div className="flex justify-end gap-4 px-6 py-4 bg-white border-t shadow-sm">
        <button
          type="button"
          onClick={handleCancelAddSchool}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleAddSchool}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
        >
          {newSchool._id ? 'Update School' : 'Add School'}
        </button>
      </div>
    </div>
  )
}

export default SchoolForm 