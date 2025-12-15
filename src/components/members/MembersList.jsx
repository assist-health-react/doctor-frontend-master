import { 
  FaEye, 
  FaPlus, 
  FaDownload,
  FaSpinner
} from 'react-icons/fa';
import MedicalHistoryList from './MedicalHistory/MedicalHistoryList';
import AddMedicalHistory from './MedicalHistory/AddMedicalHistory';
import Notes from './Notes';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { membersService } from '../../services/membersService';

const MembersList = ({ 
  members,
  selectedMembers,
  handleCheckboxChange,
  handleSelectAll,
  setSelectedMember,
  loading,
  onScroll,
  onEditNote,
  onDeleteNote
}) => {
  // Add state for both modals
  const [showViewMedicalHistory, setShowViewMedicalHistory] = useState(false);
  const [showAddMedicalHistory, setShowAddMedicalHistory] = useState(false);
  const [selectedMemberForHistory, setSelectedMemberForHistory] = useState(null);
  const [downloadingIds, setDownloadingIds] = useState(new Set());

  // Handlers for medical history actions
  const handleViewMedicalHistory = (e, member) => {
    e.stopPropagation();
    setSelectedMemberForHistory(member);
    setShowViewMedicalHistory(true);
  };

  const handleAddMedicalHistory = (e, member) => {
    e.stopPropagation();
    setSelectedMemberForHistory(member);
    setShowAddMedicalHistory(true);
  };

  const handleSaveMedicalHistory = async (data) => {
    try {
      console.log('Saving medical history:', data);
      setShowAddMedicalHistory(false);
      setSelectedMemberForHistory(null);
      toast.success('Medical history created successfully');
    } catch (error) {
      console.error('Error saving medical history:', error);
      toast.error(error.message || 'Failed to save medical history');
    }
  };

  const handleDownloadMembershipCard = async (e, memberId) => {
    e.stopPropagation();
    setDownloadingIds(prev => new Set([...prev, memberId]));
    
    try {
      await membersService.downloadMembershipCard(memberId);
      toast.success('Membership card opened in new tab');
    } catch (error) {
      console.error('Error downloading membership card:', error);
      toast.error(error.message || 'Failed to download membership card');
    } finally {
      setDownloadingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(memberId);
        return newSet;
      });
    }
  };

  // Function to flatten members and their subprofiles into a single array
  const getAllProfiles = () => {
    const allProfiles = [];
    
    members.forEach(member => {
      // Add main profile if not a student
      if (!member.isStudent) {
        allProfiles.push({
          ...member,
          isMainProfile: true
        });
        
        // Add subprofiles if they exist
        if (member.subprofileIds && member.subprofileIds.length > 0) {
          member.subprofileIds.forEach(subprofile => {
            allProfiles.push({
              ...subprofile,
              phone: member.phone, // Inherit phone from parent
              isMainProfile: false,
              parentProfile: member,
              isSubprofile: true
            });
          });
        }
      }
    });
    
    return allProfiles;
  };

  // Get all profiles including subprofiles
  const allProfiles = getAllProfiles();

  // Helper function to format member name
  const formatMemberName = (member) => {
    if (!member) return 'N/A';
    return member.name || 'N/A';
  };

  // Helper function to format member phone
  const formatMemberPhone = (member) => {
    if (!member) return 'N/A';
    return member.phone || 'N/A';
  };

  return (
    <div className="relative h-[600px]">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden border-b border-gray-200">
            <div 
              className="max-h-[600px] overflow-y-auto scroll-smooth" 
              onScroll={onScroll}
              style={{ scrollBehavior: 'smooth' }}
            >
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white sticky top-0">
                  <tr className="border-b border-gray-200">
                    <th scope="col" className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider bg-white">
                      <input
                        type="checkbox"
                        checked={allProfiles.length > 0 && selectedMembers.length === allProfiles.length}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </th>
                    <th scope="col" className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider bg-white">
                      S.No
                    </th>
                    <th scope="col" className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider bg-white">
                      M-ID
                    </th>
                    <th scope="col" className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider bg-white">
                      Name
                    </th>
                    <th scope="col" className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider bg-white">
                      Phone
                    </th>
                    <th scope="col" className="px-3 lg:px-6 py-3 lg:py-4 text-center text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider bg-white">
                      Notes
                    </th>
                    <th scope="col" className="px-3 lg:px-6 py-3 lg:py-4 text-center text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider bg-white">
                      Medical History
                    </th>
                    <th scope="col" className="px-3 lg:px-6 py-3 lg:py-4 text-center text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider bg-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allProfiles.map((profile, index) => (
                    <tr 
                      key={profile._id} 
                      className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                        profile.isSubprofile ? 'bg-blue-50/30' : ''
                      }`}
                      onClick={() => setSelectedMember(profile)}
                    >
                      <td 
                        className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={selectedMembers.includes(profile._id)}
                          onChange={(e) => handleCheckboxChange(profile._id)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-sm">
                        {index + 1}
                      </td>
                      <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-sm">
                        {profile.memberId || 'N/A'}
                      </td>
                      <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">
                            {formatMemberName(profile)}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-sm">
                        {formatMemberPhone(profile)}
                      </td>
                      <td 
                        className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Notes 
                          member={profile}
                          onEditNote={onEditNote}
                          onDeleteNote={onDeleteNote}
                          showCount={false}
                        />
                      </td>
                      <td 
                        className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={(e) => handleViewMedicalHistory(e, profile)}
                            className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                            title="View Medical History"
                          >
                            <FaEye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => handleAddMedicalHistory(e, profile)}
                            className="p-1.5 text-green-500 hover:bg-green-50 rounded-full transition-colors"
                            title="Add Medical History"
                          >
                            <FaPlus className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td 
                        className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button 
                          onClick={(e) => handleDownloadMembershipCard(e, profile._id)}
                          className="text-blue-500 hover:text-blue-700 transition-colors disabled:opacity-50"
                          disabled={downloadingIds.has(profile._id)}
                        >
                          {downloadingIds.has(profile._id) ? (
                            <FaSpinner className="w-4 h-4 lg:w-5 lg:h-5 inline animate-spin" />
                          ) : (
                            <FaDownload className="w-4 h-4 lg:w-5 lg:h-5 inline" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {loading && (
                <div className="flex justify-center items-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Medical History Modals */}
      {showViewMedicalHistory && (
        <MedicalHistoryList
          member={selectedMemberForHistory}
          onClose={() => setShowViewMedicalHistory(false)}
        />
      )}

      {showAddMedicalHistory && (
        <AddMedicalHistory
          member={selectedMemberForHistory}
          onClose={() => setShowAddMedicalHistory(false)}
          onSave={handleSaveMedicalHistory}
        />
      )}
    </div>
  );
};

export default MembersList; 