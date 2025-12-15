import { useState } from 'react'
import { FaSearch, FaPlus, FaFileDownload, FaTimes, FaChevronDown, FaChevronUp, FaUser, FaCalendar, FaHeartbeat, FaSyringe, FaPills, FaAllergies, FaNotesMedical, FaFileMedical, FaFilePdf } from 'react-icons/fa'

const ViewMedicalHistoryModal = ({ member, onClose }) => {
  const [expandedSections, setExpandedSections] = useState({
    allergies: true,
    medications: true,
    conditions: true,
    surgeries: true,
    immunizations: true,
    familyHistory: true
  })

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleSectionToggle = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleDownloadPDF = () => {
    // PDF download logic here
    console.log('Downloading medical history as PDF...')
  }

  const SectionHeader = ({ title, icon: Icon, section, bgColor, textColor, borderColor }) => (
    <div
      className={`flex items-center justify-between p-4 ${bgColor} ${borderColor} rounded-lg cursor-pointer`}
      onClick={() => handleSectionToggle(section)}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 ${textColor} rounded-lg`}>
          <Icon className="w-5 h-5" />
        </div>
        <h3 className={`text-lg font-medium ${textColor}`}>{title}</h3>
      </div>
      {expandedSections[section] ? (
        <FaChevronUp className={textColor} />
      ) : (
        <FaChevronDown className={textColor} />
      )}
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Medical History</h2>
            <p className="text-gray-600">
              {member?.name} - {member?.memberId}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
            >
              <FaFilePdf className="w-4 h-4" />
              Download PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <FaTimes className="text-gray-500" />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Allergies Section */}
          <div className="space-y-4">
            <SectionHeader
              title="Allergies"
              icon={FaAllergies}
              section="allergies"
              bgColor="bg-red-50"
              textColor="text-red-600"
              borderColor="border border-red-100"
            />
            {expandedSections.allergies && (
              <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
                {member?.medicalHistory?.allergies?.map((allergy, index) => (
                  <div key={index} className="p-4">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{allergy.name}</h4>
                        <p className="text-sm text-gray-500">Severity: {allergy.severity}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        Diagnosed: {formatDate(allergy.diagnosedDate)}
                      </div>
                    </div>
                    {allergy.notes && (
                      <p className="mt-2 text-sm text-gray-600">{allergy.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Medications Section */}
          <div className="space-y-4">
            <SectionHeader
              title="Medications"
              icon={FaPills}
              section="medications"
              bgColor="bg-blue-50"
              textColor="text-blue-600"
              borderColor="border border-blue-100"
            />
            {expandedSections.medications && (
              <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
                {member?.medicalHistory?.medications?.map((medication, index) => (
                  <div key={index} className="p-4">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{medication.name}</h4>
                        <p className="text-sm text-gray-500">
                          Dosage: {medication.dosage} | Frequency: {medication.frequency}
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">
                        Started: {formatDate(medication.startDate)}
                      </div>
                    </div>
                    {medication.notes && (
                      <p className="mt-2 text-sm text-gray-600">{medication.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Medical Conditions Section */}
          <div className="space-y-4">
            <SectionHeader
              title="Medical Conditions"
              icon={FaHeartbeat}
              section="conditions"
              bgColor="bg-purple-50"
              textColor="text-purple-600"
              borderColor="border border-purple-100"
            />
            {expandedSections.conditions && (
              <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
                {member?.medicalHistory?.conditions?.map((condition, index) => (
                  <div key={index} className="p-4">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{condition.name}</h4>
                        <p className="text-sm text-gray-500">Status: {condition.status}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        Diagnosed: {formatDate(condition.diagnosedDate)}
                      </div>
                    </div>
                    {condition.notes && (
                      <p className="mt-2 text-sm text-gray-600">{condition.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Surgeries Section */}
          <div className="space-y-4">
            <SectionHeader
              title="Surgeries"
              icon={FaNotesMedical}
              section="surgeries"
              bgColor="bg-green-50"
              textColor="text-green-600"
              borderColor="border border-green-100"
            />
            {expandedSections.surgeries && (
              <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
                {member?.medicalHistory?.surgeries?.map((surgery, index) => (
                  <div key={index} className="p-4">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{surgery.name}</h4>
                        <p className="text-sm text-gray-500">Hospital: {surgery.hospital}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        Date: {formatDate(surgery.date)}
                      </div>
                    </div>
                    {surgery.notes && (
                      <p className="mt-2 text-sm text-gray-600">{surgery.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Immunizations Section */}
          <div className="space-y-4">
            <SectionHeader
              title="Immunizations"
              icon={FaSyringe}
              section="immunizations"
              bgColor="bg-yellow-50"
              textColor="text-yellow-600"
              borderColor="border border-yellow-100"
            />
            {expandedSections.immunizations && (
              <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
                {member?.medicalHistory?.immunizations?.map((immunization, index) => (
                  <div key={index} className="p-4">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{immunization.name}</h4>
                        <p className="text-sm text-gray-500">Dose: {immunization.dose}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        Date: {formatDate(immunization.date)}
                      </div>
                    </div>
                    {immunization.notes && (
                      <p className="mt-2 text-sm text-gray-600">{immunization.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Family History Section */}
          <div className="space-y-4">
            <SectionHeader
              title="Family History"
              icon={FaFileMedical}
              section="familyHistory"
              bgColor="bg-pink-50"
              textColor="text-pink-600"
              borderColor="border border-pink-100"
            />
            {expandedSections.familyHistory && (
              <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
                {member?.medicalHistory?.familyHistory?.map((history, index) => (
                  <div key={index} className="p-4">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{history.condition}</h4>
                        <p className="text-sm text-gray-500">Relation: {history.relation}</p>
                      </div>
                    </div>
                    {history.notes && (
                      <p className="mt-2 text-sm text-gray-600">{history.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const AddMedicalHistoryModal = ({ member, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    allergies: [],
    medications: [],
    conditions: [],
    surgeries: [],
    immunizations: [],
    familyHistory: []
  })

  const handleInputChange = (section, field, value, index = null) => {
    setFormData(prev => {
      const newData = { ...prev }
      if (index !== null) {
        newData[section][index][field] = value
      }
      return newData
    })
  }

  const handleAddItem = (section) => {
    const emptyItem = getEmptyItem(section)
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], emptyItem]
    }))
  }

  const handleRemoveItem = (section, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }))
  }

  const getEmptyItem = (section) => {
    switch (section) {
      case 'allergies':
        return { name: '', severity: '', diagnosedDate: '', notes: '' }
      case 'medications':
        return { name: '', dosage: '', frequency: '', startDate: '', notes: '' }
      case 'conditions':
        return { name: '', status: '', diagnosedDate: '', notes: '' }
      case 'surgeries':
        return { name: '', hospital: '', date: '', notes: '' }
      case 'immunizations':
        return { name: '', dose: '', date: '', notes: '' }
      case 'familyHistory':
        return { condition: '', relation: '', notes: '' }
      default:
        return {}
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Add Medical History</h2>
            <p className="text-gray-600">
              {member?.name} - {member?.memberId}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Form sections for each medical history category */}
          {Object.keys(formData).map((section) => (
            <div key={section} className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-800 capitalize">
                  {section.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <button
                  type="button"
                  onClick={() => handleAddItem(section)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                >
                  Add {section.slice(0, -1)}
                </button>
              </div>

              {formData[section].map((item, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg space-y-4">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(section, index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <FaTimes />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.keys(item).map((field) => (
                      <div key={field}>
                        <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                          {field.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                        {field === 'notes' ? (
                          <textarea
                            value={item[field]}
                            onChange={(e) => handleInputChange(section, field, e.target.value, index)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="3"
                          />
                        ) : (
                          <input
                            type={field.includes('date') ? 'date' : 'text'}
                            value={item[field]}
                            onChange={(e) => handleInputChange(section, field, e.target.value, index)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}

          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Save Medical History
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const EmptyMedicalHistoryView = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Medical History</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <FaTimes className="text-gray-500" />
        </button>
      </div>
      <div className="text-center py-8">
        <FaNotesMedical className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h4 className="text-lg font-medium text-gray-800 mb-2">No Medical History</h4>
        <p className="text-gray-600">This member has no medical history records yet.</p>
      </div>
    </div>
  </div>
)

export { ViewMedicalHistoryModal, AddMedicalHistoryModal, EmptyMedicalHistoryView } 