import { useState, useEffect, useCallback } from 'react';
import { membersService } from '../../../services/membersService';
import { FaEye } from 'react-icons/fa';

const AssessmentList = ({ onViewDetails, loading: parentLoading, searchTerm, filters, schoolId, shouldFetch, onFetchComplete }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 10;

  const fetchStudents = useCallback(async () => {
    if (!schoolId) {
      console.log('No school ID provided to assessment list component');
      setError('No school selected');
      return;
    }

    try {
      console.log('Making API call to fetch students for assessments:', schoolId);
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
        sortOrder: 'desc'
      };

      if (filters.grade) {
        params.grade = filters.grade;
      }

      if (filters.section) {
        params.section = filters.section;
      }
      
      console.log('Sending params to API:', params);

      const response = await membersService.getMembers(params);
      
      if (response.status === 'success' && response.data) {
        const formattedStudents = response.data.map(student => ({
          id: student._id,
          memberId: student.memberId,
          name: student.name,
          phone: student.phone,
          gender: student.gender,
          class: student.grade || 'N/A',
          section: student.section || 'N/A'
        }));

        setStudents(prev => currentPage === 1 ? formattedStudents : [...prev, ...formattedStudents]);
        setHasMore(formattedStudents.length === itemsPerPage);
      } else {
        throw new Error('No data in API response');
      }
    } catch (err) {
      setError('Failed to fetch students');
      console.error('Error fetching students:', err);
      setHasMore(false);
    } finally {
      setLoading(false);
      if (onFetchComplete) {
        onFetchComplete();
      }
    }
  }, [schoolId, currentPage, itemsPerPage, searchTerm, filters, onFetchComplete]);

  // Effect to handle initial load and shouldFetch changes
  useEffect(() => {
    if (shouldFetch) {
      setCurrentPage(1);
      setStudents([]);
      fetchStudents();
    }
  }, [shouldFetch, fetchStudents]);

  // Load more data when scrolling to bottom
  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    if (scrollHeight - scrollTop === clientHeight && hasMore && !loading) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <div className="flex-1 border rounded-lg overflow-hidden shadow-lg bg-white">
      {/* Table Header */}
      <div className="grid grid-cols-7 gap-4 px-6 py-4 bg-gray-50 border-b sticky top-0">
        <div className="text-sm font-semibold text-gray-700">Sl.No</div>
        <div className="text-sm font-semibold text-gray-700">Student ID</div>
        <div className="text-sm font-semibold text-gray-700">Name</div>
        <div className="text-sm font-semibold text-gray-700">Mobile Number</div>
        <div className="text-sm font-semibold text-gray-700">Gender</div>
        <div className="text-sm font-semibold text-gray-700">Grade</div>
        <div className="text-sm font-semibold text-gray-700 text-center">Action</div>
      </div>

      {/* Table Body */}
      <div 
        className="overflow-y-auto max-h-[calc(100vh-300px)]"
        onScroll={handleScroll}
      >
        {(loading && currentPage === 1) ? (
          <div className="px-6 py-8 text-center text-gray-500 bg-gray-50 border-b">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <div className="mt-2">Loading students...</div>
          </div>
        ) : students.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="text-gray-400 text-lg mb-2">No students found</div>
            <div className="text-gray-500 text-sm">Try adjusting your search terms or filters</div>
          </div>
        ) : (
          <>
            {students.map((student, index) => (
            <div 
              key={student.id} 
              className="grid grid-cols-7 gap-4 px-6 py-4 border-b hover:bg-gray-50"
            >
              <div className="flex items-center text-gray-600">
                {index + 1}
              </div>
              <div className="flex items-center text-gray-600">
                {student.memberId}
              </div>
              <div className="flex items-center text-gray-700 font-medium">
                {student.name}
              </div>
              <div className="flex items-center text-gray-600">
                {student.phone}
              </div>
              <div className="flex items-center text-gray-600">
                {student.gender}
              </div>
              <div className="flex items-center text-gray-600">
                {student.class} - {student.section}
              </div>
              <div className="flex items-center justify-center">
                <button
                  onClick={() => onViewDetails(student)}
                  className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded hover:bg-blue-50"
                  title="View Assessment History"
                >
                  <FaEye />
                </button>
              </div>
            </div>
            ))}
            {loading && currentPage > 1 && (
              <div className="px-6 py-4 text-center text-gray-500">
                Loading more...
              </div>
            )}
          </>
        )}
      </div>

      {error && (
        <div className="p-4 text-center text-red-600 bg-red-50 border-t">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default AssessmentList; 