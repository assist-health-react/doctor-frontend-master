import { useState, useEffect } from 'react'
import { FaTimes, FaUserCircle, FaSpinner } from 'react-icons/fa'
import { membersService } from '../../services/membersService';

const AssignedMembersModal = ({ isOpen, onClose, doctor }) => {
  if (!isOpen) return null;

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [members, setMembers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 100;

  useEffect(() => {
    const fetchMembers = async () => {
      if (!doctor?._id) return;
      
      setLoading(true);
      setError(null);
      try {
        const response = await membersService.getMembers({
          isStudent: false,
          limit: itemsPerPage,
          page: currentPage,
          sortBy: 'createdAt',
          sortOrder: 'asc',
          doctorId: doctor._id
        });
        
        setMembers(response.data || []);
        setTotalCount(response.pagination?.total || response.data?.length || 0);
      } catch (err) {
        setError('Failed to fetch members. Please try again later.');
        console.error('Error fetching members:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [doctor._id, currentPage]);

  // Filter members based on search
  const filteredMembers = members.filter(member => 
    member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.memberId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone?.includes(searchTerm)
  );

  // Calculate pagination
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

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
              Doctor: {doctor.name} • Total Members: {totalCount}
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

        {error && (
          <div className="text-red-500 text-center py-4">
            {error}
          </div>
        )}

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
              {loading ? (
                <tr>
                  <td colSpan="3" className="text-center py-8">
                    <FaSpinner className="animate-spin h-6 w-6 mx-auto text-blue-500" />
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.memberId}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {member.profilePic ? (
                          <img 
                            src={member.profilePic} 
                            alt={member.name}
                            className="w-8 h-8 rounded-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = null;
                              e.target.className = "hidden";
                              e.target.nextSibling.className = "w-8 h-8 text-gray-400";
                            }}
                          />
                        ) : null}
                        <FaUserCircle className={`w-8 h-8 text-gray-400 ${member.profilePic ? 'hidden' : ''}`} />
                        <span className="ml-3 text-sm font-medium text-gray-900">{member.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.phone}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {!loading && filteredMembers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No members found matching your search.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalCount)} of {totalCount} members
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || loading}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === 1 || loading
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
                  disabled={loading}
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
                disabled={currentPage === totalPages || loading}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === totalPages || loading
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

export default AssignedMembersModal; 