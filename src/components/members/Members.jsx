import { useState } from 'react';
import MembersList from './MembersList';
import ViewMedicalHistory from './MedicalHistory/ViewMedicalHistory';
import AddMedicalHistory from './MedicalHistory/AddMedicalHistory';

const Members = () => {
  // States for member list management
  const [members, setMembers] = useState([]); // Your members data
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);

  // States for sub-profiles
  const [showSubProfiles, setShowSubProfiles] = useState(false);
  const [selectedMemberForView, setSelectedMemberForView] = useState(null);

  // States for medical history view
  const [showViewMedicalHistory, setShowViewMedicalHistory] = useState(false);
  const [selectedMemberForMedicalHistory, setSelectedMemberForMedicalHistory] = useState(null);

  // States for medical history add
  const [showAddMedicalHistory, setShowAddMedicalHistory] = useState(false);
  const [selectedMemberForAddMedicalHistory, setSelectedMemberForAddMedicalHistory] = useState(null);

  // Handlers for member list
  const handleCheckboxChange = (memberId) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSelectAll = () => {
    setSelectedMembers(
      selectedMembers.length === members.length
        ? []
        : members.map(member => member.id)
    );
  };

  const handleDownloadId = (memberId) => {
    // Handle ID card download
    console.log('Downloading ID for member:', memberId);
  };

  // Handler for medical history save
  const handleSaveMedicalHistory = (data) => {
    // Handle saving medical history data
    console.log('Saving medical history:', data);
    setShowAddMedicalHistory(false);
    setSelectedMemberForAddMedicalHistory(null);
  };

  return (
    <div>
      {/* Members List Component */}
      <MembersList
        members={members}
        selectedMembers={selectedMembers}
        handleCheckboxChange={handleCheckboxChange}
        handleSelectAll={handleSelectAll}
        setSelectedMember={setSelectedMember}
        setShowSubProfiles={setShowSubProfiles}
        setSelectedMemberForView={setSelectedMemberForView}
        // Medical History View props
        showViewMedicalHistory={showViewMedicalHistory}
        selectedMemberForMedicalHistory={selectedMemberForMedicalHistory}
        setShowViewMedicalHistory={setShowViewMedicalHistory}
        setSelectedMemberForMedicalHistory={setSelectedMemberForMedicalHistory}
        // Medical History Add props
        showAddMedicalHistory={showAddMedicalHistory}
        selectedMemberForAddMedicalHistory={selectedMemberForAddMedicalHistory}
        setShowAddMedicalHistory={setShowAddMedicalHistory}
        setSelectedMemberForAddMedicalHistory={setSelectedMemberForAddMedicalHistory}
        handleDownloadId={handleDownloadId}
      />

      {/* View Medical History Modal */}
      {showViewMedicalHistory && selectedMemberForMedicalHistory && (
        <ViewMedicalHistory
          member={selectedMemberForMedicalHistory}
          onClose={() => {
            setShowViewMedicalHistory(false);
            setSelectedMemberForMedicalHistory(null);
          }}
        />
      )}

      {/* Add Medical History Modal */}
      {showAddMedicalHistory && selectedMemberForAddMedicalHistory && (
        <AddMedicalHistory
          member={selectedMemberForAddMedicalHistory}
          onClose={() => {
            setShowAddMedicalHistory(false);
            setSelectedMemberForAddMedicalHistory(null);
          }}
          onSave={handleSaveMedicalHistory}
        />
      )}
    </div>
  );
};

export default Members; 