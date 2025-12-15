const InfirmaryList = ({ records, onViewDetails, loading, onLoadMore }) => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                Student
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                Complaint
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                Treatment
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {records.map((record) => (
              <tr 
                key={record._id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => onViewDetails(record)}
              >
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {record.studentId?.name}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {record.studentId?.memberId}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 line-clamp-2">
                    {record.complaint}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 line-clamp-2">
                    {record.treatment}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${record.status === 'discharged' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {record.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {new Date(record.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </td>
              </tr>
            ))}
            
            {loading && (
              <tr>
                <td colSpan="5" className="px-6 py-4">
                  <div className="flex justify-center items-center">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </td>
              </tr>
            )}
            
            {!loading && records.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-4">
                  <div className="text-center text-gray-500">
                    No records found
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!loading && records.length > 0 && onLoadMore && (
        <div className="flex justify-center py-4">
          <button
            onClick={onLoadMore}
            className="text-indigo-600 hover:text-indigo-900"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default InfirmaryList; 