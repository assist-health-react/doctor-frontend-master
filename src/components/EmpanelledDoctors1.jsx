import { useState } from 'react'
import { FaPlus, FaPhone, FaEnvelope, FaTimes, FaUserMd, FaUserCircle, FaUpload, FaEdit, FaTrash, FaSearch, FaFilter } from 'react-icons/fa'
import Select from 'react-select'

const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const FilterModal = ({ isOpen, onClose, filters, setFilters }) => {
  if (!isOpen) return null;

  const specialities = [
    'Cardiology', 'Dermatology', 'Neurology', 'Orthopedics', 
    'Pediatrics', 'Psychiatry', 'General Medicine'
  ];

  const cities = ['Chennai', 'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad'];
  const areas = {
    'Chennai': ['Anna Nagar', 'T Nagar', 'Adyar', 'Velachery', 'Tambaram'],
    'Bangalore': ['Whitefield', 'Koramangala', 'Indiranagar', 'JP Nagar'],
    'Mumbai': ['Andheri', 'Bandra', 'Colaba', 'Juhu'],
    'Delhi': ['Connaught Place', 'Dwarka', 'Rohini', 'Saket'],
    'Hyderabad': ['Banjara Hills', 'Jubilee Hills', 'Gachibowli', 'Hitech City']
  };

  const timings = [
    'Morning (6 AM - 12 PM)',
    'Afternoon (12 PM - 4 PM)',
    'Evening (4 PM - 8 PM)',
    'Night (8 PM - 12 AM)'
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">Filter Doctors</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Speciality Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Speciality
            </label>
            <select
              value={filters.speciality}
              onChange={(e) => handleFilterChange('speciality', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Specialities</option>
              {specialities.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          {/* Hospital Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hospital
            </label>
            <input
              type="text"
              value={filters.hospital}
              onChange={(e) => handleFilterChange('hospital', e.target.value)}
              placeholder="Search by hospital name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Location Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <select
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Area
              </label>
              <select
                value={filters.area}
                onChange={(e) => handleFilterChange('area', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!filters.city}
              >
                <option value="">All Areas</option>
                {filters.city && areas[filters.city].map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Timings Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timings
            </label>
            <select
              value={filters.timing}
              onChange={(e) => handleFilterChange('timing', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Timings</option>
              {timings.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>

          {/* Fees Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Consultation Fees Range
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                value={filters.minFees}
                onChange={(e) => handleFilterChange('minFees', e.target.value)}
                placeholder="Min"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                value={filters.maxFees}
                onChange={(e) => handleFilterChange('maxFees', e.target.value)}
                placeholder="Max"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Doctor Name</option>
              <option value="fees">Consultation Fees</option>
              <option value="rating">Rating</option>
              <option value="experience">Experience</option>
            </select>
          </div>

          {/* Apply/Reset Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              onClick={() => {
                setFilters({
                  speciality: '',
                  hospital: '',
                  city: '',
                  area: '',
                  timing: '',
                  minFees: '',
                  maxFees: '',
                  sortBy: 'name'
                });
              }}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Reset Filters
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AddDoctorForm = ({ onClose, initialData, isEditing = false }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    gender: '',
    education: '',
    speciality: null,
    specializedIn: '',
    experience: '',
    contactNumber: '',
    photo: null,
    workplace1: {
      hospitalName: '',
      address: '',
      city: null,
      area: null,
      timeSlots: [],
      consultationFee: ''
    },
    workplace2: {
      hospitalName: '',
      address: '',
      city: null,
      area: null,
      timeSlots: [],
      consultationFee: ''
    }
  });

  const specialityOptions = [
    { value: 'cardiology', label: 'Cardiology' },
    { value: 'dermatology', label: 'Dermatology' },
    { value: 'neurology', label: 'Neurology' },
    { value: 'orthopedics', label: 'Orthopedics' },
    { value: 'pediatrics', label: 'Pediatrics' },
    { value: 'psychiatry', label: 'Psychiatry' },
    { value: 'general-medicine', label: 'General Medicine' }
  ];

  const cityOptions = [
    { value: 'chennai', label: 'Chennai' },
    { value: 'bangalore', label: 'Bangalore' },
    { value: 'mumbai', label: 'Mumbai' },
    { value: 'delhi', label: 'Delhi' },
    { value: 'hyderabad', label: 'Hyderabad' }
  ];

  const areaOptions = {
    chennai: [
      { value: 'anna-nagar', label: 'Anna Nagar' },
      { value: 't-nagar', label: 'T Nagar' },
      { value: 'adyar', label: 'Adyar' },
      { value: 'velachery', label: 'Velachery' },
      { value: 'tambaram', label: 'Tambaram' }
    ],
    bangalore: [
      { value: 'whitefield', label: 'Whitefield' },
      { value: 'koramangala', label: 'Koramangala' },
      { value: 'indiranagar', label: 'Indiranagar' },
      { value: 'jp-nagar', label: 'JP Nagar' }
    ]
    // ... add other cities' areas
  };

  const timeSlotOptions = [
    { value: 'morning-1', label: '6 AM - 9 AM' },
    { value: 'morning-2', label: '9 AM - 12 PM' },
    { value: 'afternoon-1', label: '12 PM - 2 PM' },
    { value: 'afternoon-2', label: '2 PM - 4 PM' },
    { value: 'evening-1', label: '4 PM - 6 PM' },
    { value: 'evening-2', label: '6 PM - 8 PM' },
    { value: 'night', label: '8 PM - 10 PM' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleWorkplaceChange = (workplace, field, value) => {
    setFormData(prev => ({
      ...prev,
      [workplace]: {
        ...prev[workplace],
        [field]: value
      }
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, photo: file }));
    }
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (!value.startsWith('91')) {
      value = '91' + value;
    }
    if (value.length > 12) {
      value = value.slice(0, 12);
    }
    const formattedValue = value.length > 2 
      ? `+${value.slice(0, 2)} ${value.slice(2).replace(/(\d{5})(\d{5})/, '$1-$2')}`
      : `+${value}`;

    setFormData(prev => ({ ...prev, contactNumber: formattedValue }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">
            {isEditing ? 'Edit Doctor Profile' : 'Add New Doctor'}
          </h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
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
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number * <span className="text-gray-500 text-xs">(+91 format)</span>
              </label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handlePhoneChange}
                placeholder="+91 98765-43210"
                pattern="^\+91 \d{5}-\d{5}$"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Education Qualification *
              </label>
              <input
                type="text"
                name="education"
                value={formData.education}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Speciality *
              </label>
              <Select
                value={formData.speciality}
                onChange={(option) => setFormData(prev => ({ ...prev, speciality: option }))}
                options={specialityOptions}
                className="text-sm"
                placeholder="Select speciality"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialized In *
              </label>
              <input
                type="text"
                name="specializedIn"
                value={formData.specializedIn}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience (in years) *
              </label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Profile Photo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Photo *
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                    <span>Upload a photo</span>
                    <input
                      type="file"
                      name="photo"
                      onChange={handlePhotoChange}
                      className="sr-only"
                      accept="image/*"
                      required
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
              </div>
            </div>
          </div>

          {/* Workplace 1 */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-lg font-medium text-gray-800 mb-4">Work Place 1 (Hospital)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hospital Name *
                </label>
                <input
                  type="text"
                  value={formData.workplace1.hospitalName}
                  onChange={(e) => handleWorkplaceChange('workplace1', 'hospitalName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  value={formData.workplace1.address}
                  onChange={(e) => handleWorkplaceChange('workplace1', 'address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <Select
                  value={formData.workplace1.city}
                  onChange={(option) => handleWorkplaceChange('workplace1', 'city', option)}
                  options={cityOptions}
                  className="text-sm"
                  placeholder="Select city"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area *
                </label>
                <Select
                  value={formData.workplace1.area}
                  onChange={(option) => handleWorkplaceChange('workplace1', 'area', option)}
                  options={formData.workplace1.city ? areaOptions[formData.workplace1.city.value] : []}
                  className="text-sm"
                  placeholder="Select area"
                  isDisabled={!formData.workplace1.city}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Consultation Time Slots *
                </label>
                <Select
                  isMulti
                  value={formData.workplace1.timeSlots}
                  onChange={(options) => handleWorkplaceChange('workplace1', 'timeSlots', options)}
                  options={timeSlotOptions}
                  className="text-sm"
                  placeholder="Select time slots"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Consultation Fee *
                </label>
                <input
                  type="number"
                  value={formData.workplace1.consultationFee}
                  onChange={(e) => handleWorkplaceChange('workplace1', 'consultationFee', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  required
                />
              </div>
            </div>
          </div>

          {/* Workplace 2 */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-lg font-medium text-gray-800 mb-4">Work Place 2 (Clinic)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clinic Name
                </label>
                <input
                  type="text"
                  value={formData.workplace2.hospitalName}
                  onChange={(e) => handleWorkplaceChange('workplace2', 'hospitalName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.workplace2.address}
                  onChange={(e) => handleWorkplaceChange('workplace2', 'address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <Select
                  value={formData.workplace2.city}
                  onChange={(option) => handleWorkplaceChange('workplace2', 'city', option)}
                  options={cityOptions}
                  className="text-sm"
                  placeholder="Select city"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area
                </label>
                <Select
                  value={formData.workplace2.area}
                  onChange={(option) => handleWorkplaceChange('workplace2', 'area', option)}
                  options={formData.workplace2.city ? areaOptions[formData.workplace2.city.value] : []}
                  className="text-sm"
                  placeholder="Select area"
                  isDisabled={!formData.workplace2.city}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Consultation Time Slots
                </label>
                <Select
                  isMulti
                  value={formData.workplace2.timeSlots}
                  onChange={(options) => handleWorkplaceChange('workplace2', 'timeSlots', options)}
                  options={timeSlotOptions}
                  className="text-sm"
                  placeholder="Select time slots"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Consultation Fee
                </label>
                <input
                  type="number"
                  value={formData.workplace2.consultationFee}
                  onChange={(e) => handleWorkplaceChange('workplace2', 'consultationFee', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>
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
              {isEditing ? 'Save Changes' : 'Add Doctor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EmpanelledDoctors = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [filters, setFilters] = useState({
    speciality: '',
    hospital: '',
    city: '',
    area: '',
    timing: '',
    minFees: '',
    maxFees: '',
    sortBy: 'name'
  })

  // Sample doctors data
  const doctors = [
    {
      id: 1,
      name: "Dr. John Smith",
      image: null,
      phone: "+91 98765-43210",
      email: "john.smith@example.com",
      speciality: "Cardiology",
      hospital: "Apollo Hospitals",
      city: "Chennai",
      area: "Anna Nagar",
      fees: 1000,
      timing: "Morning (6 AM - 12 PM)",
      experience: 15,
      rating: 4.9,
      languages: ["English", "Tamil"],
      bio: "Board-certified cardiologist with expertise in interventional procedures."
    },
    {
      id: 2,
      name: "Dr. Lisa Chen",
      image: null,
      phone: "+91 98765-43211",
      email: "lisa.chen@example.com",
      speciality: "Dermatology",
      hospital: "Fortis Hospital",
      city: "Bangalore",
      area: "Koramangala",
      fees: 800,
      timing: "Evening (4 PM - 8 PM)",
      experience: 10,
      rating: 4.8,
      languages: ["English", "Hindi", "Kannada"],
      bio: "Expert dermatologist specializing in cosmetic and medical dermatology."
    },
    {
      id: 3,
      name: "Dr. Raj Patel",
      image: null,
      phone: "+91 98765-43212",
      email: "raj.patel@example.com",
      speciality: "Orthopedics",
      hospital: "Max Healthcare",
      city: "Mumbai",
      area: "Andheri",
      fees: 1200,
      timing: "Afternoon (12 PM - 4 PM)",
      experience: 20,
      rating: 4.7,
      languages: ["English", "Hindi", "Marathi"],
      bio: "Experienced orthopedic surgeon specializing in joint replacement."
    },
    {
      id: 4,
      name: "Dr. Sarah Williams",
      image: null,
      phone: "+91 98765-43213",
      email: "sarah.williams@example.com",
      speciality: "Pediatrics",
      hospital: "Rainbow Children's Hospital",
      city: "Chennai",
      area: "T Nagar",
      fees: 900,
      timing: "Morning (6 AM - 12 PM)",
      experience: 12,
      rating: 4.8,
      languages: ["English", "Tamil", "Hindi"],
      bio: "Dedicated pediatrician with special focus on newborn care."
    },
    {
      id: 5,
      name: "Dr. Arun Kumar",
      image: null,
      phone: "+91 98765-43214",
      email: "arun.kumar@example.com",
      speciality: "Neurology",
      hospital: "NIMHANS",
      city: "Bangalore",
      area: "Whitefield",
      fees: 1500,
      timing: "Evening (4 PM - 8 PM)",
      experience: 18,
      rating: 4.9,
      languages: ["English", "Kannada", "Hindi"],
      bio: "Renowned neurologist specializing in movement disorders."
    },
    {
      id: 6,
      name: "Dr. Priya Sharma",
      image: null,
      phone: "+91 98765-43215",
      email: "priya.sharma@example.com",
      speciality: "Gynecology",
      hospital: "Cloudnine Hospital",
      city: "Mumbai",
      area: "Bandra",
      fees: 1100,
      timing: "Morning (6 AM - 12 PM)",
      experience: 14,
      rating: 4.7,
      languages: ["English", "Hindi", "Marathi"],
      bio: "Expert in high-risk pregnancies and women's health."
    },
    {
      id: 7,
      name: "Dr. Michael Chang",
      image: null,
      phone: "+91 98765-43216",
      email: "michael.chang@example.com",
      speciality: "Cardiology",
      hospital: "Narayana Health",
      city: "Bangalore",
      area: "Indiranagar",
      fees: 1300,
      timing: "Afternoon (12 PM - 4 PM)",
      experience: 16,
      rating: 4.8,
      languages: ["English", "Kannada"],
      bio: "Specialist in interventional cardiology."
    },
    {
      id: 8,
      name: "Dr. Anjali Desai",
      image: null,
      phone: "+91 98765-43217",
      email: "anjali.desai@example.com",
      speciality: "Dermatology",
      hospital: "Skin & Care Clinic",
      city: "Mumbai",
      area: "Juhu",
      fees: 950,
      timing: "Evening (4 PM - 8 PM)",
      experience: 9,
      rating: 4.6,
      languages: ["English", "Hindi", "Gujarati"],
      bio: "Expert in cosmetic dermatology and skin disorders."
    },
    {
      id: 9,
      name: "Dr. Rajesh Verma",
      image: null,
      phone: "+91 98765-43218",
      email: "rajesh.verma@example.com",
      speciality: "Psychiatry",
      hospital: "Mind Wellness Center",
      city: "Delhi",
      area: "Rohini",
      fees: 1000,
      timing: "Morning (6 AM - 12 PM)",
      experience: 13,
      rating: 4.7,
      languages: ["English", "Hindi"],
      bio: "Specialized in mood disorders and anxiety treatment."
    },
    {
      id: 10,
      name: "Dr. Emma Thompson",
      image: null,
      phone: "+91 98765-43219",
      email: "emma.thompson@example.com",
      speciality: "Pediatrics",
      hospital: "Kids Care Hospital",
      city: "Chennai",
      area: "Adyar",
      fees: 850,
      timing: "Evening (4 PM - 8 PM)",
      experience: 11,
      rating: 4.8,
      languages: ["English", "Tamil"],
      bio: "Specialized in pediatric respiratory disorders."
    },
    {
      id: 11,
      name: "Dr. Suresh Menon",
      image: null,
      phone: "+91 98765-43220",
      email: "suresh.menon@example.com",
      speciality: "Orthopedics",
      hospital: "Joint Care Center",
      city: "Bangalore",
      area: "JP Nagar",
      fees: 1200,
      timing: "Morning (6 AM - 12 PM)",
      experience: 17,
      rating: 4.9,
      languages: ["English", "Kannada", "Malayalam"],
      bio: "Expert in sports injuries and joint replacements."
    },
    {
      id: 12,
      name: "Dr. Fatima Khan",
      image: null,
      phone: "+91 98765-43221",
      email: "fatima.khan@example.com",
      speciality: "Endocrinology",
      hospital: "Diabetes Care Center",
      city: "Mumbai",
      area: "Andheri",
      fees: 1100,
      timing: "Afternoon (12 PM - 4 PM)",
      experience: 15,
      rating: 4.7,
      languages: ["English", "Hindi", "Urdu"],
      bio: "Specialized in diabetes management and thyroid disorders."
    },
    {
      id: 13,
      name: "Dr. David Wilson",
      image: null,
      phone: "+91 98765-43222",
      email: "david.wilson@example.com",
      speciality: "Ophthalmology",
      hospital: "Eye Care Institute",
      city: "Chennai",
      area: "Velachery",
      fees: 900,
      timing: "Evening (4 PM - 8 PM)",
      experience: 14,
      rating: 4.8,
      languages: ["English", "Tamil"],
      bio: "Expert in retinal surgery and eye disorders."
    },
    {
      id: 14,
      name: "Dr. Meera Reddy",
      image: null,
      phone: "+91 98765-43223",
      email: "meera.reddy@example.com",
      speciality: "Gynecology",
      hospital: "Women's Health Center",
      city: "Hyderabad",
      area: "Banjara Hills",
      fees: 1000,
      timing: "Morning (6 AM - 12 PM)",
      experience: 12,
      rating: 4.6,
      languages: ["English", "Telugu", "Hindi"],
      bio: "Specialized in infertility treatment and women's wellness."
    },
    {
      id: 15,
      name: "Dr. Vikram Singh",
      image: null,
      phone: "+91 98765-43224",
      email: "vikram.singh@example.com",
      speciality: "Cardiology",
      hospital: "Heart Care Center",
      city: "Delhi",
      area: "Dwarka",
      fees: 1400,
      timing: "Afternoon (12 PM - 4 PM)",
      experience: 19,
      rating: 4.9,
      languages: ["English", "Hindi", "Punjabi"],
      bio: "Expert in cardiac surgery and heart disease management."
    },
    {
      id: 16,
      name: "Dr. Maya Patel",
      image: null,
      phone: "+91 98765-43225",
      email: "maya.patel@example.com",
      speciality: "Dermatology",
      hospital: "Skin & Beauty Clinic",
      city: "Bangalore",
      area: "Koramangala",
      fees: 1000,
      timing: "Evening (4 PM - 8 PM)",
      experience: 10,
      rating: 4.7,
      languages: ["English", "Gujarati", "Hindi"],
      bio: "Specialized in aesthetic dermatology and skin treatments."
    },
    {
      id: 17,
      name: "Dr. Samuel Joseph",
      image: null,
      phone: "+91 98765-43226",
      email: "samuel.joseph@example.com",
      speciality: "Neurology",
      hospital: "Brain & Spine Center",
      city: "Chennai",
      area: "Anna Nagar",
      fees: 1300,
      timing: "Morning (6 AM - 12 PM)",
      experience: 16,
      rating: 4.8,
      languages: ["English", "Tamil", "Malayalam"],
      bio: "Expert in neurological disorders and stroke management."
    },
    {
      id: 18,
      name: "Dr. Neha Gupta",
      image: null,
      phone: "+91 98765-43227",
      email: "neha.gupta@example.com",
      speciality: "Pediatrics",
      hospital: "Children's Specialty Hospital",
      city: "Mumbai",
      area: "Colaba",
      fees: 950,
      timing: "Evening (4 PM - 8 PM)",
      experience: 11,
      rating: 4.7,
      languages: ["English", "Hindi", "Marathi"],
      bio: "Specialized in pediatric developmental disorders."
    },
    {
      id: 19,
      name: "Dr. Arjun Nair",
      image: null,
      phone: "+91 98765-43228",
      email: "arjun.nair@example.com",
      speciality: "Orthopedics",
      hospital: "Bone & Joint Hospital",
      city: "Hyderabad",
      area: "Jubilee Hills",
      fees: 1200,
      timing: "Afternoon (12 PM - 4 PM)",
      experience: 15,
      rating: 4.8,
      languages: ["English", "Telugu", "Malayalam"],
      bio: "Expert in minimally invasive orthopedic surgery."
    },
    {
      id: 20,
      name: "Dr. Kavita Shah",
      image: null,
      phone: "+91 98765-43229",
      email: "kavita.shah@example.com",
      speciality: "Psychiatry",
      hospital: "Mental Health Institute",
      city: "Bangalore",
      area: "Indiranagar",
      fees: 1100,
      timing: "Evening (4 PM - 8 PM)",
      experience: 13,
      rating: 4.6,
      languages: ["English", "Hindi", "Kannada"],
      bio: "Specialized in cognitive behavioral therapy and mental wellness."
    },
    {
      id: 21,
      name: "Dr. Rahul Kapoor",
      image: null,
      phone: "+91 98765-43230",
      email: "rahul.kapoor@example.com",
      speciality: "ENT",
      hospital: "ENT Specialty Center",
      city: "Delhi",
      area: "Saket",
      fees: 1000,
      timing: "Morning (6 AM - 12 PM)",
      experience: 14,
      rating: 4.7,
      languages: ["English", "Hindi"],
      bio: "Expert in ear, nose, and throat surgeries."
    },
    {
      id: 22,
      name: "Dr. Anita Deshmukh",
      image: null,
      phone: "+91 98765-43231",
      email: "anita.deshmukh@example.com",
      speciality: "Gynecology",
      hospital: "Motherhood Hospital",
      city: "Mumbai",
      area: "Bandra",
      fees: 1200,
      timing: "Evening (4 PM - 8 PM)",
      experience: 16,
      rating: 4.8,
      languages: ["English", "Hindi", "Marathi"],
      bio: "Specialized in high-risk pregnancies and gynecological surgeries."
    },
    {
      id: 23,
      name: "Dr. Thomas Abraham",
      image: null,
      phone: "+91 98765-43232",
      email: "thomas.abraham@example.com",
      speciality: "Cardiology",
      hospital: "Heart & Vascular Institute",
      city: "Chennai",
      area: "T Nagar",
      fees: 1500,
      timing: "Morning (6 AM - 12 PM)",
      experience: 20,
      rating: 4.9,
      languages: ["English", "Tamil", "Malayalam"],
      bio: "Expert in interventional cardiology and cardiac rehabilitation."
    },
    {
      id: 24,
      name: "Dr. Priyanka Malhotra",
      image: null,
      phone: "+91 98765-43233",
      email: "priyanka.malhotra@example.com",
      speciality: "Dermatology",
      hospital: "Skin & Aesthetic Clinic",
      city: "Delhi",
      area: "Rohini",
      fees: 900,
      timing: "Afternoon (12 PM - 4 PM)",
      experience: 8,
      rating: 4.6,
      languages: ["English", "Hindi", "Punjabi"],
      bio: "Specialized in cosmetic dermatology and skin treatments."
    },
    {
      id: 25,
      name: "Dr. Rajat Verma",
      image: null,
      phone: "+91 98765-43234",
      email: "rajat.verma@example.com",
      speciality: "Orthopedics",
      hospital: "Advanced Orthopedic Center",
      city: "Bangalore",
      area: "Whitefield",
      fees: 1300,
      timing: "Evening (4 PM - 8 PM)",
      experience: 17,
      rating: 4.8,
      languages: ["English", "Hindi", "Kannada"],
      bio: "Expert in joint replacement and sports medicine."
    },
    {
      id: 26,
      name: "Dr. Lakshmi Rao",
      image: null,
      phone: "+91 98765-43235",
      email: "lakshmi.rao@example.com",
      speciality: "Pediatrics",
      hospital: "Children's Care Hospital",
      city: "Hyderabad",
      area: "Banjara Hills",
      fees: 800,
      timing: "Morning (6 AM - 12 PM)",
      experience: 12,
      rating: 4.7,
      languages: ["English", "Telugu", "Hindi"],
      bio: "Specialized in pediatric care and child development."
    }
  ]

  // Filter and sort doctors
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.speciality.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.hospital.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpeciality = !filters.speciality || doctor.speciality === filters.speciality;
    const matchesHospital = !filters.hospital || doctor.hospital.toLowerCase().includes(filters.hospital.toLowerCase());
    const matchesCity = !filters.city || doctor.city === filters.city;
    const matchesArea = !filters.area || doctor.area === filters.area;
    const matchesTiming = !filters.timing || doctor.timing === filters.timing;
    const matchesFees = (!filters.minFees || doctor.fees >= Number(filters.minFees)) &&
                       (!filters.maxFees || doctor.fees <= Number(filters.maxFees));

    return matchesSearch && matchesSpeciality && matchesHospital && 
           matchesCity && matchesArea && matchesTiming && matchesFees;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'fees':
        return a.fees - b.fees;
      case 'rating':
        return b.rating - a.rating;
      case 'experience':
        return b.experience - a.experience;
      default:
        return 0;
    }
  });

  const DetailView = ({ doctor, onClose }) => {
    const [showEditForm, setShowEditForm] = useState(false)

    const formatDoctorDataForEdit = (doctor) => {
      return {
        id: doctor.id,
        name: doctor.name,
        gender: doctor.gender || '',
        education: doctor.education || '',
        speciality: doctor.speciality?.value ? doctor.speciality : { value: doctor.speciality?.toLowerCase(), label: doctor.speciality },
        specializedIn: doctor.specializedIn || '',
        experience: doctor.experience || '',
        contactNumber: doctor.contactNumber || doctor.phone || '',
        photo: doctor.photo || doctor.image || null,
        workplace1: {
          hospitalName: doctor.workplace1?.hospitalName || doctor.hospital || '',
          address: doctor.workplace1?.address || '',
          city: doctor.workplace1?.city || (doctor.city ? { value: doctor.city.toLowerCase(), label: doctor.city } : null),
          area: doctor.workplace1?.area || (doctor.area ? { value: doctor.area.toLowerCase().replace(/\s+/g, '-'), label: doctor.area } : null),
          timeSlots: doctor.workplace1?.timeSlots || (doctor.timing ? [{ value: doctor.timing.toLowerCase().replace(/[()]/g, '').replace(/\s+/g, '-'), label: doctor.timing }] : []),
          consultationFee: doctor.workplace1?.consultationFee || doctor.fees || ''
        },
        workplace2: {
          hospitalName: doctor.workplace2?.hospitalName || '',
          address: doctor.workplace2?.address || '',
          city: doctor.workplace2?.city || null,
          area: doctor.workplace2?.area || null,
          timeSlots: doctor.workplace2?.timeSlots || [],
          consultationFee: doctor.workplace2?.consultationFee || ''
        }
      };
    };

    if (showEditForm) {
      return (
        <AddDoctorForm
          onClose={() => {
            setShowEditForm(false);
            onClose();
          }}
          initialData={formatDoctorDataForEdit(doctor)}
          isEditing={true}
        />
      );
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-2xl font-semibold text-gray-800">Doctor Profile</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowEditForm(true)}
                className="p-2 hover:bg-blue-50 rounded-full text-blue-500 transition-colors"
                title="Edit Doctor"
              >
                <FaEdit className="w-5 h-5" />
              </button>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
                title="Close"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="space-y-8">
            {/* Basic Information */}
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex flex-col items-center md:items-start">
                {doctor.photo ? (
                  <img 
                    src={URL.createObjectURL(doctor.photo)} 
                    alt={doctor.name}
                    className="w-40 h-40 rounded-full object-cover shadow-lg"
                  />
                ) : (
                  <FaUserCircle className="w-40 h-40 text-gray-400" />
                )}
              </div>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Full Name</h4>
                  <p className="text-lg font-medium text-gray-900">{doctor.name}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Gender</h4>
                  <p className="text-lg font-medium text-gray-900">{doctor.gender}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Contact Number</h4>
                  <p className="text-lg font-medium text-gray-900">{doctor.contactNumber}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Education Qualification</h4>
                  <p className="text-lg font-medium text-gray-900">{doctor.education}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Speciality</h4>
                  <p className="text-lg font-medium text-gray-900">{doctor.speciality?.label || doctor.speciality}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Specialized In</h4>
                  <p className="text-lg font-medium text-gray-900">{doctor.specializedIn}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Experience</h4>
                  <p className="text-lg font-medium text-gray-900">{doctor.experience} years</p>
                </div>
              </div>
            </div>

            {/* Work Place 1 (Hospital) */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Work Place 1 (Hospital)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Hospital Name</h4>
                  <p className="text-lg font-medium text-gray-900">{doctor.workplace1?.hospitalName}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Address</h4>
                  <p className="text-lg font-medium text-gray-900">{doctor.workplace1?.address}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">City</h4>
                  <p className="text-lg font-medium text-gray-900">{doctor.workplace1?.city?.label}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Area</h4>
                  <p className="text-lg font-medium text-gray-900">{doctor.workplace1?.area?.label}</p>
                </div>

                <div className="col-span-2">
                  <h4 className="text-sm font-medium text-gray-500">Consultation Time Slots</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {doctor.workplace1?.timeSlots?.map((slot, index) => (
                      <span 
                        key={index}
                        className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium"
                      >
                        {slot.label}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Consultation Fee</h4>
                  <p className="text-lg font-medium text-gray-900">₹{doctor.workplace1?.consultationFee}</p>
                </div>
              </div>
            </div>

            {/* Work Place 2 (Clinic) - Only show if data exists */}
            {doctor.workplace2?.hospitalName && (
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Work Place 2 (Clinic)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Clinic Name</h4>
                    <p className="text-lg font-medium text-gray-900">{doctor.workplace2?.hospitalName}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Address</h4>
                    <p className="text-lg font-medium text-gray-900">{doctor.workplace2?.address}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">City</h4>
                    <p className="text-lg font-medium text-gray-900">{doctor.workplace2?.city?.label}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Area</h4>
                    <p className="text-lg font-medium text-gray-900">{doctor.workplace2?.area?.label}</p>
                  </div>

                  <div className="col-span-2">
                    <h4 className="text-sm font-medium text-gray-500">Consultation Time Slots</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {doctor.workplace2?.timeSlots?.map((slot, index) => (
                        <span 
                          key={index}
                          className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium"
                        >
                          {slot.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Consultation Fee</h4>
                    <p className="text-lg font-medium text-gray-900">₹{doctor.workplace2?.consultationFee}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Fixed header section */}
      <div className="flex-none bg-white px-4 pt-4 pb-6 sticky top-0 z-50 border-b border-gray-200">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Empanelled Doctors</h2>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowFilters(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <FaFilter />
                Filters
              </button>
              <button 
                onClick={() => setShowAddForm(true)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <FaPlus />
                Add Doctor
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by doctor name, speciality, or hospital..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Active Filters Display */}
          {Object.entries(filters).some(([key, value]) => value && key !== 'sortBy') && (
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, value]) => {
                if (value && key !== 'sortBy') {
                  return (
                    <span
                      key={key}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {key}: {value}
                      <button
                        onClick={() => setFilters(prev => ({ ...prev, [key]: '' }))}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <FaTimes className="w-3 h-3" />
                      </button>
                    </span>
                  );
                }
                return null;
              })}
            </div>
          )}
        </div>
      </div>

      {/* Scrollable doctors container */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <div 
                key={doctor.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center gap-4">
                    {doctor.image ? (
                      <img 
                        src={doctor.image} 
                        alt={doctor.name}
                        className="w-20 h-20 rounded-full object-cover shadow-md"
                      />
                    ) : (
                      <FaUserCircle className="w-20 h-20 text-gray-400" />
                    )}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{doctor.name}</h3>
                      <p className="text-gray-500">{doctor.speciality}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <p className="flex items-center gap-2 text-gray-600">
                      <FaUserMd className="text-blue-500" />
                      {doctor.hospital}
                    </p>
                    <p className="flex items-center gap-2 text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {doctor.area}, {doctor.city}
                    </p>
                  </div>
                  
                  <div className="mt-4 flex gap-3">
                    <span className="bg-blue-50 px-4 py-1.5 rounded-full text-blue-700 text-sm font-medium">
                      ₹{doctor.fees}
                    </span>
                    <span className="bg-green-50 px-4 py-1.5 rounded-full text-green-700 text-sm font-medium">
                      {doctor.rating} ★
                    </span>
                  </div>

                  <button 
                    onClick={() => setSelectedDoctor(doctor)}
                    className="mt-4 w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-2.5 rounded-xl transition-colors font-medium"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <FilterModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        setFilters={setFilters}
      />

      {selectedDoctor && (
        <DetailView 
          doctor={selectedDoctor} 
          onClose={() => setSelectedDoctor(null)} 
        />
      )}

      {showAddForm && (
        <AddDoctorForm onClose={() => setShowAddForm(false)} />
      )}
    </div>
  )
}

export default EmpanelledDoctors 