import { useState, useEffect } from 'react'
import { FaDownload, FaEdit, FaTrash, FaUserCircle, FaHistory, FaUsers, FaIdCard, FaPlus, FaTimes, FaUpload, FaSearch, FaFileUpload, FaEnvelope, FaPhone, FaVenusMars, FaBirthdayCake, FaHeartbeat, FaTint, FaRulerVertical, FaWeight, FaNotesMedical, FaUser, FaCheck, FaUserMd, FaUserClock, FaEye, FaHospital, FaStethoscope, FaCalendar, FaClipboard, FaMedkit, FaExclamationTriangle, FaInfoCircle, FaPills, FaPrescription, FaClock, FaSyringe, FaVial, FaComment } from 'react-icons/fa'
import html2pdf from 'html2pdf.js';

const DoctorDropdown = ({ isOpen, onClose, onSelect, selectedMembers }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  
  // Sample doctors data - replace with your actual data
  const doctors = [
    { id: 1, name: "Dr. Aditya Patel", specialization: "Cardiologist", patients: 32 },
    { id: 2, name: "Dr. Sneha Reddy", specialization: "Pediatrician", patients: 45 },
    { id: 3, name: "Dr. Rahul Sharma", specialization: "Orthopedic", patients: 28 },
    { id: 4, name: "Dr. Meera Singh", specialization: "Gynecologist", patients: 38 },
    { id: 5, name: "Dr. Vikram Desai", specialization: "Neurologist", patients: 25 }
  ]

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor)
    setShowConfirmation(true)
  }

  const handleConfirmAssignment = () => {
    onSelect(selectedDoctor, selectedMembers)
    setSelectedDoctor(null)
    setShowConfirmation(false)
    onClose()
  }

  if (!isOpen) return null

  if (showConfirmation) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Confirm Assignment</h3>
          <p className="text-gray-600 mb-2">
            Are you sure you want to assign <span className="font-medium">{selectedDoctor.name}</span> to {selectedMembers.length} selected member{selectedMembers.length !== 1 ? 's' : ''}?
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Current patient count: {selectedDoctor.patients}
          </p>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setShowConfirmation(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmAssignment}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Assign
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Select Doctor</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        {/* Search input */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search doctors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        {/* Doctors list */}
        <div className="max-h-[60vh] overflow-y-auto">
          {filteredDoctors.map((doctor) => (
            <button
              key={doctor.id}
              onClick={() => handleDoctorSelect(doctor)}
              className="w-full p-3 flex items-center gap-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
            >
              <FaUserMd className="w-10 h-10 text-gray-400" />
              <div className="flex-1 text-left">
                <div className="font-medium text-gray-900">{doctor.name}</div>
                <div className="text-sm text-gray-500">
                  {doctor.specialization} • {doctor.patients} patients
                </div>
              </div>
            </button>
          ))}

          {filteredDoctors.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No doctors found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const NotesModal = ({ note, onClose, onSave, onDelete }) => {
  const [noteText, setNoteText] = useState(note || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(noteText)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            {note ? 'Edit Note' : 'Add Note'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <FaTimes className="text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[150px]"
            placeholder="Enter note here..."
            required
          />
          <div className="flex justify-end gap-3">
            {note && (
              <button
                type="button"
                onClick={() => {
                  onDelete()
                  onClose()
                }}
                className="px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
              >
                Delete
              </button>
            )}
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
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const Members = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [showNotesModal, setShowNotesModal] = useState(false)
  const [selectedMemberForNotes, setSelectedMemberForNotes] = useState(null)
  const itemsPerPage = 20
  const [members] = useState([
    {
      id: "MEM001",
      name: "Rajesh Kumar",
      email: "rajesh.k@example.com",
      phone: "+91 98765-43210",
      dob: "1985-05-15",
      gender: "Male",
      bloodGroup: "B+",
      height: "175",
      weight: "72",
      address: "123 Park Street, Mumbai",
      membershipType: "Premium",
      emergencyContact: {
        name: "Anita Kumar",
        relationship: "Spouse",
        number: "+91 98765-43220"
      },
      personalHistory: {
        employmentStatus: "Employed",
        educationLevel: "Post Graduate",
        maritalStatus: "Married"
      },
      notes: "Regular checkup needed next month",
      medicalHistory: [
        { date: "2023-12-10", description: "Regular checkup" },
        { date: "2023-11-15", description: "Vaccination" }
      ],
      subProfiles: [
        { name: "Anita Kumar", relation: "Spouse", dob: "1988-08-20", bloodGroup: "A+" },
        { name: "Riya Kumar", relation: "Daughter", dob: "2010-03-10", bloodGroup: "B+" }
      ]
    },
    {
      id: "MEM002",
      name: "Priya Sharma",
      email: "priya.s@example.com",
      phone: "+91 98765-43211",
      dob: "1990-08-25",
      gender: "Female",
      bloodGroup: "O+",
      height: "165",
      weight: "58",
      address: "456 Lake View, Delhi",
      membershipType: "Standard",
      emergencyContact: {
        name: "Amit Sharma",
        relationship: "Spouse",
        number: "+91 98765-43221"
      },
      personalHistory: {
        employmentStatus: "Self-employed",
        educationLevel: "Graduate",
        maritalStatus: "Married"
      },
      medicalHistory: [
        { date: "2023-12-05", description: "Dental checkup" },
        { date: "2023-10-20", description: "Annual health screening" }
      ],
      subProfiles: [
        { name: "Amit Sharma", relation: "Son", dob: "2015-06-15", bloodGroup: "O+" }
      ]
    },
    {
      id: "MEM003",
      name: "Arun Patel",
      email: "arun.p@example.com",
      phone: "+91 98765-43212",
      dob: "1975-11-30",
      gender: "Male",
      bloodGroup: "AB+",
      height: "170",
      weight: "75",
      address: "789 Green Park, Bangalore",
      membershipType: "Premium",
      emergencyContact: {
        name: "Meera Patel",
        relationship: "Spouse",
        number: "+91 98765-43222"
      },
      personalHistory: {
        employmentStatus: "Employed",
        educationLevel: "Doctorate",
        maritalStatus: "Married"
      },
      medicalHistory: [
        { date: "2023-12-15", description: "Diabetes checkup" },
        { date: "2023-11-30", description: "Eye examination" },
        { date: "2023-10-25", description: "Blood test" }
      ],
      subProfiles: [
        { name: "Meera Patel", relation: "Spouse", dob: "1978-04-15", bloodGroup: "B-" },
        { name: "Rohan Patel", relation: "Son", dob: "2008-07-20", bloodGroup: "AB+" },
        { name: "Neha Patel", relation: "Daughter", dob: "2012-09-05", bloodGroup: "B+" }
      ]
    },
    {
      id: "MEM004",
      name: "Lakshmi Venkatesh",
      email: "lakshmi.v@example.com",
      phone: "+91 98765-43213",
      dob: "1982-03-18",
      gender: "Female",
      bloodGroup: "A-",
      height: "162",
      weight: "55",
      address: "234 Temple Road, Chennai",
      membershipType: "Premium",
      emergencyContact: {
        name: "Ram Venkatesh",
        relationship: "Spouse",
        number: "+91 98765-43223"
      },
      personalHistory: {
        employmentStatus: "Employed",
        educationLevel: "Masters",
        maritalStatus: "Married"
      },
      medicalHistory: [
        { date: "2023-12-08", description: "Physiotherapy session" },
        { date: "2023-11-20", description: "Orthopedic consultation" }
      ],
      subProfiles: [
        { name: "Ram Venkatesh", relation: "Spouse", dob: "1980-09-12", bloodGroup: "O+" },
        { name: "Sita Venkatesh", relation: "Daughter", dob: "2013-11-25", bloodGroup: "A-" }
      ]
    },
    {
      id: "MEM005",
      name: "Mohammed Khan",
      email: "mohammed.k@example.com",
      phone: "+91 98765-43214",
      dob: "1978-07-22",
      gender: "Male",
      bloodGroup: "B+",
      height: "178",
      weight: "80",
      address: "567 Rose Garden, Hyderabad",
      membershipType: "Standard",
      emergencyContact: {
        name: "Fatima Khan",
        relationship: "Spouse",
        number: "+91 98765-43224"
      },
      personalHistory: {
        employmentStatus: "Business Owner",
        educationLevel: "Graduate",
        maritalStatus: "Married"
      },
      medicalHistory: [
        { date: "2023-12-12", description: "Cardiac checkup" },
        { date: "2023-11-25", description: "ECG test" },
        { date: "2023-10-15", description: "Blood pressure monitoring" }
      ],
      subProfiles: [
        { name: "Fatima Khan", relation: "Spouse", dob: "1982-05-30", bloodGroup: "O-" },
        { name: "Zara Khan", relation: "Daughter", dob: "2014-02-15", bloodGroup: "B+" },
        { name: "Imran Khan", relation: "Son", dob: "2016-08-20", bloodGroup: "O+" }
      ]
    },
    {
      id: "MEM006",
      name: "Anjali Desai",
      email: "anjali.d@example.com",
      phone: "+91 98765-43215",
      dob: "1988-12-05",
      gender: "Female",
      bloodGroup: "AB+",
      height: "165",
      weight: "60",
      address: "890 Hill View, Pune",
      membershipType: "Premium",
      emergencyContact: {
        name: "Nikhil Desai",
        relationship: "Spouse",
        number: "+91 98765-43225"
      },
      personalHistory: {
        employmentStatus: "Employed",
        educationLevel: "PhD",
        maritalStatus: "Married"
      },
      medicalHistory: [
        { date: "2023-12-01", description: "Gynecology consultation" },
        { date: "2023-11-10", description: "Vaccination" }
      ],
      subProfiles: [
        { name: "Nikhil Desai", relation: "Spouse", dob: "1986-04-18", bloodGroup: "A+" }
      ]
    },
    {
      id: "MEM007",
      name: "Suresh Reddy",
      email: "suresh.r@example.com",
      phone: "+91 98765-43216",
      dob: "1980-09-28",
      gender: "Male",
      bloodGroup: "O+",
      height: "172",
      weight: "70",
      address: "123 Valley View, Kolkata",
      membershipType: "Standard",
      emergencyContact: {
        name: "Padma Reddy",
        relationship: "Spouse",
        number: "+91 98765-43226"
      },
      personalHistory: {
        employmentStatus: "Employed",
        educationLevel: "Masters",
        maritalStatus: "Married"
      },
      medicalHistory: [
        { date: "2023-12-07", description: "General checkup" },
        { date: "2023-11-22", description: "Dental cleaning" },
        { date: "2023-10-30", description: "X-ray" }
      ],
      subProfiles: [
        { name: "Padma Reddy", relation: "Spouse", dob: "1983-11-15", bloodGroup: "A+" },
        { name: "Kiran Reddy", relation: "Son", dob: "2012-06-20", bloodGroup: "O+" },
        { name: "Preethi Reddy", relation: "Daughter", dob: "2015-03-10", bloodGroup: "A+" }
      ]
    },
    {
      id: "MEM008",
      name: "Kavita Malhotra",
      email: "kavita.m@example.com",
      phone: "+91 98765-43217",
      dob: "1992-04-15",
      gender: "Female",
      bloodGroup: "B-",
      height: "168",
      weight: "58",
      address: "456 Sun City, Ahmedabad",
      membershipType: "Premium",
      emergencyContact: {
        name: "Rohit Malhotra",
        relationship: "Spouse",
        number: "+91 98765-43227"
      },
      personalHistory: {
        employmentStatus: "Self-employed",
        educationLevel: "Graduate",
        maritalStatus: "Married"
      },
      medicalHistory: [
        { date: "2023-12-03", description: "Annual health checkup" },
        { date: "2023-11-18", description: "Thyroid test" }
      ],
      subProfiles: [
        { name: "Rohit Malhotra", relation: "Spouse", dob: "1990-08-25", bloodGroup: "AB+" },
        { name: "Aarav Malhotra", relation: "Son", dob: "2018-12-05", bloodGroup: "B+" }
      ]
    },
    {
      id: "MEM009",
      name: "Sanjay Gupta",
      email: "sanjay.g@example.com",
      phone: "+91 98765-43218",
      dob: "1976-11-08",
      gender: "Male",
      bloodGroup: "A+",
      height: "175",
      weight: "78",
      address: "789 Marina Bay, Mumbai",
      membershipType: "Standard",
      emergencyContact: {
        name: "Maya Gupta",
        relationship: "Spouse",
        number: "+91 98765-43228"
      },
      personalHistory: {
        employmentStatus: "Business Owner",
        educationLevel: "MBA",
        maritalStatus: "Married"
      },
      medicalHistory: [
        { date: "2023-12-09", description: "Blood pressure monitoring" },
        { date: "2023-11-28", description: "Diabetes screening" }
      ],
      subProfiles: [
        { name: "Maya Gupta", relation: "Spouse", dob: "1979-07-20", bloodGroup: "O+" },
        { name: "Aryan Gupta", relation: "Son", dob: "2010-09-15", bloodGroup: "A+" },
        { name: "Ananya Gupta", relation: "Daughter", dob: "2013-04-30", bloodGroup: "O+" }
      ]
    },
    {
      id: "MEM010",
      name: "Nisha Joshi",
      email: "nisha.j@example.com",
      phone: "+91 98765-43219",
      medicalHistory: [
        { date: "2023-12-11", description: "Vision test" },
        { date: "2023-11-05", description: "Dental cleaning" }
      ],
      subProfiles: [
        { name: "Prakash Joshi", relation: "Spouse" }
      ]
    },
    {
      id: "MEM011",
      name: "Vikrant Mehta",
      email: "vikrant.m@example.com",
      phone: "+91 98765-43220",
      medicalHistory: [
        { date: "2023-12-14", description: "Allergy test" },
        { date: "2023-11-12", description: "Skin consultation" }
      ],
      subProfiles: [
        { name: "Pooja Mehta", relation: "Spouse" },
        { name: "Ishaan Mehta", relation: "Son" }
      ]
    },
    {
      id: "MEM012",
      name: "Deepika Singh",
      email: "deepika.s@example.com",
      phone: "+91 98765-43221",
      medicalHistory: [
        { date: "2023-12-02", description: "Nutritional consultation" },
        { date: "2023-11-19", description: "Fitness assessment" }
      ],
      subProfiles: [
        { name: "Rajinder Singh", relation: "Spouse" },
        { name: "Tara Singh", relation: "Daughter" }
      ]
    },
    {
      id: "MEM013",
      name: "Arjun Kapoor",
      email: "arjun.k@example.com",
      phone: "+91 98765-43222",
      medicalHistory: [
        { date: "2023-12-06", description: "Orthopedic consultation" },
        { date: "2023-11-24", description: "Physiotherapy session" }
      ],
      subProfiles: [
        { name: "Priya Kapoor", relation: "Spouse" },
        { name: "Aisha Kapoor", relation: "Daughter" },
        { name: "Kabir Kapoor", relation: "Son" }
      ]
    },
    {
      id: "MEM014",
      name: "Zara Ahmed",
      email: "zara.a@example.com",
      phone: "+91 98765-43223",
      medicalHistory: [
        { date: "2023-12-13", description: "Gynecology checkup" },
        { date: "2023-11-16", description: "Blood test" }
      ],
      subProfiles: [
        { name: "Imran Ahmed", relation: "Spouse" },
        { name: "Zain Ahmed", relation: "Son" }
      ]
    },
    {
      id: "MEM015",
      name: "Rahul Verma",
      email: "rahul.v@example.com",
      phone: "+91 98765-43224",
      medicalHistory: [
        { date: "2023-12-04", description: "Cardiology consultation" },
        { date: "2023-11-21", description: "ECG test" }
      ],
      subProfiles: [
        { name: "Sneha Verma", relation: "Spouse" },
        { name: "Rohan Verma", relation: "Son" }
      ]
    },
    {
      id: "MEM016",
      name: "Aisha Patel",
      email: "aisha.p@example.com",
      medicalHistory: [
        { date: "2023-12-01", description: "Annual health checkup" },
        { date: "2023-11-15", description: "Blood pressure monitoring" }
      ],
      subProfiles: [
        { name: "Kabir Patel", relation: "Spouse" },
        { name: "Zara Patel", relation: "Daughter" }
      ]
    },
    {
      id: "MEM017",
      name: "Vikram Singh",
      medicalHistory: [
        { date: "2023-12-05", description: "Diabetes screening" },
        { date: "2023-11-20", description: "Eye examination" }
      ],
      subProfiles: [
        { name: "Priya Singh", relation: "Spouse" }
      ]
    },
    {
      id: "MEM018",
      name: "Neha Sharma",
      medicalHistory: [
        { date: "2023-12-08", description: "Dental cleaning" },
        { date: "2023-11-25", description: "Allergy test" }
      ],
      subProfiles: [
        { name: "Rahul Sharma", relation: "Spouse" },
        { name: "Aryan Sharma", relation: "Son" }
      ]
    },
    {
      id: "MEM019",
      name: "Arjun Reddy",
      medicalHistory: [
        { date: "2023-12-10", description: "Orthopedic consultation" },
        { date: "2023-11-28", description: "Physiotherapy session" }
      ],
      subProfiles: [
        { name: "Meera Reddy", relation: "Spouse" },
        { name: "Aditya Reddy", relation: "Son" }
      ]
    },
    {
      id: "MEM020",
      name: "Priya Malhotra",
      medicalHistory: [
        { date: "2023-12-12", description: "Gynecology checkup" },
        { date: "2023-11-30", description: "Ultrasound" }
      ],
      subProfiles: [
        { name: "Akash Malhotra", relation: "Spouse" }
      ]
    },
    {
      id: "MEM021",
      name: "Sanjay Kapoor",
      medicalHistory: [
        { date: "2023-12-01", description: "Cardiology consultation" }
      ],
      subProfiles: [
        { name: "Pooja Kapoor", relation: "Spouse" },
        { name: "Rohan Kapoor", relation: "Son" }
      ]
    },
    {
      id: "MEM022",
      name: "Meera Iyer",
      medicalHistory: [
        { date: "2023-12-02", description: "Dermatology consultation" },
        { date: "2023-11-15", description: "Skin allergy test" }
      ],
      subProfiles: [
        { name: "Arun Iyer", relation: "Spouse" },
        { name: "Diya Iyer", relation: "Daughter" }
      ]
    },
    {
      id: "MEM023",
      name: "Rajat Verma",
      medicalHistory: [
        { date: "2023-12-03", description: "ENT consultation" }
      ],
      subProfiles: [
        { name: "Shweta Verma", relation: "Spouse" }
      ]
    },
    {
      id: "MEM024",
      name: "Sarika Gupta",
      medicalHistory: [
        { date: "2023-12-04", description: "Nutritionist consultation" },
        { date: "2023-11-20", description: "Diet planning" }
      ],
      subProfiles: [
        { name: "Mohit Gupta", relation: "Spouse" },
        { name: "Aisha Gupta", relation: "Daughter" }
      ]
    },
    {
      id: "MEM025",
      name: "Karthik Nair",
      medicalHistory: [
        { date: "2023-12-05", description: "Orthopedic follow-up" }
      ],
      subProfiles: [
        { name: "Lakshmi Nair", relation: "Spouse" },
        { name: "Arjun Nair", relation: "Son" }
      ]
    },
    {
      id: "MEM026",
      name: "Deepak Joshi",
      medicalHistory: [
        { date: "2023-12-06", description: "Dental surgery" }
      ],
      subProfiles: [
        { name: "Rashmi Joshi", relation: "Spouse" }
      ]
    },
    {
      id: "MEM027",
      name: "Anita Reddy",
      medicalHistory: [
        { date: "2023-12-07", description: "Gynecology follow-up" }
      ],
      subProfiles: [
        { name: "Suresh Reddy", relation: "Spouse" },
        { name: "Kavya Reddy", relation: "Daughter" }
      ]
    },
    {
      id: "MEM028",
      name: "Rahul Saxena",
      medicalHistory: [
        { date: "2023-12-08", description: "Physiotherapy session" }
      ],
      subProfiles: [
        { name: "Neha Saxena", relation: "Spouse" }
      ]
    },
    {
      id: "MEM029",
      name: "Priyanka Shah",
      medicalHistory: [
        { date: "2023-12-09", description: "Dermatology follow-up" }
      ],
      subProfiles: [
        { name: "Amit Shah", relation: "Spouse" },
        { name: "Ria Shah", relation: "Daughter" }
      ]
    },
    {
      id: "MEM030",
      name: "Vivek Choudhury",
      medicalHistory: [
        { date: "2023-12-10", description: "Cardiology checkup" }
      ],
      subProfiles: [
        { name: "Sneha Choudhury", relation: "Spouse" }
      ]
    },
    {
      id: "MEM031",
      name: "Anjali Mathur",
      medicalHistory: [
        { date: "2023-12-11", description: "Ophthalmology consultation" }
      ],
      subProfiles: [
        { name: "Rohit Mathur", relation: "Spouse" },
        { name: "Aditya Mathur", relation: "Son" }
      ]
    },
    {
      id: "MEM032",
      name: "Sameer Khanna",
      medicalHistory: [
        { date: "2023-12-01", description: "ENT follow-up" }
      ],
      subProfiles: [
        { name: "Nisha Khanna", relation: "Spouse" },
        { name: "Aarav Khanna", relation: "Son" }
      ]
    },
    {
      id: "MEM033",
      name: "Ritu Sharma",
      medicalHistory: [
        { date: "2023-12-02", description: "Dermatology consultation" }
      ],
      subProfiles: [
        { name: "Amit Sharma", relation: "Spouse" }
      ]
    },
    {
      id: "MEM034",
      name: "Prakash Rao",
      medicalHistory: [
        { date: "2023-12-03", description: "Diabetes follow-up" }
      ],
      subProfiles: [
        { name: "Lakshmi Rao", relation: "Spouse" },
        { name: "Shreya Rao", relation: "Daughter" }
      ]
    },
    {
      id: "MEM035",
      name: "Kavita Menon",
      medicalHistory: [
        { date: "2023-12-04", description: "Thyroid checkup" }
      ],
      subProfiles: [
        { name: "Rajesh Menon", relation: "Spouse" }
      ]
    },
    {
      id: "MEM036",
      name: "Arun Singhania",
      medicalHistory: [
        { date: "2023-12-05", description: "Cardiology consultation" }
      ],
      subProfiles: [
        { name: "Meena Singhania", relation: "Spouse" },
        { name: "Rahul Singhania", relation: "Son" }
      ]
    },
    {
      id: "MEM037",
      name: "Sunita Reddy",
      medicalHistory: [
        { date: "2023-12-06", description: "Gynecology checkup" }
      ],
      subProfiles: [
        { name: "Krishna Reddy", relation: "Spouse" }
      ]
    },
    {
      id: "MEM038",
      name: "Rajiv Malhotra",
      medicalHistory: [
        { date: "2023-12-07", description: "Orthopedic consultation" }
      ],
      subProfiles: [
        { name: "Seema Malhotra", relation: "Spouse" },
        { name: "Rohan Malhotra", relation: "Son" }
      ]
    },
    {
      id: "MEM039",
      name: "Pooja Iyer",
      medicalHistory: [
        { date: "2023-12-08", description: "Dental checkup" }
      ],
      subProfiles: [
        { name: "Karthik Iyer", relation: "Spouse" },
        { name: "Ananya Iyer", relation: "Daughter" }
      ]
    },
    {
      id: "MEM040",
      name: "Amit Verma",
      medicalHistory: [
        { date: "2023-12-09", description: "General checkup" }
      ],
      subProfiles: [
        { name: "Neha Verma", relation: "Spouse" }
      ]
    },
    {
      id: "MEM041",
      name: "Neha Singh",
      medicalHistory: [
        { date: "2023-12-10", description: "Cardiology consultation" }
      ],
      subProfiles: [
        { name: "Raj Singh", relation: "Spouse" }
      ]
    },
    {
      id: "MEM042",
      name: "Rajat Verma",
      medicalHistory: [
        { date: "2023-12-11", description: "Orthopedic follow-up" }
      ],
      subProfiles: [
        { name: "Shweta Verma", relation: "Spouse" }
      ]
    },
    {
      id: "MEM044",
      name: "Deepak Joshi",
      medicalHistory: [
        { date: "2023-12-13", description: "Dental surgery" }
      ],
      subProfiles: [
        { name: "Rashmi Joshi", relation: "Spouse" }
      ]
    },
    {
      id: "MEM045",
      name: "Anjali Mathur",
      medicalHistory: [
        { date: "2023-12-14", description: "Cardiology follow-up" }
      ],
      subProfiles: [
        { name: "Rohit Mathur", relation: "Spouse" }
      ]
    },
    {
      id: "MEM046",
      name: "Sameer Khanna",
      medicalHistory: [
        { date: "2023-12-15", description: "Orthopedic consultation" }
      ],
      subProfiles: [
        { name: "Aarav Khanna", relation: "Spouse" }
      ]
    },
    {
      id: "MEM047",
      name: "Ritu Sharma",
      medicalHistory: [
        { date: "2023-12-16", description: "Cardiology follow-up" }
      ],
      subProfiles: [
        { name: "Diya Iyer", relation: "Spouse" }
      ]
    },
    {
      id: "MEM048",
      name: "Kavita Menon",
      medicalHistory: [
        { date: "2023-12-17", description: "Orthopedic follow-up" }
      ],
      subProfiles: [
        { name: "Krishna Reddy", relation: "Spouse" }
      ]
    },
    {
      id: "MEM049",
      name: "Arun Singhania",
      medicalHistory: [
        { date: "2023-12-18", description: "Gynecology follow-up" }
      ],
      subProfiles: [
        { name: "Seema Malhotra", relation: "Spouse" }
      ]
    },
    {
      id: "MEM050",
      name: "Sunita Reddy",
      medicalHistory: [
        { date: "2023-12-19", description: "Cardiology follow-up" }
      ],
      subProfiles: [
        { name: "Raj Singh", relation: "Spouse" }
      ]
    },
    {
      id: "MEM051",
      name: "Rajiv Malhotra",
      medicalHistory: [
        { date: "2023-12-20", description: "Orthopedic consultation" }
      ],
      subProfiles: [
        { name: "Shweta Verma", relation: "Spouse" }
      ]
    },
    {
      id: "MEM052",
      name: "Pooja Iyer",
      medicalHistory: [
        { date: "2023-12-21", description: "Dental checkup" }
      ],
      subProfiles: [
        { name: "Mohit Gupta", relation: "Spouse" }
      ]
    },
    {
      id: "MEM053",
      name: "Amit Verma",
      medicalHistory: [
        { date: "2023-12-22", description: "General checkup" }
      ],
      subProfiles: [
        { name: "Raj Singh", relation: "Spouse" }
      ]
    },
    {
      id: "MEM054",
      name: "Neha Singh",
      medicalHistory: [
        { date: "2023-12-23", description: "Cardiology consultation" }
      ],
      subProfiles: [
        { name: "Shweta Verma", relation: "Spouse" }
      ]
    },
    {
      id: "MEM055",
      name: "Rajat Verma",
      medicalHistory: [
        { date: "2023-12-24", description: "Orthopedic follow-up" }
      ],
      subProfiles: [
        { name: "Mohit Gupta", relation: "Spouse" }
      ]
    },
    {
      id: "MEM056",
      name: "Sarika Gupta",
      medicalHistory: [
        { date: "2023-12-25", description: "Cardiology follow-up" }
      ],
      subProfiles: [
        { name: "Raj Singh", relation: "Spouse" }
      ]
    },
    {
      id: "MEM057",
      name: "Deepak Joshi",
      medicalHistory: [
        { date: "2023-12-26", description: "Dental surgery" }
      ],
      subProfiles: [
        { name: "Rashmi Joshi", relation: "Spouse" }
      ]
    },
    {
      id: "MEM058",
      name: "Anjali Mathur",
      medicalHistory: [
        { date: "2023-12-27", description: "Cardiology follow-up" }
      ],
      subProfiles: [
        { name: "Rohit Mathur", relation: "Spouse" }
      ]
    },
    {
      id: "MEM059",
      name: "Sameer Khanna",
      medicalHistory: [
        { date: "2023-12-28", description: "Orthopedic consultation" }
      ],
      subProfiles: [
        { name: "Aarav Khanna", relation: "Spouse" }
      ]
    },
    {
      id: "MEM060",
      name: "Ritu Sharma",
      medicalHistory: [
        { date: "2023-12-29", description: "Cardiology follow-up" }
      ],
      subProfiles: [
        { name: "Diya Iyer", relation: "Spouse" }
      ]
    },
    {
      id: "MEM061",
      name: "Kavita Menon",
      medicalHistory: [
        { date: "2023-12-30", description: "Orthopedic follow-up" }
      ],
      subProfiles: [
        { name: "Krishna Reddy", relation: "Spouse" }
      ]
    },
    {
      id: "MEM062",
      name: "Ashok Singhania",
      medicalHistory: [
        { date: "2023-12-31", description: "Gynecology follow-up" }
      ],
      subProfiles: [
        { name: "Seema Malhotra", relation: "Spouse" }
      ]
    },
    {
      id: "MEM063",
      name: "Suman Reddy",
      medicalHistory: [
        { date: "2023-12-01", description: "Cardiology follow-up" }
      ],
      subProfiles: [
        { name: "Raj Singh", relation: "Spouse" }
      ]
    },
    {
      id: "MEM064",
      name: "Rajeev Malhotra",
      medicalHistory: [
        { date: "2023-12-02", description: "Orthopedic consultation" }
      ],
      subProfiles: [
        { name: "Shweta Verma", relation: "Spouse" }
      ]
    },
    {
      id: "MEM065",
      name: "Prerna Iyer",
      medicalHistory: [
        { date: "2023-12-03", description: "Dental checkup" }
      ],
      subProfiles: [
        { name: "Mohit Gupta", relation: "Spouse" }
      ]
    },
    {
      id: "MEM066",
      name: "Avinash Verma",
      medicalHistory: [
        { date: "2023-12-04", description: "General checkup" }
      ],
      subProfiles: [
        { name: "Raj Singh", relation: "Spouse" }
      ]
    },
    {
      id: "MEM067",
      name: "Arjun Singhania",
      medicalHistory: [
        { date: "2023-12-05", description: "Cardiology consultation" }
      ],
      subProfiles: [
        { name: "Shweta Verma", relation: "Spouse" }
      ]
    },
    {
      id: "MEM068",
      name: "Swati Reddy",
      medicalHistory: [
        { date: "2023-12-06", description: "Orthopedic follow-up" }
      ],
      subProfiles: [
        { name: "Mohit Gupta", relation: "Spouse" }
      ]
    },
    {
      id: "MEM069",
      name: "Rakesh Malhotra",
      medicalHistory: [
        { date: "2023-12-07", description: "Cardiology follow-up" }
      ],
      subProfiles: [
        { name: "Raj Singh", relation: "Spouse" }
      ]
    },
    {
      id: "MEM070",
      name: "Pallavi Iyer",
      medicalHistory: [
        { date: "2023-12-08", description: "Dental surgery" }
      ],
      subProfiles: [
        { name: "Diya Iyer", relation: "Spouse" }
      ]
    },
    {
      id: "MEM071",
      name: "Anand Verma",
      medicalHistory: [
        { date: "2023-12-09", description: "Cardiology follow-up" }
      ],
      subProfiles: [
        { name: "Rohit Mathur", relation: "Spouse" }
      ]
    },
    {
      id: "MEM072",
      name: "Rohan Malhotra",
      medicalHistory: [
        { date: "2023-12-10", description: "Orthopedic consultation" }
      ],
      subProfiles: [
        { name: "Aarav Khanna", relation: "Spouse" }
      ]
    },
    {
      id: "MEM073",
      name: "Preeti Iyer",
      medicalHistory: [
        { date: "2023-12-11", description: "Dental checkup" }
      ],
      subProfiles: [
        { name: "Mohit Gupta", relation: "Spouse" }
      ]
    },
    {
      id: "MEM074",
      name: "Akash Verma",
      medicalHistory: [
        { date: "2023-12-12", description: "Cardiology follow-up" }
      ],
      subProfiles: [
        { name: "Rohit Mathur", relation: "Spouse" }
      ]
    },
    {
      id: "MEM075",
      name: "Arjun Singhania",
      medicalHistory: [
        { date: "2023-12-13", description: "Orthopedic follow-up" }
      ],
      subProfiles: [
        { name: "Aarav Khanna", relation: "Spouse" }
      ]
    },
    {
      id: "MEM076",
      name: "Swati Reddy",
      medicalHistory: [
        { date: "2023-12-14", description: "Cardiology follow-up" }
      ],
      subProfiles: [
        { name: "Raj Singh", relation: "Spouse" }
      ]
    },
    {
      id: "MEM077",
      name: "Rakesh Malhotra",
      medicalHistory: [
        { date: "2023-12-15", description: "Orthopedic consultation" }
      ],
      subProfiles: [
        { name: "Shweta Verma", relation: "Spouse" }
      ]
    },
    {
      id: "MEM078",
      name: "Pallavi Iyer",
      medicalHistory: [
        { date: "2023-12-16", description: "Dental checkup" }
      ],
      subProfiles: [
        { name: "Mohit Gupta", relation: "Spouse" }
      ]
    },
    {
      id: "MEM079",
      name: "Anand Verma",
      medicalHistory: [
        { date: "2023-12-17", description: "General checkup" }
      ],
      subProfiles: [
        { name: "Raj Singh", relation: "Spouse" }
      ]
    },
    {
      id: "MEM080",
      name: "Neha Singh",
      medicalHistory: [
        { date: "2023-12-18", description: "Cardiology consultation" }
      ],
      subProfiles: [
        { name: "Shweta Verma", relation: "Spouse" }
      ]
    },
    {
      id: "MEM081",
      name: "Rajat Verma",
      medicalHistory: [
        { date: "2023-12-19", description: "Orthopedic follow-up" }
      ],
      subProfiles: [
        { name: "Mohit Gupta", relation: "Spouse" }
      ]
    },
    {
      id: "MEM082",
      name: "Sarika Gupta",
      medicalHistory: [
        { date: "2023-12-20", description: "Cardiology follow-up" }
      ],
      subProfiles: [
        { name: "Raj Singh", relation: "Spouse" }
      ]
    },
    {
      id: "MEM083",
      name: "Deepak Joshi",
      medicalHistory: [
        { date: "2023-12-21", description: "Dental surgery" }
      ],
      subProfiles: [
        { name: "Rashmi Joshi", relation: "Spouse" }
      ]
    },
    {
      id: "MEM084",
      name: "Anjali Mathur",
      medicalHistory: [
        { date: "2023-12-22", description: "Cardiology follow-up" }
      ],
      subProfiles: [
        { name: "Rohit Mathur", relation: "Spouse" }
      ]
    },
    {
      id: "MEM085",
      name: "Sameer Khanna",
      medicalHistory: [
        { date: "2023-12-23", description: "Orthopedic consultation" }
      ],
      subProfiles: [
        { name: "Aarav Khanna", relation: "Spouse" }
      ]
    },
    {
      id: "MEM086",
      name: "Ritu Sharma",
      medicalHistory: [
        { date: "2023-12-24", description: "Cardiology follow-up" }
      ],
      subProfiles: [
        { name: "Diya Iyer", relation: "Spouse" }
      ]
    },
    {
      id: "MEM087",
      name: "Kavita Menon",
      medicalHistory: [
        { date: "2023-12-25", description: "Orthopedic follow-up" }
      ],
      subProfiles: [
        { name: "Krishna Reddy", relation: "Spouse" }
      ]
    },
    {
      id: "MEM088",
      name: "Aniket Singhania",
      medicalHistory: [
        { date: "2023-12-26", description: "Gynecology follow-up" }
      ],
      subProfiles: [
        { name: "Seema Malhotra", relation: "Spouse" }
      ]
    },
    {
      id: "MEM089",
      name: "Sneha Reddy",
      medicalHistory: [
        { date: "2023-12-27", description: "Cardiology follow-up" }
      ],
      subProfiles: [
        { name: "Raj Singh", relation: "Spouse" }
      ]
    },
    {
      id: "MEM090",
      name: "Rohan Malhotra",
      medicalHistory: [
        { date: "2023-12-28", description: "Orthopedic consultation" }
      ],
      subProfiles: [
        { name: "Shweta Verma", relation: "Spouse" }
      ]
    },
    {
      id: "MEM091",
      name: "Preeti Iyer",
      medicalHistory: [
        { date: "2023-12-29", description: "Dental checkup" }
      ],
      subProfiles: [
        { name: "Mohit Gupta", relation: "Spouse" }
      ]
    },
    {
      id: "MEM092",
      name: "Akash Verma",
      medicalHistory: [
        { date: "2023-12-30", description: "General checkup" }
      ],
      subProfiles: [
        { name: "Raj Singh", relation: "Spouse" }
      ]
    },
    {
      id: "MEM093",
      name: "Neha Singh",
      medicalHistory: [
        { date: "2023-12-31", description: "Cardiology consultation" }
      ],
      subProfiles: [
        { name: "Shweta Verma", relation: "Spouse" }
      ]
    },
    {
      id: "MEM094",
      name: "Rajat Verma",
      medicalHistory: [
        { date: "2023-12-01", description: "Orthopedic follow-up" }
      ],
      subProfiles: [
        { name: "Mohit Gupta", relation: "Spouse" }
      ]
    },
    {
      id: "MEM095",
      name: "Sarika Gupta",
      medicalHistory: [
        { date: "2023-12-02", description: "Cardiology follow-up" }
      ],
      subProfiles: [
        { name: "Raj Singh", relation: "Spouse" }
      ]
    },
    {
      id: "MEM096",
      name: "Deepak Joshi",
      medicalHistory: [
        { date: "2023-12-03", description: "Dental surgery" }
      ],
      subProfiles: [
        { name: "Rashmi Joshi", relation: "Spouse" }
      ]
    },
    {
      id: "MEM097",
      name: "Anjali Mathur",
      medicalHistory: [
        { date: "2023-12-04", description: "Cardiology follow-up" }
      ],
      subProfiles: [
        { name: "Rohit Mathur", relation: "Spouse" }
      ]
    },
    {
      id: "MEM098",
      name: "Sameer Khanna",
      medicalHistory: [
        { date: "2023-12-05", description: "Orthopedic consultation" }
      ],
      subProfiles: [
        { name: "Aarav Khanna", relation: "Spouse" }
      ]
    },
    {
      id: "MEM099",
      name: "Ritu Sharma",
      medicalHistory: [
        { date: "2023-12-06", description: "Cardiology follow-up" }
      ],
      subProfiles: [
        { name: "Diya Iyer", relation: "Spouse" }
      ]
    },
    {
      id: "MEM100",
      name: "Kavita Menon",
      medicalHistory: [
        { date: "2023-12-07", description: "Orthopedic follow-up" }
      ],
      subProfiles: [
        { name: "Krishna Reddy", relation: "Spouse" }
      ]
    }
  ])

  const [showMedicalHistory, setShowMedicalHistory] = useState(null)
  const [showSubProfiles, setShowSubProfiles] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showMedicalHistoryComponent, setShowMedicalHistoryComponent] = useState(false)
  const [selectedMembers, setSelectedMembers] = useState([])
  const [showNavigatorDropdown, setShowNavigatorDropdown] = useState(false)
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const [scrollTimeout, setScrollTimeout] = useState(null)
  const [lastScrollTop, setLastScrollTop] = useState(0)
  const [scrollDirection, setScrollDirection] = useState(null)

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calculate total pages
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage)

  // Get paginated members with proper range
  const startIndex = Math.max(0, (currentPage - 1) * itemsPerPage)
  const endIndex = Math.min(currentPage * itemsPerPage, filteredMembers.length)
  const paginatedMembers = filteredMembers.slice(startIndex, endIndex)

  // Check if there are more members to load
  useEffect(() => {
    setHasMore(currentPage < totalPages)
  }, [currentPage, totalPages])

  const loadMoreMembers = () => {
    if (!isLoading && hasMore) {
      setIsLoading(true)
      setTimeout(() => {
        setCurrentPage(prev => prev + 1)
        setIsLoading(false)
      }, 300)
    }
  }

  const handleTableScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target
    
    // Clear any existing scroll timeout
    if (scrollTimeout) {
      clearTimeout(scrollTimeout)
    }

    // Determine scroll direction
    const direction = scrollTop > lastScrollTop ? 'down' : 'up'
    setLastScrollTop(scrollTop)
    setScrollDirection(direction)
    
    // Calculate scroll percentage
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight
    
    // Set scrolling state
    setIsScrolling(true)

    // Handle pagination based on scroll direction
    if (direction === 'down' && scrollPercentage > 0.8 && !isLoading && hasMore) {
      loadMoreMembers()
    } else if (direction === 'up' && scrollPercentage < 0.2 && !isLoading && currentPage > 1) {
      setIsLoading(true)
      setTimeout(() => {
        setCurrentPage(prev => Math.max(1, prev - 1))
        setIsLoading(false)
      }, 300)
    }

    // Reset scrolling state after delay
    setScrollTimeout(setTimeout(() => {
      setIsScrolling(false)
    }, 150))
  }

  const handleDownloadId = (memberId) => {
    // Find the member by ID
    const member = members.find(m => m.id === memberId);
    if (!member) return;

    // Create a temporary canvas element
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 350;
    const ctx = canvas.getContext('2d');

    // Set background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add border
    ctx.strokeStyle = '#2563eb'; // blue-600
    ctx.lineWidth = 10;
    ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);

    // Add header
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(5, 5, canvas.width - 10, 60);

    // Add company name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px Arial';
    ctx.fillText('ASSIST HEALTH', 20, 45);

    // Add member details
    ctx.fillStyle = '#1f2937'; // gray-800
    ctx.font = 'bold 24px Arial';
    ctx.fillText(member.name, 20, 100);

    ctx.font = '18px Arial';
    ctx.fillText(`Member ID: ${member.id}`, 20, 140);
    ctx.fillText(`Email: ${member.email}`, 20, 170);
    ctx.fillText(`Phone: ${member.phone}`, 20, 200);

    // Add QR Code placeholder
    ctx.strokeStyle = '#000000';
    ctx.strokeRect(450, 100, 100, 100);
    ctx.font = '12px Arial';
    ctx.fillText('QR Code', 475, 150);

    // Add footer
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(5, canvas.height - 65, canvas.width - 10, 60);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Arial';
    ctx.fillText('This card is the property of Assist Health and must be returned upon request.', 20, canvas.height - 30);

    // Convert canvas to image and trigger download
    const link = document.createElement('a');
    link.download = `${member.id}_ID_Card.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  const handleUpdate = (member) => {
    // Implement update logic
    console.log('Update member:', member)
  }

  const handleDelete = (memberId) => {
    // Implement delete logic
    console.log(`Delete member ${memberId}`)
  }

  const handleCheckboxChange = (memberId) => {
    setSelectedMembers(prev => {
      if (prev.includes(memberId)) {
        return prev.filter(id => id !== memberId)
      } else {
        return [...prev, memberId]
      }
    })
  }

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedMembers(filteredMembers.map(member => member.id))
    } else {
      setSelectedMembers([])
    }
  }

  const handleNavigatorSelect = (navigator, selectedMembers) => {
    console.log('Assigning navigator:', navigator, 'to members:', selectedMembers)
    // Implement your assignment logic here
    setSelectedMembers([]) // Clear selections after assignment
  }

  const handleAssignNavigator = () => {
    setShowNavigatorDropdown(true)
  }

  const handleDoctorSelect = (doctor, selectedMembers) => {
    console.log('Assigning doctor:', doctor, 'to members:', selectedMembers)
    // Implement your assignment logic here
    setSelectedMembers([]) // Clear selections after assignment
  }

  const MedicalHistoryModal = ({ history, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <FaNotesMedical className="text-blue-500" />
            Medical History
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <FaTimes className="text-gray-500" />
          </button>
        </div>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {history.map((record, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-blue-500">{record.date}</p>
              </div>
              <p className="text-gray-700">{record.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const SubProfilesModal = ({ profiles, onClose }) => {
    const [selectedSubProfile, setSelectedSubProfile] = useState(null)

    if (selectedSubProfile) {
      return (
        <MemberDetailModal 
          member={{
            id: 'SUB-' + Math.random().toString(36).substr(2, 9),
            fullName: selectedSubProfile.name,
            relation: selectedSubProfile.relation,
            // Set default values for required fields
            email: 'Not specified',
            mobile: 'Not specified',
            gender: 'Not specified',
            dob: 'Not specified',
            membershipType: 'Basic',
            bloodGroup: 'Not specified',
            height: 'Not specified',
            weight: 'Not specified',
            emergencyContact: {
              name: 'Not specified',
              relationship: 'Not specified',
              number: 'Not specified'
            },
            personalHistory: {
              employmentStatus: 'Not specified',
              educationLevel: 'Not specified',
              maritalStatus: 'Not specified'
            },
            address: 'Not specified',
            additionalInfo: '',
            subProfiles: [],
            medicalHistory: [],
            // Add parent member information
            parentMember: selectedSubProfile.parentMember || 'Not specified'
          }}
          isSubProfile={true} // Add this flag to indicate it's a sub-profile
          onClose={() => setSelectedSubProfile(null)}
        />
      )
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Sub Profiles</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FaTimes />
            </button>
          </div>
          <div className="space-y-4">
            {profiles.map((profile, index) => (
              <div 
                key={index} 
                className="flex items-center gap-3 border-b pb-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg"
                onClick={() => setSelectedSubProfile({...profile, parentMember: selectedMember?.fullName})}
              >
                <FaUserCircle className="text-gray-400 w-10 h-10" />
                <div>
                  <p className="font-medium">{profile.name}</p>
                  <p className="text-sm text-gray-500">{profile.relation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const AddMemberForm = ({ onClose, initialData = null, isEditing = false }) => {
    const [formData, setFormData] = useState(initialData || {
      fullName: '',
      isSubProfile: false,
      parentMember: '',
      email: '',
      gender: '',
      mobile: '',
      profilePic: null,
      emergencyContact: {
        name: '',
        relationship: '',
        number: ''
      },
      personalHistory: {
        employmentStatus: '',
        educationLevel: '',
        maritalStatus: ''
      },
      additionalInfo: '',
      address: '',
      membershipType: ''
    })

    const calculateAge = (birthDate) => {
      if (!birthDate) return ''
      const today = new Date()
      const birth = new Date(birthDate)
      let age = today.getFullYear() - birth.getFullYear()
      const monthDiff = today.getMonth() - birth.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--
      }
      return age.toString()
    }

    const calculateDOB = (age) => {
      if (!age || isNaN(age)) return ''
      const today = new Date()
      const birthYear = today.getFullYear() - parseInt(age)
      const dob = new Date(birthYear, today.getMonth(), today.getDate())
      return dob.toISOString().split('T')[0]
    }

    const handleInputChange = (e) => {
      const { name, value } = e.target
      if (name === 'dob') {
        setFormData(prev => ({
          ...prev,
          dob: value,
          age: calculateAge(value)
        }))
      } else if (name === 'age') {
        if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 150)) {
          setFormData(prev => ({
            ...prev,
            age: value,
            dob: value ? calculateDOB(value) : ''
          }))
        }
      } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
      }
    }

    const handleNestedInputChange = (category, field, value) => {
      setFormData(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [field]: value
        }
      }))
    }

    const handlePhoneChange = (e) => {
      let value = e.target.value.replace(/\D/g, '')
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

    const handleSubmit = (e) => {
      e.preventDefault()
      console.log(formData)
      onClose()
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-2xl font-semibold text-gray-800">
              {isEditing ? 'Edit Member' : 'Add New Member'}
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
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {!isEditing ? (
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isSubProfile}
                      onChange={(e) => setFormData(prev => ({ ...prev, isSubProfile: e.target.checked }))}
                      className="rounded text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Is this a sub profile?</span>
                  </label>

                  {formData.isSubProfile && (
                    <select
                      name="parentMember"
                      value={formData.parentMember}
                      onChange={handleInputChange}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Parent Member</option>
                      {members.map(member => (
                        <option key={member.id} value={member.id}>
                          {member.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ) : initialData?.parentMember && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parent Member
                  </label>
                  <input
                    type="text"
                    value={initialData.parentMember}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    disabled
                  />
                </div>
              )}

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
                  Mobile Number * <span className="text-gray-500 text-xs">(+91 format)</span>
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handlePhoneChange}
                  placeholder="+91 98765-43210"
                  pattern="^\+91 \d{5}-\d{5}$"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
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
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  min="0"
                  max="150"
                  placeholder="Enter age"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Profile Picture */}
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
                        onChange={(e) => setFormData(prev => ({ ...prev, profilePic: e.target.files[0] }))}
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

            {/* Emergency Contact */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-700 mb-4">Emergency Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyContact.name}
                    onChange={(e) => handleNestedInputChange('emergencyContact', 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Relationship *
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyContact.relationship}
                    onChange={(e) => handleNestedInputChange('emergencyContact', 'relationship', e.target.value)}
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
                    value={formData.emergencyContact.number}
                    onChange={(e) => handleNestedInputChange('emergencyContact', 'number', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Health Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Group *
                </label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height (cm)
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Personal and Social History */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-700 mb-4">Personal & Social History</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employment Status
                  </label>
                  <select
                    value={formData.personalHistory.employmentStatus}
                    onChange={(e) => handleNestedInputChange('personalHistory', 'employmentStatus', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Status</option>
                    <option value="Employed">Employed</option>
                    <option value="Self-Employed">Self-Employed</option>
                    <option value="Unemployed">Unemployed</option>
                    <option value="Student">Student</option>
                    <option value="Retired">Retired</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Education Level
                  </label>
                  <select
                    value={formData.personalHistory.educationLevel}
                    onChange={(e) => handleNestedInputChange('personalHistory', 'educationLevel', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Level</option>
                    <option value="High School">High School</option>
                    <option value="Bachelor's">Bachelor's</option>
                    <option value="Master's">Master's</option>
                    <option value="Doctorate">Doctorate</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marital Status
                  </label>
                  <select
                    value={formData.personalHistory.maritalStatus}
                    onChange={(e) => handleNestedInputChange('personalHistory', 'maritalStatus', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
              </div>
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

            {/* Membership Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Membership Type *
              </label>
              <select
                name="membershipType"
                value={formData.membershipType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Membership</option>
                <option value="Basic">Basic</option>
                <option value="Premium">Premium</option>
              </select>
            </div>

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
                {isEditing ? 'Save Changes' : 'Add Member'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  const MemberDetailModal = ({ member, onClose, isSubProfile = false }) => {
    const calculateAge = (birthDate) => {
      if (!birthDate) return '-'
      const today = new Date()
      const birth = new Date(birthDate)
      let age = today.getFullYear() - birth.getFullYear()
      const monthDiff = today.getMonth() - birth.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--
      }
      return age
    }

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-gray-800">
                {isSubProfile ? 'Sub Profile Details' : 'Member Details'}
              </h3>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <FaTimes />
              </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-4">Personal Information</h4>
                <div className="space-y-3">
                  <DetailRow icon={<FaUser />} label="Name" value={member.name} />
                  <DetailRow icon={<FaPhone />} label="Mobile" value={member.mobile} />
                  <DetailRow icon={<FaVenusMars />} label="Gender" value={member.gender} />
                  <DetailRow
                    icon={<FaBirthdayCake className="text-blue-500" />}
                    label="Date of Birth"
                    value={member.dob ? new Date(member.dob).toLocaleDateString() : '-'}
                  />
                  <DetailRow
                    icon={<FaUserClock className="text-blue-500" />}
                    label="Age"
                    value={`${calculateAge(member.dob)} years`}
                  />
                  <DetailRow icon={<FaIdCard />} label="Membership" value={member.membershipType} />
                </div>
              </div>

              {/* Notes Section */}
              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-4">Notes</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3 max-h-[200px] overflow-y-auto">
                  {member.notes ? (
                    <div className="bg-white rounded p-3 shadow-sm">
                      <p className="text-gray-700">{member.notes}</p>
                      <p className="text-sm text-gray-500 mt-1">Latest Note</p>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No notes available</p>
                  )}
              </div>
            </div>

              {/* Medical History */}
              <div className="md:col-span-2">
                <h4 className="text-lg font-medium text-gray-700 mb-4">Medical History</h4>
                {member.medicalHistory && member.medicalHistory.length > 0 ? (
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                    {member.medicalHistory.map((record, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-sm font-medium text-blue-500">{record.date}</p>
                </div>
                        <p className="text-gray-700">{record.description}</p>
              </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4">
                    {/* Add your medical history content here */}
                    <p className="text-gray-600">No medical history available.</p>
                  </div>
                )}
            </div>

            {/* Emergency Contact */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-700 mb-4">Emergency Contact</h4>
              <div className="space-y-3">
                <InfoRow label="Name" value={member.emergencyContact.name} />
                <InfoRow label="Relationship" value={member.emergencyContact.relationship} />
                <InfoRow label="Contact Number" value={member.emergencyContact.number} />
              </div>
            </div>

            {/* Personal & Social History */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-700 mb-4">Personal & Social History</h4>
              <div className="space-y-3">
                <InfoRow label="Employment Status" value={member.personalHistory.employmentStatus} />
                <InfoRow label="Education Level" value={member.personalHistory.educationLevel} />
                <InfoRow label="Marital Status" value={member.personalHistory.maritalStatus} />
              </div>
            </div>

            {/* Address */}
            <div className="bg-gray-50 p-4 rounded-lg col-span-2">
              <h4 className="text-lg font-medium text-gray-700 mb-4">Address</h4>
              <p className="text-gray-700">{member.address}</p>
            </div>

            {/* Additional Information */}
            {member.additionalInfo && (
              <div className="bg-gray-50 p-4 rounded-lg col-span-2">
                <h4 className="text-lg font-medium text-gray-700 mb-4">Additional Information</h4>
                <p className="text-gray-700">{member.additionalInfo}</p>
              </div>
            )}
          </div>
                </div>
        </div>
      </div>
    )
  }

  const InfoRow = ({ label, value }) => (
    <div className="flex justify-between">
      <span className="text-gray-600">{label}:</span>
      <span className="text-gray-800 font-medium">
        {value || 'Not specified'}
      </span>
    </div>
  )

  const DetailRow = ({ icon, label, value }) => (
    <div className="flex items-center gap-3">
      <span className="text-gray-500">{icon}</span>
      <div className="flex-1 flex justify-between">
        <span className="text-gray-600">{label}:</span>
        <span className="text-gray-800 font-medium">{value || 'Not specified'}</span>
      </div>
    </div>
  )

  const EmptyMedicalHistoryView = ({ onClose }) => (
    <div className="p-4 relative w-full h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Medical History</h3>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <FaTimes className="text-gray-500 w-5 h-5" />
        </button>
      </div>
      <div className="mt-4">
        {/* Add your medical history content here */}
        <p className="text-gray-600">No medical history available.</p>
      </div>
    </div>
  )

  // Reset current page when search term changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const handleSaveNote = (memberId, noteText) => {
    // In a real application, you would make an API call here
    const updatedMembers = members.map(member => {
      if (member.id === memberId) {
        return { ...member, notes: noteText }
      }
      return member
    })
    console.log('Note saved:', { memberId, noteText })
  }

  const handleDeleteNote = (memberId) => {
    // In a real application, you would make an API call here
    const updatedMembers = members.map(member => {
      if (member.id === memberId) {
        const { notes, ...rest } = member
        return rest
      }
      return member
    })
    console.log('Note deleted:', memberId)
  }

  const AddMedicalHistoryModal = ({ member, onClose, onSave }) => {
    const [formData, setFormData] = useState({
      primaryCarePhysician: {
        name: '',
        contactNumber: ''
      },
      treatingDoctors: [{
        name: '',
        hospital: '',
        speciality: ''
      }],
      followUps: [{
        date: '',
        specialistDetails: '',
        remarks: ''
      }],
      previousConditions: [{
        condition: '',
        diagnosisDate: '',
        treatmentReceived: ''
      }],
      surgeries: [{
        procedure: '',
        date: '',
        surgeon: ''
      }],
      allergies: [{
        type: '',
        description: ''
      }],
      currentMedications: [{
        name: '',
        dosage: '',
        frequency: ''
      }],
      familyHistory: [{
        condition: '',
        relationship: ''
      }],
      immunizationHistory: [{
        vaccination: '',
        dateReceived: ''
      }],
      medicalTestResults: [{
        name: '',
        date: '',
        results: ''
      }],
      currentSymptoms: [{
        symptom: '',
        concerns: ''
      }],
      lifestyleHabits: {
        smoking: 'no',
        alcoholConsumption: 'no',
        exercise: 'no'
      },
      healthInsurance: {
        provider: '',
        policyNumber: ''
      }
    });

    const handleInputChange = (section, field, value, index = null) => {
      setFormData(prev => {
        if (index !== null && Array.isArray(prev[section])) {
          // Handle array fields
          const updatedArray = [...prev[section]];
          updatedArray[index] = {
            ...updatedArray[index],
            [field]: value
          };
          return {
            ...prev,
            [section]: updatedArray
          };
        } else if (typeof prev[section] === 'object' && !Array.isArray(prev[section])) {
          // Handle nested object fields
          return {
            ...prev,
            [section]: {
              ...prev[section],
              [field]: value
            }
          };
        }
        // Handle direct fields
        return {
          ...prev,
          [section]: value
        };
      });
    };

    const handleAddItem = (section) => {
      const emptyItems = {
        treatingDoctors: {
          name: '',
          hospital: '',
          speciality: ''
        },
        followUps: {
          date: '',
          specialistDetails: '',
          remarks: ''
        },
        previousConditions: {
          condition: '',
          diagnosisDate: '',
          treatmentReceived: ''
        },
        surgeries: {
          procedure: '',
          date: '',
          surgeon: ''
        },
        allergies: {
          type: '',
          description: ''
        },
        currentMedications: {
          name: '',
          dosage: '',
          frequency: ''
        },
        familyHistory: {
          condition: '',
          relationship: ''
        },
        immunizationHistory: {
          vaccination: '',
          dateReceived: ''
        },
        medicalTestResults: {
          name: '',
          date: '',
          results: ''
        },
        currentSymptoms: {
          symptom: '',
          concerns: ''
        }
      };

      if (section in emptyItems) {
        setFormData(prev => ({
          ...prev,
          [section]: [...(prev[section] || []), emptyItems[section]]
        }));
      }
    };

    const handleRemoveItem = (section, index) => {
      setFormData(prev => ({
        ...prev,
        [section]: prev[section].filter((_, i) => i !== index)
      }));
    };

    const getEmptyItem = (section) => {
      switch (section) {
        case 'previousConditions':
          return { condition: '', diagnosisDate: '', treatmentReceived: '' };
        case 'surgeries':
          return { procedure: '', date: '', surgeon: '' };
        case 'currentMedications':
          return { name: '', dosage: '', frequency: '' };
        case 'immunizationHistory':
          return { vaccination: '', dateReceived: '' };
        case 'currentSymptoms':
          return { symptom: '', concerns: '' };
        default:
          return {};
      }
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
      onClose();
    };

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-2xl font-semibold text-gray-800">Add Medical History</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <FaTimes className="text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Member Details */}
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="text-lg font-medium text-gray-700 mb-4">Member Details</h4>
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-24 h-24 mb-3">
                  {member?.profilePhoto ? (
                    <img
                      src={member.profilePhoto}
                      alt={member?.name}
                      className="w-full h-full rounded-full object-cover border-2 border-blue-500"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                      <FaUserCircle className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{member?.name}</h3>
                <p className="text-gray-500">ID: {member?.id}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Member ID</label>
                  <input
                    type="text"
                    value={member?.id || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={member?.name || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                  <input
                    type="text"
                    value={member?.mobile || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="text"
                    value={member?.dob ? new Date(member.dob).toLocaleDateString() : ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <input
                    type="text"
                    value={member?.gender || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                  <input
                    type="text"
                    value={member?.bloodGroup || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                  <input
                    type="text"
                    value={member?.height || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                  <input
                    type="text"
                    value={member?.weight || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Membership Type</label>
                  <input
                    type="text"
                    value={member?.membershipType || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>
            </div>

            {/* Primary Care Physician */}
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="text-lg font-medium text-gray-700 mb-4">Primary Care Physician (AssistHealth Doctor)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Physician Name*</label>
                  <input
                    type="text"
                    value={formData.primaryCarePhysician.name}
                    onChange={(e) => handleInputChange('primaryCarePhysician', 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={formData.primaryCarePhysician.contactNumber}
                      onChange={(e) => handleInputChange('primaryCarePhysician', 'contactNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-l-0 border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Treating Doctors */}
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium text-gray-700">Treating Doctors</h4>
                <button
                  type="button"
                  onClick={() => handleAddItem('treatingDoctors')}
                  className="text-blue-500 hover:text-blue-600 flex items-center gap-1"
                >
                  <FaPlus className="w-4 h-4" /> Add Doctor
                </button>
              </div>
              {formData.treatingDoctors.map((doctor, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 pb-4 border-b last:border-b-0">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Treating Doctor</label>
                    <input
                      type="text"
                      value={doctor.name}
                      onChange={(e) => handleInputChange('treatingDoctors', 'name', e.target.value, index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hospital</label>
                    <input
                      type="text"
                      value={doctor.hospital}
                      onChange={(e) => handleInputChange('treatingDoctors', 'hospital', e.target.value, index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Speciality</label>
                    <input
                      type="text"
                      value={doctor.speciality}
                      onChange={(e) => handleInputChange('treatingDoctors', 'speciality', e.target.value, index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem('treatingDoctors', index)}
                        className="absolute -right-2 -top-2 text-red-500 hover:text-red-600 p-1"
                      >
                        <FaTimes className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Follow Ups */}
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium text-gray-700">Follow Ups</h4>
                <button
                  type="button"
                  onClick={() => handleAddItem('followUps')}
                  className="text-blue-500 hover:text-blue-600 flex items-center gap-1"
                >
                  <FaPlus className="w-4 h-4" /> Add Follow Up
                </button>
              </div>
              {formData.followUps.map((followUp, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 pb-4 border-b last:border-b-0">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={followUp.name}
                      onChange={(e) => handleInputChange('currentMedications', 'name', e.target.value, index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
                    <input
                      type="text"
                      value={followUp.dosage}
                      onChange={(e) => handleInputChange('currentMedications', 'dosage', e.target.value, index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                    <input
                      type="text"
                      value={followUp.frequency}
                      onChange={(e) => handleInputChange('currentMedications', 'frequency', e.target.value, index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem('currentMedications', index)}
                        className="absolute -right-2 -top-2 text-red-500 hover:text-red-600 p-1"
                      >
                        <FaTimes className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Family Medical History */}
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium text-gray-700">Family Medical History</h4>
                <button
                  type="button"
                  onClick={() => handleAddItem('familyHistory')}
                  className="text-blue-500 hover:text-blue-600 flex items-center gap-1"
                >
                  <FaPlus className="w-4 h-4" /> Add Family History
                </button>
              </div>
              {formData.familyHistory.map((history, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pb-4 border-b last:border-b-0">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                    <input
                      type="text"
                      value={history.condition}
                      onChange={(e) => handleInputChange('familyHistory', 'condition', e.target.value, index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                    <input
                      type="text"
                      value={history.relationship}
                      onChange={(e) => handleInputChange('familyHistory', 'relationship', e.target.value, index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem('familyHistory', index)}
                        className="absolute -right-2 -top-2 text-red-500 hover:text-red-600 p-1"
                      >
                        <FaTimes className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Immunization History */}
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium text-gray-700">Immunization History</h4>
                <button
                  type="button"
                  onClick={() => handleAddItem('immunizationHistory')}
                  className="text-blue-500 hover:text-blue-600 flex items-center gap-1"
                >
                  <FaPlus className="w-4 h-4" /> Add Immunization
                </button>
              </div>
              {formData.immunizationHistory.map((immunization, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pb-4 border-b last:border-b-0">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vaccination</label>
                    <input
                      type="text"
                      value={immunization.vaccination}
                      onChange={(e) => handleInputChange('immunizationHistory', 'vaccination', e.target.value, index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Received</label>
                    <input
                      type="date"
                      value={immunization.dateReceived}
                      onChange={(e) => handleInputChange('immunizationHistory', 'dateReceived', e.target.value, index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem('immunizationHistory', index)}
                        className="absolute -right-2 -top-2 text-red-500 hover:text-red-600 p-1"
                      >
                        <FaTimes className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Previous Medical Test Results */}
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium text-gray-700">Previous Medical Test Results</h4>
                <button
                  type="button"
                  onClick={() => handleAddItem('medicalTestResults')}
                  className="text-blue-500 hover:text-blue-600 flex items-center gap-1"
                >
                  <FaPlus className="w-4 h-4" /> Add Test Result
                </button>
              </div>
              {formData.medicalTestResults.map((test, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 pb-4 border-b last:border-b-0">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Test Name</label>
                    <input
                      type="text"
                      value={test.name}
                      onChange={(e) => handleInputChange('medicalTestResults', 'name', e.target.value, index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={test.date}
                      onChange={(e) => handleInputChange('medicalTestResults', 'date', e.target.value, index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Results</label>
                    <input
                      type="text"
                      value={test.results}
                      onChange={(e) => handleInputChange('medicalTestResults', 'results', e.target.value, index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem('medicalTestResults', index)}
                        className="absolute -right-2 -top-2 text-red-500 hover:text-red-600 p-1"
                      >
                        <FaTimes className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Current Symptoms or Concerns */}
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium text-gray-700">Current Symptoms or Concerns</h4>
                <button
                  type="button"
                  onClick={() => handleAddItem('currentSymptoms')}
                  className="text-blue-500 hover:text-blue-600 flex items-center gap-1"
                >
                  <FaPlus className="w-4 h-4" /> Add Symptom
                </button>
              </div>
              {formData.currentSymptoms.map((symptom, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pb-4 border-b last:border-b-0">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Symptom</label>
                    <input
                      type="text"
                      value={symptom.symptom}
                      onChange={(e) => handleInputChange('currentSymptoms', 'symptom', e.target.value, index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Additional Concerns</label>
                    <input
                      type="text"
                      value={symptom.concerns}
                      onChange={(e) => handleInputChange('currentSymptoms', 'concerns', e.target.value, index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem('currentSymptoms', index)}
                        className="absolute -right-2 -top-2 text-red-500 hover:text-red-600 p-1"
                      >
                        <FaTimes className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Lifestyle Habits */}
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="text-lg font-medium text-gray-700 mb-4">Lifestyle Habits</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Smoking</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="yes"
                        checked={formData.lifestyleHabits.smoking === 'yes'}
                        onChange={(e) => handleInputChange('lifestyleHabits', 'smoking', e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="no"
                        checked={formData.lifestyleHabits.smoking === 'no'}
                        onChange={(e) => handleInputChange('lifestyleHabits', 'smoking', e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">No</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="occasional"
                        checked={formData.lifestyleHabits.smoking === 'occasional'}
                        onChange={(e) => handleInputChange('lifestyleHabits', 'smoking', e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Occasional</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Alcohol Consumption</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="yes"
                        checked={formData.lifestyleHabits.alcoholConsumption === 'yes'}
                        onChange={(e) => handleInputChange('lifestyleHabits', 'alcoholConsumption', e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="no"
                        checked={formData.lifestyleHabits.alcoholConsumption === 'no'}
                        onChange={(e) => handleInputChange('lifestyleHabits', 'alcoholConsumption', e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">No</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="occasional"
                        checked={formData.lifestyleHabits.alcoholConsumption === 'occasional'}
                        onChange={(e) => handleInputChange('lifestyleHabits', 'alcoholConsumption', e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Occasional</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Exercise</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="yes"
                        checked={formData.lifestyleHabits.exercise === 'yes'}
                        onChange={(e) => handleInputChange('lifestyleHabits', 'exercise', e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="no"
                        checked={formData.lifestyleHabits.exercise === 'no'}
                        onChange={(e) => handleInputChange('lifestyleHabits', 'exercise', e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">No</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="occasional"
                        checked={formData.lifestyleHabits.exercise === 'occasional'}
                        onChange={(e) => handleInputChange('lifestyleHabits', 'exercise', e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Occasional</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Health Insurance Information */}
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="text-lg font-medium text-gray-700 mb-4">Health Insurance Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Provider</label>
                  <input
                    type="text"
                    value={formData.healthInsurance.provider}
                    onChange={(e) => handleInputChange('healthInsurance', 'provider', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Policy Number</label>
                  <input
                    type="text"
                    value={formData.healthInsurance.policyNumber}
                    onChange={(e) => handleInputChange('healthInsurance', 'policyNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Add state for showing the add medical history modal
  const [showAddMedicalHistory, setShowAddMedicalHistory] = useState(false);
  const [selectedMemberForMedicalHistory, setSelectedMemberForMedicalHistory] = useState(null);

  // Add the handler for saving medical history
  const handleSaveMedicalHistory = (medicalHistoryData) => {
    console.log('Saving medical history:', medicalHistoryData);
    // Here you would typically make an API call to save the data
  };

  const ViewMedicalHistoryModal = ({ member, onClose }) => {
    const [selectedSections, setSelectedSections] = useState({
      memberDetails: true,
      primaryCarePhysician: false,
      treatingDoctors: false,
      followUps: false,
      previousConditions: false,
      surgeries: false,
      allergies: false,
      currentMedications: false,
      familyHistory: false,
      immunizationHistory: false,
      medicalTestResults: false,
      currentSymptoms: false
    });

    // Dummy data for demonstration
    const dummyMedicalHistory = {
      primaryCarePhysician: {
        name: "Dr. Sarah Johnson",
        contactNumber: "9876543210"
      },
      treatingDoctors: [
        {
          name: "Dr. Michael Smith",
          hospital: "City General Hospital",
          speciality: "Cardiologist"
        },
        {
          name: "Dr. Emily Brown",
          hospital: "Medical Center",
          speciality: "Neurologist"
        }
      ],
      followUps: [
        {
          date: "2024-04-01",
          specialistDetails: "Dr. Michael Smith - Cardiology",
          remarks: "Regular checkup and ECG review"
        },
        {
          date: "2024-04-15",
          specialistDetails: "Dr. Emily Brown - Neurology",
          remarks: "MRI results discussion"
        }
      ],
      previousConditions: [
        {
          condition: "Hypertension",
          diagnosisDate: "2023-06-15",
          treatmentReceived: "Prescribed beta blockers and lifestyle changes"
        },
        {
          condition: "Migraine",
          diagnosisDate: "2023-08-20",
          treatmentReceived: "Prescribed preventive medications"
        }
      ],
      surgeries: [
        {
          procedure: "Appendectomy",
          date: "2022-03-15",
          surgeon: "Dr. Robert Wilson"
        }
      ],
      allergies: [
        {
          type: "Medication",
          description: "Penicillin - Severe reaction"
        },
        {
          type: "Food",
          description: "Peanuts - Mild allergic response"
        }
      ],
      currentMedications: [
        {
          name: "Amlodipine",
          dosage: "5mg",
          frequency: "Once daily"
        },
        {
          name: "Propranolol",
          dosage: "40mg",
          frequency: "Twice daily"
        }
      ],
      familyHistory: [
        {
          condition: "Diabetes",
          relationship: "Father"
        },
        {
          condition: "Hypertension",
          relationship: "Mother"
        }
      ],
      immunizationHistory: [
        {
          vaccination: "COVID-19",
          dateReceived: "2023-01-15"
        },
        {
          vaccination: "Influenza",
          dateReceived: "2023-09-30"
        }
      ],
      medicalTestResults: [
        {
          name: "Complete Blood Count",
          date: "2024-02-15",
          results: "Within normal range"
        },
        {
          name: "Lipid Profile",
          date: "2024-02-15",
          results: "Slightly elevated cholesterol"
        }
      ],
      currentSymptoms: [
        {
          symptom: "Occasional headaches",
          concerns: "Frequency has reduced after medication"
        }
      ]
    };

    // Merge dummy data with actual member data for display
    const displayData = {
      ...dummyMedicalHistory,
      member: member || {}
    };

    if (!member) {
      return null;
    }

    const formatDate = (dateString) => {
      if (!dateString) return '';
      try {
        return new Date(dateString).toLocaleDateString();
      } catch (error) {
        return dateString;
      }
    };

    const handleSectionToggle = (section) => {
      setSelectedSections(prev => ({
        ...prev,
        [section]: !prev[section]
      }));
    };

    const handleDownloadPDF = () => {
      const content = document.createElement('div');
      content.className = 'pdf-content';

      // Add header
      const header = document.createElement('div');
      header.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="/logo.png" alt="AssistHealth Logo" style="height: 60px; margin-bottom: 10px;" />
          <h1 style="color: #1a365d; margin: 0;">Medical History Report</h1>
          <p style="color: #4a5568; margin: 5px 0;">Generated on: ${new Date().toLocaleDateString()}</p>
        </div>
      `;
      content.appendChild(header);

      // Add selected sections
      if (selectedSections.memberDetails) {
        const memberDetails = document.createElement('div');
        memberDetails.innerHTML = `
          <div style="margin-bottom: 20px;">
            <h2 style="color: #2b6cb0; border-bottom: 2px solid #2b6cb0; padding-bottom: 5px;">Member Details</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
              <p><strong>Name:</strong> ${member.name}</p>
              <p><strong>ID:</strong> ${member.id}</p>
              <p><strong>Date of Birth:</strong> ${member.dob || 'N/A'}</p>
              <p><strong>Blood Group:</strong> ${member.bloodGroup || 'N/A'}</p>
            </div>
          </div>
        `;
        content.appendChild(memberDetails);
      }

      if (selectedSections.primaryCarePhysician && displayData.primaryCarePhysician) {
        const pcpSection = document.createElement('div');
        pcpSection.innerHTML = `
          <div style="margin-bottom: 20px;">
            <h2 style="color: #2b6cb0; border-bottom: 2px solid #2b6cb0; padding-bottom: 5px;">Primary Care Physician</h2>
            <div style="margin-top: 10px;">
              <p><strong>Name:</strong> ${displayData.primaryCarePhysician.name || 'N/A'}</p>
              <p><strong>Contact:</strong> ${displayData.primaryCarePhysician.contactNumber || 'N/A'}</p>
            </div>
          </div>
        `;
        content.appendChild(pcpSection);
      }

      if (selectedSections.currentMedications && displayData.currentMedications?.length > 0) {
        const medicationsSection = document.createElement('div');
        medicationsSection.innerHTML = `
          <div style="margin-bottom: 20px;">
            <h2 style="color: #2b6cb0; border-bottom: 2px solid #2b6cb0; padding-bottom: 5px;">Current Medications</h2>
            <div style="margin-top: 10px;">
              ${displayData.currentMedications.map(med => `
                <div style="margin-bottom: 10px; padding: 10px; background-color: #f7fafc; border-radius: 4px;">
                  <p><strong>Medication:</strong> ${med.name}</p>
                  <p><strong>Dosage:</strong> ${med.dosage}</p>
                  <p><strong>Frequency:</strong> ${med.frequency}</p>
                </div>
              `).join('')}
            </div>
          </div>
        `;
        content.appendChild(medicationsSection);
      }

      if (selectedSections.allergies && displayData.allergies?.length > 0) {
        const allergiesSection = document.createElement('div');
        allergiesSection.innerHTML = `
          <div style="margin-bottom: 20px;">
            <h2 style="color: #2b6cb0; border-bottom: 2px solid #2b6cb0; padding-bottom: 5px;">Allergies</h2>
            <div style="margin-top: 10px;">
              ${displayData.allergies.map(allergy => `
                <div style="margin-bottom: 10px; padding: 10px; background-color: #fff3e0; border-radius: 4px;">
                  <p><strong>Type:</strong> ${allergy.type}</p>
                  <p><strong>Description:</strong> ${allergy.description}</p>
                </div>
              `).join('')}
            </div>
          </div>
        `;
        content.appendChild(allergiesSection);
      }

      if (selectedSections.immunizationHistory && displayData.immunizationHistory?.length > 0) {
        const immunizationsSection = document.createElement('div');
        immunizationsSection.innerHTML = `
          <div style="margin-bottom: 20px;">
            <h2 style="color: #2b6cb0; border-bottom: 2px solid #2b6cb0; padding-bottom: 5px;">Immunization History</h2>
            <div style="margin-top: 10px;">
              ${displayData.immunizationHistory.map(immunization => `
                <div style="margin-bottom: 10px; padding: 10px; background-color: #f7fafc; border-radius: 4px;">
                  <p><strong>Vaccination:</strong> ${immunization.vaccination}</p>
                  <p><strong>Date Received:</strong> ${formatDate(immunization.dateReceived)}</p>
                </div>
              `).join('')}
            </div>
          </div>
        `;
        content.appendChild(immunizationsSection);
      }

      // Configure PDF options
      const options = {
        margin: [10, 10],
        filename: `medical_history_${member.id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      // Generate PDF
      html2pdf().from(content).set(options).save();
    };

    // Section Header Component
    const SectionHeader = ({ title, icon, section, bgColor, textColor, borderColor }) => (
      <div className={`px-6 py-4 ${bgColor} border-b ${borderColor} flex justify-between items-center`}>
        <h3 className={`text-lg font-semibold ${textColor} flex items-center gap-2`}>
          {icon}
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectedSections[section]}
            onChange={() => handleSectionToggle(section)}
            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
        </div>
      </div>
    );

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-100 rounded-xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b flex justify-between items-center sticky top-0 z-10 shadow-sm">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FaNotesMedical className="text-primary-600" />
                Medical History
              </h2>
              <p className="text-gray-600 mt-1">Patient: {member?.name || 'N/A'}</p>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleDownloadPDF}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <FaDownload />
                Download Selected
              </button>
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <FaTimes className="text-gray-500 text-xl" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Member Details */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <SectionHeader
                    title="Member Details"
                    icon={<FaUser className="text-blue-600" />}
                    section="memberDetails"
                    bgColor="bg-blue-50"
                    textColor="text-blue-800"
                    borderColor="border-blue-100"
                  />
                  <div className="p-6">
                    {/* Profile Photo and Basic Info */}
                    <div className="flex items-center pb-6 mb-6 border-b border-gray-200">
                      <div className="relative w-24 h-24 flex-shrink-0">
                        {member?.profilePhoto ? (
                          <img
                            src={member.profilePhoto}
                            alt={member.name}
                            className="w-full h-full rounded-full object-cover border-4 border-blue-100"
                          />
                        ) : (
                          <div className="w-full h-full rounded-full bg-blue-50 border-4 border-blue-100 flex items-center justify-center">
                            <FaUserCircle className="w-16 h-16 text-blue-300" />
                          </div>
                        )}
                      </div>
                      <div className="ml-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-1">{member.name}</h3>
                        <p className="text-gray-500 mb-2">ID: {member.id}</p>
                        <div className="flex items-center gap-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                            <FaTint className="mr-1" /> {member.bloodGroup || 'N/A'}
                          </span>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-50 text-gray-700">
                            <FaVenusMars className="mr-1" /> {member.gender || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Member Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-500 mb-3">Contact Information</h4>
                        <div className="space-y-3">
                          <DetailRow icon={<FaEnvelope className="text-blue-500" />} label="Email" value={member.email} />
                          <DetailRow icon={<FaPhone className="text-blue-500" />} label="Phone" value={member.phone} />
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-500 mb-3">Physical Details</h4>
                        <div className="space-y-3">
                          <DetailRow icon={<FaRulerVertical className="text-blue-500" />} label="Height" value={member.height ? `${member.height} cm` : 'N/A'} />
                          <DetailRow icon={<FaWeight className="text-blue-500" />} label="Weight" value={member.weight ? `${member.weight} kg` : 'N/A'} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Primary Care Physician */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <SectionHeader
                    title="Primary Care Physician"
                    icon={<FaUserMd className="text-green-600" />}
                    section="primaryCarePhysician"
                    bgColor="bg-green-50"
                    textColor="text-green-800"
                    borderColor="border-green-100"
                  />
                  <div className="p-6">
                    <div className="bg-green-50 rounded-lg border border-green-100 p-4">
                      <div className="flex items-start">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <FaUserMd className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4 flex-1">
                          <h4 className="text-lg font-medium text-gray-800">
                            {displayData.primaryCarePhysician?.name || 'No physician assigned'}
                          </h4>
                          <p className="text-sm text-gray-500 mb-3">Primary Healthcare Provider</p>
                          {displayData.primaryCarePhysician?.contactNumber && (
                            <div className="flex items-center text-sm text-gray-600">
                              <FaPhone className="w-4 h-4 text-green-500 mr-2" />
                              {displayData.primaryCarePhysician.contactNumber}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Current Medications */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <SectionHeader
                    title="Current Medications"
                    icon={<FaPills className="text-green-600" />}
                    section="currentMedications"
                    bgColor="bg-green-50"
                    textColor="text-green-800"
                    borderColor="border-green-100"
                  />
                  <div className="p-6">
                    <div className="space-y-4">
                      {(displayData.currentMedications || []).map((medication, index) => (
                        <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-100">
                          <div className="grid grid-cols-1 gap-3">
                            <DetailRow icon={<FaPills className="text-green-500" />} label="Medication" value={medication.name} />
                            <DetailRow icon={<FaPrescription className="text-green-500" />} label="Dosage" value={medication.dosage} />
                            <DetailRow icon={<FaClock className="text-green-500" />} label="Frequency" value={medication.frequency} />
                          </div>
                        </div>
                      ))}
                      {(!displayData.currentMedications || displayData.currentMedications.length === 0) && (
                        <p className="text-gray-500 italic">No current medications recorded</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Allergies */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <SectionHeader
                    title="Allergies"
                    icon={<FaExclamationTriangle className="text-yellow-600" />}
                    section="allergies"
                    bgColor="bg-yellow-50"
                    textColor="text-yellow-800"
                    borderColor="border-yellow-100"
                  />
                  <div className="p-6">
                    <div className="space-y-4">
                      {(displayData.allergies || []).map((allergy, index) => (
                        <div key={index} className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                          <div className="grid grid-cols-1 gap-3">
                            <DetailRow icon={<FaExclamationTriangle className="text-yellow-500" />} label="Type" value={allergy.type} />
                            <DetailRow icon={<FaInfoCircle className="text-yellow-500" />} label="Description" value={allergy.description} />
                          </div>
                        </div>
                      ))}
                      {(!displayData.allergies || displayData.allergies.length === 0) && (
                        <p className="text-gray-500 italic">No allergies recorded</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Current Symptoms & Concerns */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <SectionHeader
                    title="Current Symptoms & Concerns"
                    icon={<FaNotesMedical className="text-teal-600" />}
                    section="currentSymptoms"
                    bgColor="bg-teal-50"
                    textColor="text-teal-800"
                    borderColor="border-teal-100"
                  />
                  <div className="p-6">
                    <div className="space-y-4">
                      {(displayData.currentSymptoms || []).map((symptom, index) => (
                        <div key={index} className="p-4 bg-teal-50 rounded-lg border border-teal-100">
                          <div className="grid grid-cols-1 gap-3">
                            <DetailRow icon={<FaNotesMedical className="text-teal-500" />} label="Symptom" value={symptom.symptom} />
                            <DetailRow icon={<FaComment className="text-teal-500" />} label="Concerns" value={symptom.concerns} />
                          </div>
                        </div>
                      ))}
                      {(!displayData.currentSymptoms || displayData.currentSymptoms.length === 0) && (
                        <p className="text-gray-500 italic">No current symptoms recorded</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Follow Ups */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <SectionHeader
                    title="Upcoming Follow-ups"
                    icon={<FaCalendar className="text-purple-600" />}
                    section="followUps"
                    bgColor="bg-purple-50"
                    textColor="text-purple-800"
                    borderColor="border-purple-100"
                  />
                  <div className="p-6">
                    <div className="space-y-4">
                      {(displayData.followUps || []).map((followUp, index) => (
                        <div key={index} className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                          <div className="grid grid-cols-1 gap-3">
                            <DetailRow icon={<FaCalendar className="text-purple-500" />} label="Date" value={formatDate(followUp.date)} />
                            <DetailRow icon={<FaUserMd className="text-purple-500" />} label="Specialist" value={followUp.specialistDetails} />
                            <DetailRow icon={<FaClipboard className="text-purple-500" />} label="Remarks" value={followUp.remarks} />
                          </div>
                        </div>
                      ))}
                      {(!displayData.followUps || displayData.followUps.length === 0) && (
                        <p className="text-gray-500 italic">No follow-ups scheduled</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Previous Medical Conditions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <SectionHeader
                    title="Previous Medical Conditions"
                    icon={<FaHeartbeat className="text-red-600" />}
                    section="previousConditions"
                    bgColor="bg-red-50"
                    textColor="text-red-800"
                    borderColor="border-red-100"
                  />
                  <div className="p-6">
                    <div className="space-y-4">
                      {(displayData.previousConditions || []).map((condition, index) => (
                        <div key={index} className="p-4 bg-red-50 rounded-lg border border-red-100">
                          <div className="grid grid-cols-1 gap-3">
                            <DetailRow icon={<FaHeartbeat className="text-red-500" />} label="Condition" value={condition.condition} />
                            <DetailRow icon={<FaCalendar className="text-red-500" />} label="Diagnosis Date" value={formatDate(condition.diagnosisDate)} />
                            <DetailRow icon={<FaMedkit className="text-red-500" />} label="Treatment" value={condition.treatmentReceived} />
                          </div>
                        </div>
                      ))}
                      {(!displayData.previousConditions || displayData.previousConditions.length === 0) && (
                        <p className="text-gray-500 italic">No previous conditions recorded</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Immunization History */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <SectionHeader
                    title="Immunization History"
                    icon={<FaSyringe className="text-indigo-600" />}
                    section="immunizationHistory"
                    bgColor="bg-indigo-50"
                    textColor="text-indigo-800"
                    borderColor="border-indigo-100"
                  />
                  <div className="p-6">
                    <div className="space-y-4">
                      {(displayData.immunizationHistory || []).map((immunization, index) => (
                        <div key={index} className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                          <div className="grid grid-cols-1 gap-3">
                            <DetailRow icon={<FaSyringe className="text-indigo-500" />} label="Vaccination" value={immunization.vaccination} />
                            <DetailRow icon={<FaCalendar className="text-indigo-500" />} label="Date" value={formatDate(immunization.dateReceived)} />
                          </div>
                        </div>
                      ))}
                      {(!displayData.immunizationHistory || displayData.immunizationHistory.length === 0) && (
                        <p className="text-gray-500 italic">No immunization history recorded</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Test Results */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <SectionHeader
                    title="Recent Test Results"
                    icon={<FaVial className="text-teal-600" />}
                    section="medicalTestResults"
                    bgColor="bg-teal-50"
                    textColor="text-teal-800"
                    borderColor="border-teal-100"
                  />
                  <div className="p-6">
                    <div className="space-y-4">
                      {(displayData.medicalTestResults || []).map((test, index) => (
                        <div key={index} className="p-4 bg-teal-50 rounded-lg border border-teal-100">
                          <div className="grid grid-cols-1 gap-3">
                            <DetailRow icon={<FaVial className="text-teal-500" />} label="Test" value={test.name} />
                            <DetailRow icon={<FaCalendar className="text-teal-500" />} label="Date" value={formatDate(test.date)} />
                            <DetailRow icon={<FaClipboard className="text-teal-500" />} label="Results" value={test.results} />
                          </div>
                        </div>
                      ))}
                      {(!displayData.medicalTestResults || displayData.medicalTestResults.length === 0) && (
                        <p className="text-gray-500 italic">No test results recorded</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Update the Members component to include state for viewing medical history
  const [showViewMedicalHistory, setShowViewMedicalHistory] = useState(false);
  const [selectedMemberForView, setSelectedMemberForView] = useState(null);

  // Update the table row to use the new view functionality
  // Find the medical history view button and update its onClick handler:
  // ... existing code ...
  <button 
    onClick={(e) => {
      e.stopPropagation();
      setSelectedMemberForView(member);
      setShowViewMedicalHistory(true);
    }}
    className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
    title="View Medical History"
  >
    <FaEye className="w-4 h-4" />
  </button>
  // ... existing code ...

  // Add the modal to the render section
  return (
    <div className="p-2 sm:p-4 lg:p-6 max-w-[1920px] mx-auto w-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 lg:mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold">Members</h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:flex-none sm:min-w-[250px] lg:min-w-[300px]">
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          <div className="flex items-center gap-2 sm:gap-4 justify-end w-full sm:w-auto">
            {/* Assign Doctor Button */}
            <button 
              onClick={() => setShowDoctorDropdown(true)}
              className="flex-none bg-green-500 hover:bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm sm:text-base transition-colors"
            >
              <FaUserMd className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Assign Doctor</span>
            </button>

            {/* Add Member Button */}
            <button 
              onClick={() => setShowAddForm(true)}
              className="flex-none bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm sm:text-base transition-colors min-w-[40px] sm:min-w-[120px]"
            >
              <FaPlus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Add Member</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table/Card View */}
      <div className="flex flex-col h-[calc(100vh-180px)] lg:h-[calc(100vh-200px)]">
        <div className="flex-1 bg-white rounded-xl shadow-md overflow-hidden">
          {/* Mobile Card View */}
          <div 
            className="sm:hidden divide-y divide-gray-200 overflow-auto h-full" 
            onScroll={handleTableScroll}
            style={{ 
              scrollBehavior: 'auto',
              scrollbarWidth: 'thin',
              scrollbarColor: '#CBD5E0 #EDF2F7',
              overscrollBehavior: 'contain',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {paginatedMembers.map((member, index) => (
              <div 
                key={member.id}
                className="p-3 hover:bg-gray-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(member.id)}
                      onChange={() => handleCheckboxChange(member.id)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex items-center gap-2">
                      <FaUserCircle className="w-8 h-8 text-gray-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{member.name}</h3>
                        <p className="text-xs text-gray-500">{member.id}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMedicalHistoryComponent(true);
                      }}
                      className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-full"
                    >
                      <FaEye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadId(member.id);
                      }}
                      className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-full"
                    >
                      <FaDownload className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-1 space-y-0.5">
                  <p className="text-xs text-gray-600">{member.phone}</p>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowSubProfiles(member.subProfiles);
                    }}
                    className="text-xs text-gray-600 hover:text-gray-900"
                  >
                    {member.subProfiles.length} sub profiles
                  </button>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="p-4 text-center text-gray-500">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-2"></div>
                Loading more members...
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block h-full">
            <div 
              className="overflow-auto h-full" 
              onScroll={handleTableScroll}
              style={{ 
                scrollBehavior: 'auto',
                scrollbarWidth: 'thin',
                scrollbarColor: '#CBD5E0 #EDF2F7',
                overscrollBehavior: 'contain',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              <table className="w-full table-fixed">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="w-[3%] lg:w-[4%] px-3 lg:px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedMembers.length === filteredMembers.length && filteredMembers.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                    </th>
                    <th className="w-[4%] lg:w-[5%] px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                    <th className="w-[8%] lg:w-[10%] px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">M-ID</th>
                    <th className="w-[15%] lg:w-[20%] px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="w-[12%] lg:w-[15%] px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="w-[8%] lg:w-[10%] px-3 lg:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Sub Profiles</th>
                    <th className="w-[15%] lg:w-[20%] px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                    <th className="w-[6%] lg:w-[8%] px-3 lg:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Medical History</th>
                    <th className="w-[6%] lg:w-[8%] px-3 lg:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedMembers.map((member, index) => (
                    <tr 
                      key={member.id} 
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setSelectedMember({
                        id: member.id,
                        fullName: member.name,
                        email: member.email,
                        mobile: member.phone,
                        gender: member.gender || 'Not specified',
                        dob: member.dob || 'Not specified',
                        membershipType: member.membershipType || 'Not specified',
                        bloodGroup: member.bloodGroup || 'Not specified',
                        height: member.height || 'Not specified',
                        weight: member.weight || 'Not specified',
                        emergencyContact: {
                          name: member.emergencyContact?.name || 'Not specified',
                          relationship: member.emergencyContact?.relationship || 'Not specified',
                          number: member.emergencyContact?.number || 'Not specified'
                        },
                        personalHistory: {
                          employmentStatus: member.personalHistory?.employmentStatus || 'Not specified',
                          educationLevel: member.personalHistory?.educationLevel || 'Not specified',
                          maritalStatus: member.personalHistory?.maritalStatus || 'Not specified'
                        },
                        address: member.address || 'Not specified',
                        additionalInfo: member.additionalInfo || '',
                        subProfiles: member.subProfiles || [],
                        medicalHistory: member.medicalHistory || []
                      })}
                    >
                      <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedMembers.includes(member.id)}
                          onChange={() => handleCheckboxChange(member.id)}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-sm">{index + 1}</td>
                      <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-sm">{member.id}</td>
                      <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center">
                          <FaUserCircle className="w-6 h-6 lg:w-8 lg:h-8 text-gray-400 mr-2 lg:mr-3" />
                          <span className="truncate">{member.name}</span>
                        </div>
                      </td>
                      <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-sm">{member.phone}</td>
                      <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-sm text-center">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowSubProfiles(member.subProfiles);
                          }}
                          className="text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          {member.subProfiles.length}
                        </button>
                      </td>
                      <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-sm">
                        {member.notes ? (
                          <div className="flex items-center gap-2">
                            <div className="max-w-[100px] lg:max-w-[150px] truncate text-gray-600">{member.notes}</div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedMemberForNotes(member)
                                setShowNotesModal(true)
                              }}
                              className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                            >
                              <FaEdit className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedMemberForNotes(member)
                              setShowNotesModal(true)
                            }}
                            className="text-blue-500 hover:text-blue-700 flex items-center gap-1 transition-colors"
                          >
                            <FaPlus className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                            <span>Add Note</span>
                          </button>
                        )}
                      </td>
                      <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                              setSelectedMemberForView(member);
                              setShowViewMedicalHistory(true);
                          }}
                            className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                            title="View Medical History"
                        >
                            <FaEye className="w-4 h-4" />
                        </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMemberForMedicalHistory(member);
                              setShowAddMedicalHistory(true);
                            }}
                            className="p-1.5 text-green-500 hover:bg-green-50 rounded-full transition-colors"
                            title="Add Medical History"
                          >
                            <FaPlus className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-center">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadId(member.id);
                          }}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                        >
                          <FaDownload className="w-4 h-4 lg:w-5 lg:h-5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {isLoading && (
                <div className="p-4 text-center text-gray-500">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-2"></div>
                  Loading more members...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between px-3 lg:px-4 py-3 bg-white rounded-lg shadow-sm gap-3 sm:gap-0">
          <div className="text-xs lg:text-sm text-gray-700 text-center sm:text-left">
            <span>Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredMembers.length)} of {filteredMembers.length} members</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (currentPage > 1) {
                  setCurrentPage(prev => prev - 1);
                  const tableContainer = document.querySelector('.overflow-auto');
                  if (tableContainer) {
                    tableContainer.scrollTop = 0;
                  }
                }
              }}
              disabled={currentPage === 1}
              className={`px-2 lg:px-3 py-1 rounded-md text-sm ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 transition-colors'
              }`}
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {[...Array(Math.min(5, totalPages))].map((_, index) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = index + 1;
                } else if (currentPage <= 3) {
                  pageNumber = index + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + index;
                } else {
                  pageNumber = currentPage - 2 + index;
                }

                return (
                  <button
                    key={pageNumber}
                    onClick={() => {
                      setCurrentPage(pageNumber);
                      const tableContainer = document.querySelector('.overflow-auto');
                      if (tableContainer) {
                        tableContainer.scrollTop = 0;
                      }
                    }}
                    className={`w-7 h-7 lg:w-8 lg:h-8 flex items-center justify-center rounded-md text-sm transition-colors ${
                      currentPage === pageNumber
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span className="px-2">...</span>
                  <button
                    onClick={() => {
                      setCurrentPage(totalPages);
                      const tableContainer = document.querySelector('.overflow-auto');
                      if (tableContainer) {
                        tableContainer.scrollTop = 0;
                      }
                    }}
                    className="w-7 h-7 lg:w-8 lg:h-8 flex items-center justify-center rounded-md text-sm bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 transition-colors"
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>
            <button
              onClick={() => {
                if (currentPage < totalPages) {
                  setCurrentPage(prev => prev + 1);
                  const tableContainer = document.querySelector('.overflow-auto');
                  if (tableContainer) {
                    tableContainer.scrollTop = 0;
                  }
                }
              }}
              disabled={currentPage === totalPages}
              className={`px-2 lg:px-3 py-1 rounded-md text-sm ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 transition-colors'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showMedicalHistoryComponent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl h-[calc(100vh-2rem)] sm:h-auto sm:max-h-[90vh] overflow-y-auto">
            <EmptyMedicalHistoryView onClose={() => setShowMedicalHistoryComponent(false)} />
          </div>
        </div>
      )}

      {selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl h-[calc(100vh-2rem)] sm:h-auto sm:max-h-[90vh] overflow-y-auto">
            <MemberDetailModal 
              member={selectedMember} 
              onClose={() => setSelectedMember(null)} 
            />
          </div>
        </div>
      )}

      {showSubProfiles && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl w-full max-w-md h-[calc(100vh-2rem)] sm:h-auto sm:max-h-[90vh] overflow-y-auto">
            <SubProfilesModal 
              profiles={showSubProfiles} 
              onClose={() => setShowSubProfiles(null)} 
            />
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl h-[calc(100vh-2rem)] sm:h-auto sm:max-h-[90vh] overflow-y-auto">
            <AddMemberForm onClose={() => setShowAddForm(false)} />
          </div>
        </div>
      )}

      {showNotesModal && selectedMemberForNotes && (
        <NotesModal
          note={selectedMemberForNotes.notes}
          onClose={() => {
            setShowNotesModal(false)
            setSelectedMemberForNotes(null)
          }}
          onSave={(noteText) => handleSaveNote(selectedMemberForNotes.id, noteText)}
          onDelete={() => handleDeleteNote(selectedMemberForNotes.id)}
        />
      )}

      {showDoctorDropdown && (
        <DoctorDropdown
          isOpen={showDoctorDropdown}
          onClose={() => setShowDoctorDropdown(false)}
          onSelect={handleDoctorSelect}
          selectedMembers={selectedMembers}
        />
      )}

      {showAddMedicalHistory && (
        <AddMedicalHistoryModal
          member={selectedMemberForMedicalHistory}
          onClose={() => setShowAddMedicalHistory(false)}
          onSave={handleSaveMedicalHistory}
        />
      )}

      {showViewMedicalHistory && selectedMemberForView && (
        <ViewMedicalHistoryModal
          member={selectedMemberForView}
          onClose={() => {
            setShowViewMedicalHistory(false);
            setSelectedMemberForView(null);
          }}
        />
      )}
    </div>
  )
}

export default Members 