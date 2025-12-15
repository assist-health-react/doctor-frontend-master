import { FaUserMd } from 'react-icons/fa';
import { DetailField } from './CommonComponents';

const PrimaryCarePhysician = ({ data }) => {
  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="px-4 py-3 border-b bg-gray-50">
        <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
          <FaUserMd className="text-blue-500" />
          Primary Care Physician
        </h3>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailField label="Name" value={data.name} />
          <DetailField label="Contact" value={data.contactNumber} />
        </div>
      </div>
    </div>
  );
};

export default PrimaryCarePhysician; 