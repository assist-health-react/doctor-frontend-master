import { useState } from 'react'
import { FaPlus, FaPhone, FaEnvelope, FaTimes, FaUserMd, FaUserCircle, FaUpload, FaEdit, FaTrash } from 'react-icons/fa'

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

const AssignedMembersModal = ({ isOpen, onClose, navigator }) => {
  if (!isOpen) return null;

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  // Sample assigned members data - replace with your actual data
  const assignedMembers = Array.from({ length: 156 }, (_, index) => ({
    id: `MEM${String(index + 1).padStart(3, '0')}`,
    name: `Member ${index + 1}`,
    phone: `+91 ${Math.floor(10000 + Math.random() * 90000)}-${Math.floor(10000 + Math.random() * 90000)}`
  }));

  // Filter members based on search
  const filteredMembers = assignedMembers.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone.includes(searchTerm)
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMembers = filteredMembers.slice(startIndex, startIndex + itemsPerPage);

  // Generate page numbers array
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift('...');
    }
    if (currentPage + delta < totalPages - 1) {
      range.push('...');
    }

    range.unshift(1);
    if (totalPages !== 1) {
      range.push(totalPages);
    }

    return range;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-semibold text-gray-800">Assigned Members</h3>
            <p className="text-sm text-gray-500 mt-1">
              Navigator: {navigator.name} • Total Members: {assignedMembers.length}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by ID, name or phone..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaUserCircle className="w-8 h-8 text-gray-400 mr-3" />
                      <span className="text-sm font-medium text-gray-900">{member.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredMembers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No members found matching your search.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredMembers.length)} of {filteredMembers.length} members
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Previous
              </button>
              {getPageNumbers().map((pageNum, idx) => (
                <button
                  key={idx}
                  onClick={() => typeof pageNum === 'number' && setCurrentPage(pageNum)}
                  className={`px-3 py-1 rounded-lg ${
                    pageNum === currentPage
                      ? 'bg-blue-500 text-white'
                      : pageNum === '...'
                      ? 'cursor-default'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Navigators = () => {
  const [selectedNavigator, setSelectedNavigator] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showAssignedMembers, setShowAssignedMembers] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: '',
    mobile: '',
    profilePic: null,
    languages: [],
    intro: '',
    password: '',
    confirmPassword: ''
  })

  // Extended dummy data with more navigators
  const navigators = [
    {
      id: 1,
      name: "Dr. Priya Sharma",
      image: null,
      phone: "+91 98765-43210",
      email: "priya.sharma@example.com",
      gender: "Female",
      patients: 145,
      rating: 4.8,
      languages: ["Tamil", "English", "Hindi"],
      bio: "Specialized in providing comprehensive mental health navigation services with a focus on patient advocacy and care coordination."
    },
    {
      id: 2,
      name: "Dr. Rajesh Kumar",
      image: null,
      phone: "+91 98765-43211",
      email: "rajesh.kumar@example.com",
      gender: "Male",
      patients: 230,
      rating: 4.9,
      languages: ["Hindi", "English", "Telugu"],
      bio: "Dedicated pediatric navigator with extensive experience in coordinating care for children with complex medical needs."
    },
    {
      id: 3,
      name: "Dr. Lakshmi Menon",
      image: null,
      phone: "+91 98765-43212",
      email: "lakshmi.m@example.com",
      gender: "Female",
      patients: 178,
      rating: 4.7,
      languages: ["Malayalam", "English", "Tamil"],
      bio: "Specialized in geriatric care navigation, focusing on coordinating comprehensive care for elderly patients."
    },
    {
      id: 4,
      name: "Dr. Arjun Reddy",
      image: null,
      phone: "+91 98765-43213",
      email: "arjun.r@example.com",
      gender: "Male",
      patients: 156,
      rating: 4.6,
      languages: ["Telugu", "English", "Hindi"],
      bio: "Expert in managing and coordinating care for patients with chronic conditions and complex medical needs."
    },
    {
      id: 5,
      name: "Dr. Ananya Iyer",
      image: null,
      phone: "+91 98765-43214",
      email: "ananya.i@example.com",
      gender: "Female",
      patients: 190,
      rating: 4.9,
      languages: ["Kannada", "English", "Hindi"],
      bio: "Specialized in women's health navigation, providing comprehensive care coordination and advocacy services."
    },
    {
      id: 6,
      name: "Dr. Karthik Raman",
      image: null,
      phone: "+91 98765-43215",
      email: "karthik.r@example.com",
      gender: "Male",
      patients: 125,
      rating: 4.8,
      languages: ["Tamil", "English", "Malayalam"],
      bio: "Dedicated oncology navigator with expertise in coordinating cancer care and support services."
    },
    {
      id: 7,
      name: "Dr. Meera Nair",
      image: null,
      phone: "+91 98765-43216",
      email: "meera.n@example.com",
      gender: "Female",
      patients: 168,
      rating: 4.8,
      languages: ["Malayalam", "English", "Tamil"],
      bio: "Specialized in pediatric care navigation with expertise in coordinating care for children with special needs."
    },
    {
      id: 8,
      name: "Dr. Sameer Khan",
      image: null,
      phone: "+91 98765-43217",
      email: "sameer.k@example.com",
      gender: "Male",
      patients: 195,
      rating: 4.7,
      languages: ["Hindi", "English", "Urdu"],
      bio: "Expert in chronic disease management and coordinating care for patients with multiple health conditions."
    },
    {
      id: 9,
      name: "Dr. Anjali Menon",
      image: null,
      phone: "+91 98765-43218",
      email: "anjali.m@example.com",
      gender: "Female",
      patients: 142,
      rating: 4.9,
      languages: ["Malayalam", "English", "Hindi"],
      bio: "Specialized in maternal health navigation, providing comprehensive support throughout pregnancy and postpartum care."
    },
    {
      id: 10,
      name: "Dr. Rajiv Kapoor",
      image: null,
      phone: "+91 98765-43219",
      email: "rajiv.k@example.com",
      gender: "Male",
      patients: 210,
      rating: 4.8,
      languages: ["Hindi", "English", "Punjabi"],
      bio: "Dedicated to coordinating care for cardiac patients, with expertise in post-surgery recovery management."
    },
    {
      id: 11,
      name: "Dr. Deepa Krishnan",
      image: null,
      phone: "+91 98765-43220",
      email: "deepa.k@example.com",
      gender: "Female",
      patients: 175,
      rating: 4.7,
      languages: ["Tamil", "English", "Telugu"],
      bio: "Specialized in diabetes care navigation, helping patients manage their condition through coordinated care approaches."
    },
    {
      id: 12,
      name: "Dr. Aryan Sharma",
      image: null,
      phone: "+91 98765-43221",
      email: "aryan.s@example.com",
      gender: "Male",
      patients: 188,
      rating: 4.9,
      languages: ["Hindi", "English", "Bengali"],
      bio: "Expert in coordinating care for orthopedic patients, specializing in rehabilitation and recovery programs."
    },
    {
      id: 13,
      name: "Dr. Nisha Patel",
      image: null,
      phone: "+91 98765-43222",
      email: "nisha.p@example.com",
      gender: "Female",
      patients: 156,
      rating: 4.8,
      languages: ["Gujarati", "English", "Hindi"],
      bio: "Specialized in geriatric care coordination, focusing on holistic wellness for elderly patients."
    },
    {
      id: 14,
      name: "Dr. Aditya Reddy",
      image: null,
      phone: "+91 98765-43223",
      email: "aditya.r@example.com",
      gender: "Male",
      patients: 225,
      rating: 4.7,
      languages: ["Telugu", "English", "Kannada"],
      bio: "Expert in coordinating care for neurological conditions, with focus on long-term patient support."
    },
    {
      id: 15,
      name: "Dr. Priyanka Mehta",
      image: null,
      phone: "+91 98765-43224",
      email: "priyanka.m@example.com",
      gender: "Female",
      patients: 198,
      rating: 4.9,
      languages: ["Hindi", "English", "Marathi"],
      bio: "Specialized in oncology navigation, providing comprehensive support for cancer patients and their families."
    },
    {
      id: 16,
      name: "Dr. Kabir Singh",
      image: null,
      phone: "+91 98765-43225",
      email: "kabir.s@example.com",
      gender: "Male",
      patients: 167,
      rating: 4.8,
      languages: ["Punjabi", "English", "Hindi"],
      bio: "Dedicated to mental health navigation, focusing on coordinated care for psychiatric patients."
    },
    {
      id: 17,
      name: "Dr. Lakshmi Rao",
      image: null,
      phone: "+91 98765-43226",
      email: "lakshmi.r@example.com",
      gender: "Female",
      patients: 182,
      rating: 4.7,
      languages: ["Telugu", "English", "Tamil"],
      bio: "Expert in women's health navigation, specializing in reproductive health care coordination."
    },
    {
      id: 18,
      name: "Dr. Farhan Ahmed",
      image: null,
      phone: "+91 98765-43227",
      email: "farhan.a@example.com",
      gender: "Male",
      patients: 205,
      rating: 4.9,
      languages: ["Urdu", "English", "Hindi"],
      bio: "Specialized in pulmonary care navigation, coordinating care for respiratory conditions."
    },
    {
      id: 19,
      name: "Dr. Anita Desai",
      image: null,
      phone: "+91 98765-43228",
      email: "anita.d@example.com",
      gender: "Female",
      patients: 145,
      rating: 4.8,
      languages: ["Marathi", "English", "Hindi"],
      bio: "Focused on pediatric developmental care navigation, helping children with special needs."
    },
    {
      id: 20,
      name: "Dr. Vivek Kumar",
      image: null,
      phone: "+91 98765-43229",
      email: "vivek.k@example.com",
      gender: "Male",
      patients: 235,
      rating: 4.7,
      languages: ["Hindi", "English", "Bhojpuri"],
      bio: "Expert in emergency care coordination and trauma patient navigation services."
    },
    {
      id: 21,
      name: "Dr. Ritu Verma",
      image: null,
      phone: "+91 98765-43230",
      email: "ritu.v@example.com",
      gender: "Female",
      patients: 172,
      rating: 4.9,
      languages: ["Hindi", "English", "Sanskrit"],
      bio: "Specialized in endocrine disorder navigation and diabetes care management."
    },
    {
      id: 22,
      name: "Dr. Sanjay Gupta",
      image: null,
      phone: "+91 98765-43231",
      email: "sanjay.g@example.com",
      gender: "Male",
      patients: 220,
      rating: 4.8,
      languages: ["Hindi", "English", "Gujarati"],
      bio: "Expert in cardiology patient navigation and heart disease management coordination."
    },
    {
      id: 23,
      name: "Dr. Maya Krishnamurthy",
      image: null,
      phone: "+91 98765-43232",
      email: "maya.k@example.com",
      gender: "Female",
      patients: 158,
      rating: 4.7,
      languages: ["Kannada", "English", "Tamil"],
      bio: "Specialized in pediatric oncology navigation and supportive care coordination."
    },
    {
      id: 24,
      name: "Dr. Imran Khan",
      image: null,
      phone: "+91 98765-43233",
      email: "imran.k@example.com",
      gender: "Male",
      patients: 195,
      rating: 4.9,
      languages: ["Urdu", "English", "Hindi"],
      bio: "Focused on orthopedic rehabilitation navigation and sports injury recovery coordination."
    },
    {
      id: 25,
      name: "Dr. Shreya Joshi",
      image: null,
      phone: "+91 98765-43234",
      email: "shreya.j@example.com",
      gender: "Female",
      patients: 168,
      rating: 4.8,
      languages: ["Marathi", "English", "Hindi"],
      bio: "Expert in maternal-fetal medicine navigation and high-risk pregnancy care coordination."
    },
    {
      id: 26,
      name: "Dr. Rahul Malhotra",
      image: null,
      phone: "+91 98765-43235",
      email: "rahul.m@example.com",
      gender: "Male",
      patients: 212,
      rating: 4.7,
      languages: ["Hindi", "English", "Punjabi"],
      bio: "Specialized in neurology patient navigation and stroke recovery coordination."
    },
    {
      id: 27,
      name: "Dr. Divya Sundaram",
      image: null,
      phone: "+91 98765-43236",
      email: "divya.s@example.com",
      gender: "Female",
      patients: 185,
      rating: 4.9,
      languages: ["Tamil", "English", "Malayalam"],
      bio: "Expert in geriatric care navigation and elder wellness program coordination."
    },
    {
      id: 28,
      name: "Dr. Ashok Pillai",
      image: null,
      phone: "+91 98765-43237",
      email: "ashok.p@example.com",
      gender: "Male",
      patients: 230,
      rating: 4.8,
      languages: ["Malayalam", "English", "Tamil"],
      bio: "Specialized in palliative care navigation and end-of-life care coordination."
    },
    {
      id: 29,
      name: "Dr. Neha Sharma",
      image: null,
      phone: "+91 98765-43238",
      email: "neha.s@example.com",
      gender: "Female",
      patients: 175,
      rating: 4.7,
      languages: ["Hindi", "English", "Rajasthani"],
      bio: "Focused on mental health navigation for adolescents and young adults."
    },
    {
      id: 30,
      name: "Dr. Suresh Kumar",
      image: null,
      phone: "+91 98765-43239",
      email: "suresh.k@example.com",
      gender: "Male",
      patients: 245,
      rating: 4.9,
      languages: ["Tamil", "English", "Telugu"],
      bio: "Expert in diabetes and endocrinology care navigation with focus on lifestyle management."
    },
    {
      id: 31,
      name: "Dr. Kavita Reddy",
      image: null,
      phone: "+91 98765-43240",
      email: "kavita.r@example.com",
      gender: "Female",
      patients: 192,
      rating: 4.8,
      languages: ["Telugu", "English", "Hindi"],
      bio: "Specialized in women's wellness and preventive care navigation services."
    },
    {
      id: 32,
      name: "Dr. Mohammed Ali",
      image: null,
      phone: "+91 98765-43241",
      email: "mohammed.a@example.com",
      gender: "Male",
      patients: 215,
      rating: 4.7,
      languages: ["Urdu", "English", "Hindi"],
      bio: "Expert in cardiac rehabilitation and heart health navigation programs."
    },
    {
      id: 33,
      name: "Dr. Shweta Patel",
      image: null,
      phone: "+91 98765-43242",
      email: "shweta.p@example.com",
      gender: "Female",
      patients: 165,
      rating: 4.9,
      languages: ["Gujarati", "English", "Hindi"],
      bio: "Specialized in pediatric developmental disorders and early intervention coordination."
    },
    {
      id: 34,
      name: "Dr. Vikram Singh",
      image: null,
      phone: "+91 98765-43243",
      email: "vikram.s@example.com",
      gender: "Male",
      patients: 228,
      rating: 4.8,
      languages: ["Hindi", "English", "Punjabi"],
      bio: "Focused on sports medicine navigation and athletic injury recovery coordination."
    },
    {
      id: 35,
      name: "Dr. Shalini Menon",
      image: null,
      phone: "+91 98765-43244",
      email: "shalini.m@example.com",
      gender: "Female",
      patients: 178,
      rating: 4.7,
      languages: ["Malayalam", "English", "Tamil"],
      bio: "Expert in oncology navigation and cancer survivorship program coordination."
    },
    {
      id: 36,
      name: "Dr. Rajesh Khanna",
      image: null,
      phone: "+91 98765-43245",
      email: "rajesh.k@example.com",
      gender: "Male",
      patients: 205,
      rating: 4.9,
      languages: ["Hindi", "English", "Marathi"],
      bio: "Specialized in chronic pain management and rehabilitation care coordination."
    }
  ]

  // Add this near your other constants
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
    // Add your form submission logic here
    console.log(formData)
    setShowAddForm(false)
    setFormData({
      name: '',
      email: '',
      gender: '',
      mobile: '',
      profilePic: null,
      languages: [],
      intro: '',
      password: '',
      confirmPassword: ''
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

  const DetailView = ({ navigator, onClose }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    const handleDelete = () => {
      // Add your delete logic here
      console.log('Deleting navigator:', navigator.id)
      setShowDeleteConfirm(false)
      onClose()
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-2xl font-semibold text-gray-800">Navigator Profile</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 hover:bg-red-50 rounded-full text-red-500 transition-colors"
                title="Delete Navigator"
              >
                <FaTrash className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setIsEditing(true)}
                className="p-2 hover:bg-blue-50 rounded-full text-blue-500 transition-colors"
                title="Edit Navigator"
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
          
          <div className="flex flex-col items-center md:flex-row md:items-start gap-8">
            <div className="flex flex-col items-center">
              {navigator.image ? (
                <img 
                  src={navigator.image} 
                  alt={navigator.name}
                  className="w-40 h-40 rounded-full object-cover shadow-lg"
                />
              ) : (
                <FaUserCircle className="w-40 h-40 text-gray-400" />
              )}
              <div className="mt-4 text-center">
                <h4 className="text-2xl font-semibold text-gray-800">{navigator.name}</h4>
              </div>
            </div>
            
            <div className="flex-1 space-y-6">
              {/* Contact Information */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h5 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h5>
                <div className="space-y-3">
                  <p className="flex items-center gap-3 text-gray-600">
                    <FaPhone className="text-blue-500" />
                    {navigator.phone}
                  </p>
                  <p className="flex items-center gap-3 text-gray-600">
                    <FaEnvelope className="text-blue-500" />
                    {navigator.email}
                  </p>
                  <p className="flex items-center gap-3 text-gray-600">
                    <FaUserMd className="text-blue-500" />
                    {navigator.gender}
                  </p>
                </div>
              </div>

              {/* Languages Section */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h5 className="text-lg font-semibold text-gray-800 mb-4">Languages Spoken</h5>
                <div className="flex flex-wrap gap-2">
                  {navigator.languages?.map((language, index) => (
                    <span 
                      key={index}
                      className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bio Section */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h5 className="text-lg font-semibold text-gray-800 mb-4">About</h5>
                <p className="text-gray-600 leading-relaxed">{navigator.bio}</p>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <p className="text-blue-600 text-sm font-medium">Total Patients</p>
                  <p className="text-3xl font-bold text-blue-700 mt-1">{navigator.patients}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <p className="text-green-600 text-sm font-medium">Rating</p>
                  <p className="text-3xl font-bold text-green-700 mt-1">{navigator.rating} ★</p>
                </div>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <AddNavigatorForm 
                  onClose={() => setIsEditing(false)} 
                  initialData={navigator}
                  isEditing={true}
                />
              </div>
            </div>
          )}

          <ConfirmationDialog
            isOpen={showDeleteConfirm}
            onClose={() => setShowDeleteConfirm(false)}
            onConfirm={handleDelete}
            title="Delete Navigator"
            message={`Are you sure you want to delete ${navigator.name}? This action cannot be undone.`}
          />
        </div>
      </div>
    )
  }

  // Add this new component
  const AddNavigatorForm = ({ onClose, initialData, isEditing }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-2xl font-semibold">Add New Navigator</h3>
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
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
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

            {/* Languages */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Languages Spoken *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border border-gray-300 rounded-lg">
                {languageOptions.map(language => (
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

            {/* Introduction */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Introduction *
              </label>
              <textarea
                name="intro"
                value={initialData?.bio || formData.intro}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>
            </div>

            {/* Password Fields */}
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
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-4">
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
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Navigators</h2>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FaPlus />
          Add Navigator
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {navigators.map((navigator) => (
          <div 
            key={navigator.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center gap-4">
                {navigator.image ? (
                  <img 
                    src={navigator.image} 
                    alt={navigator.name}
                    className="w-20 h-20 rounded-full object-cover shadow-md"
                  />
                ) : (
                  <FaUserCircle className="w-20 h-20 text-gray-400" />
                )}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{navigator.name}</h3>
                  <p className="text-gray-500">{navigator.gender}</p>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <p className="flex items-center gap-2 text-gray-600">
                  <FaPhone className="text-blue-500" />
                  {navigator.phone}
                </p>
                <div className="flex flex-wrap gap-2">
                  {navigator.languages?.map((language, index) => (
                    <span 
                      key={index}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 flex gap-3">
                <span className="bg-blue-50 px-4 py-1.5 rounded-full text-blue-700 text-sm font-medium">
                  {navigator.patients} patients
                </span>
                <span className="bg-green-50 px-4 py-1.5 rounded-full text-green-700 text-sm font-medium">
                  {navigator.rating} ★
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button 
                  onClick={() => {
                    setSelectedNavigator(navigator);
                    setShowAssignedMembers(true);
                  }}
                  className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-2.5 rounded-xl transition-colors font-medium"
                >
                  Assigned Members
                </button>
                <button 
                  onClick={() => setSelectedNavigator(navigator)}
                  className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-2.5 rounded-xl transition-colors font-medium"
                >
                  View Profile
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddForm && (
        <AddNavigatorForm onClose={() => setShowAddForm(false)} />
      )}

      {selectedNavigator && !showAssignedMembers && (
        <DetailView 
          navigator={selectedNavigator} 
          onClose={() => setSelectedNavigator(null)} 
        />
      )}

      {showAssignedMembers && selectedNavigator && (
        <AssignedMembersModal
          isOpen={showAssignedMembers}
          onClose={() => {
            setShowAssignedMembers(false);
            setSelectedNavigator(null);
          }}
          navigator={selectedNavigator}
        />
      )}
    </div>
  )
}

export default Navigators 