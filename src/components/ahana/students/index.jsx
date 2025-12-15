import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { FaSearch, FaFilter, FaUserPlus, FaEye, FaUpload } from 'react-icons/fa';
import { membersService } from '../../../services/membersService';
import { getSchoolById } from '../../../services/schoolsService';
import StudentList from './StudentList';
import StudentFilters from './StudentFilters';
import AddStudentForm from './AddStudentForm';
import AddAssessmentForm from './AddAssessmentForm';
import ViewStudentDetails from './ViewStudentDetails';
import StudentBulkUploadGuide from './StudentBulkUploadGuide';
import { useOutletContext } from 'react-router-dom';

const AllStudents = () => {
  const { schoolId, schoolData, isLoading: isLoadingSchool } = useOutletContext() || {};
  
  useEffect(() => {
    console.log('School Data in AllStudents:', {
      schoolId,
      schoolData,
      grades: schoolData?.grades,
      isLoadingSchool
    });
  }, [schoolId, schoolData, isLoadingSchool]);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [students, setStudents] = useState([]);
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [showAssessmentForm, setShowAssessmentForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showViewDetails, setShowViewDetails] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
    grade: '',
    section: ''
  });
  const tableRef = useRef(null);
  const itemsPerPage = 10;
  const [shouldFetch, setShouldFetch] = useState(false);
  const isInitialMount = useRef(true);

  // Extract grades and sections from schoolData
  const availableGrades = useMemo(() => {
    if (!schoolData?.grades) return [];
    return schoolData.grades.map(grade => grade.class);
  }, [schoolData?.grades]);

  // Get sections for the selected grade
  const availableSections = useMemo(() => {
    if (!schoolData?.grades || !filters.grade) return [];
    const selectedGrade = schoolData.grades.find(g => g.class === filters.grade);
    return selectedGrade?.section?.map(s => s.name) || [];
  }, [schoolData?.grades, filters.grade]);

  const fetchStudents = useCallback(async () => {
    if (!schoolId) {
      console.log('No school ID provided to students component');
      setError('No school selected');
      return;
    }

    try {
      console.log('Making API call to fetch students for school:', schoolId);
      setError(null);
      setLoading(true);
      
      const currentSearch = searchTerm || filters.name || '';
      
      const params = {
        isStudent: true,
        schoolId: schoolId,
        page: currentPage,
        limit: itemsPerPage,
        search: currentSearch,
        sortBy: 'createdAt',
        sortOrder: 'asc'
      };

      if (filters.grade) {
        params.grade = filters.grade;
      }

      if (filters.section) {
        params.section = filters.section;
      }
      
      console.log('Sending params to API:', params);

      const response = await membersService.getMembers(params);

      console.log('API Response received:', response);

      if (!response || !response.data) {
        throw new Error('No data in API response');
      }

      const studentsList = response.data.map(student => ({
        id: student._id,
        studentId: student.memberId,
        name: student.name,
        mobile: student.phone,
        school: student.address?.region || '',
        class: student.studentDetails?.grade || '',
        section: student.studentDetails?.section || '',
        gender: student.gender || '',
        email: student.email,
        dob: student.dob,
        bloodGroup: student.bloodGroup,
        profilePic: student.profilePic || null,
        addressDescription: Array.isArray(student.address) && student.address.length > 0 ? student.address[0].description : '',
        addressPinCode: Array.isArray(student.address) && student.address.length > 0 ? student.address[0].pinCode : '',
        addressRegion: Array.isArray(student.address) && student.address.length > 0 ? student.address[0].region : '',
        addressLandmark: Array.isArray(student.address) && student.address.length > 0 ? student.address[0].landmark : '',
        addressState: Array.isArray(student.address) && student.address.length > 0 ? student.address[0].state : '',
        addressCountry: Array.isArray(student.address) && student.address.length > 0 ? student.address[0].country : '',
        emergencyContactName: student.emergencyContact?.name || '',
        emergencyContactRelation: student.emergencyContact?.relation || '',
        emergencyContactPhone: student.emergencyContact?.phone || ''
      }));

      console.log('Processed students data:', studentsList);
      setStudents(prev => currentPage === 1 ? studentsList : [...prev, ...studentsList]);
      setHasMore(studentsList.length === itemsPerPage);
    } catch (error) {
      console.error('API call failed:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setError(
        `Failed to fetch students: ${error.response?.data?.message || error.message}`
      );
      setHasMore(false);
    } finally {
      setLoading(false);
      setShouldFetch(false);
    }
  }, [schoolId, currentPage, itemsPerPage, searchTerm, filters]);

  // Effect to handle initial mount and schoolId changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    if (schoolId) {
        setShouldFetch(true);
      }
    }
  }, [schoolId]);

  // Effect to handle data fetching
  useEffect(() => {
    if (shouldFetch && !isLoadingSchool) {
      fetchStudents();
    }
  }, [shouldFetch, isLoadingSchool, fetchStudents]);

  const handleFilterChange = (filterName, value) => {
    console.log('Filter changed:', filterName, value);
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleApplyFilters = () => {
    console.log('Applying filters:', filters);
    if (schoolId) {
      setCurrentPage(1);
      setStudents([]);
      setShouldFetch(true);
    }
  };

  const handleSearch = () => {
    if (schoolId) {
      setCurrentPage(1);
      setStudents([]);
      setShouldFetch(true);
    }
  };

  const handleViewStudent = async (student) => {
    console.log('Viewing student:', student);
    setSelectedStudent(student);
    setShowViewDetails(true);
  };

  const handleEditStudent = async (student) => {
    try {
      // Fetch complete student details using the same API as view
      const response = await membersService.getMemberById(student.id);
      if (response.status === 'success' && response.data) {
        setSelectedStudent(response.data);
        setShowAddStudentForm(true);
      }
    } catch (error) {
      console.error('Error fetching student details for edit:', error);
      alert('Failed to load student details for editing. Please try again.');
    }
  };

  const filteredStudents = useMemo(() => {
    console.log('Filtering students:', students);
    return students;
  }, [students]);

  console.log('Rendering AllStudents with:', {
    loading,
    studentsCount: students.length,
    filteredCount: filteredStudents.length,
    error
  });

  return (
    <div className="w-full h-full flex flex-col bg-gray-50">
      <div className="flex justify-between items-center mb-4 px-4 py-4 bg-white border-b">
        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-4">
            <div className="w-96">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search students..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 border-l-0"
            >
              Search
            </button>
          </div>
          <button
            onClick={() => setShowFilters(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            <FaFilter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowBulkUpload(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <FaUpload />
            <span>Bulk Insert</span>
          </button>
          <button
            onClick={() => setShowAddStudentForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FaUserPlus />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mx-4 mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p className="font-medium">Error Loading Students</p>
          <p>{error}</p>
          <button 
            onClick={() => fetchStudents()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      <div className="flex-1 p-4">
        {loading && students.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <StudentList
            students={filteredStudents}
            loading={loading}
            onViewDetails={(student) => {
              console.log('View details clicked for student:', student);
              handleViewStudent(student);
            }}
            onSelectStudent={(student) => {
              console.log('Add assessment clicked for student:', student);
              setSelectedStudent(student);
              setShowAssessmentForm(true);
            }}
          />
        )}
      </div>

      {showAddStudentForm && (
        <AddStudentForm
          isOpen={showAddStudentForm}
          onClose={() => {
            setShowAddStudentForm(false);
            setSelectedStudent(null);
          }}
          onSuccess={() => {
            setShowAddStudentForm(false);
            setSelectedStudent(null);
            setCurrentPage(1);
            setStudents([]);
            fetchStudents();
          }}
          initialData={selectedStudent}
        />
      )}

      {showViewDetails && selectedStudent && (
        <ViewStudentDetails
          isOpen={showViewDetails}
          studentId={selectedStudent.id}
          onClose={() => {
            setShowViewDetails(false);
            setSelectedStudent(null);
          }}
          onEdit={async (studentData) => {
            setShowViewDetails(false);
            // Fetch fresh data before editing
            await handleEditStudent({ id: studentData._id });
          }}
          onDelete={async (studentId) => {
            try {
              await membersService.deleteMember(studentId);
              setShowViewDetails(false);
              setSelectedStudent(null);
              // Refresh the students list
              setCurrentPage(1);
              setStudents([]);
              fetchStudents();
            } catch (error) {
              console.error('Error deleting student:', error);
              alert('Failed to delete student. Please try again.');
            }
          }}
        />
      )}

      {showAssessmentForm && selectedStudent && (
        <AddAssessmentForm
          student={selectedStudent}
          onClose={() => {
            setShowAssessmentForm(false);
            setSelectedStudent(null);
          }}
        />
      )}

      <StudentFilters
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onApplyFilters={handleApplyFilters}
        schoolData={schoolData}
        isLoading={isLoadingSchool}
      />

      <StudentBulkUploadGuide
        isOpen={showBulkUpload}
        onClose={() => setShowBulkUpload(false)}
        mode="insert"
        onFileUpload={() => {
          setShowBulkUpload(false);
          setCurrentPage(1);
          setStudents([]);
          fetchStudents();
        }}
      />
    </div>
  );
};

export default AllStudents; 