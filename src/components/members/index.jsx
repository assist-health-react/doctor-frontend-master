import { useState, useEffect, useMemo,useCallback,useRef  } from 'react';//2026
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
   const isInitialMount = useRef(true);//2026
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

  
// Pagination 15.1.2026
const [activeFilters, setActiveFilters] = useState({});
const [selectedMemberForView, setSelectedMemberForView] = useState(null);
const [totalMembers, setTotalMembers] = useState(0);
const limit = 10;

// FRONTEND pagination slice
const paginatedMembers = useMemo(() => {
  const start = (page - 1) * limit;
  const end = start + limit;
  return members.slice(start, end);
}, [members, page, limit]);

// Single effect to handle both initial load and subsequent updates
  useEffect(() => {
    const fetchData = async () => {
      // Skip if loading
      if (loading) return;

      // On initial mount
      if (isInitialMount.current) {
        isInitialMount.current = false;
        await fetchMembers(1, false);
        return;
      }

      // For subsequent filter changes
      if (!searchTerm) {
        await fetchMembers(1, false);
      }
    };

    fetchData();
  }, [activeFilters]); // activeFilters dependency only
///SAMPLE///
const staticMembers = [
  {
    "_id": "696341efe8467d1b49877001",
    "name": "Siva Kumar",
    "email": "siva@gmail.com",
    "phone": "919876567890",
    "dob": "1995-06-12T00:00:00.000Z",
    "gender": "male",
    "profilePic": null,
    "role": "member",
    "languagesSpoken": ["Tamil"],
    "introduction": "Regular health member",
    "total_assigned_members": 0,
    "rating": 0,
    "createdAt": "2026-01-01T06:23:43.153Z",
    "updatedAt": "2026-01-01T06:23:43.153Z",
    "navigatorId": "AHNAV006",
    "__v": 0
  },
  {
    "_id": "696341efe8467d1b49877002",
    "name": "Kumaravel",
    "email": "kumar@gmail.com",
    "phone": "919834567321",
    "dob": "1992-03-21T00:00:00.000Z",
    "gender": "male",
    "profilePic": null,
    "role": "member",
    "languagesSpoken": ["Tamil", "English"],
    "introduction": "Senior citizen member",
    "total_assigned_members": 0,
    "rating": 0,
    "createdAt": "2026-01-02T08:10:12.000Z",
    "updatedAt": "2026-01-02T08:10:12.000Z",
    "navigatorId": "AHNAV006",
    "__v": 0
  },
  {
    "_id": "696341efe8467d1b49877003",
    "name": "Priya",
    "email": "priya@gmail.com",
    "phone": "919812345678",
    "dob": "1998-11-05T00:00:00.000Z",
    "gender": "female",
    "profilePic": null,
    "role": "member",
    "languagesSpoken": ["Tamil"],
    "introduction": "Student member",
    "total_assigned_members": 0,
    "rating": 0,
    "createdAt": "2026-01-03T09:15:30.000Z",
    "updatedAt": "2026-01-03T09:15:30.000Z",
    "navigatorId": "AHNAV006",
    "__v": 0
  },
  {
    "_id": "696341efe8467d1b49877004",
    "name": "Arun",
    "email": "arun@gmail.com",
    "phone": "919823456789",
    "dob": "1990-07-19T00:00:00.000Z",
    "gender": "male",
    "profilePic": null,
    "role": "member",
    "languagesSpoken": ["Tamil", "English"],
    "introduction": "Working professional",
    "total_assigned_members": 0,
    "rating": 0,
    "createdAt": "2026-01-04T10:45:00.000Z",
    "updatedAt": "2026-01-04T10:45:00.000Z",
    "navigatorId": "AHNAV006",
    "__v": 0
  },
  {
    "_id": "696341efe8467d1b49877005",
    "name": "Divya",
    "email": "divya@gmail.com",
    "phone": "919845612378",
    "dob": "1996-01-25T00:00:00.000Z",
    "gender": "female",
    "profilePic": null,
    "role": "member",
    "languagesSpoken": ["Tamil"],
    "introduction": "Fitness enthusiast",
    "total_assigned_members": 0,
    "rating": 0,
    "createdAt": "2026-01-05T11:30:20.000Z",
    "updatedAt": "2026-01-05T11:30:20.000Z",
    "navigatorId": "AHNAV006",
    "__v": 0
  },
  {
    "_id": "696341efe8467d1b49877006",
    "name": "Ramesh",
    "email": "ramesh@gmail.com",
    "phone": "919856789012",
    "dob": "1988-09-14T00:00:00.000Z",
    "gender": "male",
    "profilePic": null,
    "role": "member",
    "languagesSpoken": ["Tamil"],
    "introduction": "Diabetic care member",
    "total_assigned_members": 0,
    "rating": 0,
    "createdAt": "2026-01-06T12:10:45.000Z",
    "updatedAt": "2026-01-06T12:10:45.000Z",
    "navigatorId": "AHNAV006",
    "__v": 0
  },
  {
    "_id": "696341efe8467d1b49877007",
    "name": "Lakshmi",
    "email": "lakshmi@gmail.com",
    "phone": "919867890123",
    "dob": "1993-12-03T00:00:00.000Z",
    "gender": "female",
    "profilePic": null,
    "role": "member",
    "languagesSpoken": ["Tamil"],
    "introduction": "Wellness program member",
    "total_assigned_members": 0,
    "rating": 0,
    "createdAt": "2026-01-07T14:22:10.000Z",
    "updatedAt": "2026-01-07T14:22:10.000Z",
    "navigatorId": "AHNAV006",
    "__v": 0
  },
  {
    "_id": "696341efe8467d1b49877008",
    "name": "Vijay",
    "email": "vijay@gmail.com",
    "phone": "919878901234",
    "dob": "1991-04-28T00:00:00.000Z",
    "gender": "male",
    "profilePic": null,
    "role": "member",
    "languagesSpoken": ["Tamil", "English"],
    "introduction": "Corporate member",
    "total_assigned_members": 0,
    "rating": 0,
    "createdAt": "2026-01-08T15:05:00.000Z",
    "updatedAt": "2026-01-08T15:05:00.000Z",
    "navigatorId": "AHNAV006",
    "__v": 0
  },
  {
    "_id": "696341efe8467d1b49877009",
    "name": "Meena",
    "email": "meena@gmail.com",
    "phone": "919889012345",
    "dob": "1997-08-09T00:00:00.000Z",
    "gender": "female",
    "profilePic": null,
    "role": "member",
    "languagesSpoken": ["Tamil"],
    "introduction": "Nutrition care member",
    "total_assigned_members": 0,
    "rating": 0,
    "createdAt": "2026-01-09T16:45:30.000Z",
    "updatedAt": "2026-01-09T16:45:30.000Z",
    "navigatorId": "AHNAV006",
    "__v": 0
  },
  {
    "_id": "696341efe8467d1b49877010",
    "name": "Senthil",
    "email": "senthil@gmail.com",
    "phone": "919890123456",
    "dob": "1989-10-18T00:00:00.000Z",
    "gender": "male",
    "profilePic": null,
    "role": "member",
    "languagesSpoken": ["Tamil"],
    "introduction": "Senior health plan",
    "total_assigned_members": 0,
    "rating": 0,
    "createdAt": "2026-01-10T17:30:00.000Z",
    "updatedAt": "2026-01-10T17:30:00.000Z",
    "navigatorId": "AHNAV006",
    "__v": 0
  },
  {
    "_id": "696341efe8467d1b49877011",
    "name": "Anitha",
    "email": "anitha@gmail.com",
    "phone": "919801234567",
    "dob": "1994-02-11T00:00:00.000Z",
    "gender": "female",
    "profilePic": null,
    "role": "member",
    "languagesSpoken": ["Tamil"],
    "introduction": "Women wellness member",
    "total_assigned_members": 0,
    "rating": 0,
    "createdAt": "2026-01-11T09:15:00.000Z",
    "updatedAt": "2026-01-11T09:15:00.000Z",
    "navigatorId": "AHNAV006",
    "__v": 0
  },
  {
    "_id": "696341efe8467d1b49877012",
    "name": "Mohan",
    "email": "mohan@gmail.com",
    "phone": "919812309876",
    "dob": "1987-06-06T00:00:00.000Z",
    "gender": "male",
    "profilePic": null,
    "role": "member",
    "languagesSpoken": ["Tamil"],
    "introduction": "Heart care member",
    "total_assigned_members": 0,
    "rating": 0,
    "createdAt": "2026-01-12T10:40:00.000Z",
    "updatedAt": "2026-01-12T10:40:00.000Z",
    "navigatorId": "AHNAV006",
    "__v": 0
  },
  {
    "_id": "696341efe8467d1b49877013",
    "name": "Revathi",
    "email": "revathi@gmail.com",
    "phone": "919823450987",
    "dob": "1999-05-30T00:00:00.000Z",
    "gender": "female",
    "profilePic": null,
    "role": "member",
    "languagesSpoken": ["Tamil"],
    "introduction": "Young adult member",
    "total_assigned_members": 0,
    "rating": 0,
    "createdAt": "2026-01-13T11:55:00.000Z",
    "updatedAt": "2026-01-13T11:55:00.000Z",
    "navigatorId": "AHNAV006",
    "__v": 0
  },
  {
    "_id": "696341efe8467d1b49877014",
    "name": "Balaji",
    "email": "balaji@gmail.com",
    "phone": "919834560987",
    "dob": "1991-09-09T00:00:00.000Z",
    "gender": "male",
    "profilePic": null,
    "role": "member",
    "languagesSpoken": ["Tamil", "English"],
    "introduction": "Annual plan member",
    "total_assigned_members": 0,
    "rating": 0,
    "createdAt": "2026-01-14T12:30:00.000Z",
    "updatedAt": "2026-01-14T12:30:00.000Z",
    "navigatorId": "AHNAV006",
    "__v": 0
  },
  {
    "_id": "696341efe8467d1b49877015",
    "name": "Nandhini",
    "email": "nandhini@gmail.com",
    "phone": "919845670123",
    "dob": "1996-12-17T00:00:00.000Z",
    "gender": "female",
    "profilePic": null,
    "role": "member",
    "languagesSpoken": ["Tamil"],
    "introduction": "Lifestyle care member",
    "total_assigned_members": 0,
    "rating": 0,
    "createdAt": "2026-01-15T13:20:00.000Z",
    "updatedAt": "2026-01-15T13:20:00.000Z",
    "navigatorId": "AHNAV006",
    "__v": 0
  }
];


const fetchMembers = useCallback(
  async (pageNum = 1, search = '', filters = {}) => {
    try {
      if (loading) return;

      setLoading(true);
      setError(null);

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user?.userId) throw new Error('User not authenticated');

      const queryParams = {
        doctorId: user.userId,
        page: pageNum,
        limit: limit,
        search,
        sortBy: 'createdAt',
        sortOrder: 'asc',
        isStudent: false,
        ...filters
      };

    const response = await membersService.getMembers(queryParams);

    //Test
    //  const response = {
    //   status: 'success',
    //   data: staticMembers
    // };

      if (response?.status === 'success') {
        setMembers(response.data || []);
        setTotalMembers(response.data.length);
        setPage(pageNum);
      } else {
        throw new Error('Failed to fetch members');
      }
    } catch (err) {
      setError(err.message);
      showSnackbar(err.message, 'error');
    } finally {
      setLoading(false);
    }
  },
  [limit, loading, showSnackbar]
);

  // const fetchMembers = useCallback(async (pageNum = 1, search = '', filters = {}) => {
  //   try {
  //     setLoading(true);
  //     setError(null);
  //     console.log('Fetching members with params:', { pageNum, search, filters });
      
  //     // Get user from localStorage to get navigatorId
  //     const user = JSON.parse(localStorage.getItem('user') || '{}');
  //     if (!user || !user.userId) {
  //       throw new Error('User not authenticated. Please login again.');
  //     }
      
  //     // Create a new object with navigatorId first
  //     const queryParams = {
  //       doctorId: user.userId,
  //       page: pageNum,
  //       limit: 10,
  //       search,
  //       sortBy: 'createdAt',
  //       sortOrder: 'asc',
  //       isStudent: false
  //     };

  //     // Only spread filters that don't override our required params
  //     const { doctorId, page, limit, ...otherFilters } = filters;
      
  //     const finalParams = {
  //       ...queryParams,
  //       ...otherFilters
  //     };

  //     console.log('Final query params:', finalParams);
      
  //     const response = await membersService.getMembers(finalParams);

  //     console.log('API Response:', response);
      
  //     // Check if response has the expected structure
  //     if (response?.status === 'success' && Array.isArray(response.data)) {
  //       if (pageNum === 1) {
  //         console.log('Setting initial members:', response.data);
  //         setMembers(response.data);
  //       } else {
  //         console.log('Appending members:', response.data);
  //         setMembers(prev => [...prev, ...response.data]);
  //       }
        
  //       // Check if there are more pages based on pagination info
  //       if (response.pagination) {
  //         const hasNextPage = response.pagination.page < response.pagination.pages;
  //         setHasMore(hasNextPage);
  //         setPage(response.pagination.page);
  //       } else {
  //         setHasMore(false);
  //         setPage(pageNum);
  //       }
  //     } else {
  //       console.error('Invalid response structure:', response);
  //       throw new Error(response?.message || 'Invalid response from server');
  //     }
  //   } catch (err) {
  //     console.error('Error fetching members:', err);
  //     setError(err.message || 'Failed to fetch members');
  //     setMembers([]);  // Clear members on error
  //     setHasMore(false);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  const handleScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const scrolledToBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 1;
    
    if (scrolledToBottom && !loading && hasMore) {
      console.log('Scrolled to bottom, loading more...', { page, loading, hasMore });
      const nextPage = page + 1;
      fetchMembers(nextPage, searchTerm, currentFilters);
    }
  }, [page, loading, hasMore, searchTerm, currentFilters, fetchMembers]);

  // // Update useEffect to include currentFilters dependency
  // useEffect(() => {
  //   console.log('Initial members fetch');
  //   fetchMembers(1, '', currentFilters);
  // }, [fetchMembers, currentFilters]);

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

      {/* <MembersList
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
      /> */}
     <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <MembersList
       // members={members}
        members={paginatedMembers}
        selectedMembers={selectedMembers}
        handleCheckboxChange={handleCheckboxChange}
        handleSelectAll={handleSelectAll}
        setSelectedMember={handleViewMember}
        handleDownloadId={handleDownloadId}
        loading={loading}
        //onScroll={handleScroll}
        onEditNote={handleEditNote}
        onDeleteNote={handleDeleteNote}
        onRefresh={fetchMembers}
         page={page}
  limit={limit}
      />

            {/* Pagination */}
        {totalMembers > 0 && (
        <div className="flex justify-end items-center gap-1 p-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-sm">
            Page {page} of {Math.ceil(totalMembers / limit)}
          </span>

          <button
            disabled={page >= Math.ceil(totalMembers / limit)}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
   </div>
        
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