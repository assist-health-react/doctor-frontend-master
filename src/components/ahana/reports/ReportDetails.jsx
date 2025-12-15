import { IoMdClose } from 'react-icons/io';

const ReportDetails = ({ isOpen, onClose, report }) => {
  if (!isOpen || !report) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-800">Report Details</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
          >
            <IoMdClose className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Report Header Info */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600">Date</label>
                <p className="text-gray-900 font-medium">{new Date(report.date).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Type</label>
                <p className="text-gray-900 font-medium">{report.type}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Grade</label>
                <p className="text-gray-900 font-medium">{report.grade}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Status</label>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${report.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {report.status}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Count</label>
                <p className="text-gray-900 font-medium">{report.count}</p>
              </div>
            </div>
          </div>

          {/* Report Content */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Summary</h3>
              <p className="text-gray-600">{report.summary || 'No summary available.'}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Details</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Student Name</label>
                    <p className="text-gray-900">{report.details.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Student ID</label>
                    <p className="text-gray-900">{report.details.studentId}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">School</label>
                    <p className="text-gray-900">{report.details.school}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Complaints</label>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {report.details.complaints}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Consent From</label>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {report.details.consentFrom}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Treatment</label>
                    <p className="text-gray-900">{report.details.treatment}</p>
                  </div>
                </div>
              </div>
            </div>

            {report.recommendations && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recommendations</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  {report.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-end gap-4 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportDetails; 