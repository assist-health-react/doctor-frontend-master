import { useState } from 'react';
import ReportDetails from './ReportDetails';

const ReportList = ({ reports, loading, onLoadMore, hasMore }) => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleRowClick = (report) => {
    setSelectedReport(report);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedReport(null);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sl.No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Complaints</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consent From</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Treatment</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="9" className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                </td>
              </tr>
            ) : reports.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
                  No reports found
                </td>
              </tr>
            ) : (
              reports.map((report, index) => (
                <tr 
                  key={report.id}
                  onClick={() => handleRowClick(report)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(report.date).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                    {report.details.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {report.details.studentId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {report.details.complaints}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {report.details.details}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {report.details.consentFrom}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {report.details.treatment}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {hasMore && !loading && (
        <div className="px-6 py-4 border-t">
          <button
            onClick={onLoadMore}
            className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Load More
          </button>
        </div>
      )}

      <ReportDetails
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        report={selectedReport}
      />
    </div>
  );
};

export default ReportList; 