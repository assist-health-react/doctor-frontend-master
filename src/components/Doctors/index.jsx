import { useState, useEffect } from 'react'
import { doctorsService } from '../../services/doctorsService'
import DoctorsList from './DoctorsList'
import DoctorDetail from './DoctorDetail'
import AddEditDoctor from './AddEditDoctor'
import AssignedMembersModal from './AssignedMembersModal'
import { languageOptions, areaOptions } from './utils'

const Doctors = () => {
  const itemsPerPage = 9 // Show 9 doctors per page (3x3 grid)

  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showAssignedMembers, setShowAssignedMembers] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [doctorId, setDoctorId] = useState('')
  const [pincode, setPincode] = useState('')
  const [selectedServiceType, setSelectedServiceType] = useState('all')
  const [selectedLanguages, setSelectedLanguages] = useState([])
  const [selectedAreas, setSelectedAreas] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [doctors, setDoctors] = useState([])
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: itemsPerPage
  })

  // Function to fetch doctor details
  const fetchDoctorDetails = async (doctorId) => {
    try {
      setIsLoading(true)
      const response = await doctorsService.getDoctorById(doctorId)
      if (response.status === 'success' && response.data) {
        // Ensure we have the _id field
        const doctorData = {
          ...response.data,
          _id: response.data._id || doctorId // Fallback to the passed ID if _id is not in response
        }
        setSelectedDoctor(doctorData)
      } else {
        setError('Failed to fetch doctor details. Please try again later.')
      }
    } catch (err) {
      setError('Failed to fetch doctor details. Please try again later.')
      console.error('Error fetching doctor details:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Function to handle view profile
  const handleViewProfile = async (doctor) => {
    if (!doctor.id) {
      setError('Invalid doctor ID. Please try again.');
      return;
    }
    await fetchDoctorDetails(doctor.id);
  }

  // Function to handle filter changes
  const handleFilterChange = (newSearchTerm, newDoctorId, newPincode, newServiceType) => {
    console.log('Parent - handleFilterChange called with:', {
      searchTerm: newSearchTerm,
      doctorId: newDoctorId,
      pincode: newPincode,
      serviceType: newServiceType
    });

    setSearchTerm(newSearchTerm);
    setDoctorId(newDoctorId);
    setPincode(newPincode);
    setSelectedServiceType(newServiceType || 'all');
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Effect to fetch doctors when filters change
  useEffect(() => {
    console.log('Parent - useEffect triggered with:', {
      searchTerm,
      doctorId,
      pincode,
      selectedServiceType
    });
    fetchDoctors();
  }, [currentPage, searchTerm, doctorId, pincode, selectedServiceType]); // Add all filter dependencies

  // Function to fetch doctors
  const fetchDoctors = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const params = {
        page: currentPage,
        limit: itemsPerPage
      };

      // Add search parameters only if they have values
      if (searchTerm?.trim()) {
        params.search = searchTerm.trim();
      }
      if (doctorId && typeof doctorId === 'string' && doctorId.trim()) {
        console.log('Parent - Adding doctorId to params:', doctorId.trim());
        params.doctorId = doctorId.trim();
      }
      if (pincode?.trim()) {
        console.log('Parent - Adding pincode to params:', pincode.trim());
        params.areas = [pincode.trim()];
      }

      // Only add serviceType if it's not 'all' and is defined
      if (selectedServiceType && selectedServiceType !== 'all') {
        params.serviceTypes = [selectedServiceType.toLowerCase()];
      }

      // Add languages if selected
      if (selectedLanguages?.length > 0) {
        params.languagesSpoken = selectedLanguages;
      }

      // Add areas if selected
      if (selectedAreas?.length > 0) {
        params.areas = [...(params.areas || []), ...selectedAreas];
      }

      console.log('Parent - fetchDoctors called with final params:', params);
      const response = await doctorsService.getDoctors(params)
      
      if (response.status === 'success') {
        setDoctors(response.data)
        setPagination(response.pagination)
      } else {
        setError('Failed to fetch doctors. Please try again later.')
      }
    } catch (err) {
      setError('Failed to fetch doctors. Please try again later.')
      console.error('Error fetching doctors:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Effect to fetch doctors only when filters are applied or page changes
  useEffect(() => {
    fetchDoctors()
  }, [currentPage, searchTerm, doctorId, pincode, selectedServiceType, selectedLanguages, selectedAreas]) // Added all filter dependencies

  // Update the filtered doctors to use API data
  const paginatedDoctors = doctors
    .filter(doctor => {
      try {
        // Apply pincode filter
        if (pincode && doctor.offlineAddress) {
          // Handle case where offlineAddress is an array
          if (Array.isArray(doctor.offlineAddress)) {
            return doctor.offlineAddress.some(address => address.pincode === pincode);
          }
          // Handle case where offlineAddress is a single object
          if (typeof doctor.offlineAddress === 'object') {
            return doctor.offlineAddress.pincode === pincode;
          }
        }
        return !pincode; // If pincode is entered but doctor has no address, don't show them
      } catch (error) {
        console.error('Error filtering doctor:', doctor, error);
        return false; // Skip this doctor if there's an error
      }
    })
    .map(doctor => {
      try {
        return {
          id: doctor._id,
          name: doctor.name,
          email: doctor.email,
          phone: doctor.phone,
          gender: doctor.gender,
          education: doctor.qualification?.join(', '),
          medicalCouncilNumber: doctor.medicalCouncilRegistrationNumber,
          languages: doctor.languagesSpoken,
          bio: doctor.introduction,
          serviceTypes: doctor.serviceTypes,
          patients: doctor.total_assigned_members,
          rating: doctor.rating,
          image: doctor.profilePic,
          doctorId: doctor.doctorId,
          specializations: doctor.specializations,
          onlineConsultationTimeSlots: doctor.onlineConsultationTimeSlots,
          offlineConsultationTimeSlots: doctor.offlineConsultationTimeSlots,
          offlineAddress: doctor.offlineAddress,
          areas: doctor.areas,
          profilePicture: doctor.profilePic,
          signature: doctor.digitalSignature
        };
      } catch (error) {
        console.error('Error mapping doctor:', doctor, error);
        return null; // Return null for doctors that can't be mapped
      }
    })
    .filter(Boolean); // Remove any null values from mapping errors

  // Function to handle view members
  const handleViewMembers = async (doctor) => {
    try {
      setIsLoading(true);
      const response = await doctorsService.getDoctorById(doctor.id);
      if (response.status === 'success' && response.data) {
        setSelectedDoctor(response.data);
        setShowAssignedMembers(true);
      } else {
        setError('Failed to fetch doctor details. Please try again later.');
      }
    } catch (err) {
      setError('Failed to fetch doctor details. Please try again later.');
      console.error('Error fetching doctor details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 h-[calc(100vh-80px)] flex flex-col overflow-hidden">
      <DoctorsList 
        doctors={paginatedDoctors}
        isLoading={isLoading}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        doctorId={doctorId}
        setDoctorId={setDoctorId}
        pincode={pincode}
        setPincode={setPincode}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        selectedServiceType={selectedServiceType}
        setSelectedServiceType={setSelectedServiceType}
        selectedLanguages={selectedLanguages}
        setSelectedLanguages={setSelectedLanguages}
        selectedAreas={selectedAreas}
        setSelectedAreas={setSelectedAreas}
        onViewProfile={handleViewProfile}
        onViewMembers={handleViewMembers}
        onAddDoctor={() => setShowAddForm(true)}
        pagination={pagination}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onFilterChange={handleFilterChange}
      />

      {showAddForm && (
        <AddEditDoctor 
          onClose={() => setShowAddForm(false)} 
          onSuccess={() => {
            setShowAddForm(false);
            fetchDoctors(); // Refresh the list
          }}
        />
      )}

      {selectedDoctor && !showAssignedMembers && (
        <DoctorDetail
          doctor={selectedDoctor} 
          onClose={() => setSelectedDoctor(null)}
          onDeleteSuccess={() => {
            setSelectedDoctor(null);
            fetchDoctors(); // Refresh the list after successful deletion
          }}
        />
      )}

      {showAssignedMembers && selectedDoctor && (
        <AssignedMembersModal
          isOpen={showAssignedMembers}
          onClose={() => {
            setShowAssignedMembers(false);
            setSelectedDoctor(null);
          }}
          doctor={selectedDoctor}
        />
      )}

      {error && (
        <div className="text-red-500 text-center py-4">
          {error}
        </div>
      )}
    </div>
  )
}

export default Doctors 