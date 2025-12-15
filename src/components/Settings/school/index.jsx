import React, { useState, useEffect } from 'react'
import { FaPlus, FaTimes, FaEye, FaEdit, FaTrash } from 'react-icons/fa'
import { Modal, ConfirmationModal } from '../Modal'
import SchoolForm from './SchoolForm'
import SchoolList from './SchoolList'
import SchoolDetails from './SchoolDetails'
import { getAllSchools, createSchool, deleteSchool, getSchoolById, updateSchool } from '../../../services/schoolsService'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import api from '../../../services/api'

const SchoolManagement = () => {
  const navigate = useNavigate()
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
      pinCode: '',
      region: '',
      landmark: '',
      city: '',
      state: '',
      country: 'India',
      location: {
        latitude: 0,
        longitude: 0
      }
    },
    contactNumber: '',
    email: '',
    website: '',
    grades: [],
    principal: {
      name: '',
      email: '',
      phone: ''
    },
    isActive: true
  })
  const [newGrade, setNewGrade] = useState({ class: '', section: [] })
  const [newSection, setNewSection] = useState({ name: '', studentsCount: 0 })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedSchoolId, setSelectedSchoolId] = useState(null)
  const [activeModal, setActiveModal] = useState(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [itemToRemove, setItemToRemove] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const [selectedSchool, setSelectedSchool] = useState(null)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [detailsError, setDetailsError] = useState(null)
  const [regionOptions, setRegionOptions] = useState([])
  const [isLoadingRegions, setIsLoadingRegions] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingSchool, setEditingSchool] = useState(null)

  useEffect(() => {
    fetchSchools(currentPage)
  }, [currentPage])

  const fetchSchools = async (page = 1) => {
    try {
      setIsLoading(true)
      setError(null)
      
      console.log('Fetching schools for page:', page)
      const response = await getAllSchools(page)
      console.log('Schools Response:', {
        status: response?.status,
        dataLength: response?.data?.length,
        pagination: response?.pagination
      })
      
      if (response && Array.isArray(response.data)) {
        setSchools(response.data)
        
        if (response.pagination) {
          setPagination({
            currentPage: response.pagination.page,
            totalPages: response.pagination.pages,
            total: response.pagination.total,
            limit: response.pagination.limit
          })
        } else {
          setPagination({
            currentPage: page,
            totalPages: 1,
            total: response.data.length,
            limit: 10
          })
        }
      } else {
        setError('Invalid response format from server')
        console.error('Unexpected response format:', response)
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch schools'
      setError(errorMessage)
      console.error('Error in fetchSchools:', {
        message: err.message,
        name: err.name,
        stack: err.stack,
        response: err.response?.data
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdd = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Show loading toast
      const loadingToast = toast.loading('Creating school...')

      // Basic validation
      if (!newSchool.name?.trim()) {
        toast.dismiss(loadingToast)
        toast.error('School name is required')
        setError('School name is required')
        setIsLoading(false)
        return
      }

      // Transform the data to match API requirements
      const schoolData = {
        name: newSchool.name.trim(),
        description: newSchool.description.trim(),
        logo: newSchool.logo || null,
        address: {
          description: newSchool.address.description.trim(),
          pinCode: newSchool.address.pinCode,
          region: newSchool.address.region,
          landmark: newSchool.address.landmark || '',
          city: newSchool.address.city,
          state: newSchool.address.state,
          country: newSchool.address.country || 'India',
          location: newSchool.address.location
        },
        contactNumber: newSchool.contactNumber,
        email: newSchool.email.trim(),
        website: newSchool.website || '',
        grades: newSchool.grades.map(grade => ({
          class: grade.class,
          section: grade.section.map(section => ({
            name: section.name,
            studentsCount: parseInt(section.studentsCount) || 0
          }))
        })),
        principal: {
          name: newSchool.principal.name.trim(),
          email: newSchool.principal.email.trim(),
          phone: newSchool.principal.phone
        },
        isActive: true
      }

      // Log the logo value for debugging
      console.log('Logo URL being sent:', schoolData.logo);

      // Remove logoPreview as it's only for UI
      delete schoolData.logoPreview;

      console.log('Submitting school data:', schoolData)
      const response = await createSchool(schoolData)
      
      if (response.status === 'success') {
        toast.dismiss(loadingToast)
        toast.success('School created successfully!')
        setActiveModal(null)
        fetchSchools(currentPage)
      } else {
        throw new Error(response.message || 'Failed to create school')
      }
    } catch (error) {
      console.error('Error creating school:', error)
      toast.error(error.message || 'Failed to create school')
      setError(error.message || 'Failed to create school')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveClick = (school) => {
    setItemToRemove(school)
    setShowConfirmation(true)
  }

  const handleConfirmRemove = async () => {
    if (itemToRemove) {
      try {
        setIsLoading(true)
        setError(null)
        
        // Show loading toast
        const loadingToast = toast.loading('Deleting school...')
        
        const response = await deleteSchool(itemToRemove._id)
        
        // Check if we have a valid response
        if (response && response.status === 'success') {
          toast.dismiss(loadingToast)
          toast.success(response.message)
          
          // Close the confirmation modal
          setShowConfirmation(false)
          setItemToRemove(null)
          
          // If we're viewing the deleted school's details, close that modal too
          if (selectedSchoolId === itemToRemove._id) {
            setSelectedSchoolId(null)
            setSelectedSchool(null)
          }
          
          // Refresh the schools list
          fetchSchools(currentPage)
        } else {
          throw new Error(response?.message || 'Failed to delete school')
        }
      } catch (err) {
        console.error('Error deleting school:', err)
        
        // Show error toast with a more user-friendly message
        const errorMessage = err.message || 'Failed to delete school. Please try again.'
        toast.error(errorMessage)
        setError(errorMessage)
        
        // Keep the confirmation modal open so user can try again
        setShowConfirmation(true)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleCancelRemove = () => {
    setShowConfirmation(false)
    setItemToRemove(null)
  }

  const handleAddSection = (gradeIndex) => {
    if (newSection.name && newSection.studentsCount > 0) {
      if (isEditing && editingSchool) {
        setEditingSchool(prev => ({
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
      } else {
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
      }
      setNewSection({ name: '', studentsCount: 0 })
    }
  }

  const handleAddGrade = () => {
    if (newGrade.class) {
      if (isEditing && editingSchool) {
        setEditingSchool(prev => ({
          ...prev,
          grades: [...prev.grades, { class: newGrade.class, section: [] }]
        }))
      } else {
        setNewSchool(prev => ({
          ...prev,
          grades: [...prev.grades, { class: newGrade.class, section: [] }]
        }))
      }
      setNewGrade({ class: '', section: [] })
    }
  }

  const handleRemoveGrade = (gradeIndex) => {
    if (isEditing && editingSchool) {
      setEditingSchool(prev => ({
        ...prev,
        grades: prev.grades.filter((_, idx) => idx !== gradeIndex)
      }))
    } else {
      setNewSchool(prev => ({
        ...prev,
        grades: prev.grades.filter((_, idx) => idx !== gradeIndex)
      }))
    }
  }

  const handleRemoveSection = (gradeIndex, sectionIndex) => {
    if (isEditing && editingSchool) {
      setEditingSchool(prev => ({
        ...prev,
        grades: prev.grades.map((grade, idx) => 
          idx === gradeIndex
            ? { ...grade, section: grade.section.filter((_, i) => i !== sectionIndex) }
            : grade
        )
      }))
    } else {
      setNewSchool(prev => ({
        ...prev,
        grades: prev.grades.map((grade, idx) => 
          idx === gradeIndex
            ? { ...grade, section: grade.section.filter((_, i) => i !== sectionIndex) }
            : grade
        )
      }))
    }
  }

  const handleLogoChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Logo size should be less than 5MB')
        return
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file')
        return
      }

      // Create preview immediately for better UX
      const previewUrl = URL.createObjectURL(file)
      
      // Update the appropriate state based on whether we're editing or adding
      if (isEditing && editingSchool) {
        setEditingSchool(prev => ({
          ...prev,
          logoPreview: previewUrl
        }))
      } else {
        setNewSchool(prev => ({
          ...prev,
          logoPreview: previewUrl
        }))
      }

      // Show loading state
      setIsLoading(true)
      setError(null)

      // Create FormData object
      const formData = new FormData()
      formData.append('file', file)

      // Upload image directly using api
      const response = await api.post('/api/v1/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      // Debug logs to see the exact response structure
      console.log('Full response:', response);

      // Get the response data from the Axios response
      const responseData = response.data;

      // Validate the response structure
      if (!responseData || !responseData.success || !responseData.imageUrl) {
        console.error('Invalid response structure:', responseData);
        throw new Error('Invalid response from server');
      }

      // Get the image URL from the response
      const imageUrl = responseData.imageUrl;

      console.log('Image URL extracted:', imageUrl); // Debug log

      // Update state with the image URL
      if (isEditing && editingSchool) {
        setEditingSchool(prev => ({
          ...prev,
          logo: imageUrl,
          logoPreview: previewUrl
        }));
      } else {
        setNewSchool(prev => ({
          ...prev,
          logo: imageUrl,
          logoPreview: previewUrl
        }));
      }
      toast.success('Logo uploaded successfully');
    } catch (err) {
      console.error('Error uploading image:', err)
      let errorMessage = 'Failed to upload image'
      
      if (err.response?.status === 413) {
        errorMessage = 'File size too large. Please upload a smaller image (max 5MB)'
      } else if (err.response?.status === 415) {
        errorMessage = 'Invalid file type. Please upload only images (PNG, JPG, GIF)'
      } else if (err.message) {
        errorMessage = err.message
      }
      
      toast.error(errorMessage)
      setError(errorMessage)
      
      // Clean up any preview
      if (isEditing && editingSchool?.logoPreview) {
        URL.revokeObjectURL(editingSchool.logoPreview)
      } else if (newSchool.logoPreview) {
        URL.revokeObjectURL(newSchool.logoPreview)
      }

      // Reset the appropriate state
      if (isEditing && editingSchool) {
        setEditingSchool(prev => ({
          ...prev,
          logo: null,
          logoPreview: null
        }))
      } else {
        setNewSchool(prev => ({
          ...prev,
          logo: null,
          logoPreview: null
        }))
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Update the cleanup effect to handle both cases
  useEffect(() => {
    return () => {
      if (newSchool.logoPreview) {
        URL.revokeObjectURL(newSchool.logoPreview)
      }
      if (editingSchool?.logoPreview) {
        URL.revokeObjectURL(editingSchool.logoPreview)
      }
    }
  }, [newSchool.logoPreview, editingSchool?.logoPreview])

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const fetchSchoolDetails = async (id) => {
    try {
      setIsLoadingDetails(true)
      setDetailsError(null)
      
      console.log('Fetching school details for ID:', id)
      const response = await getSchoolById(id)
      console.log('School Details Response:', response)
      
      if (response && response.data) {
        setSelectedSchool(response.data)
      } else {
        const errorMsg = 'Failed to fetch school details: Invalid response format'
        setDetailsError(errorMsg)
        console.error('Unexpected response format:', response)
      }
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch school details'
      setDetailsError(errorMsg)
      console.error('Error in fetchSchoolDetails:', {
        message: err.message,
        name: err.name,
        stack: err.stack,
        response: err.response?.data
      })
    } finally {
      setIsLoadingDetails(false)
    }
  }

  useEffect(() => {
    if (selectedSchoolId) {
      fetchSchoolDetails(selectedSchoolId)
    } else {
      setSelectedSchool(null)
    }
  }, [selectedSchoolId])

  const handleCancelAddSchool = () => {
    // Reset the form
    setNewSchool({
      name: '',
      description: '',
      logo: null,
      logoPreview: null,
      address: {
        description: '',
        pinCode: '',
        region: '',
        landmark: '',
        city: '',
        state: '',
        country: 'India',
        location: {
          latitude: 0,
          longitude: 0
        }
      },
      contactNumber: '',
      email: '',
      website: '',
      grades: [],
      principal: {
        name: '',
        email: '',
        phone: ''
      },
      isActive: true
    })
    
    // Clean up any object URLs
    if (newSchool.logoPreview) {
      URL.revokeObjectURL(newSchool.logoPreview)
    }
    
    // Close the modal
    setActiveModal(null)
  }

  const fetchLocationDetails = async (pincode) => {
    try {
      setIsLoadingRegions(true);
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();
      
      if (data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
        // Create region options from all post offices using Name field
        const regions = data[0].PostOffice.map(office => ({
          value: office.Name,
          label: `${office.Name} (${office.District})`
        }));
        
        // Remove duplicates
        const uniqueRegions = Array.from(new Set(regions.map(r => r.value)))
          .map(value => regions.find(r => r.value === value));
        
        setRegionOptions(uniqueRegions);

        // Update address fields with the first post office data
        const firstOffice = data[0].PostOffice[0];
        setNewSchool(prev => ({
          ...prev,
          address: {
            ...prev.address,
            city: firstOffice.District,
            state: firstOffice.State,
            country: 'India'
          }
        }));
      } else {
        setRegionOptions([]);
        toast.error('No regions found for this pincode');
      }
    } catch (error) {
      console.error('Error fetching location details:', error);
      toast.error('Failed to fetch location details');
      setRegionOptions([]);
    } finally {
      setIsLoadingRegions(false);
    }
  };

  const handlePincodeChange = (e) => {
    const pincode = e.target.value;
    if (pincode.length === 6) {
      fetchLocationDetails(pincode);
    } else {
      // Reset region options if pincode is incomplete
      setRegionOptions([]);
      // Reset region, city, and state if pincode is changed
      setNewSchool(prev => ({
        ...prev,
        address: {
          ...prev.address,
          region: '',
          city: '',
          state: '',
          country: 'India'
        }
      }));
    }
  };

  const handleEditClick = () => {
    if (!selectedSchool) return
    
    // Create a deep copy of the selected school to avoid modifying the original
    const schoolCopy = JSON.parse(JSON.stringify(selectedSchool))
    setEditingSchool(schoolCopy)
    setIsEditing(true)
  }

  const handleEdit = async () => {
    if (!editingSchool) return

    try {
      setIsLoading(true)
      setError(null)
      
      // Show loading toast
      const loadingToast = toast.loading('Updating school...')

      // Transform the data to match API requirements
      const schoolData = {
        name: editingSchool.name,
        description: editingSchool.description,
        logo: editingSchool.logo || null,
        address: {
          description: editingSchool.address.description,
          landmark: editingSchool.address.landmark || '',
          pinCode: editingSchool.address.pinCode,
          region: editingSchool.address.region,
          city: editingSchool.address.city,
          state: editingSchool.address.state,
          country: editingSchool.address.country || 'India',
          location: editingSchool.address.location
        },
        contactNumber: editingSchool.contactNumber,
        email: editingSchool.email,
        website: editingSchool.website || '',
        grades: editingSchool.grades.map(grade => ({
          class: grade.class,
          section: grade.section.map(section => ({
            name: section.name,
            studentsCount: parseInt(section.studentsCount) || 0
          }))
        })),
        principal: {
          name: editingSchool.principal.name,
          email: editingSchool.principal.email,
          phone: editingSchool.principal.phone
        },
        isActive: editingSchool.isActive
      }

      console.log('Updating school with data:', schoolData)
      const response = await updateSchool(editingSchool._id, schoolData)
      
      if (response && response.status === 'success') {
        toast.dismiss(loadingToast)
        toast.success('School updated successfully')
        
        // Close the edit modal and reset states
        setIsEditing(false)
        setEditingSchool(null)
        setSelectedSchoolId(null)
        setSelectedSchool(null)
        
        // Refresh the schools list
        fetchSchools(currentPage)
      } else {
        throw new Error(response?.message || 'Failed to update school')
      }
    } catch (error) {
      console.error('Error updating school:', error)
      
      // Show error toast with a more user-friendly message
      const errorMessage = error.message || 'Failed to update school. Please try again.'
      toast.error(errorMessage)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelEdit = () => {
    if (editingSchool?.logoPreview) {
      URL.revokeObjectURL(editingSchool.logoPreview)
    }
    setIsEditing(false)
    setEditingSchool(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <button 
          onClick={() => window.history.back()}
          className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <div className="flex-1 ml-4">
          <h2 className="text-xl font-semibold text-gray-800">Schools</h2>
        </div>
        <button
          onClick={() => setActiveModal('addSchool')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
        >
          <FaPlus size={14} />
          Add School
        </button>
      </div>

      <SchoolList
        schools={schools}
        isLoading={isLoading}
        error={error}
        setSelectedSchoolId={setSelectedSchoolId}
        pagination={pagination}
        onPageChange={handlePageChange}
      />

      {activeModal === 'addSchool' && (
        <Modal 
          title="Add School" 
          onClose={handleCancelAddSchool}
        >
          <SchoolForm
            newSchool={newSchool}
            setNewSchool={setNewSchool}
            newGrade={newGrade}
            setNewGrade={setNewGrade}
            newSection={newSection}
            setNewSection={setNewSection}
            grades={grades}
            handleAddGrade={handleAddGrade}
            handleAddSection={handleAddSection}
            handleRemoveGrade={handleRemoveGrade}
            handleRemoveSection={handleRemoveSection}
            handleAddSchool={handleAdd}
            handleCancelAddSchool={handleCancelAddSchool}
            handleLogoChange={handleLogoChange}
            regionOptions={regionOptions}
            handlePincodeChange={handlePincodeChange}
            isLoadingRegions={isLoadingRegions}
          />
        </Modal>
      )}

      {isEditing && editingSchool && (
        <Modal 
          title="Edit School" 
          onClose={handleCancelEdit}
        >
          <SchoolForm
            newSchool={editingSchool}
            setNewSchool={setEditingSchool}
            newGrade={newGrade}
            setNewGrade={setNewGrade}
            newSection={newSection}
            setNewSection={setNewSection}
            grades={grades}
            handleAddGrade={handleAddGrade}
            handleAddSection={handleAddSection}
            handleRemoveGrade={handleRemoveGrade}
            handleRemoveSection={handleRemoveSection}
            handleAddSchool={handleEdit}
            handleCancelAddSchool={handleCancelEdit}
            handleLogoChange={handleLogoChange}
            regionOptions={regionOptions}
            handlePincodeChange={handlePincodeChange}
            isLoadingRegions={isLoadingRegions}
          />
        </Modal>
      )}

      {selectedSchoolId && !isEditing && (
        <Modal 
          title={selectedSchool?.name || 'School Details'}
          onClose={() => {
            setSelectedSchoolId(null)
            setSelectedSchool(null)
          }}
          actions={
            <div className="flex items-center gap-2">
              <button
                onClick={handleEditClick}
                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                title="Edit School"
              >
                <FaEdit size={18} />
              </button>
              <button
                onClick={() => handleRemoveClick(selectedSchool)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                title="Delete School"
              >
                <FaTrash size={16} />
              </button>
            </div>
          }
        >
          {isLoadingDetails ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : detailsError ? (
            <div className="text-center py-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">{detailsError}</p>
                <button
                  onClick={() => fetchSchoolDetails(selectedSchoolId)}
                  className="mt-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <SchoolDetails school={selectedSchool} />
          )}
        </Modal>
      )}

      {showConfirmation && (
        <ConfirmationModal
          title="Confirm Delete"
          message={`Are you sure you want to delete "${itemToRemove.name}"?`}
          onConfirm={handleConfirmRemove}
          onCancel={handleCancelRemove}
        />
      )}
    </div>
  )
}

export default SchoolManagement 