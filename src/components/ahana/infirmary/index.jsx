import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { FaSearch, FaFilter, FaTimes, FaEye } from 'react-icons/fa';
import InfirmaryFilters from './InfirmaryFilters';
import StudentInfirmaryList from './StudentInfirmaryList';
import { useOutletContext } from 'react-router-dom';
import { membersService } from '../../../services/membersService';

const Infirmary = () => {
  const { schoolId, schoolData } = useOutletContext() || {};
  const [showFilters, setShowFilters] = useState(false);
  const [showStudentRecords, setShowStudentRecords] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
    grade: '',
    section: '',
    fromDate: '',
    toDate: '',
    complaints: ''
  });
  const [appliedFilters, setAppliedFilters] = useState({
    name: '',
    grade: '',
    section: '',
    fromDate: '',
    toDate: '',
    complaints: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInputValue, setSearchInputValue] = useState('');
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const itemsPerPage = 20;
  const tableRef = useRef(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await membersService.getMembers({
        page: currentPage,
        limit: itemsPerPage,
        schoolId: schoolId || undefined,
        search: searchTerm,
        isStudent: true,
        grade: appliedFilters.grade || undefined,
        section: appliedFilters.section || undefined,
        name: appliedFilters.name || undefined
      });

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
        active: student.active
      }));

      if (currentPage === 1) {
        setStudents(studentsList);
      } else {
        setStudents(prev => [...prev, ...studentsList]);
      }
      setHasMore(studentsList.length === itemsPerPage);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [currentPage, searchTerm, appliedFilters]);

  const filteredData = useMemo(() => {
    return students;
  }, [students]);

  const handleScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
    
    if (scrollPercentage > 80 && !loading && hasMore) {
      loadMoreItems();
    }
  }, [loading, hasMore]);

  const loadMoreItems = () => {
    if (loading || !hasMore) return;
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
  };

  useEffect(() => {
    const tableElement = tableRef.current;
    if (tableElement) {
      tableElement.addEventListener('scroll', handleScroll);
      return () => tableElement.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, appliedFilters]);

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setShowStudentRecords(true);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    setCurrentPage(1);
    setShowFilters(false);
  };

  const handleSearch = () => {
    setSearchTerm(searchInputValue);
    setCurrentPage(1);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleRemoveFilter = (key) => {
    const newFilters = {
      ...filters,
      [key]: ''
    };
    setFilters(newFilters);
    setAppliedFilters(newFilters);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col h-full bg-white p-6">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative flex gap-4">
          <div className="flex gap-2 w-96">
            <input
              type="text"
              placeholder="Search by name, ID, school..."
              value={searchInputValue}
              onChange={(e) => setSearchInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
            >
              <FaSearch />
              Search
            </button>
          </div>
          <button
            onClick={() => setShowFilters(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <FaFilter />
            Filters
          </button>
        </div>

        {/* Active Filters Display */}
        {Object.entries(appliedFilters).some(([key, value]) => value && key !== 'fromDate' && key !== 'toDate' && key !== 'complaints') && (
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(appliedFilters).map(([key, value]) => {
              if (!value || key === 'fromDate' || key === 'toDate' || key === 'complaints') return null;
              return (
                <div key={key} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  <span>{key}: {value}</span>
                  <button
                    onClick={() => handleRemoveFilter(key)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div 
          ref={tableRef}
          className="h-[calc(100vh-220px)] overflow-auto scroll-smooth"
        >
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th scope="col" className="w-16 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sl. No
                </th>
                <th scope="col" className="w-32 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student ID
                </th>
                <th scope="col" className="w-48 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="w-36 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mobile Number
                </th>
                <th scope="col" className="w-24 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class
                </th>
                <th scope="col" className="w-64 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="w-24 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((student, index) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {visibleRange.start + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 truncate">
                    {student.studentId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 truncate">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 truncate">
                    {student.mobile}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 truncate">
                    {student.class}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 truncate">
                    {student.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center">
                      <button
                        onClick={() => handleViewStudent(student)}
                        className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50 transition-colors"
                        title="View Student"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {loading && (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                      <span className="ml-2">Loading...</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {!loading && filteredData.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No records found</p>
            </div>
          )}
        </div>
      </div>

      {/* Filters Modal */}
      <InfirmaryFilters
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onApplyFilters={handleApplyFilters}
        schoolData={schoolData}
        isLoading={loading}
      />

      {/* Student Records Modal */}
      {showStudentRecords && selectedStudent && (
        <StudentInfirmaryList
          student={selectedStudent}
          onClose={() => {
            setShowStudentRecords(false);
            setSelectedStudent(null);
          }}
        />
      )}
    </div>
  );
};

export default Infirmary; 