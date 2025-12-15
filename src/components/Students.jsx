import { useState } from 'react'
import { FaPlus, FaSearch, FaFileUpload, FaUserCircle, FaSchool, FaTimes, FaUpload, FaEdit, FaTrash } from 'react-icons/fa'

const ViewStudentModal = ({ student, onClose }) => {
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const handleUploadAssessment = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    console.log('Health Assessment uploaded:', Object.fromEntries(formData))
    setShowUploadModal(false)
  }

  const handleDeleteAssessment = () => {
    console.log('Assessment deleted')
    setShowDeleteConfirm(false)
    setShowUploadModal(false)
  }

  const handleEditAssessment = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    console.log('Assessment edited:', Object.fromEntries(formData))
    setIsEditing(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">Student Details</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <FaUpload />
              Upload Assessment
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
          {/* Personal Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-lg font-medium text-gray-700 mb-4">Personal Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoRow label="Full Name" value={student.name} />
              <InfoRow label="Student ID" value={student.id} />
              <InfoRow label="Gender" value={student.gender} />
              <InfoRow label="Date of Birth" value={student.dob} />
              <InfoRow label="Email" value={student.email} />
              <InfoRow label="Contact Number" value={student.mobile} />
              <InfoRow label="Alternate Contact" value={student.alternateContactNumber} />
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-lg font-medium text-gray-700 mb-4">Academic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoRow label="School" value={student.school} />
              <InfoRow label="Class" value={student.class} />
              <InfoRow label="Section" value={student.section} />
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-lg font-medium text-gray-700 mb-4">Location Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoRow label="City" value={student.city} />
              <InfoRow label="State" value={student.state} />
            </div>
          </div>
        </div>

        {/* Health Assessment Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Health Assessment Form</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                    title="Edit Assessment"
                  >
                    <FaEdit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    title="Delete Assessment"
                  >
                    <FaTrash className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setShowUploadModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <FaTimes className="text-gray-500" />
                  </button>
                </div>
              </div>

              <form onSubmit={isEditing ? handleEditAssessment : handleUploadAssessment} className="space-y-6">
                {/* Basic Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-700 mb-4">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Student Name *
                      </label>
                      <input
                        type="text"
                        name="studentName"
                        defaultValue={student.name}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Assist Health ID *
                      </label>
                      <input
                        type="text"
                        name="healthId"
                        defaultValue={student.id}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        name="dob"
                        defaultValue={student.dob}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Grade/Class *
                      </label>
                      <input
                        type="text"
                        name="grade"
                        defaultValue={student.class}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender *
                      </label>
                      <input
                        type="text"
                        name="gender"
                        defaultValue={student.gender}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Number *
                      </label>
                      <input
                        type="text"
                        name="contactNo"
                        defaultValue={student.mobile}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Parent Name *
                      </label>
                      <input
                        type="text"
                        name="parentName"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Physical Measurements */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-700 mb-4">Physical Measurements</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Height (cm) *
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        name="height"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Weight (kg) *
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        name="weight"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        BMI *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        name="bmi"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Vital Signs */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-700 mb-4">Vital Signs</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Temperature (°F) *
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        name="temperature"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pulse Rate (bpm) *
                      </label>
                      <input
                        type="number"
                        name="pulseRate"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SpO2 Percentage *
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        name="spo2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Blood Pressure *
                      </label>
                      <input
                        type="text"
                        name="bp"
                        placeholder="120/80"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Dental Health */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-700 mb-4">Dental Health</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Oral Health *
                      </label>
                      <select
                        name="oralHealth"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select Status</option>
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                        <option value="Poor">Poor</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Other Dental Issues
                      </label>
                      <textarea
                        name="dentalIssues"
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Describe any other dental issues..."
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Vision Assessment */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-700 mb-4">Vision Assessment</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Short Range (Right) *
                      </label>
                      <input
                        type="text"
                        name="shortRangeRight"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Short Range (Left) *
                      </label>
                      <input
                        type="text"
                        name="shortRangeLeft"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Long Range (Right) *
                      </label>
                      <input
                        type="text"
                        name="longRangeRight"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Long Range (Left) *
                      </label>
                      <input
                        type="text"
                        name="longRangeLeft"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-700 mb-4">Additional Information</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hearing Comments
                      </label>
                      <textarea
                        name="hearingComments"
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter hearing assessment comments..."
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Comments
                      </label>
                      <textarea
                        name="additionalComments"
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter any additional comments..."
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Doctor Signature */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-700 mb-4">Doctor's Signature</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Signature *
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                      <div className="space-y-1 text-center">
                        <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                            <span>Upload signature</span>
                            <input
                              type="file"
                              name="doctorSignature"
                              className="sr-only"
                              accept="image/*"
                              required
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    {isEditing ? 'Save Changes' : 'Submit Assessment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Delete Assessment</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this assessment? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAssessment}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-600">{label}:</span>
    <span className="text-gray-800 font-medium">{value || 'Not specified'}</span>
  </div>
)

const AddStudentForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    dob: '',
    email: '',
    contactNumber: '',
    alternateContactNumber: '',
    section: '',
    grade: '',
    schoolName: '',
    city: '',
    state: '',
    password: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">Add New Student</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth *
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number *
              </label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                placeholder="+91 98765-43210"
                pattern="^\+91 \d{5}-\d{5}$"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alternate Contact Number
              </label>
              <input
                type="tel"
                name="alternateContactNumber"
                value={formData.alternateContactNumber}
                onChange={handleInputChange}
                placeholder="+91 98765-43210"
                pattern="^\+91 \d{5}-\d{5}$"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Academic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grade/Class *
              </label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Grade</option>
                <option value="8th">8th</option>
                <option value="9th">9th</option>
                <option value="10th">10th</option>
                <option value="11th">11th</option>
                <option value="12th">12th</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section *
              </label>
              <input
                type="text"
                name="section"
                value={formData.section}
                onChange={handleInputChange}
                placeholder="A, B, C, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                School Name *
              </label>
              <select
                name="schoolName"
                value={formData.schoolName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select School</option>
                <option value="Delhi Public School">Delhi Public School</option>
                <option value="St. Mary's School">St. Mary's School</option>
                <option value="Modern School">Modern School</option>
                <option value="St. Joseph's School">St. Joseph's School</option>
              </select>
            </div>
          </div>

          {/* Location Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State *
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add Student
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const UpdateSchoolForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    school: '',
    logo: null
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('School update form submitted:', formData)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">Update School</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* School Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select School *
            </label>
            <select
              value={formData.school}
              onChange={(e) => setFormData(prev => ({ ...prev, school: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select School</option>
              <option value="Delhi Public School">Delhi Public School</option>
              <option value="St. Mary's School">St. Mary's School</option>
              <option value="Modern School">Modern School</option>
              <option value="St. Joseph's School">St. Joseph's School</option>
            </select>
          </div>

          {/* School Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              School Logo
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                    <span>Upload logo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFormData(prev => ({ ...prev, logo: e.target.files[0] }))}
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
              </div>
            </div>
            {formData.logo && (
              <p className="mt-2 text-sm text-gray-600">
                Selected file: {formData.logo.name}
              </p>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Update School
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const Students = () => {
  const [students] = useState([
    {
      id: "STU001",
      name: "Rahul Kumar",
      school: "Delhi Public School",
      mobile: "+91 98765-43210",
      class: "10th",
      gender: "Male",
      dob: "2006-05-15",
      email: "rahul.k@example.com",
      alternateContactNumber: "+91 98765-43299",
      section: "A",
      city: "Delhi",
      state: "Delhi"
    },
    {
      id: "STU002",
      name: "Priya Singh",
      school: "St. Mary's School",
      mobile: "+91 98765-43211",
      class: "12th",
    },
    {
      id: "STU003",
      name: "Amit Patel",
      school: "Modern School",
      mobile: "+91 98765-43212",
      class: "11th",
    },
    {
      id: "STU004",
      name: "Sneha Reddy",
      school: "Delhi Public School",
      mobile: "+91 98765-43213",
      class: "9th",
    },
    {
      id: "STU005",
      name: "Karthik Raj",
      school: "St. Joseph's School",
      mobile: "+91 98765-43214",
      class: "8th",
    },
    {
      id: "STU006",
      name: "Ananya Sharma",
      school: "Delhi Public School",
      mobile: "+91 98765-43215",
      class: "11th",
    },
    {
      id: "STU007",
      name: "Mohammed Ali",
      school: "Modern School",
      mobile: "+91 98765-43216",
      class: "10th",
    },
    {
      id: "STU008",
      name: "Riya Kapoor",
      school: "St. Mary's School",
      mobile: "+91 98765-43217",
      class: "12th",
    },
    {
      id: "STU009",
      name: "Arjun Nair",
      school: "St. Joseph's School",
      mobile: "+91 98765-43218",
      class: "9th",
    },
    {
      id: "STU010",
      name: "Zara Khan",
      school: "Modern School",
      mobile: "+91 98765-43219",
      class: "8th",
    },
    {
      id: "STU011",
      name: "Vikram Singh",
      school: "Delhi Public School",
      mobile: "+91 98765-43220",
      class: "10th",
    },
    {
      id: "STU012",
      name: "Neha Gupta",
      school: "St. Mary's School",
      mobile: "+91 98765-43221",
      class: "11th",
    },
    {
      id: "STU013",
      name: "Arun Kumar",
      school: "Modern School",
      mobile: "+91 98765-43222",
      class: "12th",
    },
    {
      id: "STU014",
      name: "Meera Iyer",
      school: "St. Joseph's School",
      mobile: "+91 98765-43223",
      class: "9th",
    },
    {
      id: "STU015",
      name: "Rohan Mehta",
      school: "Delhi Public School",
      mobile: "+91 98765-43224",
      class: "8th",
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showUpdateSchool, setShowUpdateSchool] = useState(false)

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleViewStudent = (student) => {
    setSelectedStudent(student)
  }

  const handleBulkUpload = () => {
    // Implement bulk upload logic
    console.log('Bulk upload')
  }

  const handleUpdateSchool = () => {
    // Implement school update logic
    console.log('Update school')
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Students</h2>
        <div className="flex items-center gap-4">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Add Student Button */}
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FaPlus />
            Add Student
          </button>

          {/* Update School Button */}
          <button 
            onClick={() => setShowUpdateSchool(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FaSchool />
            Update School
          </button>

          {/* Bulk Upload Button */}
          <button 
            onClick={handleBulkUpload}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FaFileUpload />
            Bulk Upload
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  S.No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  School
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mobile No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student, index) => (
                <tr 
                  key={student.id} 
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaUserCircle className="w-8 h-8 text-gray-400 mr-3" />
                      {student.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.school}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.mobile}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.class}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button 
                      onClick={() => handleViewStudent(student)}
                      className="px-4 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddForm && (
        <AddStudentForm onClose={() => setShowAddForm(false)} />
      )}

      {selectedStudent && (
        <ViewStudentModal 
          student={selectedStudent} 
          onClose={() => setSelectedStudent(null)} 
        />
      )}

      {showUpdateSchool && (
        <UpdateSchoolForm onClose={() => setShowUpdateSchool(false)} />
      )}
    </div>
  )
}

export default Students 