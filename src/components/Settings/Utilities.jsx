import React, { useState, useEffect } from 'react'
import { FaPlus, FaTimes, FaEye, FaEdit } from 'react-icons/fa'
import { Modal, ConfirmationModal } from './Modal'
import { getAllSchools, createSchool, deleteSchool } from '../../services/schoolsService'
import { useNavigate } from 'react-router-dom'
import HealthcareList from './healthcare/HealthcareList'

const Utilities = () => {
  const navigate = useNavigate()
  // State for each section
  const [specialities, setSpecialities] = useState(['Cardiology', 'Neurology', 'Pediatrics'])
  const [promoCodes, setPromoCodes] = useState([
    { code: 'WELCOME20', discount: '20%', validUntil: '2024-12-31' },
    { code: 'HEALTH10', discount: '10%', validUntil: '2024-06-30' }
  ])

  // School states
  const [grades] = useState([
    'Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 
    'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'
  ])
  const [schools, setSchools] = useState([])
  const [newSchool, setNewSchool] = useState({
    name: '',
    description: '',
    logo: null,
    logoPreview: null,
    address: {
      description: '',
      pin_code: '',
      region: '',
      landmark: '',
      state: '',
      country: ''
    },
    contact_number: '',
    email: '',
    website: '',
    grades: [],
    principal: {
      name: '',
      email: '',
      phone: ''
    }
  })
  const [newGrade, setNewGrade] = useState({ class: '', section: [] })
  const [newSection, setNewSection] = useState({ name: '', studentsCount: 0 })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedSchoolId, setSelectedSchoolId] = useState(null)

  // Modal states
  const [activeModal, setActiveModal] = useState(null)
  const [newItem, setNewItem] = useState('')
  const [newPromoCode, setNewPromoCode] = useState({ code: '', discount: '', validUntil: '' })
  const [editingPromoCode, setEditingPromoCode] = useState(null)

  // Add new states for confirmation modal
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [itemToRemove, setItemToRemove] = useState(null)
  const [removeType, setRemoveType] = useState(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState(null)

  useEffect(() => {
    fetchSchools(currentPage)
  }, [currentPage])

  const fetchSchools = async (page = 1) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await getAllSchools(page)
      if (response.status === 'success') {
        setSchools(response.data || [])
        setPagination(response.pagination)
      } else {
        setError(response.message || 'Failed to fetch schools')
        console.error('Error response:', response)
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch schools'
      setError(errorMessage)
      console.error('Error fetching schools:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdd = async (type) => {
    switch (type) {
      case 'speciality':
        if (newItem.trim()) {
          setSpecialities([...specialities, newItem.trim()])
          setNewItem('')
        }
        break
      case 'promoCode':
        if (newPromoCode.code.trim() && newPromoCode.discount.trim() && newPromoCode.validUntil) {
          setPromoCodes([...promoCodes, { ...newPromoCode }])
          setNewPromoCode({ code: '', discount: '', validUntil: '' })
        }
        break
      case 'school':
        try {
          if (!newSchool.name || !newSchool.description || !newSchool.email) {
            setError('Please fill in all required fields')
            return
          }

          setIsLoading(true)
          setError(null)

          const schoolToCreate = {
            ...newSchool,
            contact_number: newSchool.contact_number || '',
            email: newSchool.email || '',
            website: newSchool.website || '',
            address: {
              ...newSchool.address,
              pin_code: newSchool.address.pin_code || ''
            },
            principal: {
              name: newSchool.principal.name || '',
              email: newSchool.principal.email || '',
              phone: newSchool.principal.phone || ''
            },
            grades: newSchool.grades.map(grade => ({
              class: grade.class,
              section: grade.section.map(section => ({
                name: section.name,
                studentsCount: parseInt(section.studentsCount) || 0
              }))
            }))
          }

          const response = await createSchool(schoolToCreate)
          if (response.status === 'success') {
            await fetchSchools()
            setActiveModal(null)
            setNewSchool({
              name: '',
              description: '',
              logo: null,
              logoPreview: null,
              address: {
                description: '',
                pin_code: '',
                region: '',
                landmark: '',
                state: '',
                country: ''
              },
              contact_number: '',
              email: '',
              website: '',
              grades: [],
              principal: {
                name: '',
                email: '',
                phone: ''
              }
            })
          }
        } catch (err) {
          console.error('Error creating school:', err)
          setError(err.response?.data?.message || 'Failed to create school')
        } finally {
          setIsLoading(false)
        }
        break
    }
  }

  const handleRemoveClick = async (type, item) => {
    setRemoveType(type)
    setItemToRemove(item)
    setShowConfirmation(true)
  }

  const handleConfirmRemove = async () => {
    if (removeType && itemToRemove) {
      switch (removeType) {
        case 'speciality':
          setSpecialities(specialities.filter(s => s !== itemToRemove))
          break
        case 'promoCode':
          setPromoCodes(promoCodes.filter(p => p.code !== itemToRemove))
          break
        case 'school':
          try {
            setIsLoading(true)
            setError(null)
            const schoolToDelete = schools.find(s => s.name === itemToRemove)
            if (schoolToDelete) {
              await deleteSchool(schoolToDelete._id)
              await fetchSchools()
            }
          } catch (err) {
            setError('Failed to delete school')
            console.error('Error deleting school:', err)
          } finally {
            setIsLoading(false)
          }
          break
      }
    }
    setShowConfirmation(false)
    setItemToRemove(null)
    setRemoveType(null)
  }

  const handleCancelRemove = () => {
    setShowConfirmation(false)
    setItemToRemove(null)
    setRemoveType(null)
  }

  const handleEditPromoCode = (code) => {
    const promoToEdit = promoCodes.find(p => p.code === code)
    if (promoToEdit) {
      setEditingPromoCode(promoToEdit)
      setActiveModal('editPromoCode')
    }
  }

  const handleUpdatePromoCode = () => {
    if (editingPromoCode) {
      setPromoCodes(promoCodes.map(p => 
        p.code === editingPromoCode.code ? editingPromoCode : p
      ))
      setEditingPromoCode(null)
      setActiveModal(null)
    }
  }

  // School-specific handlers
  const handleAddSection = (gradeIndex) => {
    if (newSection.name && newSection.studentsCount > 0) {
      setNewSchool(prev => ({
        ...prev,
        grades: prev.grades.map((grade, idx) => 
          idx === gradeIndex
            ? { 
                ...grade, 
                section: [...grade.section, { 
                  name: newSection.name, 
                  studentsCount: parseInt(newSection.studentsCount) 
                }] 
              }
            : grade
        )
      }))
      setNewSection({ name: '', studentsCount: 0 })
    }
  }

  const handleAddGrade = () => {
    if (newGrade.class) {
      setNewSchool(prev => ({
        ...prev,
        grades: [...prev.grades, { class: newGrade.class, section: [] }]
      }))
      setNewGrade({ class: '', section: [] })
    }
  }

  const handleRemoveGrade = (gradeIndex) => {
    setNewSchool(prev => ({
      ...prev,
      grades: prev.grades.filter((_, idx) => idx !== gradeIndex)
    }))
  }

  const handleRemoveSection = (gradeIndex, sectionIndex) => {
    setNewSchool(prev => ({
      ...prev,
      grades: prev.grades.map((grade, idx) => 
        idx === gradeIndex
          ? { ...grade, section: grade.section.filter((_, i) => i !== sectionIndex) }
          : grade
      )
    }))
  }

  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Logo size should be less than 5MB')
        return
      }
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file')
        return
      }
      setNewSchool(prev => ({
        ...prev,
        logo: file,
        logoPreview: URL.createObjectURL(file)
      }))
    }
  }

  useEffect(() => {
    return () => {
      if (newSchool.logoPreview) {
        URL.revokeObjectURL(newSchool.logoPreview)
      }
    }
  }, [newSchool.logoPreview])

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  return (
    <div className="space-y-6">
      {/* Speciality Card */}
      <div className="bg-white p-4 rounded-lg shadow-sm max-w-sm">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-medium text-gray-800">Speciality</h3>
            <p className="text-sm text-gray-500">{specialities.length} specialities</p>
          </div>
          <button
            onClick={() => setActiveModal('viewSpecialities')}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            <FaEye />
          </button>
        </div>
      </div>

      {/* Promo Code Card */}
      <div className="bg-white p-4 rounded-lg shadow-sm max-w-sm">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-medium text-gray-800">Promo Codes</h3>
            <p className="text-sm text-gray-500">{promoCodes.length} active codes</p>
          </div>
          <button
            onClick={() => setActiveModal('viewPromoCodes')}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            <FaEye />
          </button>
        </div>
      </div>

      {/* Schools Card */}
      <div className="bg-white p-4 rounded-lg shadow-sm max-w-sm">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-medium text-gray-800">Schools</h3>
            <p className="text-sm text-gray-500">Manage school information</p>
          </div>
          <button
            onClick={() => navigate('/settings/school')}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            <FaEye />
          </button>
        </div>
      </div>

      {/* Healthcare Providers Card */}
      <div className="bg-white p-4 rounded-lg shadow-sm max-w-sm">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-medium text-gray-800">Healthcare Providers</h3>
            <p className="text-sm text-gray-500">Manage healthcare providers</p>
          </div>
          <button
            onClick={() => navigate('/settings/healthcare')}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            <FaEye />
          </button>
        </div>
      </div>

      {/* Modals */}
      {activeModal === 'viewSpecialities' && (
        <Modal title="All Specialities" onClose={() => setActiveModal(null)}>
          <div className="space-y-4">
            {/* Add new speciality form */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="Enter new speciality"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleAdd('speciality')}
                disabled={!newItem.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                <FaPlus className="w-4 h-4" />
              </button>
            </div>

            {/* List of specialities */}
            <div className="grid grid-cols-2 gap-2">
              {specialities.map((speciality, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-gray-700">{speciality}</span>
                  <button
                    onClick={() => handleRemoveClick('speciality', speciality)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded-full"
                  >
                    <FaTimes className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {specialities.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                No specialities added yet
              </p>
            )}
          </div>
        </Modal>
      )}

      {activeModal === 'viewPromoCodes' && (
        <Modal title="All Promo Codes" onClose={() => setActiveModal(null)}>
          <div className="space-y-4">
            {/* Add new promo code form */}
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                value={newPromoCode.code}
                onChange={(e) => setNewPromoCode({ ...newPromoCode, code: e.target.value })}
                placeholder="Enter code"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={newPromoCode.discount}
                onChange={(e) => setNewPromoCode({ ...newPromoCode, discount: e.target.value })}
                placeholder="Discount (e.g., 20%)"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-2">
                <input
                  type="date"
                  value={newPromoCode.validUntil}
                  onChange={(e) => setNewPromoCode({ ...newPromoCode, validUntil: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleAdd('promoCode')}
                  disabled={!newPromoCode.code.trim() || !newPromoCode.discount.trim() || !newPromoCode.validUntil}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  <FaPlus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* List of promo codes */}
            <div className="space-y-2">
              {promoCodes.map((promo, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">{promo.code}</span>
                      <span className="px-2 py-0.5 bg-green-50 text-green-600 text-sm rounded-full">
                        {promo.discount} OFF
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Valid until: {new Date(promo.validUntil).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditPromoCode(promo.code)}
                      className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-full"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveClick('promoCode', promo.code)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-full"
                    >
                      <FaTimes className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {promoCodes.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                No promo codes added yet
              </p>
            )}
          </div>
        </Modal>
      )}

      {activeModal === 'viewHealthcare' && (
        <Modal title="Healthcare Providers" onClose={() => setActiveModal(null)}>
          <HealthcareList />
        </Modal>
      )}

      {activeModal === 'editPromoCode' && (
        <Modal title="Edit Promo Code" onClose={() => {
          setActiveModal(null)
          setEditingPromoCode(null)
        }}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                <input
                  type="text"
                  value={editingPromoCode?.code || ''}
                  onChange={(e) => setEditingPromoCode({ ...editingPromoCode, code: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount</label>
                <input
                  type="text"
                  value={editingPromoCode?.discount || ''}
                  onChange={(e) => setEditingPromoCode({ ...editingPromoCode, discount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
                <input
                  type="date"
                  value={editingPromoCode?.validUntil || ''}
                  onChange={(e) => setEditingPromoCode({ ...editingPromoCode, validUntil: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={() => {
                  setActiveModal(null)
                  setEditingPromoCode(null)
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdatePromoCode}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add the confirmation modal */}
      {showConfirmation && (
        <ConfirmationModal
          title="Confirm Delete"
          message={`Are you sure you want to delete "${itemToRemove}"?`}
          onConfirm={handleConfirmRemove}
          onCancel={handleCancelRemove}
        />
      )}
    </div>
  )
}

export default Utilities 