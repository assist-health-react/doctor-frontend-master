import { useState, useEffect } from 'react'
import { FaPlus, FaPhone, FaEnvelope, FaTimes, FaUserMd, FaUserCircle, FaUpload, FaEdit, FaTrash, FaSearch, FaFilter } from 'react-icons/fa'
import { BiSearch } from 'react-icons/bi'

// Helper function to convert 24h to 12h format
const formatTime = (time24) => {
  const [hours, minutes] = time24.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 || 12
  return `${hour12}:${minutes} ${ampm}`
}

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

const Doctors = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [lastScrollTop, setLastScrollTop] = useState(0)
  const [scrollDirection, setScrollDirection] = useState(null)
  const [displayRange, setDisplayRange] = useState({ start: 0, end: 9 })
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocus, setSearchFocus] = useState(false)
  const itemsPerPage = 9 // Show 9 doctors per page (3x3 grid)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: '',
    mobile: '',
    profilePic: null,
    education: '',
    medicalCouncilNumber: '',
    languages: [],
    intro: '',
    password: '',
    confirmPassword: '',
    signature: null
  })

  // Add new state for filters
  const [filters, setFilters] = useState({
    serviceType: 'all',
    gender: 'all',
    availability: 'all'
  })

  const [showFilters, setShowFilters] = useState(false)

  // Sample doctors data
  const doctors = [
    {
      id: 1,
      name: "Dr. John Smith",
      image: null,
      phone: "+91 98765-43210",
      email: "john.smith@example.com",
      gender: "Male",
      education: "MBBS, MD (Internal Medicine)",
      medicalCouncilNumber: "MCI-12345",
      signature: null,
      patients: 245,
      rating: 4.9,
      languages: ["English", "Hindi"],
      bio: "Board-certified physician with expertise in internal medicine and a focus on preventive care.",
      serviceType: "online",
      availability: {
        from: "09:00",
        to: "17:00"
      }
    },
    {
      id: 2,
      name: "Dr. Lisa Chen",
      image: null,
      phone: "+91 98765-43211",
      email: "lisa.chen@example.com",
      gender: "Female",
      education: "MBBS, MS (Orthopedics)",
      medicalCouncilNumber: "MCI-23456",
      patients: 180,
      rating: 4.8,
      languages: ["English", "Hindi", "Tamil"],
      bio: "Experienced orthopedic surgeon specializing in sports injuries and joint replacements.",
      serviceType: "offline",
      availability: {
        from: "10:00",
        to: "18:00"
      }
    },
    {
      id: 3,
      name: "Dr. Raj Patel",
      image: null,
      phone: "+91 98765-43212",
      email: "raj.patel@example.com",
      gender: "Male",
      education: "MBBS, DM (Cardiology)",
      medicalCouncilNumber: "MCI-34567",
      patients: 210,
      rating: 4.7,
      languages: ["English", "Hindi", "Gujarati"],
      bio: "Specialized in cardiology with a patient-centered approach to heart health and preventive care.",
      serviceType: "online",
      availability: {
        from: "10:00",
        to: "18:00"
      }
    },
    {
      id: 4,
      name: "Dr. Maria Rodriguez",
      image: null,
      phone: "+91 98765-43213",
      email: "maria.r@example.com",
      gender: "Female",
      education: "MBBS, MD (Pediatrics)",
      medicalCouncilNumber: "MCI-45678",
      patients: 165,
      rating: 4.9,
      languages: ["English", "Spanish", "Hindi"],
      bio: "Pediatric specialist with over a decade of experience in children's healthcare and development.",
      serviceType: "offline",
      availability: {
        from: "10:00",
        to: "18:00"
      }
    },
    {
      id: 5,
      name: "Dr. David Kim",
      image: null,
      phone: "+91 98765-43214",
      email: "david.kim@example.com",
      gender: "Male",
      education: "MBBS, MS (Orthopedics)",
      medicalCouncilNumber: "MCI-56789",
      patients: 190,
      rating: 4.8,
      languages: ["English", "Korean", "Hindi"],
      bio: "Orthopedic surgeon specializing in sports medicine and rehabilitation therapy.",
      serviceType: "online",
      availability: {
        from: "14:00",
        to: "20:00"
      }
    },
    {
      id: 6,
      name: "Dr. Priya Sharma",
      image: null,
      phone: "+91 98765-43215",
      email: "priya.s@example.com",
      gender: "Female",
      education: "MBBS, MD (Gynecology)",
      medicalCouncilNumber: "MCI-67890",
      patients: 220,
      rating: 4.9,
      languages: ["English", "Hindi", "Punjabi"],
      bio: "Expert gynecologist focusing on women's health and reproductive medicine.",
      serviceType: "offline",
      availability: {
        from: "10:00",
        to: "18:00"
      }
    },
    {
      id: 7,
      name: "Dr. Michael Chang",
      image: null,
      phone: "+91 98765-43216",
      email: "michael.c@example.com",
      gender: "Male",
      education: "MBBS, MD (Dermatology)",
      medicalCouncilNumber: "MCI-78901",
      patients: 175,
      rating: 4.7,
      languages: ["English", "Mandarin", "Hindi"],
      bio: "Dermatologist specializing in skin conditions and cosmetic procedures.",
      serviceType: "online",
      availability: {
        from: "11:00",
        to: "19:00"
      }
    },
    {
      id: 8,
      name: "Dr. Sarah Johnson",
      image: null,
      phone: "+91 98765-43217",
      email: "sarah.j@example.com",
      gender: "Female",
      education: "MBBS, MD (Psychiatry)",
      medicalCouncilNumber: "MCI-89012",
      patients: 150,
      rating: 4.8,
      languages: ["English", "Hindi", "French"],
      bio: "Psychiatrist dedicated to mental health and emotional well-being."
    },
    {
      id: 9,
      name: "Dr. Arun Kumar",
      image: null,
      phone: "+91 98765-43218",
      email: "arun.k@example.com",
      gender: "Male",
      education: "MBBS, DM (Neurology)",
      medicalCouncilNumber: "MCI-90123",
      patients: 195,
      rating: 4.9,
      languages: ["English", "Hindi", "Telugu"],
      bio: "Neurologist with expertise in treating complex neurological disorders."
    },
    {
      id: 10,
      name: "Dr. Emma Wilson",
      image: null,
      phone: "+91 98765-43219",
      email: "emma.w@example.com",
      gender: "Female",
      education: "MBBS, MD (Endocrinology)",
      medicalCouncilNumber: "MCI-01234",
      patients: 170,
      rating: 4.8,
      languages: ["English", "Hindi", "German"],
      bio: "Endocrinologist specializing in hormone-related disorders and diabetes management."
    },
    {
      id: 11,
      name: "Dr. Vikram Malhotra",
      image: null,
      phone: "+91 98765-43220",
      email: "vikram.m@example.com",
      gender: "Male",
      education: "MBBS, MS (ENT)",
      medicalCouncilNumber: "MCI-11223",
      patients: 185,
      rating: 4.7,
      languages: ["English", "Hindi", "Punjabi"],
      bio: "ENT specialist with extensive experience in surgical and non-surgical treatments."
    },
    {
      id: 12,
      name: "Dr. Jessica Lee",
      image: null,
      phone: "+91 98765-43221",
      email: "jessica.l@example.com",
      gender: "Female",
      education: "MBBS, MD (Ophthalmology)",
      medicalCouncilNumber: "MCI-22334",
      patients: 160,
      rating: 4.9,
      languages: ["English", "Korean", "Hindi"],
      bio: "Ophthalmologist specializing in eye surgery and vision care."
    },
    {
      id: 13,
      name: "Dr. Rahul Verma",
      image: null,
      phone: "+91 98765-43222",
      email: "rahul.v@example.com",
      gender: "Male",
      education: "MBBS, MD (Pulmonology)",
      medicalCouncilNumber: "MCI-33445",
      patients: 200,
      rating: 4.8,
      languages: ["English", "Hindi", "Marathi"],
      bio: "Pulmonologist focusing on respiratory diseases and sleep disorders."
    },
    {
      id: 14,
      name: "Dr. Sophie Martin",
      image: null,
      phone: "+91 98765-43223",
      email: "sophie.m@example.com",
      gender: "Female",
      education: "MBBS, MD (Rheumatology)",
      medicalCouncilNumber: "MCI-44556",
      patients: 155,
      rating: 4.7,
      languages: ["English", "French", "Hindi"],
      bio: "Rheumatologist specializing in autoimmune disorders and joint diseases."
    },
    {
      id: 15,
      name: "Dr. Arjun Reddy",
      image: null,
      phone: "+91 98765-43224",
      email: "arjun.r@example.com",
      gender: "Male",
      education: "MBBS, DM (Gastroenterology)",
      medicalCouncilNumber: "MCI-55667",
      patients: 230,
      rating: 4.9,
      languages: ["English", "Hindi", "Telugu"],
      bio: "Gastroenterologist with expertise in digestive disorders and endoscopic procedures."
    },
    {
      id: 16,
      name: "Dr. Maya Patel",
      image: null,
      phone: "+91 98765-43225",
      email: "maya.p@example.com",
      gender: "Female",
      education: "MBBS, MD (Dermatology)",
      medicalCouncilNumber: "MCI-66778",
      patients: 175,
      rating: 4.8,
      languages: ["English", "Hindi", "Gujarati"],
      bio: "Dermatologist specializing in skin care and aesthetic procedures."
    },
    {
      id: 17,
      name: "Dr. Thomas Anderson",
      image: null,
      phone: "+91 98765-43226",
      email: "thomas.a@example.com",
      gender: "Male",
      education: "MBBS, MD (Nephrology)",
      medicalCouncilNumber: "MCI-77889",
      patients: 190,
      rating: 4.7,
      languages: ["English", "Hindi", "German"],
      bio: "Nephrologist focusing on kidney diseases and hypertension management."
    },
    {
      id: 18,
      name: "Dr. Anita Desai",
      image: null,
      phone: "+91 98765-43227",
      email: "anita.d@example.com",
      gender: "Female",
      education: "MBBS, MD (Pediatrics)",
      medicalCouncilNumber: "MCI-88990",
      patients: 210,
      rating: 4.9,
      languages: ["English", "Hindi", "Marathi"],
      bio: "Pediatrician specializing in child development and preventive care."
    },
    {
      id: 19,
      name: "Dr. James Wilson",
      image: null,
      phone: "+91 98765-43228",
      email: "james.w@example.com",
      gender: "Male",
      education: "MBBS, MS (Orthopedics)",
      medicalCouncilNumber: "MCI-99001",
      patients: 205,
      rating: 4.8,
      languages: ["English", "Hindi"],
      bio: "Orthopedic surgeon specializing in joint replacement and trauma care."
    },
    {
      id: 20,
      name: "Dr. Neha Gupta",
      image: null,
      phone: "+91 98765-43229",
      email: "neha.g@example.com",
      gender: "Female",
      education: "MBBS, MD (Psychiatry)",
      medicalCouncilNumber: "MCI-00112",
      patients: 165,
      rating: 4.7,
      languages: ["English", "Hindi", "Bengali"],
      bio: "Psychiatrist focusing on anxiety, depression, and stress management."
    },
    {
      id: 21,
      name: "Dr. Robert Chen",
      image: null,
      phone: "+91 98765-43230",
      email: "robert.c@example.com",
      gender: "Male",
      education: "MBBS, DM (Cardiology)",
      medicalCouncilNumber: "MCI-11234",
      patients: 240,
      rating: 4.9,
      languages: ["English", "Mandarin", "Hindi"],
      bio: "Cardiologist specializing in interventional procedures and heart disease prevention."
    },
    {
      id: 22,
      name: "Dr. Meera Shah",
      image: null,
      phone: "+91 98765-43231",
      email: "meera.s@example.com",
      gender: "Female",
      education: "MBBS, MD (Gynecology)",
      medicalCouncilNumber: "MCI-22345",
      patients: 195,
      rating: 4.8,
      languages: ["English", "Hindi", "Gujarati"],
      bio: "Gynecologist with expertise in obstetrics and women's health."
    },
    {
      id: 23,
      name: "Dr. William Park",
      image: null,
      phone: "+91 98765-43232",
      email: "william.p@example.com",
      gender: "Male",
      education: "MBBS, MD (Neurology)",
      medicalCouncilNumber: "MCI-33456",
      patients: 180,
      rating: 4.7,
      languages: ["English", "Korean", "Hindi"],
      bio: "Neurologist specializing in stroke treatment and neurodegenerative disorders."
    },
    {
      id: 24,
      name: "Dr. Anjali Kumar",
      image: null,
      phone: "+91 98765-43233",
      email: "anjali.k@example.com",
      gender: "Female",
      education: "MBBS, MD (Endocrinology)",
      medicalCouncilNumber: "MCI-44567",
      patients: 170,
      rating: 4.9,
      languages: ["English", "Hindi", "Tamil"],
      bio: "Endocrinologist focusing on thyroid disorders and metabolic diseases."
    },
    {
      id: 25,
      name: "Dr. Daniel Lee",
      image: null,
      phone: "+91 98765-43234",
      email: "daniel.l@example.com",
      gender: "Male",
      education: "MBBS, MS (ENT)",
      medicalCouncilNumber: "MCI-55678",
      patients: 185,
      rating: 4.8,
      languages: ["English", "Mandarin", "Hindi"],
      bio: "ENT surgeon specializing in minimally invasive procedures."
    },
    {
      id: 26,
      name: "Dr. Pooja Sharma",
      image: null,
      phone: "+91 98765-43235",
      email: "pooja.s@example.com",
      gender: "Female",
      education: "MBBS, MD (Dermatology)",
      medicalCouncilNumber: "MCI-66789",
      patients: 200,
      rating: 4.7,
      languages: ["English", "Hindi", "Punjabi"],
      bio: "Dermatologist specializing in advanced skin treatments and procedures."
    },
    {
      id: 27,
      name: "Dr. Richard Brown",
      image: null,
      phone: "+91 98765-43236",
      email: "richard.b@example.com",
      gender: "Male",
      education: "MBBS, DM (Gastroenterology)",
      medicalCouncilNumber: "MCI-77890",
      patients: 215,
      rating: 4.9,
      languages: ["English", "Hindi", "French"],
      bio: "Gastroenterologist with expertise in advanced endoscopic procedures."
    },
    {
      id: 28,
      name: "Dr. Shalini Verma",
      image: null,
      phone: "+91 98765-43237",
      email: "shalini.v@example.com",
      gender: "Female",
      education: "MBBS, MD (Pediatrics)",
      medicalCouncilNumber: "MCI-88901",
      patients: 190,
      rating: 4.8,
      languages: ["English", "Hindi", "Bengali"],
      bio: "Pediatrician specializing in newborn care and childhood diseases."
    },
    {
      id: 29,
      name: "Dr. Andrew Thompson",
      image: null,
      phone: "+91 98765-43238",
      email: "andrew.t@example.com",
      gender: "Male",
      education: "MBBS, MD (Psychiatry)",
      medicalCouncilNumber: "MCI-99012",
      patients: 160,
      rating: 4.7,
      languages: ["English", "Hindi", "Spanish"],
      bio: "Psychiatrist focusing on cognitive behavioral therapy and mental health."
    },
    {
      id: 30,
      name: "Dr. Kavita Reddy",
      image: null,
      phone: "+91 98765-43239",
      email: "kavita.r@example.com",
      gender: "Female",
      education: "MBBS, MS (Ophthalmology)",
      medicalCouncilNumber: "MCI-00123",
      patients: 175,
      rating: 4.9,
      languages: ["English", "Hindi", "Telugu"],
      bio: "Ophthalmologist specializing in retinal diseases and eye surgery."
    }
  ]

  // Filter doctors based on search query and filters
  const filteredDoctors = doctors.filter(doctor => {
    // Search query filter
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch = (
      doctor.name.toLowerCase().includes(searchLower) ||
      doctor.email.toLowerCase().includes(searchLower) ||
      doctor.phone.includes(searchQuery) ||
      doctor.education.toLowerCase().includes(searchLower) ||
      doctor.medicalCouncilNumber.toLowerCase().includes(searchLower) ||
      doctor.languages.some(lang => lang.toLowerCase().includes(searchLower))
    )

    // Service type filter
    const matchesServiceType = filters.serviceType === 'all' || doctor.serviceType === filters.serviceType

    // Gender filter
    const matchesGender = filters.gender === 'all' || doctor.gender === filters.gender

    // Availability filter
    const matchesAvailability = filters.availability === 'all' || (() => {
      if (!doctor.availability) return false
      const time = parseInt(doctor.availability.from.split(':')[0])
      switch (filters.availability) {
        case 'morning': return time >= 9 && time < 12
        case 'afternoon': return time >= 12 && time < 17
        case 'evening': return time >= 17 && time < 21
        default: return true
      }
    })()

    return matchesSearch && matchesServiceType && matchesGender && matchesAvailability
  })

  // Get paginated doctors from filtered results
  const paginatedDoctors = filteredDoctors.slice(displayRange.start, displayRange.end)

  // Update hasMore when filtered results change
  useEffect(() => {
    setHasMore(displayRange.end < filteredDoctors.length)
    // Reset display range when search query changes
    if (searchQuery) {
      setDisplayRange({ start: 0, end: 9 })
      setCurrentPage(1)
    }
  }, [displayRange.end, filteredDoctors.length, searchQuery])

  const loadMoreDoctors = () => {
    if (!isLoading && hasMore) {
      setIsLoading(true)
      setTimeout(() => {
        setDisplayRange(prev => ({
          start: prev.start,
          end: Math.min(prev.end + itemsPerPage, filteredDoctors.length)
        }))
        setCurrentPage(prev => prev + 1)
        setIsLoading(false)
      }, 300)
    }
  }

  const loadPreviousDoctors = () => {
    if (!isLoading && displayRange.start > 0) {
      setIsLoading(true)
      setTimeout(() => {
        setDisplayRange(prev => ({
          start: Math.max(0, prev.start - itemsPerPage),
          end: Math.min(prev.end, filteredDoctors.length)
        }))
        setCurrentPage(prev => Math.max(1, prev - 1))
        setIsLoading(false)
      }, 300)
    }
  }

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target
    
    // Determine scroll direction
    const direction = scrollTop > lastScrollTop ? 'down' : 'up'
    setLastScrollTop(scrollTop)
    setScrollDirection(direction)
    
    // Calculate scroll percentage
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight
    
    // Load more content when scrolling down and near bottom
    if (direction === 'down' && scrollPercentage > 0.8 && !isLoading && hasMore) {
      loadMoreDoctors()
    }
    
    // Load previous content when scrolling up and near top
    else if (direction === 'up' && scrollTop < clientHeight * 0.2 && !isLoading && displayRange.start > 0) {
      const container = e.target
      const currentScrollHeight = container.scrollHeight
      
      loadPreviousDoctors()
      
      // Maintain scroll position after loading previous items
      requestAnimationFrame(() => {
        const newScrollHeight = container.scrollHeight
        const heightDiff = newScrollHeight - currentScrollHeight
        if (heightDiff > 0) {
          container.scrollTop = heightDiff + scrollTop
        }
      })
    }
  }

  const languageOptions = [
    'Tamil', 'English', 'Hindi', 'Malayalam', 'Telugu', 'Kannada'
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleLanguageChange = (language) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(lang => lang !== language)
        : [...prev.languages, language]
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({ ...prev, profilePic: file }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(formData)
    setShowAddForm(false)
    setFormData({
      name: '',
      email: '',
      gender: '',
      mobile: '',
      profilePic: null,
      education: '',
      medicalCouncilNumber: '',
      languages: [],
      intro: '',
      password: '',
      confirmPassword: '',
      signature: null
    })
  }

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '') // Remove non-digits
    if (!value.startsWith('91')) {
      value = '91' + value
    }
    if (value.length > 12) {
      value = value.slice(0, 12)
    }
    const formattedValue = value.length > 2 
      ? `+${value.slice(0, 2)} ${value.slice(2).replace(/(\d{5})(\d{5})/, '$1-$2')}`
      : `+${value}`

    setFormData(prev => ({ ...prev, mobile: formattedValue }))
  }

  const DetailView = ({ doctor, onClose }) => {
    if (!doctor) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">{doctor.name}</h2>
                <p className="text-gray-600">{doctor.education}</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            {/* Service Type Badge */}
            <div className="mb-6">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                doctor.serviceType === 'online' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {doctor.serviceType === 'online' ? 'Online' : 'Offline'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <FaPhone className="w-5 h-5 mr-3" />
                    <span>{doctor.phone}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaEnvelope className="w-5 h-5 mr-3" />
                    <span>{doctor.email}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <FaUserMd className="w-5 h-5 mr-3" />
                    <span>Medical Council: {doctor.medicalCouncilNumber}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaUserCircle className="w-5 h-5 mr-3" />
                    <span>Gender: {doctor.gender}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Availability Section */}
            {doctor.availability && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {doctor.serviceType === 'online' ? 'Online' : 'Clinic'} Hours
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">From</span>
                      <p className="text-gray-900 font-medium">
                        {formatTime(doctor.availability.from)}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">To</span>
                      <p className="text-gray-900 font-medium">
                        {formatTime(doctor.availability.to)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Languages Section */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {doctor.languages.map((language, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const AddDoctorForm = ({ onClose, initialData, isEditing }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-2xl font-semibold text-gray-800">
              {isEditing ? 'Edit Doctor' : 'Add New Doctor'}
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
                  value={initialData?.name || formData.name}
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
                  value={initialData?.email || formData.email}
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
                  value={initialData?.gender || formData.gender}
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
                  Mobile Number * <span className="text-gray-500 text-xs">(+91 format)</span>
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={initialData?.mobile || formData.mobile}
                  onChange={handlePhoneChange}
                  placeholder="+91 98765-43210"
                  pattern="^\+91 \d{5}-\d{5}$"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  title="Please enter a valid Indian mobile number (+91 followed by 10 digits)"
                />
                <p className="mt-1 text-xs text-gray-500">Format: +91 98765-43210</p>
              </div>
            </div>

            {/* Professional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Education Qualification *
                </label>
                <input
                  type="text"
                  name="education"
                  value={initialData?.education || formData.education}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="e.g., MBBS, MD, MS"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medical Council Number *
                </label>
                <input
                  type="text"
                  name="medicalCouncilNumber"
                  value={initialData?.medicalCouncilNumber || formData.medicalCouncilNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Languages Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Languages Spoken *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border border-gray-300 rounded-lg">
                {['Tamil', 'English', 'Hindi', 'Malayalam', 'Telugu', 'Kannada'].map(language => (
                  <label key={language} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={initialData?.languages?.includes(language) || formData.languages.includes(language)}
                      onChange={() => handleLanguageChange(language)}
                      className="rounded text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-sm">{language}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Introduction/Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Introduction About Doctor *
              </label>
              <textarea
                name="intro"
                value={initialData?.bio || formData.intro}
                onChange={handleInputChange}
                rows="4"
                placeholder="Write a brief introduction about the doctor's experience and expertise..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>
            </div>

            {/* Profile Picture Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Picture
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        name="profilePic"
                        onChange={handleFileChange}
                        className="sr-only"
                        accept="image/*"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>

            {/* Signature Upload with separate handler */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Digital Signature *
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                      <span>Upload signature</span>
                      <input
                        type="file"
                        name="signature"
                        onChange={(e) => {
                          const file = e.target.files[0]
                          if (file) {
                            setFormData(prev => ({ ...prev, signature: file }))
                          }
                        }}
                        className="sr-only"
                        accept="image/*"
                        required={!isEditing}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                </div>
              </div>
            </div>

            {/* Password Fields */}
            {!isEditing && (
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
                    minLength="6"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    minLength="6"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
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
    )
  }

  // Calculate total pages based on filtered results
  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage)

  // Add FilterModal component
  const FilterModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
        <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Filters</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <FaTimes className="text-gray-500" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Type
              </label>
              <select
                value={filters.serviceType}
                onChange={e => setFilters(prev => ({ ...prev, serviceType: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="all">All Services</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                value={filters.gender}
                onChange={e => setFilters(prev => ({ ...prev, gender: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="all">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability
              </label>
              <select
                value={filters.availability}
                onChange={e => setFilters(prev => ({ ...prev, availability: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="all">All Times</option>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={() => {
                setFilters({
                  serviceType: 'all',
                  gender: 'all',
                  availability: 'all'
                });
                onClose();
              }}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 h-[calc(100vh-80px)] flex flex-col">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Doctors</h2>
        </div>

        {/* Search bar and filter button */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search doctors..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <BiSearch className="h-5 w-5 text-gray-400" />
            </div>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg border ${
              Object.values(filters).some(value => value !== 'all')
                ? 'bg-blue-50 border-blue-200 text-blue-600' 
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            } transition-colors`}
          >
            <FaFilter className="w-5 h-5" />
          </button>
        </div>

        {searchQuery && (
          <div className="text-sm text-gray-500">
            Found {filteredDoctors.length} results
          </div>
        )}
      </div>

      <div 
        className="flex-1 overflow-auto"
        onScroll={handleScroll}
        style={{ 
          scrollBehavior: 'auto',
          scrollbarWidth: 'thin',
          scrollbarColor: '#CBD5E0 #EDF2F7',
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {isLoading && scrollDirection === 'up' && (
          <div className="p-4 text-center text-gray-500">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-2"></div>
            Loading previous doctors...
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
          {paginatedDoctors.map((doctor) => (
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
                    <p className="text-gray-500">{doctor.gender}</p>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <p className="flex items-center gap-2 text-gray-600">
                    <FaUserMd className="text-blue-500" />
                    {doctor.education || 'MBBS'}
                  </p>
                  <p className="flex items-center gap-2 text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0h8v12H6V4z" clipRule="evenodd" />
                    </svg>
                    MCN: {doctor.medicalCouncilNumber || 'Not Available'}
                  </p>
                  {/* Service Type and Availability */}
                  <div className="flex flex-col gap-2 mt-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      doctor.serviceType === 'online' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {doctor.serviceType === 'online' ? 'Online' : 'Offline'}
                    </span>
                    {doctor.availability && (
                      <p className="text-sm text-gray-600">
                        {doctor.serviceType === 'online' ? 'Online' : 'Clinic'} Hours: {formatTime(doctor.availability.from)} - {formatTime(doctor.availability.to)}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 flex gap-3">
                  <span className="bg-blue-50 px-4 py-1.5 rounded-full text-blue-700 text-sm font-medium">
                    {doctor.patients} patients
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
        
        {isLoading && scrollDirection === 'down' && (
          <div className="p-4 text-center text-gray-500">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-2"></div>
            Loading more doctors...
          </div>
        )}
      </div>

      {/* Pagination Bar */}
      <div className="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => loadPreviousDoctors()}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => loadMoreDoctors()}
            disabled={!hasMore}
            className={`relative ml-3 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${
              !hasMore
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{displayRange.start + 1}</span> to{' '}
              <span className="font-medium">{displayRange.end}</span> of{' '}
              <span className="font-medium">{filteredDoctors.length}</span> doctors
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => loadPreviousDoctors()}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                  currentPage === 1 ? 'cursor-not-allowed' : 'hover:text-gray-700'
                }`}
              >
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                </svg>
              </button>
              
              {/* Page Numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => {
                      setCurrentPage(pageNum);
                      const container = document.querySelector('.overflow-auto');
                      if (container) container.scrollTop = 0;
                    }}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                      currentPage === pageNum
                        ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => loadMoreDoctors()}
                disabled={!hasMore}
                className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                  !hasMore ? 'cursor-not-allowed' : 'hover:text-gray-700'
                }`}
              >
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Add FilterModal */}
      <FilterModal isOpen={showFilters} onClose={() => setShowFilters(false)} />

      {showAddForm && (
        <AddDoctorForm onClose={() => setShowAddForm(false)} />
      )}

      {selectedDoctor && (
        <DetailView 
          doctor={selectedDoctor} 
          onClose={() => setSelectedDoctor(null)} 
        />
      )}
    </div>
  )
}

export default Doctors 