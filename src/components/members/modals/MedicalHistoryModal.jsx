import { FaTimes, FaNotesMedical } from 'react-icons/fa';

const MedicalHistoryModal = ({ history, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Medical History Summary</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {history ? (
          <div className="space-y-6">
            {/* Summary Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="font-medium text-blue-700">Medications</div>
                <div className="text-2xl text-blue-800">{history.medications?.length || 0}</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="font-medium text-green-700">Allergies</div>
                <div className="text-2xl text-green-800">{history.allergies?.length || 0}</div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="font-medium text-yellow-700">Conditions</div>
                <div className="text-2xl text-yellow-800">{history.medicalConditions?.length || 0}</div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="font-medium text-red-700">Surgeries</div>
                <div className="text-2xl text-red-800">{history.surgeries?.length || 0}</div>
              </div>
            </div>

            {/* Recent Updates */}
            <div className="border rounded-lg p-4">
              <h4 className="text-lg font-medium text-gray-700 mb-3">Recent Updates</h4>
              <div className="space-y-2">
                {history.recentUpdates?.map((update, index) => (
                  <div key={index} className="flex items-start space-x-3 p-2 bg-gray-50 rounded">
                    <FaNotesMedical className="text-gray-400 mt-1" />
                    <div>
                      <div className="text-sm text-gray-600">{update.date}</div>
                      <div className="text-gray-800">{update.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Highlights */}
            <div className="border rounded-lg p-4">
              <h4 className="text-lg font-medium text-gray-700 mb-3">Key Highlights</h4>
              <ul className="list-disc list-inside space-y-2">
                {history.keyHighlights?.map((highlight, index) => (
                  <li key={index} className="text-gray-700">{highlight}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <FaNotesMedical className="mx-auto text-gray-400 text-5xl mb-4" />
            <p className="text-gray-500">No medical history available</p>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicalHistoryModal; 