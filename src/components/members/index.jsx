import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaPlus, 
  FaUserMd, 
  FaSearch,
  FaFilter,
  FaTimes
} from 'react-icons/fa';
import { membersService } from '../../services/membersService';
import MembersList from './MembersList';
import AddEditMember from './AddEditMember';
import { DoctorDropdown } from './dropdowns';
import { MedicalHistoryModal } from './modals';
import { 
  AddMedicalHistory,  
} from './MedicalHistory';
import { 
  ConfirmationDialog, 
} from './common';
import ViewMember from './ViewMember';
import { useSnackbar } from '../../contexts/SnackbarContext';
import MemberFilter from './MemberFilter';

// Dummy member data with all possible fields

const Members = () => {
  const { showSnackbar } = useSnackbar();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showMedicalHistoryModal, setShowMedicalHistoryModal] = useState(false);
  const [showSubProfilesModal, setShowSubProfilesModal] = useState(false);
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [showAddMedicalHistoryModal, setShowAddMedicalHistoryModal] = useState(false);
  const [showViewMember, setShowViewMember] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showEditMember, setShowEditMember] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({
    navigatorId: '',
    doctorId: '',
    isSubprofile: false,
    maritalStatus: '',
    educationLevel: '',
    from_date: '',
    to_date: ''
  });

  const fetchMembers = useCallback(async (pageNum = 1, search = '', filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching members with params:', { pageNum, search, filters });
      
      // Get user from localStorage to get navigatorId
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user || !user.userId) {
        throw new Error('User not authenticated. Please login again.');
      }
      
      // Create a new object with navigatorId first
      const queryParams = {
        doctorId: user.userId,
        page: pageNum,
        limit: 10,
        search,
        sortBy: 'createdAt',
        sortOrder: 'asc',
        isStudent: false
      };

      // Only spread filters that don't override our required params
      const { doctorId, page, limit, ...otherFilters } = filters;
      
      const finalParams = {
        ...queryParams,
        ...otherFilters
      };

      console.log('Final query params:', finalParams);
      
      const response = await membersService.getMembers(finalParams);

      console.log('API Response:', response);
      
      // Check if response has the expected structure
      if (response?.status === 'success' && Array.isArray(response.data)) {
        if (pageNum === 1) {
          console.log('Setting initial members:', response.data);
          setMembers(response.data);
        } else {
          console.log('Appending members:', response.data);
          setMembers(prev => [...prev, ...response.data]);
        }
        
        // Check if there are more pages based on pagination info
        if (response.pagination) {
          const hasNextPage = response.pagination.page < response.pagination.pages;
          setHasMore(hasNextPage);
          setPage(response.pagination.page);
        } else {
          setHasMore(false);
          setPage(pageNum);
        }
      } else {
        console.error('Invalid response structure:', response);
        throw new Error(response?.message || 'Invalid response from server');
      }
    } catch (err) {
      console.error('Error fetching members:', err);
      setError(err.message || 'Failed to fetch members');
      setMembers([]);  // Clear members on error
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const scrolledToBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 1;
    
    if (scrolledToBottom && !loading && hasMore) {
      console.log('Scrolled to bottom, loading more...', { page, loading, hasMore });
      const nextPage = page + 1;
      fetchMembers(nextPage, searchTerm, currentFilters);
    }
  }, [page, loading, hasMore, searchTerm, currentFilters, fetchMembers]);

  // Update useEffect to include currentFilters dependency
  useEffect(() => {
    console.log('Initial members fetch');
    fetchMembers(1, '', currentFilters);
  }, [fetchMembers, currentFilters]);

  const handleSearchClick = () => {
    setPage(1);
    fetchMembers(1, searchTerm, currentFilters);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  const handleFilterApply = (filters) => {
    const updatedFilters = {
      ...filters,
      sortBy: 'createdAt',
      sortOrder: 'asc',
      isStudent: false
    };
    setCurrentFilters(updatedFilters);
    setPage(1);
    fetchMembers(1, searchTerm, updatedFilters);
  };

  const handleCheckboxChange = (memberId) => {
    setSelectedMembers(prev => {
      if (prev.includes(memberId)) {
        return prev.filter(id => id !== memberId);
      }
      return [...prev, memberId];
    });
  };

  const handleSelectAll = () => {
    if (selectedMembers.length === members.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(members.map(member => member.id || member._id));
    }
  };

  const handleDownloadId = async (memberId) => {
    try {
      const response = await membersService.downloadMemberId(memberId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `member-id-${memberId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Failed to download member ID:', err);
    }
  };

  const handleEditNote = async (memberId, note) => {
    try {
      await membersService.updateMemberNote(memberId, note);
      setMembers(prev => prev.map(member => 
        (member.id || member._id) === memberId 
          ? { ...member, notes: note }
          : member
      ));
    } catch (err) {
      console.error('Failed to update note:', err);
    }
  };

  const handleDeleteNote = async (memberId) => {
    try {
      await membersService.deleteMemberNote(memberId);
      setMembers(prev => prev.map(member => 
        (member.id || member._id) === memberId 
          ? { ...member, notes: null }
          : member
      ));
    } catch (err) {
      console.error('Failed to delete note:', err);
    }
  };

  const handleSaveMedicalHistory = async (medicalHistoryData) => {
    try {
      // Add your save medical history API call here
      await fetch(`/api/members/${selectedMember.id}/medical-history`, {
        method: 'POST',
        body: JSON.stringify(medicalHistoryData),
      });
      // Update local state or refresh data as needed
    } catch (error) {
      console.error('Error saving medical history:', error);
    }
  };

  const handleViewMember = async (member) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching member details for:', member._id || member.id);
      const response = await membersService.getMemberById(member._id || member.id);
      console.log('Member details response:', response);
      
      if (response?.status === 'success' && response?.data) {
        setSelectedMember(response.data);
        setShowViewMember(true);
      } else {
        console.error('Invalid response structure:', response);
        throw new Error('Failed to fetch member details');
      }
    } catch (err) {
      console.error('Error fetching member details:', err);
      showSnackbar(
        err.message || 'Failed to fetch member details', 
        'error'
      );
      setSelectedMember(null);
    } finally {
      setLoading(false);
    }
  };


  const handleDoctorAssign = async (doctor) => {
    try {
      if (!selectedMembers.length) {
        showSnackbar('Please select at least one member', 'warning');
        return;
      }

      setLoading(true);
      const response = await membersService.assignDoctor(selectedMembers, doctor._id);

      if (response.status === 'success') {
        showSnackbar('Doctor assigned successfully', 'success');
        setSelectedMembers([]);
        setShowDoctorDropdown(false);
        fetchMembers(); // Refresh the members list
      } else {
        throw new Error(response.message || 'Failed to assign doctor');
      }
    } catch (err) {
      console.error('Error assigning doctor:', err);
      showSnackbar(err.message || 'Failed to assign doctor', 'error');
    } finally {
      setLoading(false);
    }
  };


  const handleAddMember = async (memberData) => {
    try {
      // The member has already been created in the AddEditMember component
      // Just update the UI and fetch the latest list
      showSnackbar('Member added successfully', 'success');
      setShowAddMember(false);
      fetchMembers();
    } catch (err) {
      console.error('Error handling member addition:', err);
      showSnackbar(err.message || 'Failed to handle member addition', 'error');
    }
  };

  const handleEditMember = (memberData) => {
    setEditingMember(memberData);
    setShowEditMember(true);
    setShowViewMember(false);
  };

  const handleEditSubmit = async (updatedMemberData) => {
    try {
      setLoading(true);
      const response = await membersService.updateMember(
        updatedMemberData._id || updatedMemberData.id,
        updatedMemberData
      );
      
      if (response?.status === 'success' && response?.data) {
        showSnackbar('Member updated successfully', 'success');
        setShowEditMember(false);
        setEditingMember(null);
        fetchMembers();
      } else {
        throw new Error(response?.message || 'Failed to update member');
      }
    } catch (err) {
      console.error('Error updating member:', err);
      showSnackbar(err.message || 'Failed to update member', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatMemberData = (member) => {
    if (!member) {
      console.error('Received null or undefined member');
      return null;
    }

    console.log('Formatting member:', member);
    
    // Basic member data
    const formattedMember = {
      id: member._id,
      memberId: member.memberId || 'N/A',
      fullName: member.name || 'N/A',
      email: member.email || 'N/A',
      mobile: member.phone || 'N/A',
      gender: member.gender || 'N/A',
      dob: member.dob || 'N/A',
      membershipType: member.isStudent ? 'Student' : 'Regular',
      bloodGroup: member.bloodGroup || 'Not specified',
      height: member.heightInFt ? `${member.heightInFt} ft` : 'Not specified',
      weight: member.weightInKg ? `${member.weightInKg} kg` : 'Not specified',
      
      // Emergency contact
      emergencyContact: member.emergencyContact ? {
        name: member.emergencyContact.name || 'N/A',
        relationship: member.emergencyContact.relation || 'N/A',
        number: member.emergencyContact.phone || 'N/A'
      } : null,
      
      // Personal history
      personalHistory: {
        employmentStatus: member.employmentStatus || 'Not specified',
        educationLevel: member.educationLevel || 'Not specified',
        maritalStatus: member.maritalStatus || 'Not specified'
      },
      
      // Address
      address: member.address ? 
        `${member.address.description || ''}, ${member.address.region || ''}, ${member.address.pinCode || ''}`.trim() : 
        'Not specified',
      rawAddress: member.address || null,
      
      // Status and dates
      status: member.active ? 'active' : 'inactive',
      registrationDate: member.createdAt || 'N/A',
      lastVisit: member.updatedAt || 'N/A',
      
      // Additional fields
      subprofileIds: member.subprofileIds || [],
      isStudent: member.isStudent || false,
      isSubprofile: member.isSubprofile || false,
      studentDetails: member.studentDetails || null,
      subscriptions: member.subscriptions || [],
      addons: member.addons || []
    };

    console.log('Formatted member data:', formattedMember);
    return formattedMember;
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setPage(1);
    fetchMembers(1, '', currentFilters);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Members</h1>
        <div className="flex items-center gap-2">
          
          <button
            onClick={() => setShowAddMember(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus className="w-4 h-4" />
            Add Member
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative flex w-full">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchClick()}
                  className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                {searchTerm && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    title="Clear search"
                  >
                    <FaTimes className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button
                onClick={handleSearchClick}
                className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Search
              </button>
            </div>
          </div>

          <button
            onClick={() => setShowFilterModal(true)}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            <FaFilter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <MembersList
        members={members}
        selectedMembers={selectedMembers}
        handleCheckboxChange={handleCheckboxChange}
        handleSelectAll={handleSelectAll}
        setSelectedMember={handleViewMember}
        handleDownloadId={handleDownloadId}
        loading={loading}
        onScroll={handleScroll}
        onEditNote={handleEditNote}
        onDeleteNote={handleDeleteNote}
      />

      {showAddMember && (
        <AddEditMember
          onClose={() => setShowAddMember(false)}
          onSubmit={handleAddMember}
          loading={loading}
        />
      )}

      {showViewMember && selectedMember && (
        <ViewMember
          memberId={selectedMember._id || selectedMember.id}
          member={selectedMember}
          onClose={() => {
            setShowViewMember(false);
            setSelectedMember(null);
          }}
          onEdit={handleEditMember}
          onDelete={async (memberId) => {
            try {
              await membersService.deleteMember(memberId);
              setMembers(prev => prev.filter(m => 
                (m.id || m._id) !== memberId
              ));
              setShowViewMember(false);
              setSelectedMember(null);
              showSnackbar('Member deleted successfully', 'success');
            } catch (err) {
              console.error('Failed to delete member:', err);
              showSnackbar(err.message || 'Failed to delete member', 'error');
              throw err; // Re-throw the error so ViewMember can handle loading state
            }
          }}
        />
      )}

      {showEditMember && editingMember && (
        <AddEditMember
          initialData={editingMember}
          isEditing={true}
          onClose={() => {
            setShowEditMember(false);
            setEditingMember(null);
          }}
          onSubmit={handleEditSubmit}
        />
      )}

      {showDoctorDropdown && (
        <DoctorDropdown
          isOpen={showDoctorDropdown}
          onClose={() => setShowDoctorDropdown(false)}
          onAssign={handleDoctorAssign}
          selectedMembers={selectedMembers}
        />
      )}

      {showSubProfilesModal && selectedMember && (
        <SubProfilesModal
          member={selectedMember}
          onClose={() => {
            setShowSubProfilesModal(false);
            setSelectedMember(null);
          }}
        />
      )}

      {showMedicalHistoryModal && selectedMember && (
        <MedicalHistoryModal
          member={selectedMember}
          onClose={() => {
            setShowMedicalHistoryModal(false);
            setSelectedMember(null);
          }}
        />
      )}

      {showAddMedicalHistoryModal && selectedMember && (
        <AddMedicalHistory
          member={selectedMember}
          onClose={() => setShowAddMedicalHistoryModal(false)}
          onSave={handleSaveMedicalHistory}
        />
      )}

      <MemberFilter
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleFilterApply}
        currentFilters={currentFilters}
      />
    </div>
  );
};

export default Members; 