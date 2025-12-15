import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { FaSearch, FaClipboardList, FaEdit, FaTrash, FaEye, FaFilter, FaTimes, FaUserCircle, FaUsers, FaChevronLeft, FaChevronRight, FaPlus, FaDownload, FaChevronDown, FaFileUpload, FaFileDownload, FaBoxOpen } from 'react-icons/fa'
import { IoMdClose } from 'react-icons/io'

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 font-medium text-sm rounded-lg transition-colors
      ${active 
        ? 'bg-blue-500 text-white' 
        : 'text-gray-600 hover:bg-gray-100'}`}
  >
    {children}
  </button>
)

const FilterPopup = ({ isOpen, onClose, selectedSchool, selectedClass, selectedSection, onSchoolChange, onClassChange, onSectionChange }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl m-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium text-gray-700">Filters</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <IoMdClose className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-1">
                School
              </label>
              <select
                id="school"
                value={selectedSchool}
                onChange={(e) => onSchoolChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Schools</option>
                {['Delhi Public School', 'St. Mary School', 'Modern School'].map(school => (
                  <option key={school} value={school}>{school}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-1">
                Class
              </label>
              <select
                id="class"
                value={selectedClass}
                onChange={(e) => onClassChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Classes</option>
                {['IX', 'X', 'XI', 'XII'].map(cls => (
                  <option key={cls} value={cls}>Class {cls}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="section" className="block text-sm font-medium text-gray-700 mb-1">
                Section
              </label>
              <select
                id="section"
                value={selectedSection}
                onChange={(e) => onSectionChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Sections</option>
                {['A', 'B', 'C'].map(section => (
                  <option key={section} value={section}>Section {section}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  )
}

const AddStudentForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    dob: '',
    email: '',
    contactNumber: '',
    alternateContactNumber: '',
    grade: '',
    section: '',
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
    // Add your form submission logic here
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Add New Student</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth *
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number *
              </label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                required
                pattern="[0-9]{10}"
                placeholder="10-digit mobile number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Alternate Contact Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alternate Contact Number
              </label>
              <input
                type="tel"
                name="alternateContactNumber"
                value={formData.alternateContactNumber}
                onChange={handleInputChange}
                pattern="[0-9]{10}"
                placeholder="10-digit mobile number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Grade/Class */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grade/Class *
              </label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Grade</option>
                {['IX', 'X', 'XI', 'XII'].map(grade => (
                  <option key={grade} value={grade}>Class {grade}</option>
                ))}
              </select>
            </div>

            {/* Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section *
              </label>
              <select
                name="section"
                value={formData.section}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Section</option>
                {['A', 'B', 'C'].map(section => (
                  <option key={section} value={section}>Section {section}</option>
                ))}
              </select>
            </div>

            {/* School Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                School Name *
              </label>
              <select
                name="schoolName"
                value={formData.schoolName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select School</option>
                {['Delhi Public School', 'St. Mary School', 'Modern School'].map(school => (
                  <option key={school} value={school}>{school}</option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State *
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength="6"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            >
              Add Student
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const AddAssessmentForm = ({ isOpen, onClose, student }) => {
  const [assessments, setAssessments] = useState([])
  const [formData, setFormData] = useState({
    parentName: '',
    height: '',
    weight: '',
    bmi: '',
    temperature: '',
    pulseRate: '',
    spO2: '',
    bp: '',
    oralHealth: '',
    dentalIssues: '',
    rightEye: '',
    leftEye: '',
    hearingComments: '',
    additionalComments: '',
    doctorSignature: null
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setFormData(prev => ({
      ...prev,
      doctorSignature: file
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newAssessment = {
      ...formData,
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      studentName: student?.name,
      studentId: student?.id
    }
    setAssessments(prev => [...prev, newAssessment])
    
    // Reset form
    setFormData({
      parentName: '',
      height: '',
      weight: '',
      bmi: '',
      temperature: '',
      pulseRate: '',
      spO2: '',
      bp: '',
      oralHealth: '',
      dentalIssues: '',
      rightEye: '',
      leftEye: '',
      hearingComments: '',
      additionalComments: '',
      doctorSignature: null
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Add Assessment Report</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Static Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-lg font-medium text-gray-700 mb-4">Student Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Name</label>
                <p className="text-gray-900">{student?.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Student ID</label>
                <p className="text-gray-900">{student?.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Date of Birth</label>
                <p className="text-gray-900">{student?.dob}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Grade</label>
                <p className="text-gray-900">{student?.class}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Gender</label>
                <p className="text-gray-900">{student?.gender}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Contact Number</label>
                <p className="text-gray-900">{student?.mobile}</p>
              </div>
            </div>
          </div>

          {/* Assessment Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Parent Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parent Name *
              </label>
              <input
                type="text"
                name="parentName"
                value={formData.parentName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Height */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Height (cm) *
              </label>
              <input
                type="number"
                step="0.01"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight (kg) *
              </label>
              <input
                type="number"
                step="0.01"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* BMI */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                BMI *
              </label>
              <input
                type="number"
                step="0.01"
                name="bmi"
                value={formData.bmi}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Temperature */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temperature (°F) *
              </label>
              <input
                type="number"
                step="0.1"
                name="temperature"
                value={formData.temperature}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Pulse Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pulse Rate (bpm) *
              </label>
              <input
                type="number"
                name="pulseRate"
                value={formData.pulseRate}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* SpO2 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SpO2 (%) *
              </label>
              <input
                type="number"
                min="0"
                max="100"
                name="spO2"
                value={formData.spO2}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* BP */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                BP *
              </label>
              <input
                type="text"
                name="bp"
                value={formData.bp}
                onChange={handleInputChange}
                placeholder="120/80"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Oral Health */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Oral Health *
              </label>
              <select
                name="oralHealth"
                value={formData.oralHealth}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Status</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>

            {/* Dental Issues */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Any Other Dental Issues
              </label>
              <textarea
                name="dentalIssues"
                value={formData.dentalIssues}
                onChange={handleInputChange}
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            {/* Vision Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                  Right Eye
              </label>
              <input
                type="text"
                  name="rightEye"
                  value={formData.rightEye}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter right eye vision"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                  Left Eye
              </label>
              <input
                type="text"
                  name="leftEye"
                  value={formData.leftEye}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter left eye vision"
              />
            </div>
            </div>

            {/* Hearing Comments */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hearing Comments
              </label>
              <textarea
                name="hearingComments"
                value={formData.hearingComments}
                onChange={handleInputChange}
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            {/* Additional Comments */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Comments
              </label>
              <textarea
                name="additionalComments"
                value={formData.additionalComments}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            {/* Doctor Signature */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Doctor Signature *
              </label>
              <input
                type="file"
                name="doctorSignature"
                onChange={handleFileChange}
                accept="image/*"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            >
              Submit Assessment
            </button>
          </div>
        </form>

        {/* Assessment History Table */}
        {assessments.length > 0 && (
          <div className="mt-8">
            <h4 className="text-lg font-medium text-gray-800 mb-4">Assessment History</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Height</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Weight</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">BMI</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Temperature</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pulse Rate</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SpO2</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">BP</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Oral Health</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {assessments.map((assessment) => (
                    <tr key={assessment.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{assessment.date}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{assessment.height} cm</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{assessment.weight} kg</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{assessment.bmi}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{assessment.temperature}°F</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{assessment.pulseRate} bpm</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{assessment.spO2}%</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{assessment.bp}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{assessment.oralHealth}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const ViewStudentDetails = ({ isOpen, onClose, student, onEdit, onDelete }) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

  if (!isOpen) return null

  const handleDelete = () => {
    setShowDeleteConfirmation(true)
  }

  const confirmDelete = () => {
    onDelete(student.id)
    setShowDeleteConfirmation(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Student Details</h3>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onEdit(student)}
              className="text-blue-600 hover:text-blue-800"
              title="Edit Student"
            >
              <FaEdit className="w-5 h-5" />
            </button>
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800"
              title="Delete Student"
            >
              <FaTrash className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600">Name</label>
            <p className="text-gray-900">{student?.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Student ID</label>
            <p className="text-gray-900">{student?.id}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Gender</label>
            <p className="text-gray-900">{student?.gender}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Date of Birth</label>
            <p className="text-gray-900">{student?.dob}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <p className="text-gray-900">{student?.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Contact Number</label>
            <p className="text-gray-900">{student?.contactNumber}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Alternate Contact</label>
            <p className="text-gray-900">{student?.alternateContactNumber || '-'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Class</label>
            <p className="text-gray-900">Class {student?.grade}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Section</label>
            <p className="text-gray-900">Section {student?.section}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">School</label>
            <p className="text-gray-900">{student?.schoolName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">City</label>
            <p className="text-gray-900">{student?.city}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">State</label>
            <p className="text-gray-900">{student?.state}</p>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h4>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this student? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteConfirmation(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
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

const AllStudents = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSchool, setSelectedSchool] = useState('')
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedSection, setSelectedSection] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [showAddStudentForm, setShowAddStudentForm] = useState(false)
  const [showAssessmentForm, setShowAssessmentForm] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showViewDetails, setShowViewDetails] = useState(false)
  const [selectedStudentForView, setSelectedStudentForView] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const tableRef = useRef(null)
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: itemsPerPage })
  
  // Sample data - replace with actual data
  const students = [
    { id: 'STU001', name: 'Rahul Kumar', mobile: '9876543210', school: 'Delhi Public School', class: 'X', section: 'A', gender: 'Male' },
    { id: 'STU002', name: 'Priya Singh', mobile: '9876543211', school: 'St. Mary School', class: 'IX', section: 'B', gender: 'Female' },
    { id: 'STU003', name: 'Amit Sharma', mobile: '9876543212', school: 'Modern School', class: 'XI', section: 'C', gender: 'Male' },
    { id: 'STU004', name: 'Neha Patel', mobile: '9876543213', school: 'Delhi Public School', class: 'XII', section: 'A', gender: 'Female' },
    { id: 'STU005', name: 'Raj Malhotra', mobile: '9876543214', school: 'St. Mary School', class: 'X', section: 'B', gender: 'Male' },
    { id: 'STU006', name: 'Anita Gupta', mobile: '9876543215', school: 'Modern School', class: 'IX', section: 'A', gender: 'Female' },
    { id: 'STU007', name: 'Vikram Singh', mobile: '9876543216', school: 'Delhi Public School', class: 'XI', section: 'C', gender: 'Male' },
    { id: 'STU008', name: 'Meera Reddy', mobile: '9876543217', school: 'St. Mary School', class: 'XII', section: 'B', gender: 'Female' },
    { id: 'STU009', name: 'Arjun Mehta', mobile: '9876543218', school: 'Modern School', class: 'X', section: 'A', gender: 'Male' },
    { id: 'STU010', name: 'Sanya Kapoor', mobile: '9876543219', school: 'Delhi Public School', class: 'IX', section: 'C', gender: 'Female' },
    { id: 'STU011', name: 'Rohan Verma', mobile: '9876543220', school: 'St. Mary School', class: 'XI', section: 'B', gender: 'Male' },
    { id: 'STU012', name: 'Ishaan Kumar', mobile: '9876543221', school: 'Modern School', class: 'XII', section: 'A', gender: 'Male' },
    { id: 'STU013', name: 'Zara Sheikh', mobile: '9876543222', school: 'Delhi Public School', class: 'X', section: 'C', gender: 'Female' },
    { id: 'STU014', name: 'Aditya Sharma', mobile: '9876543223', school: 'St. Mary School', class: 'IX', section: 'B', gender: 'Male' },
    { id: 'STU015', name: 'Riya Patel', mobile: '9876543224', school: 'Modern School', class: 'XI', section: 'A', gender: 'Female' },
    { id: 'STU016', name: 'Karan Malhotra', mobile: '9876543225', school: 'Delhi Public School', class: 'X', section: 'B', gender: 'Male' },
    { id: 'STU017', name: 'Nisha Verma', mobile: '9876543226', school: 'St. Mary School', class: 'XII', section: 'C', gender: 'Female' },
    { id: 'STU018', name: 'Aryan Shah', mobile: '9876543227', school: 'Modern School', class: 'IX', section: 'A', gender: 'Male' },
    { id: 'STU019', name: 'Kavya Reddy', mobile: '9876543228', school: 'Delhi Public School', class: 'XI', section: 'B', gender: 'Female' },
    { id: 'STU020', name: 'Dhruv Patel', mobile: '9876543229', school: 'St. Mary School', class: 'X', section: 'C', gender: 'Male' },
    { id: 'STU021', name: 'Aisha Khan', mobile: '9876543230', school: 'Modern School', class: 'XII', section: 'A', gender: 'Female' },
    { id: 'STU022', name: 'Varun Mehta', mobile: '9876543231', school: 'Delhi Public School', class: 'IX', section: 'B', gender: 'Male' },
    { id: 'STU023', name: 'Tanvi Gupta', mobile: '9876543232', school: 'St. Mary School', class: 'XI', section: 'C', gender: 'Female' },
    { id: 'STU024', name: 'Yash Sharma', mobile: '9876543233', school: 'Modern School', class: 'X', section: 'A', gender: 'Male' },
    { id: 'STU025', name: 'Shreya Singh', mobile: '9876543234', school: 'Delhi Public School', class: 'XII', section: 'B', gender: 'Female' },
    { id: 'STU026', name: 'Aarav Kumar', mobile: '9876543235', school: 'St. Mary School', class: 'IX', section: 'C', gender: 'Male' },
    { id: 'STU027', name: 'Diya Patel', mobile: '9876543236', school: 'Modern School', class: 'XI', section: 'A', gender: 'Female' },
    { id: 'STU028', name: 'Kabir Sinha', mobile: '9876543237', school: 'Delhi Public School', class: 'X', section: 'B', gender: 'Male' },
    { id: 'STU029', name: 'Ananya Reddy', mobile: '9876543238', school: 'St. Mary School', class: 'XII', section: 'C', gender: 'Female' },
    { id: 'STU030', name: 'Vihaan Kapoor', mobile: '9876543239', school: 'Modern School', class: 'IX', section: 'A', gender: 'Male' },
    { id: 'STU031', name: 'Advait Menon', mobile: '9876543240', school: 'Delhi Public School', class: 'XI', section: 'B', gender: 'Male' },
    { id: 'STU032', name: 'Saanvi Iyer', mobile: '9876543241', school: 'St. Mary School', class: 'X', section: 'A', gender: 'Female' },
    { id: 'STU033', name: 'Reyansh Shah', mobile: '9876543242', school: 'Modern School', class: 'XII', section: 'C', gender: 'Male' },
    { id: 'STU034', name: 'Avni Desai', mobile: '9876543243', school: 'Delhi Public School', class: 'IX', section: 'B', gender: 'Female' },
    { id: 'STU035', name: 'Veer Malhotra', mobile: '9876543244', school: 'St. Mary School', class: 'XI', section: 'A', gender: 'Male' },
    { id: 'STU036', name: 'Aisha Syed', mobile: '9876543245', school: 'Modern School', class: 'X', section: 'C', gender: 'Female' },
    { id: 'STU037', name: 'Arjun Nair', mobile: '9876543246', school: 'Delhi Public School', class: 'XII', section: 'B', gender: 'Male' },
    { id: 'STU038', name: 'Myra Khan', mobile: '9876543247', school: 'St. Mary School', class: 'IX', section: 'A', gender: 'Female' },
    { id: 'STU039', name: 'Vivaan Reddy', mobile: '9876543248', school: 'Modern School', class: 'XI', section: 'C', gender: 'Male' },
    { id: 'STU040', name: 'Anaya Sharma', mobile: '9876543249', school: 'Delhi Public School', class: 'X', section: 'B', gender: 'Female' },
    { id: 'STU041', name: 'Aarav Choudhury', mobile: '9876543250', school: 'St. Mary School', class: 'XII', section: 'A', gender: 'Male' },
    { id: 'STU042', name: 'Zara Malik', mobile: '9876543251', school: 'Modern School', class: 'IX', section: 'C', gender: 'Female' },
    { id: 'STU043', name: 'Kabir Joshi', mobile: '9876543252', school: 'Delhi Public School', class: 'XI', section: 'B', gender: 'Male' },
    { id: 'STU044', name: 'Anika Gupta', mobile: '9876543253', school: 'St. Mary School', class: 'X', section: 'A', gender: 'Female' },
    { id: 'STU045', name: 'Ishaan Verma', mobile: '9876543254', school: 'Modern School', class: 'XII', section: 'C', gender: 'Male' },
    { id: 'STU046', name: 'Riya Kapoor', mobile: '9876543255', school: 'Delhi Public School', class: 'IX', section: 'B', gender: 'Female' },
    { id: 'STU047', name: 'Aditya Mehta', mobile: '9876543256', school: 'St. Mary School', class: 'XI', section: 'A', gender: 'Male' },
    { id: 'STU048', name: 'Siya Patel', mobile: '9876543257', school: 'Modern School', class: 'X', section: 'C', gender: 'Female' },
    { id: 'STU049', name: 'Dhruv Singh', mobile: '9876543258', school: 'Delhi Public School', class: 'XII', section: 'B', gender: 'Male' },
    { id: 'STU050', name: 'Aaradhya Kumar', mobile: '9876543259', school: 'St. Mary School', class: 'IX', section: 'A', gender: 'Female' },
    { id: 'STU051', name: 'Aryan Khanna', mobile: '9876543260', school: 'Modern School', class: 'XI', section: 'C', gender: 'Male' },
    { id: 'STU052', name: 'Avani Reddy', mobile: '9876543261', school: 'Delhi Public School', class: 'X', section: 'B', gender: 'Female' },
    { id: 'STU053', name: 'Shaurya Malhotra', mobile: '9876543262', school: 'St. Mary School', class: 'XII', section: 'A', gender: 'Male' },
    { id: 'STU054', name: 'Anvi Sharma', mobile: '9876543263', school: 'Modern School', class: 'IX', section: 'C', gender: 'Female' },
    { id: 'STU055', name: 'Yash Verma', mobile: '9876543264', school: 'Delhi Public School', class: 'XI', section: 'B', gender: 'Male' },
    { id: 'STU056', name: 'Mira Kapoor', mobile: '9876543265', school: 'St. Mary School', class: 'X', section: 'A', gender: 'Female' },
    { id: 'STU057', name: 'Rudra Singh', mobile: '9876543266', school: 'Modern School', class: 'XII', section: 'C', gender: 'Male' },
    { id: 'STU058', name: 'Amaira Patel', mobile: '9876543267', school: 'Delhi Public School', class: 'IX', section: 'B', gender: 'Female' },
    { id: 'STU059', name: 'Ved Sharma', mobile: '9876543268', school: 'St. Mary School', class: 'XI', section: 'A', gender: 'Male' },
    { id: 'STU060', name: 'Kyra Mehta', mobile: '9876543269', school: 'Modern School', class: 'X', section: 'C', gender: 'Female' },
    { id: 'STU061', name: 'Vihaan Gupta', mobile: '9876543270', school: 'Delhi Public School', class: 'XII', section: 'B', gender: 'Male' },
    { id: 'STU062', name: 'Shanaya Reddy', mobile: '9876543271', school: 'St. Mary School', class: 'IX', section: 'A', gender: 'Female' },
    { id: 'STU063', name: 'Aarush Kumar', mobile: '9876543272', school: 'Modern School', class: 'XI', section: 'C', gender: 'Male' },
    { id: 'STU064', name: 'Kiara Singh', mobile: '9876543273', school: 'Delhi Public School', class: 'X', section: 'B', gender: 'Female' },
    { id: 'STU065', name: 'Atharv Malhotra', mobile: '9876543274', school: 'St. Mary School', class: 'XII', section: 'A', gender: 'Male' },
    { id: 'STU066', name: 'Navya Kapoor', mobile: '9876543275', school: 'Modern School', class: 'IX', section: 'C', gender: 'Female' },
    { id: 'STU067', name: 'Krish Sharma', mobile: '9876543276', school: 'Delhi Public School', class: 'XI', section: 'B', gender: 'Male' },
    { id: 'STU068', name: 'Ira Patel', mobile: '9876543277', school: 'St. Mary School', class: 'X', section: 'A', gender: 'Female' },
    { id: 'STU069', name: 'Ayaan Khan', mobile: '9876543278', school: 'Modern School', class: 'XII', section: 'C', gender: 'Male' },
    { id: 'STU070', name: 'Diya Verma', mobile: '9876543279', school: 'Delhi Public School', class: 'IX', section: 'B', gender: 'Female' },
    { id: 'STU071', name: 'Shiv Reddy', mobile: '9876543280', school: 'St. Mary School', class: 'XI', section: 'A', gender: 'Male' },
    { id: 'STU072', name: 'Pari Malhotra', mobile: '9876543281', school: 'Modern School', class: 'X', section: 'C', gender: 'Female' },
    { id: 'STU073', name: 'Arnav Mehta', mobile: '9876543282', school: 'Delhi Public School', class: 'XII', section: 'B', gender: 'Male' },
    { id: 'STU074', name: 'Sara Khan', mobile: '9876543283', school: 'St. Mary School', class: 'IX', section: 'A', gender: 'Female' },
    { id: 'STU075', name: 'Yuvan Singh', mobile: '9876543284', school: 'Modern School', class: 'XI', section: 'C', gender: 'Male' },
    { id: 'STU076', name: 'Ahana Sharma', mobile: '9876543285', school: 'Delhi Public School', class: 'X', section: 'B', gender: 'Female' },
    { id: 'STU077', name: 'Aayan Kumar', mobile: '9876543286', school: 'St. Mary School', class: 'XII', section: 'A', gender: 'Male' },
    { id: 'STU078', name: 'Mishka Gupta', mobile: '9876543287', school: 'Modern School', class: 'IX', section: 'C', gender: 'Female' },
    { id: 'STU079', name: 'Rehan Patel', mobile: '9876543288', school: 'Delhi Public School', class: 'XI', section: 'B', gender: 'Male' },
    { id: 'STU080', name: 'Anvi Reddy', mobile: '9876543289', school: 'St. Mary School', class: 'X', section: 'A', gender: 'Female' },
    { id: 'STU081', name: 'Viraj Malhotra', mobile: '9876543290', school: 'Modern School', class: 'XII', section: 'C', gender: 'Male' },
    { id: 'STU082', name: 'Tara Kapoor', mobile: '9876543291', school: 'Delhi Public School', class: 'IX', section: 'B', gender: 'Female' },
    { id: 'STU083', name: 'Aadit Sharma', mobile: '9876543292', school: 'St. Mary School', class: 'XI', section: 'A', gender: 'Male' },
    { id: 'STU084', name: 'Myra Verma', mobile: '9876543293', school: 'Modern School', class: 'X', section: 'C', gender: 'Female' },
    { id: 'STU085', name: 'Kabir Mehta', mobile: '9876543294', school: 'Delhi Public School', class: 'XII', section: 'B', gender: 'Male' },
    { id: 'STU086', name: 'Aanya Singh', mobile: '9876543295', school: 'St. Mary School', class: 'IX', section: 'A', gender: 'Female' },
    { id: 'STU087', name: 'Vivaan Kumar', mobile: '9876543296', school: 'Modern School', class: 'XI', section: 'C', gender: 'Male' },
    { id: 'STU088', name: 'Pihu Gupta', mobile: '9876543297', school: 'Delhi Public School', class: 'X', section: 'B', gender: 'Female' },
    { id: 'STU089', name: 'Advaith Reddy', mobile: '9876543298', school: 'St. Mary School', class: 'XII', section: 'A', gender: 'Male' },
    { id: 'STU090', name: 'Aadhya Patel', mobile: '9876543299', school: 'Modern School', class: 'IX', section: 'C', gender: 'Female' },
    { id: 'STU091', name: 'Shlok Malhotra', mobile: '9876543200', school: 'Delhi Public School', class: 'XI', section: 'B', gender: 'Male' },
    { id: 'STU092', name: 'Nitya Sharma', mobile: '9876543201', school: 'St. Mary School', class: 'X', section: 'A', gender: 'Female' },
    { id: 'STU093', name: 'Aaryan Khan', mobile: '9876543202', school: 'Modern School', class: 'XII', section: 'C', gender: 'Male' },
    { id: 'STU094', name: 'Ishita Verma', mobile: '9876543203', school: 'Delhi Public School', class: 'IX', section: 'B', gender: 'Female' },
    { id: 'STU095', name: 'Shaan Mehta', mobile: '9876543204', school: 'St. Mary School', class: 'XI', section: 'A', gender: 'Male' },
    { id: 'STU096', name: 'Anushka Kapoor', mobile: '9876543205', school: 'Modern School', class: 'X', section: 'C', gender: 'Female' },
    { id: 'STU097', name: 'Laksh Singh', mobile: '9876543206', school: 'Delhi Public School', class: 'XII', section: 'B', gender: 'Male' },
    { id: 'STU098', name: 'Samaira Gupta', mobile: '9876543207', school: 'St. Mary School', class: 'IX', section: 'A', gender: 'Female' },
    { id: 'STU099', name: 'Pranav Kumar', mobile: '9876543208', school: 'Modern School', class: 'XI', section: 'C', gender: 'Male' },
    { id: 'STU100', name: 'Vanya Reddy', mobile: '9876543209', school: 'Delhi Public School', class: 'X', section: 'B', gender: 'Female' },
  ]

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSchool = !selectedSchool || student.school === selectedSchool
    const matchesClass = !selectedClass || student.class === selectedClass
    const matchesSection = !selectedSection || student.section === selectedSection

    return matchesSearch && matchesSchool && matchesClass && matchesSection
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStudents(paginatedStudents.map(student => student.id))
    } else {
      setSelectedStudents([])
    }
  }

  const handleSelectStudent = (studentId) => {
    setSelectedStudents(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId)
      } else {
        return [...prev, studentId]
      }
    })
  }

  const handleNavigatorSelect = (navigator, selectedStudents) => {
    console.log('Assigning navigator:', navigator, 'to students:', selectedStudents)
    // Implement your assignment logic here
    setSelectedStudents([]) // Clear selections after assignment
  }

  const handleEditStudent = (student) => {
    setSelectedStudent(student)
    setShowAddStudentForm(true)
    setShowViewDetails(false)
  }

  const handleDeleteStudent = (studentId) => {
    // Filter out the deleted student
    const updatedStudents = students.filter(student => student.id !== studentId)
    // Update your students state here
    console.log('Student deleted:', studentId)
  }

  // Modify the pagination logic
  const loadMoreItems = () => {
    if (loading || !hasMore) return

    setLoading(true)
    setTimeout(() => {
      const nextPage = currentPage + 1
      if (nextPage <= totalPages) {
        setCurrentPage(nextPage)
        setVisibleRange(prev => ({
          start: prev.start,
          end: Math.min(nextPage * itemsPerPage, filteredStudents.length)
        }))
      } else {
        setHasMore(false)
      }
      setLoading(false)
    }, 300)
  }

  // Handle scroll event
  const handleScroll = useCallback(() => {
    if (!tableRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = tableRef.current
    const scrollPercentage = scrollTop / (scrollHeight - clientHeight)

    // Load more when scrolling down near bottom
    if (scrollPercentage > 0.8) {
      loadMoreItems()
    }

    // Update visible range based on scroll position
    const estimatedRowHeight = 53 // Approximate height of each row
    const visibleStart = Math.floor(scrollTop / estimatedRowHeight)
    const visibleEnd = Math.min(
      visibleStart + Math.ceil(clientHeight / estimatedRowHeight),
      filteredStudents.length
    )

    // Keep one page worth of buffer above and below
    const bufferSize = itemsPerPage
    const rangeStart = Math.max(0, visibleStart - bufferSize)
    const rangeEnd = Math.min(filteredStudents.length, visibleEnd + bufferSize)

    setVisibleRange({ start: rangeStart, end: rangeEnd })
    
    // Update current page based on visible content
    const newPage = Math.ceil(visibleEnd / itemsPerPage)
    if (newPage !== currentPage) {
      setCurrentPage(newPage)
    }
  }, [loading, hasMore, filteredStudents.length, currentPage, itemsPerPage])

  // Add scroll event listener
  useEffect(() => {
    const tableElement = tableRef.current
    if (tableElement) {
      tableElement.addEventListener('scroll', handleScroll)
      return () => tableElement.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1)
    setHasMore(true)
    setVisibleRange({ start: 0, end: itemsPerPage })
  }, [searchTerm, selectedSchool, selectedClass, selectedSection])

  // Modify how we get displayed students
  const displayedStudents = useMemo(() => {
    return filteredStudents.slice(visibleRange.start, visibleRange.end)
  }, [filteredStudents, visibleRange])

  return (
    <div className="flex flex-col h-full">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4 lg:mb-6">
        {/* Search and Filter */}
        <div className="flex gap-2 items-center flex-1">
          <div className="relative flex-1 md:flex-none md:w-[350px] lg:w-[400px]">
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1) // Reset to first page on search
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <button
            onClick={() => setIsFilterOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <FaFilter className="w-4 h-4" />
            Filter
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 sm:justify-end">
          <button
            onClick={() => setShowAddStudentForm(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Student
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="h-[calc(100vh-180px)] lg:h-[calc(100vh-200px)] bg-white rounded-lg shadow">
        <div 
          ref={tableRef}
          className="overflow-auto h-full scroll-smooth"
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                  Sl. No
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Student ID
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-44">
                  Name
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-44">
                  School
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-36">
                  Mobile Number
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  Gender
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  Grade
                </th>
                <th className="px-6 py-3.5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  Action
                </th>
                <th className="px-6 py-3.5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                  Assessment
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Add spacer for proper scrolling */}
              <tr style={{ height: `${visibleRange.start * 53}px` }} />
              
              {displayedStudents.map((student, index) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {visibleRange.start + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.school}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.mobile}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.gender}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.class} - {student.section}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      title="View Details"
                      onClick={() => {
                        setSelectedStudentForView(student)
                        setShowViewDetails(true)
                      }}
                    >
                      <FaEye className="w-5 h-5 mx-auto" />
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => {
                        setSelectedStudent(student)
                        setShowAssessmentForm(true)
                      }}
                      className="text-green-600 hover:text-green-800 transition-colors"
                      title="Add Assessment"
                    >
                      <FaPlus className="w-5 h-5 mx-auto" />
                    </button>
                  </td>
                </tr>
              ))}

              {loading && (
                <tr>
                  <td colSpan="9" className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                      <span className="ml-2">Loading...</span>
                    </div>
                  </td>
                </tr>
              )}

              {/* Add bottom spacer for proper scrolling */}
              <tr style={{ height: `${(filteredStudents.length - visibleRange.end) * 53}px` }} />
            </tbody>
          </table>

          {filteredStudents.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No students found matching your search.
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {filteredStudents.length > 0 && (
        <div className="flex justify-between items-center mt-4 lg:mt-6 bg-white px-6 py-4 rounded-lg shadow">
          <div className="text-sm text-gray-700">
            Showing {visibleRange.start + 1} to {Math.min(visibleRange.end, filteredStudents.length)} of {filteredStudents.length} results
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        </div>
      )}

      {/* Filter Popup */}
      <FilterPopup
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        selectedSchool={selectedSchool}
        selectedClass={selectedClass}
        selectedSection={selectedSection}
        onSchoolChange={setSelectedSchool}
        onClassChange={setSelectedClass}
        onSectionChange={setSelectedSection}
      />

      {/* Add Student Form */}
      <AddStudentForm
        isOpen={showAddStudentForm}
        onClose={() => setShowAddStudentForm(false)}
      />

      {/* Add Assessment Form */}
      <AddAssessmentForm
        isOpen={showAssessmentForm}
        onClose={() => {
          setShowAssessmentForm(false)
          setSelectedStudent(null)
        }}
        student={selectedStudent}
      />

      {/* View Student Details */}
      <ViewStudentDetails
        isOpen={showViewDetails}
        onClose={() => {
          setShowViewDetails(false)
          setSelectedStudentForView(null)
        }}
        student={selectedStudentForView}
        onEdit={handleEditStudent}
        onDelete={handleDeleteStudent}
      />
    </div>
  )
}

export const ViewAssessmentDetails = ({ isOpen, onClose, assessment }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Assessment Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <IoMdClose className="h-6 w-6" />
          </button>
        </div>
        
        <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Student Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Student Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Student ID</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.studentId}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Name</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.studentName}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Mobile</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.mobile}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Gender</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.gender}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Grade</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.grade}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Parent Name</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.parentName}</div>
              </div>
            </div>
          </div>

          {/* Physical Measurements */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Physical Measurements</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Height</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.height} cm</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Weight</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.weight} kg</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">BMI</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.bmi}</div>
              </div>
            </div>
          </div>

          {/* Vital Signs */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Vital Signs</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Temperature</label>
                <div className="mt-1 text-sm text-gray-900">{((assessment.temperature - 32) * 5/9).toFixed(1)}°C</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Pulse Rate</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.pulseRate} bpm</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">SpO2</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.spO2}%</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Blood Pressure</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.bp} mmHg</div>
              </div>
            </div>
          </div>

          {/* Oral Health */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Oral Health</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Status</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.oralHealth}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Dental Issues</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.dentalIssues}</div>
              </div>
            </div>
          </div>

          {/* Vision Assessment */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Vision Assessment</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Right Eye</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.rightEye}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Left Eye</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.leftEye}</div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Additional Information</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Hearing Comments</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.hearingComments}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Additional Comments</label>
                <div className="mt-1 text-sm text-gray-900">{assessment.additionalComments}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AssessmentReport = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showViewDetails, setShowViewDetails] = useState(false)
  const [selectedAssessment, setSelectedAssessment] = useState(null)
  const [selectedSchool, setSelectedSchool] = useState('')
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedSection, setSelectedSection] = useState('')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const itemsPerPage = 10
  const tableRef = useRef(null)

  // Set mounted state
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Sample data for schools and classes
  const availableSchools = ['Delhi Public School', 'St. Mary School', 'Modern School']
  const availableClasses = ['IX', 'X', 'XI', 'XII']
  const availableSections = ['A', 'B', 'C']

  // Sample assessment data
  const sampleAssessments = useMemo(() => Array.from({ length: 100 }, (_, index) => ({
    id: `ASS${(index + 1).toString().padStart(3, '0')}`,
    date: new Date(2024, 2, Math.floor(index / 5) + 1).toISOString().split('T')[0],
    studentId: `STU${(index + 1).toString().padStart(3, '0')}`,
    studentName: `Student ${index + 1}`,
    school: availableSchools[index % 3],
    mobile: `98765${(index + 1).toString().padStart(5, '0')}`,
    gender: index % 2 === 0 ? 'Male' : 'Female',
    grade: `${availableClasses[index % 4]}-${availableSections[index % 3]}`,
    parentName: `Parent ${index + 1}`,
    height: Math.floor(150 + Math.random() * 30),
    weight: Math.floor(45 + Math.random() * 25),
    bmi: (20 + Math.random() * 5).toFixed(1),
    temperature: (98 + Math.random()).toFixed(1),
    pulseRate: Math.floor(70 + Math.random() * 20),
    spO2: Math.floor(95 + Math.random() * 5),
    bp: `${Math.floor(110 + Math.random() * 20)}/${Math.floor(70 + Math.random() * 10)}`,
    oralHealth: ['Good', 'Fair', 'Poor'][index % 3],
    dentalIssues: index % 5 === 0 ? 'Cavity' : index % 4 === 0 ? 'Gingivitis' : 'None',
    rightEye: Math.random() > 0.8 ? '6/9' : '6/6',
    leftEye: Math.random() > 0.8 ? '6/9' : '6/6',
    hearingComments: index % 10 === 0 ? 'Mild hearing loss' : 'Normal',
    additionalComments: index % 7 === 0 ? 'Regular follow-up recommended' : ''
  })), [])

  // Filter assessments based on all filters
  const filteredAssessments = useMemo(() => 
    sampleAssessments.filter(assessment => {
      const matchesSearch = 
    assessment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assessment.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.mobile.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesSchool = !selectedSchool || assessment.school === selectedSchool
      const matchesClass = !selectedClass || assessment.grade.split('-')[0] === selectedClass
      const matchesSection = !selectedSection || assessment.grade.split('-')[1] === selectedSection
      const matchesStudent = !selectedStudent || assessment.studentId === selectedStudent.id
      const matchesDate = !selectedDate || assessment.date === selectedDate

      return matchesSearch && matchesSchool && matchesClass && matchesSection && matchesStudent && matchesDate
    })
  , [sampleAssessments, searchTerm, selectedSchool, selectedClass, selectedSection, selectedStudent, selectedDate])

  // Calculate pagination
  const totalPages = Math.ceil(filteredAssessments.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentAssessments = filteredAssessments.slice(startIndex, endIndex)

  useEffect(() => {
    if (mounted) {
      const timer = setTimeout(() => {
        setLoading(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [mounted])

  if (!mounted) return null

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="text-gray-500">Loading...</span>
        </div>
      </div>
    )
  }

  // Handle bulk upload
  const handleBulkUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      console.log('Uploading file:', file.name)
      e.target.value = ''
    }
  }

  // Handle bulk download
  const handleBulkDownload = () => {
    // Create CSV content
    const headers = [
      'Assessment ID',
      'Date',
      'Student ID',
      'Student Name',
      'School',
      'Mobile',
      'Gender',
      'Grade',
      'Parent Name',
      'Height',
      'Weight',
      'BMI',
      'Temperature',
      'Pulse Rate',
      'SpO2',
      'BP',
      'Oral Health',
      'Dental Issues',
      'Right Eye',
      'Left Eye',
      'Hearing Comments',
      'Additional Comments'
    ]

    const csvContent = [
      headers.join(','),
      ...filteredAssessments.map(assessment => [
        assessment.id,
        assessment.date,
        assessment.studentId,
        assessment.studentName,
        assessment.school,
        assessment.mobile,
        assessment.gender,
        assessment.grade,
        assessment.parentName,
        assessment.height,
        assessment.weight,
        assessment.bmi,
        assessment.temperature,
        assessment.pulseRate,
        assessment.spO2,
        assessment.bp,
        assessment.oralHealth,
        assessment.dentalIssues,
        assessment.rightEye,
        assessment.leftEye,
        assessment.hearingComments,
        assessment.additionalComments
      ].join(','))
    ].join('\n')

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `assessment_report_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-semibold text-gray-800">Assessment Reports</h1>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-64">
          <input
            type="text"
                placeholder="Search by student name, ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
              <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
            <div className="flex gap-2">
            <label className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 cursor-pointer transition-colors">
              <FaFileUpload className="w-5 h-5" />
              Bulk Upload
              <input
                type="file"
                accept=".csv, .xlsx"
                onChange={handleBulkUpload}
                className="hidden"
              />
            </label>
              <button
                onClick={handleBulkDownload}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 cursor-pointer transition-colors"
              >
                <FaFileDownload className="w-5 h-5" />
                Bulk Download
              </button>
            </div>
        </div>
      </div>

        {/* Filters */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Schools</option>
            {availableSchools.map(school => (
                <option key={school} value={school}>{school}</option>
              ))}
            </select>

            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Classes</option>
            {availableClasses.map(cls => (
                <option key={cls} value={cls}>Class {cls}</option>
              ))}
            </select>

            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Sections</option>
            {availableSections.map(section => (
                <option key={section} value={section}>Section {section}</option>
              ))}
            </select>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Height</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BMI</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
            {currentAssessments.map((assessment) => (
                    <tr key={assessment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{assessment.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{assessment.studentId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{assessment.studentName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{assessment.school}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{assessment.grade}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{assessment.height} cm</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{assessment.weight} kg</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{assessment.bmi}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button
                    onClick={() => {
                      setSelectedAssessment(assessment)
                      setShowViewDetails(true)
                    }}
                      className="text-blue-600 hover:text-blue-800"
                        >
                    View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          </div>

      {/* Pagination */}
      {filteredAssessments.length > 0 && (
        <div className="flex justify-between items-center px-6 py-4 border-t">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredAssessments.length)} of {filteredAssessments.length} results
          </div>
          <div className="flex gap-2">
                <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
              className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
                  </button>
              </div>
        </div>
      )}

      {/* View Assessment Details Modal */}
        <ViewAssessmentDetails
          isOpen={showViewDetails}
        onClose={() => {
          setShowViewDetails(false)
          setSelectedAssessment(null)
        }}
          assessment={selectedAssessment}
        />
    </div>
  )
}

const infirmaryData = Array.from({ length: 40 }, (_, index) => ({
  id: `STU${(index + 1).toString().padStart(3, '0')}`,
  name: `Student ${index + 1}`,
  school: `School ${Math.floor(index / 10) + 1}`,
  mobile: `98765${(index + 1).toString().padStart(5, '0')}`,
  class: `Grade ${Math.floor(Math.random() * 12) + 1}`,
  section: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
  gender: ['Male', 'Female'][Math.floor(Math.random() * 2)],
  email: `student${index + 1}@school.com`
}));

const AddInfirmaryRecord = ({ isOpen, onClose, student }) => {
  const [records, setRecords] = useState([{ complaints: '', details: '', treatment: '' }]);
  const [consentFrom, setConsentFrom] = useState('');
  
  if (!isOpen) return null;

  const currentDate = new Date().toLocaleDateString();
  const currentDay = new Date().toLocaleString('en-us', { weekday: 'long' });
  const currentTime = new Date().toLocaleTimeString();

  const handleAddMore = () => {
    setRecords([...records, { complaints: '', details: '', treatment: '' }]);
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
    console.log({ student, consentFrom, records });
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
              <div className="grid grid-cols-3 gap-6 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Date</label>
                  <p className="text-gray-900 font-medium">{currentDate}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Day</label>
                  <p className="text-gray-900 font-medium">{currentDay}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Time</label>
                  <p className="text-gray-900 font-medium">{currentTime}</p>
                </div>
              </div>

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

            {/* Consent Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Consent From *
              </label>
              <select
                value={consentFrom}
                onChange={(e) => setConsentFrom(e.target.value)}
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

            {/* Records Section */}
            <div className="space-y-4">
              {records.map((record, index) => (
                <div key={index} className="relative bg-gray-50 rounded-lg p-4 border">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
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

const Infirmary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const itemsPerPage = 20;
  const tableRef = useRef(null);

  const filteredData = useMemo(() => {
    return infirmaryData.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.school.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
    
    if (scrollPercentage > 80 && !loading && hasMore) {
      loadMoreItems();
    }
  }, [loading, hasMore]);

  const loadMoreItems = () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const nextPage = currentPage + 1;
    const nextEnd = Math.min(nextPage * itemsPerPage, filteredData.length);
    
    // Simulate loading delay
    setTimeout(() => {
      setVisibleRange(prev => ({
        start: prev.start,
        end: nextEnd
      }));
      setCurrentPage(nextPage);
      setHasMore(nextEnd < filteredData.length);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    const tableElement = tableRef.current;
    if (tableElement) {
      tableElement.addEventListener('scroll', handleScroll);
      return () => tableElement.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  // Reset pagination when search term changes
  useEffect(() => {
    setVisibleRange({ start: 0, end: itemsPerPage });
    setCurrentPage(1);
    setHasMore(true);
  }, [searchTerm]);

  const handleAddRecord = (student) => {
    setSelectedStudent(student);
    setShowAddRecord(true);
  };

  return (
    <div className="flex flex-col h-full bg-white p-6">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, ID, school, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 px-12 text-lg border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 border rounded-lg overflow-hidden shadow-lg bg-white">
        {/* Table Header */}
        <div className="grid grid-cols-8 gap-4 px-6 py-4 bg-gray-50 border-b sticky top-0 z-10">
          <div className="text-sm font-semibold text-gray-700">Sl.No</div>
          <div className="text-sm font-semibold text-gray-700">Student ID</div>
          <div className="text-sm font-semibold text-gray-700">Name</div>
          <div className="text-sm font-semibold text-gray-700">School</div>
          <div className="text-sm font-semibold text-gray-700">Mobile Number</div>
          <div className="text-sm font-semibold text-gray-700">Class</div>
          <div className="text-sm font-semibold text-gray-700">Email</div>
          <div className="text-sm font-semibold text-gray-700 text-center">Records</div>
        </div>

        {/* Table Body */}
        <div 
          ref={tableRef}
          className="overflow-y-auto max-h-[calc(100vh-300px)]"
        >
          {filteredData.slice(visibleRange.start, visibleRange.end).map((student, index) => (
            <div 
              key={student.id} 
              className="grid grid-cols-8 gap-4 px-6 py-4 border-b transition-colors hover:bg-gray-50"
            >
              <div className="flex items-center text-gray-600">
                {visibleRange.start + index + 1}
              </div>
              <div className="flex items-center font-medium text-gray-700">
                {student.id}
              </div>
              <div className="flex items-center text-gray-700">
                {student.name}
              </div>
              <div className="flex items-center text-gray-600">
                {student.school}
              </div>
              <div className="flex items-center text-gray-600">
                {student.mobile}
              </div>
              <div className="flex items-center text-gray-600">
                {student.class}
              </div>
              <div className="flex items-center text-gray-600">
                {student.email || `${student.id.toLowerCase()}@school.com`}
              </div>
              <div className="flex items-center justify-center">
                <button
                  onClick={() => handleAddRecord(student)}
                  className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                  title="Add Record"
                >
                  <FaPlus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {loading && (
            <div className="px-6 py-8 text-center text-gray-500 bg-gray-50 border-b">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <div className="mt-2">Loading more items...</div>
            </div>
          )}

          {/* Empty state */}
          {filteredData.length === 0 && (
            <div className="px-6 py-12 text-center">
              <div className="text-gray-400 text-lg mb-2">No records found</div>
              <div className="text-gray-500 text-sm">Try adjusting your search terms</div>
            </div>
          )}
        </div>
      </div>

      {/* Pagination info */}
      <div className="mt-4 px-2 text-sm text-gray-600 flex items-center justify-between">
        <div>
          Showing {visibleRange.start + 1} to {Math.min(visibleRange.end, filteredData.length)} of {filteredData.length} entries
        </div>
        {hasMore && (
          <div className="text-gray-500">
            Scroll down to load more
          </div>
        )}
      </div>

      {/* Add Record Form */}
      <AddInfirmaryRecord
        isOpen={showAddRecord}
        onClose={() => setShowAddRecord(false)}
        student={selectedStudent}
      />
    </div>
  );
};

const ReportFilters = ({ isOpen, onClose, filters, onFilterChange }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Filter Reports</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <IoMdClose className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* School Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              School
            </label>
            <select
              value={filters.school}
              onChange={(e) => onFilterChange('school', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Schools</option>
              {availableSchools.map(school => (
                <option key={school} value={school}>{school}</option>
              ))}
            </select>
          </div>

          {/* Class Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class
            </label>
            <select
              value={filters.class}
              onChange={(e) => onFilterChange('class', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Classes</option>
              {availableClasses.map(cls => (
                <option key={cls} value={cls}>Class {cls}</option>
              ))}
            </select>
          </div>

          {/* Section Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section
            </label>
            <select
              value={filters.section}
              onChange={(e) => onFilterChange('section', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Sections</option>
              {availableSections.map(section => (
                <option key={section} value={section}>Section {section}</option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={filters.fromDate}
                onChange={(e) => onFilterChange('fromDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={filters.toDate}
                onChange={(e) => onFilterChange('toDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Report Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Report Type
            </label>
            <select
              value={filters.reportType}
              onChange={(e) => onFilterChange('reportType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Report Type</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>

        <div className="px-6 py-4 border-t flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

const Report = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    school: '',
    class: '',
    section: '',
    fromDate: '',
    toDate: '',
    reportType: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const tableRef = useRef(null);

  const filteredData = useMemo(() => {
    return infirmaryData.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.school.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
    
    if (scrollPercentage > 80 && !loading && hasMore) {
      loadMoreItems();
    }
  }, [loading, hasMore]);

  const loadMoreItems = () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setTimeout(() => {
      setVisibleRange(prev => ({
        start: prev.start,
        end: Math.min(prev.end + 10, filteredData.length)
      }));
      setHasMore(visibleRange.end + 10 < filteredData.length);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    const tableElement = tableRef.current;
    if (tableElement) {
      tableElement.addEventListener('scroll', handleScroll);
      return () => tableElement.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  return (
    <div className="flex flex-col h-full bg-white p-6">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative flex gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 px-12 text-lg border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
          </div>
          <button
            onClick={() => setShowFilters(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <FaFilter />
            Filters
          </button>
        </div>

        {/* Active Filters Display */}
        {Object.values(filters).some(value => value) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => {
              if (!value) return null;
              return (
                <div key={key} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  <span>{key}: {value}</span>
                  <button
                    onClick={() => handleFilterChange(key, '')}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="flex-1 border rounded-lg overflow-hidden shadow-lg bg-white">
        {/* Table Header */}
        <div className="grid grid-cols-9 gap-4 px-6 py-4 bg-gray-50 border-b sticky top-0 z-10">
          <div className="text-sm font-semibold text-gray-700">Sl.No</div>
          <div className="text-sm font-semibold text-gray-700">Date</div>
          <div className="text-sm font-semibold text-gray-700">Name</div>
          <div className="text-sm font-semibold text-gray-700">Student ID</div>
          <div className="text-sm font-semibold text-gray-700">School</div>
          <div className="text-sm font-semibold text-gray-700">Complaints</div>
          <div className="text-sm font-semibold text-gray-700">Details</div>
          <div className="text-sm font-semibold text-gray-700">Consent From</div>
          <div className="text-sm font-semibold text-gray-700">Treatment</div>
        </div>

        {/* Table Body */}
        <div 
          ref={tableRef}
          className="overflow-y-auto max-h-[calc(100vh-300px)]"
        >
          {filteredData.slice(visibleRange.start, visibleRange.end).map((record, index) => (
            <div 
              key={record.id} 
              className="grid grid-cols-9 gap-4 px-6 py-4 border-b hover:bg-gray-50"
            >
              <div className="flex items-center text-gray-600">
                {visibleRange.start + index + 1}
              </div>
              <div className="flex items-center text-gray-600">
                {new Date(record.date).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
              <div className="flex items-center text-gray-700 font-medium">
                {record.name}
              </div>
              <div className="flex items-center text-gray-600">
                {record.studentId}
              </div>
              <div className="flex items-center text-gray-600">
                {record.school}
              </div>
              <div className="flex items-center">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {record.complaints}
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                {record.details}
              </div>
              <div className="flex items-center">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {record.consentFrom}
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                {record.treatment}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {loading && (
            <div className="px-6 py-8 text-center text-gray-500 bg-gray-50 border-b">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <div className="mt-2">Loading more items...</div>
            </div>
          )}

          {/* Empty state */}
          {filteredData.length === 0 && (
            <div className="px-6 py-12 text-center">
              <div className="text-gray-400 text-lg mb-2">No records found</div>
              <div className="text-gray-500 text-sm">Try adjusting your search terms</div>
            </div>
          )}
        </div>
      </div>

      {/* Pagination info */}
      <div className="mt-4 px-2 text-sm text-gray-600 flex items-center justify-between">
        <div>
          Showing {visibleRange.start + 1} to {Math.min(visibleRange.end, filteredData.length)} of {filteredData.length} entries
        </div>
        {hasMore && (
          <div className="text-gray-500">
            Scroll down to load more
          </div>
        )}
      </div>

      {/* Filters Modal */}
      <ReportFilters
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
      />
    </div>
  )
}

// Inventory Component
const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddItem, setShowAddItem] = useState(false)
  const [expandedCategory, setExpandedCategory] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [categories, setCategories] = useState([
    'Tablets',
    'Syrups',
    'Sprays',
    'Nasal Drops',
    'Inhaler',
    'Lotion',
    'Gels',
    'Oral Rehydration',
    'Balms',
    'Ointments',
    'Eye Drops',
    'Dressing Materials'
  ])
  const [newCategory, setNewCategory] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [isNewCategory, setIsNewCategory] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    currentStock: '',
    expiryDate: '',
  })

  // Toggle category expansion
  const toggleCategory = (category) => {
    if (expandedCategory === category) {
      setExpandedCategory('')
    } else {
      setExpandedCategory(category)
    }
  }

  // Categories from the Excel sheet
  const inventoryItems = [
    // Tablets
    {
      id: 1,
      category: 'Tablets',
      name: 'Tab Paracetamol 500mg',
      currentStock: 250,
      expiryDate: '2026-04',
      dailyUsage: Array(31).fill(null),
      total: 100,
      required: 150,
      received: 0
    },
    {
      id: 2,
      category: 'Tablets',
      name: 'Tab Cetirizine 10mg',
      currentStock: 180,
      expiryDate: '2026-06',
      dailyUsage: Array(31).fill(null),
      total: 80,
      required: 100,
      received: 0
    },
    {
      id: 3,
      category: 'Tablets',
      name: 'Tab Ibuprofen 400mg',
      currentStock: 200,
      expiryDate: '2026-05',
      dailyUsage: Array(31).fill(null),
      total: 90,
      required: 110,
      received: 0
    },
    {
      id: 4,
      category: 'Tablets',
      name: 'Tab Azithromycin 500mg',
      currentStock: 150,
      expiryDate: '2025-12',
      dailyUsage: Array(31).fill(null),
      total: 50,
      required: 100,
      received: 0
    },

    // Syrups
    {
      id: 5,
      category: 'Syrups',
      name: 'Paracetamol 125mg/5ml',
      currentStock: 80,
      expiryDate: '2025-11',
      dailyUsage: Array(31).fill(null),
      total: 30,
      required: 50,
      received: 0
    },
    {
      id: 6,
      category: 'Syrups',
      name: 'Cetirizine 5mg/5ml',
      currentStock: 65,
      expiryDate: '2025-12',
      dailyUsage: Array(31).fill(null),
      total: 25,
      required: 40,
      received: 0
    },
    {
      id: 7,
      category: 'Syrups',
      name: 'Amoxicillin 250mg/5ml',
      currentStock: 70,
      expiryDate: '2025-10',
      dailyUsage: Array(31).fill(null),
      total: 30,
      required: 40,
      received: 0
    },

    // Sprays
    {
      id: 8,
      category: 'Sprays',
      name: 'Nasal Decongestant',
      currentStock: 45,
      expiryDate: '2026-02',
      dailyUsage: Array(31).fill(null),
      total: 20,
      required: 25,
      received: 0
    },
    {
      id: 9,
      category: 'Sprays',
      name: 'Throat Spray',
      currentStock: 40,
      expiryDate: '2026-01',
      dailyUsage: Array(31).fill(null),
      total: 15,
      required: 25,
      received: 0
    },

    // Nasal Drops
    {
      id: 10,
      category: 'Nasal Drops',
      name: 'Saline Nasal Drops',
      currentStock: 60,
      expiryDate: '2026-03',
      dailyUsage: Array(31).fill(null),
      total: 25,
      required: 35,
      received: 0
    },
    {
      id: 11,
      category: 'Nasal Drops',
      name: 'Xylometazoline 0.1%',
      currentStock: 55,
      expiryDate: '2026-02',
      dailyUsage: Array(31).fill(null),
      total: 20,
      required: 35,
      received: 0
    },

    // Inhaler
    {
      id: 12,
      category: 'Inhaler',
      name: 'Salbutamol 100mcg',
      currentStock: 40,
      expiryDate: '2026-06',
      dailyUsage: Array(31).fill(null),
      total: 15,
      required: 25,
      received: 0
    },
    {
      id: 13,
      category: 'Inhaler',
      name: 'Budesonide 200mcg',
      currentStock: 35,
      expiryDate: '2026-05',
      dailyUsage: Array(31).fill(null),
      total: 15,
      required: 20,
      received: 0
    },

    // Lotion
    {
      id: 14,
      category: 'Lotion',
      name: 'Calamine Lotion 100ml',
      currentStock: 70,
      expiryDate: '2026-08',
      dailyUsage: Array(31).fill(null),
      total: 30,
      required: 40,
      received: 0
    },
    {
      id: 15,
      category: 'Lotion',
      name: 'Moisturizing Lotion 200ml',
      currentStock: 65,
      expiryDate: '2026-07',
      dailyUsage: Array(31).fill(null),
      total: 25,
      required: 40,
      received: 0
    },

    // Gels
    {
      id: 16,
      category: 'Gels',
      name: 'Diclofenac Gel 1%',
      currentStock: 85,
      expiryDate: '2026-09',
      dailyUsage: Array(31).fill(null),
      total: 35,
      required: 50,
      received: 0
    },
    {
      id: 17,
      category: 'Gels',
      name: 'Clotrimazole Gel 1%',
      currentStock: 75,
      expiryDate: '2026-08',
      dailyUsage: Array(31).fill(null),
      total: 30,
      required: 45,
      received: 0
    },

    // Oral Rehydration
    {
      id: 18,
      category: 'Oral Rehydration',
      name: 'ORS Powder Sachets',
      currentStock: 300,
      expiryDate: '2026-12',
      dailyUsage: Array(31).fill(null),
      total: 100,
      required: 200,
      received: 0
    },
    {
      id: 19,
      category: 'Oral Rehydration',
      name: 'Electrolyte Solution',
      currentStock: 250,
      expiryDate: '2026-11',
      dailyUsage: Array(31).fill(null),
      total: 90,
      required: 160,
      received: 0
    },

    // Balms
    {
      id: 20,
      category: 'Balms',
      name: 'Pain Relief Balm 30g',
      currentStock: 100,
      expiryDate: '2026-10',
      dailyUsage: Array(31).fill(null),
      total: 40,
      required: 60,
      received: 0
    },
    {
      id: 21,
      category: 'Balms',
      name: 'Cold Relief Balm 20g',
      currentStock: 90,
      expiryDate: '2026-09',
      dailyUsage: Array(31).fill(null),
      total: 35,
      required: 55,
      received: 0
    },

    // Ointments
    {
      id: 22,
      category: 'Ointments',
      name: 'Betamethasone 0.1%',
      currentStock: 80,
      expiryDate: '2026-07',
      dailyUsage: Array(31).fill(null),
      total: 30,
      required: 50,
      received: 0
    },
    {
      id: 23,
      category: 'Ointments',
      name: 'Mupirocin 2%',
      currentStock: 75,
      expiryDate: '2026-06',
      dailyUsage: Array(31).fill(null),
      total: 25,
      required: 50,
      received: 0
    },
    // Eye Drops
    {
      id: 24,
      category: 'Eye Drops',
      name: 'Artificial Tears',
      currentStock: 90,
      expiryDate: '2025-12',
      dailyUsage: Array(31).fill(null),
      total: 40,
      required: 50,
      received: 0
    },
    {
      id: 25,
      category: 'Eye Drops',
      name: 'Antibiotic Eye Drops',
      currentStock: 85,
      expiryDate: '2025-11',
      dailyUsage: Array(31).fill(null),
      total: 35,
      required: 50,
      received: 0
    },
    // Dressing Materials
    {
      id: 26,
      category: 'Dressing Materials',
      name: 'Sterile Gauze Pads',
      currentStock: 400,
      expiryDate: '2026-12',
      dailyUsage: Array(31).fill(null),
      total: 150,
      required: 250,
      received: 0
    },
    {
      id: 27,
      category: 'Dressing Materials',
      name: 'Adhesive Bandages',
      currentStock: 350,
      expiryDate: '2026-11',
      dailyUsage: Array(31).fill(null),
      total: 120,
      required: 230,
      received: 0
    },
    {
      id: 28,
      category: 'Dressing Materials',
      name: 'Cotton Rolls 500g',
      currentStock: 200,
      expiryDate: '2026-12',
      dailyUsage: Array(31).fill(null),
      total: 80,
      required: 120,
      received: 0
    },
    {
      id: 29,
      category: 'Dressing Materials',
      name: 'Surgical Tape 1"',
      currentStock: 150,
      expiryDate: '2026-10',
      dailyUsage: Array(31).fill(null),
      total: 60,
      required: 90,
      received: 0
    }
  ]

  // Handle item selection
  const handleItemClick = (item) => {
    setSelectedItem(item)
  }

  // Handle usage update
  const handleUsageUpdate = (newDailyUsage) => {
    console.log('Updated daily usage:', newDailyUsage)
  }

  const handleAddItem = (e) => {
    e.preventDefault()
    const category = isNewCategory ? newCategory : selectedCategory
    const newItem = {
      id: inventoryItems.length + 1,
      category,
      name: formData.name,
      currentStock: parseInt(formData.currentStock),
      expiryDate: formData.expiryDate,
      dailyUsage: Array(31).fill(null),
      total: 0,
      required: 0,
      received: 0
    }

    // Add new category if it's a new one
    if (isNewCategory && newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory])
    }

    // Add new item logic here
    console.log('New item:', newItem)
    
    // Reset form
    setFormData({ name: '', currentStock: '', expiryDate: '' })
    setNewCategory('')
    setSelectedCategory('')
    setIsNewCategory(false)
    setShowAddItem(false)
  }

  return (
    <div className="flex flex-col h-full bg-white p-4 overflow-hidden">
      {/* Header Section */}
      <div className="sticky top-0 bg-white z-30 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Inventory Management
          </h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 px-4 py-2 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <button
              onClick={() => setShowAddItem(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
            >
              <FaPlus /> Add Item
            </button>
          </div>
        </div>
      </div>

      {/* Categories Wrap Layout */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-wrap gap-4">
          {categories.map(category => {
            const isExpanded = expandedCategory === category;
            return (
              <div 
                key={category} 
                className={`bg-white rounded-lg shadow-md border transition-all duration-200 ${
                  isExpanded ? 'w-full' : 'w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)]'
                }`}
              >
                <div 
                  className={`flex items-center justify-between p-4 rounded-t-lg cursor-pointer ${
                    isExpanded ? 'bg-purple-100' : 'bg-purple-50'
                  }`}
                  onClick={() => toggleCategory(category)}
                >
                  <h3 className="text-lg font-semibold text-purple-800">{category}</h3>
                  <button className="text-purple-800">
                    {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
                  </button>
                </div>

                {isExpanded && (
                  <div className="p-4">
                    {inventoryItems
                      .filter(item => item.category === category)
                      .map(item => (
                        <div 
                          key={item.id} 
                          className="mb-3 last:mb-0 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleItemClick(item)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">{item.name}</h4>
                              <p className="text-sm text-gray-500">Stock: {item.currentStock} | Exp: {item.expiryDate}</p>
                            </div>
                            <div className="flex flex-col items-end text-sm">
                              <span className="text-blue-600">Total: {item.total}</span>
                              <span className="text-yellow-600">Req: {item.required}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Usage Calendar Modal */}
      <UsageCalendar
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        onSubmit={handleUsageUpdate}
      />

      {/* Add Item Modal */}
      {showAddItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add New Item</h3>
              <button 
                onClick={() => setShowAddItem(false)} 
                className="text-gray-500 hover:text-gray-700"
              >
                <IoMdClose size={24} />
              </button>
            </div>
            <form onSubmit={handleAddItem} className="space-y-4">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    id="existingCategory"
                    checked={!isNewCategory}
                    onChange={() => setIsNewCategory(false)}
                    className="text-blue-500"
                  />
                  <label htmlFor="existingCategory">Select Existing Category</label>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    id="newCategory"
                    checked={isNewCategory}
                    onChange={() => setIsNewCategory(true)}
                    className="text-blue-500"
                  />
                  <label htmlFor="newCategory">Create New Category</label>
                </div>
                
                {isNewCategory ? (
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Enter new category name"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                ) : (
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Item Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Item Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Current Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Stock</label>
                <input
                  type="number"
                  value={formData.currentStock}
                  onChange={(e) => setFormData({...formData, currentStock: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                <input
                  type="month"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddItem(false)}
                  className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const UsageCalendar = ({ item, isOpen, onClose, onSubmit }) => {
  const [dailyUsage, setDailyUsage] = useState([])
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Initialize dailyUsage when item changes
  useEffect(() => {
    if (item) {
      setDailyUsage(item.dailyUsage || Array(31).fill(null))
    }
  }, [item])

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const handleSubmit = () => {
    onSubmit(dailyUsage)
    onClose()
  }

  if (!isOpen || !item) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[800px] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold">{item.name} - Daily Usage</h3>
            <p className="text-sm text-gray-500">Current Stock: {item.currentStock} | Expiry: {item.expiryDate}</p>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="month"
              value={`${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`}
              onChange={(e) => setCurrentMonth(new Date(e.target.value))}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <IoMdClose size={24} />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-4 mb-6">
          {Array.from({ length: getDaysInMonth(currentMonth) }, (_, day) => (
            <div key={day} className="text-center">
              <div className="text-sm font-medium text-gray-700 mb-2">{day + 1}</div>
              <input
                type="number"
                value={dailyUsage[day] || ''}
                onChange={(e) => {
                  const newUsage = [...dailyUsage]
                  newUsage[day] = e.target.value ? parseInt(e.target.value) : null
                  setDailyUsage(newUsage)
                }}
                className="w-12 h-12 text-center border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <div className="text-sm text-gray-600 mb-1">Total Usage</div>
            <div className="font-semibold">{dailyUsage.reduce((sum, val) => sum + (val || 0), 0)}</div>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg text-center">
            <div className="text-sm text-gray-600 mb-1">Required</div>
            <div className="font-semibold">{item.required}</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg text-center">
            <div className="text-sm text-gray-600 mb-1">Received</div>
            <div className="font-semibold">{item.received}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

const Ahana = () => {
  const [activeTab, setActiveTab] = useState('students')

  const tabs = [
    { id: 'students', label: 'My Students' },
    { id: 'assessment', label: 'Assessment Report' },
    { id: 'infirmary', label: 'Infirmary' },
    { id: 'report', label: 'Report' },
    { id: 'inventory', label: 'Inventory' }
  ]

  return (
    <div className="w-full h-full">
      {/* Tab Navigation */}
      <div className="bg-gray-50 p-1 rounded-lg inline-flex gap-2">
        {tabs.map(tab => (
          <TabButton
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </TabButton>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === 'students' && <AllStudents />}
        {activeTab === 'assessment' && <AssessmentReport />}
        {activeTab === 'infirmary' && <Infirmary />}
        {activeTab === 'report' && <Report />}
        {activeTab === 'inventory' && <Inventory />}
      </div>
    </div>
  )
}

export default Ahana