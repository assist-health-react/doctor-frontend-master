import { useState } from 'react'
import { FaSearch, FaPlus, FaEye, FaTimes, FaEdit, FaTrash, FaUser, FaEnvelope, FaPhone, FaCalendar, FaClock, FaMapMarkerAlt, FaEllipsisV, FaClipboardList } from 'react-icons/fa'

const AddAppointmentForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: '',
    number: '',
    services: '',
    date: '',
    time: '',
    additionalInfo: '',
    address: '',
    appointmentFor: 'member',
    selectedSubProfile: '',
    selectedDoctor: ''
  })

  // Sample doctors data
  const doctors = [
    { id: 'DOC001', name: 'Dr. Amit Shah', specialty: 'General Physician' },
    { id: 'DOC002', name: 'Dr. Priya Patel', specialty: 'Pediatrician' },
    { id: 'DOC003', name: 'Dr. Rajesh Kumar', specialty: 'Cardiologist' },
    { id: 'DOC004', name: 'Dr. Sneha Desai', specialty: 'Dentist' },
    { id: 'DOC005', name: 'Dr. Vikram Mehta', specialty: 'Orthopedic' },
    { id: 'DOC006', name: 'Dr. Anjali Singh', specialty: 'Gynecologist' },
    { id: 'DOC007', name: 'Dr. Suresh Reddy', specialty: 'Dermatologist' },
    { id: 'DOC008', name: 'Dr. Meera Iyer', specialty: 'ENT Specialist' },
    { id: 'DOC009', name: 'Dr. Arjun Kapoor', specialty: 'Neurologist' },
    { id: 'DOC010', name: 'Dr. Lakshmi Rao', specialty: 'Ophthalmologist' }
  ]

  const subProfiles = [
    { id: 'SP001', name: 'Sub-Profile 1' },
    { id: 'SP002', name: 'Sub-Profile 2' },
    { id: 'SP003', name: 'Sub-Profile 3' },
    { id: 'SP004', name: 'Sub-Profile 4' },
    { id: 'SP005', name: 'Sub-Profile 5' }
  ]

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
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">Book New Appointment</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Appointment For
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="appointmentFor"
                  value="member"
                  checked={formData.appointmentFor === 'member'}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Member</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="appointmentFor"
                  value="subProfile"
                  checked={formData.appointmentFor === 'subProfile'}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Sub Profile</span>
              </label>
            </div>
          </div>

          {formData.appointmentFor === 'subProfile' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Sub Profile *
              </label>
              <select
                name="selectedSubProfile"
                value={formData.selectedSubProfile}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={formData.appointmentFor === 'subProfile'}
              >
                <option value="">Select Sub Profile</option>
                {subProfiles.map(profile => (
                  <option key={profile.id} value={profile.id}>
                    {profile.name}
                  </option>
                ))}
              </select>
            </div>
          )}

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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="number"
                value={formData.number}
                onChange={handleInputChange}
                placeholder="+91 98765-43210"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Doctor Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Doctor *
              </label>
              <select
                name="selectedDoctor"
                value={formData.selectedDoctor}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Doctor</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialty}
                  </option>
                ))}
              </select>
            </div>

            {/* Services */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Services *
              </label>
              <select
                name="services"
                value={formData.services}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Service</option>
                <option value="consultation">General Consultation</option>
                <option value="checkup">Regular Checkup</option>
                <option value="dental">Dental Care</option>
                <option value="specialist">Specialist Consultation</option>
                <option value="physiotherapy">Physiotherapy</option>
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time *
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address *
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>

          {/* Additional Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Information
            </label>
            <textarea
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
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
              Book Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const NoteActions = ({ note, onClose, onEdit, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedNote, setEditedNote] = useState(note)

  const handleEdit = () => {
    onEdit(editedNote)
    setIsEditing(false)
  }

  return (
    <div className="absolute z-10 bg-white rounded-lg shadow-lg p-4 w-64">
      {!isEditing ? (
        <>
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-medium text-gray-800">Note</h4>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FaTimes />
            </button>
          </div>
          <p className="text-gray-600 mb-3">{note}</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="px-2 py-1 text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <FaEdit /> Edit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-2 py-1 text-red-600 hover:text-red-800 flex items-center gap-1"
            >
              <FaTrash /> Delete
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-medium text-gray-800">Edit Note</h4>
            <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700">
              <FaTimes />
            </button>
          </div>
          <textarea
            value={editedNote}
            onChange={(e) => setEditedNote(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg mb-3"
            rows="3"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleEdit}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h4 className="text-lg font-medium text-gray-800 mb-3">Confirm Delete</h4>
            <p className="text-gray-600 mb-4">Are you sure you want to delete this note?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete()
                  setShowDeleteConfirm(false)
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const AppointmentDetailsModal = ({ appointment, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">Appointment Details</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Doctor Information */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaUser className="text-blue-600 w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Doctor</p>
                <p className="font-medium text-lg">{appointment.doctor?.name}</p>
                <p className="text-blue-600">{appointment.doctor?.specialty}</p>
              </div>
            </div>
          </div>

          {/* Appointment Type */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaUser className="text-blue-600 w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Appointment For</p>
              <p className="font-medium capitalize">{appointment.appointmentFor || 'Member'}</p>
              {appointment.appointmentFor === 'subProfile' && appointment.selectedSubProfile && (
                <p className="text-sm text-gray-600 mt-1">
                  Sub Profile: {appointment.selectedSubProfile}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaUser className="text-blue-600 w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{appointment.name}</p>
              </div>
            </div>

            {/* Member ID */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaUser className="text-blue-600 w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Member ID</p>
                <p className="font-medium">{appointment.memberId}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaEnvelope className="text-blue-600 w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{appointment.email || 'Not provided'}</p>
              </div>
            </div>

            {/* Gender */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaUser className="text-blue-600 w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="font-medium capitalize">{appointment.gender || 'Not specified'}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaPhone className="text-blue-600 w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="font-medium">{appointment.phone}</p>
              </div>
            </div>

            {/* Service */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaCalendar className="text-blue-600 w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Service</p>
                <p className="font-medium">{appointment.services || 'Not specified'}</p>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaCalendar className="text-blue-600 w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{appointment.date || 'Not specified'}</p>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaClock className="text-blue-600 w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-medium">{appointment.time || 'Not specified'}</p>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaClock className="text-blue-600 w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                  ${appointment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                    appointment.status === 'ongoing' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-blue-100 text-blue-800'}`}
                >
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Payment Status */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaCalendar className="text-blue-600 w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Status</p>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                  ${appointment.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                >
                  {appointment.paymentStatus.charAt(0).toUpperCase() + appointment.paymentStatus.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaMapMarkerAlt className="text-blue-600 w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-medium">{appointment.address}</p>
            </div>
          </div>

          {/* Additional Information */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaClipboardList className="text-blue-600 w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Additional Information</p>
              <p className="font-medium">{appointment.additionalInfo || 'No additional information provided'}</p>
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-end pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const StatusDropdown = ({ status, onStatusChange, appointmentId }) => {
  const [isOpen, setIsOpen] = useState(false)

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    ongoing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }

  const handleStatusChange = (newStatus) => {
    onStatusChange(appointmentId, newStatus)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${statusColors[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
        <FaEllipsisV className="w-3 h-3" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-20 border border-gray-200 divide-y divide-gray-100">
            {Object.keys(statusColors).map((statusOption) => (
              <button
                key={statusOption}
                onClick={() => handleStatusChange(statusOption)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 ${
                  status === statusOption ? 'bg-gray-50 font-medium' : ''
                }`}
              >
                <span className={`w-3 h-3 rounded-full ${
                  statusOption === 'pending' ? 'bg-yellow-500' :
                  statusOption === 'ongoing' ? 'bg-blue-500' :
                  statusOption === 'completed' ? 'bg-green-500' :
                  'bg-red-500'
                }`}></span>
                <span className="flex-1">{statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}</span>
                {status === statusOption && (
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

const DoctorProfileModal = ({ doctor, onClose }) => {
  if (!doctor) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">Doctor Profile</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <FaUser className="w-10 h-10 text-blue-500" />
            </div>
            <div>
              <h4 className="text-xl font-semibold text-gray-900">{doctor.name}</h4>
              <p className="text-blue-600 font-medium">{doctor.specialty}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Doctor ID</p>
              <p className="font-medium">{doctor.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Experience</p>
              <p className="font-medium">{doctor.experience || '10+ years'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Qualification</p>
              <p className="font-medium">{doctor.qualification || 'MBBS, MD'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Languages</p>
              <p className="font-medium">{doctor.languages || 'English, Hindi'}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-2">About</p>
            <p className="text-gray-700">
              {doctor.about || `${doctor.name} is a highly qualified and experienced ${doctor.specialty.toLowerCase()} with expertise in providing comprehensive medical care. The doctor has a strong track record of successful patient treatments and maintains the highest standards of professional medical practice.`}
            </p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const Appointments = () => {
  // Sample data - replace with actual data
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      memberId: "MEM001",
      name: "Rajesh Kumar",
      phone: "+91 98765-43210",
      status: "pending",
      note: "First consultation",
      paymentStatus: "paid",
      doctor: { id: 'DOC001', name: 'Dr. Amit Shah', specialty: 'General Physician' }
    },
    {
      id: 2,
      memberId: "MEM002",
      name: "Priya Sharma",
      phone: "+91 98765-43211",
      status: "ongoing",
      note: "Follow-up appointment",
      paymentStatus: "pending",
      doctor: { id: 'DOC002', name: 'Dr. Priya Patel', specialty: 'Pediatrician' }
    },
    {
      id: 3,
      memberId: "MEM003",
      name: "Arun Patel",
      phone: "+91 98765-43212",
      status: "completed",
      note: "Regular checkup",
      paymentStatus: "paid",
      doctor: { id: 'DOC003', name: 'Dr. Rajesh Kumar', specialty: 'Cardiologist' }
    },
    {
      id: 4,
      memberId: "MEM004",
      name: "Lakshmi Venkatesh",
      phone: "+91 98765-43213",
      status: "pending",
      note: "Specialist consultation",
      paymentStatus: "pending",
      doctor: { id: 'DOC004', name: 'Dr. Sneha Desai', specialty: 'Dentist' }
    },
    {
      id: 5,
      memberId: "MEM005",
      name: "Mohammed Khan",
      phone: "+91 98765-43214",
      status: "ongoing",
      note: "Dental checkup",
      paymentStatus: "paid",
      doctor: { id: 'DOC005', name: 'Dr. Vikram Mehta', specialty: 'Orthopedic' }
    },
    {
      id: 6,
      memberId: "MEM006",
      name: "Anjali Desai",
      phone: "+91 98765-43215",
      status: "completed",
      note: "Post-surgery follow up",
      paymentStatus: "paid",
      doctor: { id: 'DOC006', name: 'Dr. Anjali Singh', specialty: 'Gynecologist' }
    },
    {
      id: 7,
      memberId: "MEM007",
      name: "Suresh Reddy",
      phone: "+91 98765-43216",
      status: "pending",
      note: "Annual health screening",
      paymentStatus: "pending",
      doctor: { id: 'DOC007', name: 'Dr. Suresh Reddy', specialty: 'Dermatologist' }
    },
    {
      id: 8,
      memberId: "MEM008",
      name: "Meera Iyer",
      phone: "+91 98765-43217",
      status: "ongoing",
      note: "Physiotherapy session",
      paymentStatus: "paid",
      doctor: { id: 'DOC008', name: 'Dr. Meera Iyer', specialty: 'ENT Specialist' }
    },
    {
      id: 9,
      memberId: "MEM009",
      name: "Vikram Mehta",
      phone: "+91 98765-43218",
      status: "completed",
      note: "Cardiology consultation",
      paymentStatus: "paid",
      doctor: { id: 'DOC009', name: 'Dr. Arjun Kapoor', specialty: 'Neurologist' }
    },
    {
      id: 10,
      memberId: "MEM010",
      name: "Neha Gupta",
      phone: "+91 98765-43219",
      status: "pending",
      note: "Dermatology consultation",
      paymentStatus: "pending",
      doctor: { id: 'DOC010', name: 'Dr. Lakshmi Rao', specialty: 'Ophthalmologist' }
    },
    {
      id: 11,
      memberId: "MEM011",
      name: "Arjun Kapoor",
      phone: "+91 98765-43220",
      status: "ongoing",
      note: "Orthopedic follow-up",
      paymentStatus: "paid",
      doctor: { id: 'DOC009', name: 'Dr. Arjun Kapoor', specialty: 'Neurologist' }
    },
    {
      id: 12,
      memberId: "MEM012",
      name: "Sanya Malhotra",
      phone: "+91 98765-43221",
      status: "completed",
      note: "Dental cleaning",
      paymentStatus: "paid",
      doctor: { id: 'DOC004', name: 'Dr. Sneha Desai', specialty: 'Dentist' }
    },
    {
      id: 13,
      memberId: "MEM013",
      name: "Rahul Verma",
      phone: "+91 98765-43222",
      status: "pending",
      note: "Eye examination",
      paymentStatus: "pending",
      doctor: { id: 'DOC008', name: 'Dr. Meera Iyer', specialty: 'ENT Specialist' }
    },
    {
      id: 14,
      memberId: "MEM014",
      name: "Pooja Singh",
      phone: "+91 98765-43223",
      status: "ongoing",
      note: "Nutrition consultation",
      paymentStatus: "paid",
      doctor: { id: 'DOC002', name: 'Dr. Priya Patel', specialty: 'Pediatrician' }
    },
    {
      id: 15,
      memberId: "MEM015",
      name: "Karan Malhotra",
      phone: "+91 98765-43224",
      status: "completed",
      note: "General health checkup",
      paymentStatus: "paid",
      doctor: { id: 'DOC003', name: 'Dr. Rajesh Kumar', specialty: 'Cardiologist' }
    },
    {
      id: 16,
      memberId: "MEM016",
      name: "Anita Deshmukh",
      phone: "+91 98765-43225",
      status: "pending",
      note: "Gynecology consultation",
      paymentStatus: "pending",
      doctor: { id: 'DOC006', name: 'Dr. Anjali Singh', specialty: 'Gynecologist' }
    },
    {
      id: 17,
      memberId: "MEM017",
      name: "Rajiv Khanna",
      phone: "+91 98765-43226",
      status: "ongoing",
      note: "Diabetes checkup",
      paymentStatus: "paid",
      doctor: { id: 'DOC005', name: 'Dr. Vikram Mehta', specialty: 'Orthopedic' }
    },
    {
      id: 18,
      memberId: "MEM018",
      name: "Deepika Patel",
      phone: "+91 98765-43227",
      status: "completed",
      note: "Vaccination",
      paymentStatus: "paid",
      doctor: { id: 'DOC001', name: 'Dr. Amit Shah', specialty: 'General Physician' }
    },
    {
      id: 19,
      memberId: "MEM019",
      name: "Amit Shah",
      phone: "+91 98765-43228",
      status: "pending",
      note: "ENT consultation",
      paymentStatus: "pending",
      doctor: { id: 'DOC009', name: 'Dr. Arjun Kapoor', specialty: 'Neurologist' }
    },
    {
      id: 20,
      memberId: "MEM020",
      name: "Riya Sharma",
      phone: "+91 98765-43229",
      status: "ongoing",
      note: "Physical therapy",
      paymentStatus: "paid",
      doctor: { id: 'DOC001', name: 'Dr. Amit Shah', specialty: 'General Physician' }
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [selectedDoctor, setSelectedDoctor] = useState(null)

  // Filter appointments based on search term and status
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = (
      appointment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.phone.includes(searchTerm)
    )

    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedAppointments = filteredAppointments.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleViewAppointment = (appointmentId) => {
    const appointment = appointments.find(app => app.id === appointmentId)
    setSelectedAppointment(appointment)
  }

  const handleStatusChange = (appointmentId, newStatus) => {
    setAppointments(appointments.map(appointment => 
      appointment.id === appointmentId
        ? { ...appointment, status: newStatus }
        : appointment
    ))
  }

  return (
    <div className="w-full h-full p-2 sm:p-4 lg:p-6 max-w-full overflow-hidden">
      {/* Header with search, filter, and book button */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 mb-4 lg:mb-6">
        <h2 className="text-2xl font-semibold whitespace-nowrap flex-shrink-0">Appointments</h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:max-w-3xl">
          {/* Search Input */}
          <div className="relative flex-1 min-w-0">
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Status Filter Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-40 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-shrink-0"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Book Appointment Button */}
          <button 
            onClick={() => setShowAddForm(true)}
            className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 whitespace-nowrap transition-colors flex-shrink-0"
          >
            <FaPlus className="w-3.5 h-3.5" />
            Book Appointment
          </button>
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="h-[calc(100vh-180px)] lg:h-[calc(100vh-200px)] flex flex-col">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[60px]">S.No</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[100px]">M-ID</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[160px]">Name</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[160px]">Doctor</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[130px]">Number</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px]">Status</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell w-[180px]">Comments</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[100px]">Payment</th>
                      <th scope="col" className="px-3 py-3.5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[100px]">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedAppointments.map((appointment, index) => (
                      <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{startIndex + index + 1}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appointment.memberId}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.name}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                          <button
                            onClick={() => setSelectedDoctor(appointment.doctor)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            {appointment.doctor?.name}
                          </button>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.phone}</td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          <StatusDropdown
                            status={appointment.status}
                            onStatusChange={handleStatusChange}
                            appointmentId={appointment.id}
                          />
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 hidden lg:table-cell">
                          <div className="max-w-[160px] truncate">{appointment.note}</div>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${appointment.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {appointment.paymentStatus.charAt(0).toUpperCase() + appointment.paymentStatus.slice(1)}
                          </span>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => handleViewAppointment(appointment.id)}
                            className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm inline-flex items-center gap-1.5 transition-colors"
                          >
                            <FaEye className="w-3.5 h-3.5" />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination Controls */}
      {filteredAppointments.length > 0 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-4 sm:px-6 mt-4 rounded-lg shadow-sm">
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAppointments.length)} of {filteredAppointments.length} entries
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center rounded-l-md px-3 py-2 text-sm font-medium
                    ${currentPage === 1
                      ? 'text-gray-400 bg-gray-100'
                      : 'text-gray-500 bg-white hover:bg-gray-50 border border-gray-300'
                    }`}
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  const isCurrentPage = pageNumber === currentPage;

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-medium
                        ${isCurrentPage
                          ? 'z-10 bg-blue-600 text-white'
                          : 'text-gray-500 bg-white hover:bg-gray-50 border border-gray-300'
                        }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center rounded-r-md px-3 py-2 text-sm font-medium
                    ${currentPage === totalPages
                      ? 'text-gray-400 bg-gray-100'
                      : 'text-gray-500 bg-white hover:bg-gray-50 border border-gray-300'
                    }`}
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Pagination */}
      <div className="flex flex-1 justify-between sm:hidden mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
            ${currentPage === 1
              ? 'text-gray-400 bg-gray-100'
              : 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-300'
            }`}
        >
          Previous
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
            ${currentPage === totalPages
              ? 'text-gray-400 bg-gray-100'
              : 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-300'
            }`}
        >
          Next
        </button>
      </div>

      {/* Modals */}
      {showAddForm && (
        <AddAppointmentForm onClose={() => setShowAddForm(false)} />
      )}

      {selectedAppointment && (
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
        />
      )}

      {/* Add Doctor Profile Modal */}
      {selectedDoctor && (
        <DoctorProfileModal
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
        />
      )}
    </div>
  )
}

export default Appointments 