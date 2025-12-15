import { FaUserCircle } from 'react-icons/fa';
import { DetailField } from './CommonComponents';

const MemberBasicInfo = ({ member }) => {
  if (!member) {
    return null;
  }

  // Handle different property name variations
  const memberDetails = {
    fullName: member.fullName || member.name || 'N/A',
    id: member.memberId || member.id || 'N/A',
    gender: member.gender || 'N/A',
    age: member.age || 'N/A',
    mobile: member.mobile || member.phone || member.contactNumber || 'N/A',
    email: member.email || 'N/A',
    profilePhoto: member.profilePic || member.profilePhoto || member.avatar || null
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="col-span-full lg:col-span-1 flex justify-center lg:justify-start">
          <div className="relative w-32 h-32">
            {memberDetails.profilePhoto ? (
              <img
                src={memberDetails.profilePhoto}
                alt={memberDetails.fullName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                <FaUserCircle className="w-20 h-20 text-gray-400" />
              </div>
            )}
          </div>
        </div>
        <div className="col-span-full lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailField label="Full Name" value={memberDetails.fullName} />
          <DetailField label="Member ID" value={memberDetails.id} />
          <DetailField label="Gender" value={memberDetails.gender} />
          <DetailField label="Age" value={memberDetails.age} />
          <DetailField label="Contact" value={memberDetails.mobile} />
          <DetailField label="Email" value={memberDetails.email} />
        </div>
      </div>
    </div>
  );
};

export default MemberBasicInfo; 