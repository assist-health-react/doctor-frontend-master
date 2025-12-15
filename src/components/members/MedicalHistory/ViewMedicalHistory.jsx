import React, { useState, useEffect } from 'react';
import {
  FaUser, FaUserMd, FaMedkit, FaUsers, FaPills, FaCalendar,
  FaHeartbeat, FaSyringe, FaVial, FaExclamationTriangle,
  FaNotesMedical, FaShieldAlt, FaBuilding, FaIdCard,
  FaDownload, FaTimes, FaEdit, FaTrash, FaPhone,
  FaEnvelope, FaRulerVertical, FaWeight, FaUserCircle,
  FaVenusMars, FaTint, FaPrescription, FaClock,
  FaClipboard, FaInfoCircle, FaComment, FaStethoscope,
  FaHospital, FaFile, FaFilePdf, FaFileImage, FaFileAlt
} from 'react-icons/fa';
import html2pdf from 'html2pdf.js';
import { medicalHistoryService } from '../../../services/medicalHistoryService';
import AddMedicalHistory from './AddMedicalHistory';
import { toast } from 'react-hot-toast';

const ViewMedicalHistory = ({ member, onClose, initialData, onDelete }) => {
  const [selectedSections, setSelectedSections] = useState({
    memberDetails: true,
    primaryCarePhysician: false,
    treatingDoctors: false,
    followUps: false,
    previousConditions: false,
    surgeries: false,
    allergies: false,
    currentMedications: false,
    familyHistory: false,
    immunizationHistory: false,
    medicalTestResults: false,
    currentSymptoms: false,
    lifestyleHabits: false,
    healthInsurance: false
  });

  const [medicalHistory, setMedicalHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchMedicalHistory = async () => {
    try {
      setLoading(true);
      if (!initialData?._id || !member?._id) {
        throw new Error('Missing required data to fetch medical history');
      }
      const response = await medicalHistoryService.getMedicalHistoryById(initialData._id, member._id || member.id);
      
      if (response.status === 'success' && response.data) {
        const mappedData = {
          medicalReports: response.data.medicalReports || [],
          treatingDoctors: response.data.treatingDoctors || [],
          followUps: response.data.followUps || [],
          familyHistory: response.data.familyHistory || [],
          allergies: response.data.allergies || [],
          currentMedications: response.data.currentMedications || [],
          surgeries: response.data.surgeries || [],
          previousMedicalConditions: response.data.previousMedicalConditions || [],
          immunizations: response.data.immunizations || [],
          medicalTestResults: response.data.medicalTestResults || [],
          currentSymptoms: response.data.currentSymptoms || [],
          healthInsurance: response.data.healthInsurance || [],
          lifestyleHabits: response.data.lifestyleHabits || {
            smoking: 'never',
            alcoholConsumption: 'never',
            exercise: 'never'
          },
          updatedAt: response.data.updatedAt,
          createdAt: response.data.createdAt
        };
        setMedicalHistory(mappedData);
      } else {
        throw new Error('Invalid response structure from API');
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching medical history:', err);
      setError(err.message || 'Failed to fetch medical history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (member?._id && initialData?._id) {
      fetchMedicalHistory();
    }
  }, [member, initialData]);

  // Merge medical history data with member data for display
  const displayData = {
    ...medicalHistory,
    member: member || {}
  };

  const handleEdit = () => {
    console.log('Edit button clicked');
    console.log('Current medical history:', medicalHistory);
    console.log('Member data:', member);
    setIsEditMode(true);
  };

  const handleSave = async (updatedData) => {
    try {
      console.log('Saving updated data:', updatedData);
      await medicalHistoryService.updateMedicalHistory(initialData._id, member._id || member.id, updatedData);
      await fetchMedicalHistory(); // Refresh the data after saving
      setIsEditMode(false);
      toast.success('Medical history updated successfully');
    } catch (error) {
      console.error('Error updating medical history:', error);
      toast.error(error.message || 'Failed to update medical history');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this medical history?')) {
      try {
        await medicalHistoryService.deleteMedicalHistory(initialData._id, member._id || member.id);
        toast.success('Medical history deleted successfully');
        if (onDelete) {
          onDelete(); // Call the onDelete callback if provided
        } else {
          onClose(); // Fallback to onClose if onDelete is not provided
        }
      } catch (error) {
        console.error('Error deleting medical history:', error);
        toast.error(error.message || 'Failed to delete medical history');
      }
    }
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FaFilePdf className="text-red-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <FaFileImage className="text-blue-500" />;
      default:
        return <FaFileAlt className="text-gray-500" />;
    }
  };

  const handleFileDownload = (fileUrl) => {
    // Open the file URL directly in a new tab instead of making an API call
    window.open(fileUrl, '_blank');
  };

  if (!member) {
    return null;
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl">
          <p className="text-red-500">{error}</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return dateString;
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Not available';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const handleSectionToggle = (section) => {
    setSelectedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleDownloadPDF = () => {
    const content = document.createElement('div');
    content.className = 'pdf-content';

    // Add header
    const header = document.createElement('div');
    header.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="/logo.png" alt="AssistHealth Logo" style="height: 60px; margin-bottom: 10px;" />
        <h1 style="color: #1a365d; margin: 0;">Medical History Report</h1>
        <p style="color: #4a5568; margin: 5px 0;">Generated on: ${new Date().toLocaleDateString()}</p>
      </div>
    `;
    content.appendChild(header);

    // Add selected sections
    if (selectedSections.memberDetails) {
      const memberDetails = document.createElement('div');
      memberDetails.innerHTML = `
        <div style="margin-bottom: 20px;">
          <h2 style="color: #2b6cb0; border-bottom: 2px solid #2b6cb0; padding-bottom: 5px;">Member Details</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
            <p><strong>Name:</strong> ${member.name}</p>
            <p><strong>ID:</strong> ${member.id}</p>
            <p><strong>Date of Birth:</strong> ${member.dob || 'N/A'}</p>
            <p><strong>Blood Group:</strong> ${member.bloodGroup || 'N/A'}</p>
          </div>
        </div>
      `;
      content.appendChild(memberDetails);
    }

    if (selectedSections.primaryCarePhysician && displayData.primaryCarePhysician) {
      const pcpSection = document.createElement('div');
      pcpSection.innerHTML = `
        <div style="margin-bottom: 20px;">
          <h2 style="color: #2b6cb0; border-bottom: 2px solid #2b6cb0; padding-bottom: 5px;">Primary Care Physician</h2>
          <div style="margin-top: 10px;">
            <p><strong>Name:</strong> ${displayData.primaryCarePhysician.name || 'N/A'}</p>
            <p><strong>Contact:</strong> ${displayData.primaryCarePhysician.contactNumber || 'N/A'}</p>
          </div>
        </div>
      `;
      content.appendChild(pcpSection);
    }

    if (selectedSections.currentMedications && displayData.currentMedications?.length > 0) {
      const medicationsSection = document.createElement('div');
      medicationsSection.innerHTML = `
        <div style="margin-bottom: 20px;">
          <h2 style="color: #2b6cb0; border-bottom: 2px solid #2b6cb0; padding-bottom: 5px;">Current Medications</h2>
          <div style="margin-top: 10px;">
            ${displayData.currentMedications.map(med => `
              <div style="margin-bottom: 10px; padding: 10px; background-color: #f7fafc; border-radius: 4px;">
                <p><strong>Medication:</strong> ${med.name}</p>
                <p><strong>Dosage:</strong> ${med.dosage}</p>
                <p><strong>Frequency:</strong> ${med.frequency}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      content.appendChild(medicationsSection);
    }

    if (selectedSections.allergies && displayData.allergies?.length > 0) {
      const allergiesSection = document.createElement('div');
      allergiesSection.innerHTML = `
        <div style="margin-bottom: 20px;">
          <h2 style="color: #2b6cb0; border-bottom: 2px solid #2b6cb0; padding-bottom: 5px;">Allergies</h2>
          <div style="margin-top: 10px;">
            ${displayData.allergies.map(allergy => `
              <div style="margin-bottom: 10px; padding: 10px; background-color: #fff3e0; border-radius: 4px;">
                <p><strong>Type:</strong> ${allergy.type}</p>
                <p><strong>Description:</strong> ${allergy.description}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      content.appendChild(allergiesSection);
    }

    if (selectedSections.immunizationHistory && displayData.immunizationHistory?.length > 0) {
      const immunizationsSection = document.createElement('div');
      immunizationsSection.innerHTML = `
        <div style="margin-bottom: 20px;">
          <h2 style="color: #2b6cb0; border-bottom: 2px solid #2b6cb0; padding-bottom: 5px;">Immunization History</h2>
          <div style="margin-top: 10px;">
            ${displayData.immunizationHistory.map(immunization => `
              <div style="margin-bottom: 10px; padding: 10px; background-color: #f7fafc; border-radius: 4px;">
                <p><strong>Vaccination:</strong> ${immunization.vaccination}</p>
                <p><strong>Date Received:</strong> ${formatDate(immunization.dateReceived)}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      content.appendChild(immunizationsSection);
    }

    // Configure PDF options
    const options = {
      margin: [10, 10],
      filename: `medical_history_${member.id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Generate PDF
    html2pdf().from(content).set(options).save();
  };

  // Section Header Component
  const SectionHeader = ({ title, icon: Icon, section, bgColor, textColor, borderColor }) => (
    <div className={`px-6 py-4 ${bgColor} border-b ${borderColor} flex justify-between items-center`}>
      <h3 className={`text-lg font-semibold ${textColor} flex items-center gap-2`}>
        {Icon}
        {title}
      </h3>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={selectedSections[section]}
          onChange={() => handleSectionToggle(section)}
          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  // Add the DetailRow component
  const DetailRow = ({ icon, label, value }) => (
    <div className="flex items-center">
      <span className="w-8">{icon}</span>
      <span className="font-medium text-gray-600 mr-2">{label}:</span>
      <span className="text-gray-800">{value || 'N/A'}</span>
    </div>
  );

  return (
    <>
      {isEditMode ? (
        <AddMedicalHistory
          member={member}
          onClose={() => setIsEditMode(false)}
          onSave={handleSave}
          initialData={{ ...medicalHistory, _id: initialData._id }}
          isEdit={true}
        />
      ) : (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-100 rounded-xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b flex flex-col gap-2 sticky top-0 z-10 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FaNotesMedical className="text-primary-600" />
                Medical History
              </h2>
              <p className="text-gray-600 mt-1">Patient: {member?.name || 'N/A'}</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleEdit}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit"
              >
                <FaEdit />
              </button>
              <button 
                onClick={handleDownloadPDF}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <FaDownload />
                Download Selected
              </button>
              <button 
                onClick={handleDelete}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <FaTrash />
              </button>
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <FaTimes className="text-gray-500 text-xl" />
              </button>
            </div>
          </div>
          {/* Last Updated Timestamp */}
          <div className="flex items-center text-sm text-gray-500">
            <FaClock className="w-4 h-4 mr-2" />
            Last Updated: {formatDateTime(medicalHistory?.updatedAt)}
          </div>
        </div>

        {/* Content */}
        <div id="medical-history-content" className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Member Details */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <SectionHeader
                  title="Member Details"
                  icon={<FaUser className="text-blue-600" />}
                  section="memberDetails"
                  bgColor="bg-blue-50"
                  textColor="text-blue-800"
                  borderColor="border-blue-100"
                />
                <div className="p-6">
                  {/* Profile Photo and Basic Info */}
                  <div className="flex items-center pb-6 mb-6 border-b border-gray-200">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      {member?.profilePhoto ? (
                        <img
                          src={member.profilePhoto}
                          alt={member.name}
                          className="w-full h-full rounded-full object-cover border-4 border-blue-100"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-blue-50 border-4 border-blue-100 flex items-center justify-center">
                          <FaUserCircle className="w-16 h-16 text-blue-300" />
                        </div>
                      )}
                    </div>
                    <div className="ml-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-1">{member.name}</h3>
                      <p className="text-gray-500 mb-2">ID: {member.id}</p>
                      <div className="flex items-center gap-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                          <FaTint className="mr-1" /> {member.bloodGroup || 'N/A'}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-50 text-gray-700">
                          <FaVenusMars className="mr-1" /> {member.gender || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Member Information Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500 mb-3">Contact Information</h4>
                      <div className="space-y-3">
                        <DetailRow icon={<FaEnvelope className="text-blue-500" />} label="Email" value={member.email} />
                        <DetailRow icon={<FaPhone className="text-blue-500" />} label="Phone" value={member.phone} />
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500 mb-3">Physical Details</h4>
                      <div className="space-y-3">
                        <DetailRow icon={<FaRulerVertical className="text-blue-500" />} label="Height" value={member.height ? `${member.height} cm` : 'N/A'} />
                        <DetailRow icon={<FaWeight className="text-blue-500" />} label="Weight" value={member.weight ? `${member.weight} kg` : 'N/A'} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Primary Care Physician */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <SectionHeader
                  title="Primary Care Physician"
                  icon={<FaUserMd className="text-green-600" />}
                  section="primaryCarePhysician"
                  bgColor="bg-green-50"
                  textColor="text-green-800"
                  borderColor="border-green-100"
                />
                <div className="p-6">
                  <div className="bg-green-50 rounded-lg border border-green-100 p-4">
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaUserMd className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="ml-4 flex-1">
                        <h4 className="text-lg font-medium text-gray-800">
                          {displayData.primaryCarePhysician?.name || 'No physician assigned'}
                        </h4>
                        <p className="text-sm text-gray-500 mb-3">Primary Healthcare Provider</p>
                        {displayData.primaryCarePhysician?.contactNumber && (
                          <div className="flex items-center text-sm text-gray-600">
                            <FaPhone className="w-4 h-4 text-green-500 mr-2" />
                            {displayData.primaryCarePhysician.contactNumber}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Treating Doctors */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <SectionHeader
                  title="Treating Doctors"
                  icon={<FaUserMd className="text-blue-600" />}
                  section="treatingDoctors"
                  bgColor="bg-blue-50"
                  textColor="text-blue-800"
                  borderColor="border-blue-100"
                />
                <div className="p-6">
                  <div className="space-y-4">
                    {(displayData.treatingDoctors || []).map((doctor, index) => (
                      <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="grid grid-cols-1 gap-3">
                          <DetailRow icon={<FaUserMd className="text-blue-500" />} label="Doctor Name" value={doctor.name} />
                          <DetailRow icon={<FaHospital className="text-blue-500" />} label="Hospital" value={doctor.hospitalName} />
                          <DetailRow icon={<FaStethoscope className="text-blue-500" />} label="Speciality" value={doctor.speciality} />
                        </div>
                      </div>
                    ))}
                    {(!displayData.treatingDoctors || displayData.treatingDoctors.length === 0) && (
                      <p className="text-gray-500 italic">No treating doctors recorded</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Surgeries */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <SectionHeader
                  title="Surgeries"
                  icon={<FaMedkit className="text-red-600" />}
                  section="surgeries"
                  bgColor="bg-red-50"
                  textColor="text-red-800"
                  borderColor="border-red-100"
                />
                <div className="p-6">
                  <div className="space-y-4">
                    {(displayData.surgeries || []).map((surgery, index) => (
                      <div key={index} className="p-4 bg-red-50 rounded-lg border border-red-100">
                        <div className="grid grid-cols-1 gap-3">
                          <DetailRow icon={<FaMedkit className="text-red-500" />} label="Procedure" value={surgery.procedure} />
                          <DetailRow icon={<FaCalendar className="text-red-500" />} label="Date" value={formatDate(surgery.date)} />
                          <DetailRow icon={<FaUserMd className="text-red-500" />} label="Surgeon" value={surgery.surgeonName} />
                        </div>
                      </div>
                    ))}
                    {(!displayData.surgeries || displayData.surgeries.length === 0) && (
                      <p className="text-gray-500 italic">No surgeries recorded</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Family History */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <SectionHeader
                  title="Family History"
                  icon={<FaUsers className="text-purple-600" />}
                  section="familyHistory"
                  bgColor="bg-purple-50"
                  textColor="text-purple-800"
                  borderColor="border-purple-100"
                />
                <div className="p-6">
                  <div className="space-y-4">
                    {(displayData.familyHistory || []).map((history, index) => (
                      <div key={index} className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                        <div className="grid grid-cols-1 gap-3">
                          <DetailRow icon={<FaHeartbeat className="text-purple-500" />} label="Condition" value={history.condition} />
                          <DetailRow icon={<FaUsers className="text-purple-500" />} label="Relationship" value={history.relationship} />
                        </div>
                      </div>
                    ))}
                    {(!displayData.familyHistory || displayData.familyHistory.length === 0) && (
                      <p className="text-gray-500 italic">No family history recorded</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Current Medications */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <SectionHeader
                  title="Current Medications"
                  icon={<FaPills className="text-green-600" />}
                  section="currentMedications"
                  bgColor="bg-green-50"
                  textColor="text-green-800"
                  borderColor="border-green-100"
                />
                <div className="p-6">
                  <div className="space-y-4">
                    {(displayData.currentMedications || []).map((medication, index) => (
                      <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-100">
                        <div className="grid grid-cols-1 gap-3">
                          <DetailRow icon={<FaPills className="text-green-500" />} label="Medication" value={medication.name} />
                          <DetailRow icon={<FaPrescription className="text-green-500" />} label="Dosage" value={medication.dosage} />
                          <DetailRow icon={<FaClock className="text-green-500" />} label="Frequency" value={medication.frequency} />
                        </div>
                      </div>
                    ))}
                    {(!displayData.currentMedications || displayData.currentMedications.length === 0) && (
                      <p className="text-gray-500 italic">No current medications recorded</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Follow Ups */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <SectionHeader
                  title="Upcoming Follow-ups"
                  icon={<FaCalendar className="text-purple-600" />}
                  section="followUps"
                  bgColor="bg-purple-50"
                  textColor="text-purple-800"
                  borderColor="border-purple-100"
                />
                <div className="p-6">
                  <div className="space-y-4">
                    {(displayData.followUps || []).map((followUp, index) => (
                      <div key={index} className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                        <div className="grid grid-cols-1 gap-3">
                          <DetailRow icon={<FaCalendar className="text-purple-500" />} label="Date" value={formatDate(followUp.date)} />
                          <DetailRow icon={<FaUserMd className="text-purple-500" />} label="Specialist" value={followUp.specialistDetails} />
                          <DetailRow icon={<FaClipboard className="text-purple-500" />} label="Remarks" value={followUp.remarks} />
                        </div>
                      </div>
                    ))}
                    {(!displayData.followUps || displayData.followUps.length === 0) && (
                      <p className="text-gray-500 italic">No follow-ups scheduled</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Previous Medical Conditions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <SectionHeader
                  title="Previous Medical Conditions"
                  icon={<FaHeartbeat className="text-red-600" />}
                  section="previousMedicalConditions"
                  bgColor="bg-red-50"
                  textColor="text-red-800"
                  borderColor="border-red-100"
                />
                <div className="p-6">
                  <div className="space-y-4">
                    {(displayData.previousMedicalConditions || []).map((condition, index) => (
                      <div key={index} className="p-4 bg-red-50 rounded-lg border border-red-100">
                        <div className="grid grid-cols-1 gap-3">
                          <DetailRow icon={<FaHeartbeat className="text-red-500" />} label="Condition" value={condition.condition} />
                          <DetailRow icon={<FaCalendar className="text-red-500" />} label="Diagnosed At" value={formatDate(condition.diagnosedAt)} />
                          <DetailRow icon={<FaMedkit className="text-red-500" />} label="Treatment" value={condition.treatmentReceived} />
                          <DetailRow icon={<FaClipboard className="text-red-500" />} label="Notes" value={condition.notes} />
                          <DetailRow icon={<FaInfoCircle className="text-red-500" />} label="Status" value={condition.status} />
                        </div>
                      </div>
                    ))}
                    {(!displayData.previousMedicalConditions || displayData.previousMedicalConditions.length === 0) && (
                      <p className="text-gray-500 italic">No previous conditions recorded</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Immunization History */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <SectionHeader
                  title="Immunization History"
                  icon={<FaSyringe className="text-indigo-600" />}
                  section="immunizations"
                  bgColor="bg-indigo-50"
                  textColor="text-indigo-800"
                  borderColor="border-indigo-100"
                />
                <div className="p-6">
                  <div className="space-y-4">
                    {(displayData.immunizations || []).map((immunization, index) => (
                      <div key={index} className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                        <div className="grid grid-cols-1 gap-3">
                          <DetailRow icon={<FaSyringe className="text-indigo-500" />} label="Vaccine" value={immunization.vaccine} />
                          <DetailRow icon={<FaCalendar className="text-indigo-500" />} label="Date" value={formatDate(immunization.date)} />
                        </div>
                      </div>
                    ))}
                    {(!displayData.immunizations || displayData.immunizations.length === 0) && (
                      <p className="text-gray-500 italic">No immunization history recorded</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Test Results */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <SectionHeader
                  title="Medical Test Results"
                  icon={<FaVial className="text-teal-600" />}
                  section="medicalTestResults"
                  bgColor="bg-teal-50"
                  textColor="text-teal-800"
                  borderColor="border-teal-100"
                />
                <div className="p-6">
                  <div className="space-y-4">
                    {(displayData.medicalTestResults || []).map((test, index) => (
                      <div key={index} className="p-4 bg-teal-50 rounded-lg border border-teal-100">
                        <div className="grid grid-cols-1 gap-3">
                          <DetailRow icon={<FaVial className="text-teal-500" />} label="Test" value={test.name} />
                          <DetailRow icon={<FaCalendar className="text-teal-500" />} label="Date" value={formatDate(test.date)} />
                          <DetailRow icon={<FaClipboard className="text-teal-500" />} label="Results" value={test.results} />
                        </div>
                      </div>
                    ))}
                    {(!displayData.medicalTestResults || displayData.medicalTestResults.length === 0) && (
                      <p className="text-gray-500 italic">No test results recorded</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Lifestyle Habits */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <SectionHeader
                  title="Lifestyle Habits"
                  icon={<FaHeartbeat className="text-purple-600" />}
                  section="lifestyleHabits"
                  bgColor="bg-purple-50"
                  textColor="text-purple-800"
                  borderColor="border-purple-100"
                />
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                      <div className="grid grid-cols-1 gap-3">
                        <DetailRow 
                          icon={<FaHeartbeat className="text-purple-500" />} 
                          label="Smoking" 
                          value={displayData.lifestyleHabits?.smoking?.charAt(0).toUpperCase() + displayData.lifestyleHabits?.smoking?.slice(1) || 'Not specified'} 
                        />
                        <DetailRow 
                          icon={<FaHeartbeat className="text-purple-500" />} 
                          label="Alcohol Consumption" 
                          value={displayData.lifestyleHabits?.alcoholConsumption?.charAt(0).toUpperCase() + displayData.lifestyleHabits?.alcoholConsumption?.slice(1) || 'Not specified'} 
                        />
                        <DetailRow 
                          icon={<FaHeartbeat className="text-purple-500" />} 
                          label="Exercise" 
                          value={displayData.lifestyleHabits?.exercise?.charAt(0).toUpperCase() + displayData.lifestyleHabits?.exercise?.slice(1) || 'Not specified'} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Health Insurance */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <SectionHeader
                  title="Health Insurance"
                  icon={<FaShieldAlt className="text-green-600" />}
                  section="healthInsurance"
                  bgColor="bg-green-50"
                  textColor="text-green-800"
                  borderColor="border-green-100"
                />
                <div className="p-6">
                  <div className="space-y-4">
                    {(displayData.healthInsurance || []).map((insurance, index) => (
                      <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-100">
                      <div className="grid grid-cols-1 gap-3">
                          <DetailRow icon={<FaBuilding className="text-green-500" />} label="Provider" value={insurance.provider} />
                          <DetailRow icon={<FaIdCard className="text-green-500" />} label="Policy Number" value={insurance.policyNumber} />
                          <DetailRow icon={<FaCalendar className="text-green-500" />} label="Expiry Date" value={formatDate(insurance.expiryDate)} />
                        </div>
                      </div>
                    ))}
                    {(!displayData.healthInsurance || displayData.healthInsurance.length === 0) && (
                      <p className="text-gray-500 italic">No health insurance recorded</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Allergies */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <SectionHeader
                  title="Allergies"
                  icon={<FaExclamationTriangle className="text-yellow-600" />}
                  section="allergies"
                  bgColor="bg-yellow-50"
                  textColor="text-yellow-800"
                  borderColor="border-yellow-100"
                />
                <div className="p-6">
                  <div className="space-y-4">
                    {(displayData.allergies || []).map((allergy, index) => (
                      <div key={index} className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                        <div className="grid grid-cols-1 gap-3">
                          <DetailRow icon={<FaPills className="text-yellow-500" />} label="Medications" value={allergy.medications} />
                          <DetailRow icon={<FaExclamationTriangle className="text-yellow-500" />} label="Food" value={allergy.food} />
                          <DetailRow icon={<FaInfoCircle className="text-yellow-500" />} label="Other" value={allergy.other} />
                        </div>
                      </div>
                    ))}
                    {(!displayData.allergies || displayData.allergies.length === 0) && (
                      <p className="text-gray-500 italic">No allergies recorded</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Current Symptoms & Concerns */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <SectionHeader
                  title="Current Symptoms & Concerns"
                  icon={<FaNotesMedical className="text-teal-600" />}
                  section="currentSymptoms"
                  bgColor="bg-teal-50"
                  textColor="text-teal-800"
                  borderColor="border-teal-100"
                />
                <div className="p-6">
                  <div className="space-y-4">
                    {(displayData.currentSymptoms || []).map((symptom, index) => (
                      <div key={index} className="p-4 bg-teal-50 rounded-lg border border-teal-100">
                        <div className="grid grid-cols-1 gap-3">
                          <DetailRow icon={<FaNotesMedical className="text-teal-500" />} label="Symptom" value={symptom.symptom} />
                          <DetailRow icon={<FaComment className="text-teal-500" />} label="Concerns" value={symptom.concerns} />
                        </div>
                      </div>
                    ))}
                    {(!displayData.currentSymptoms || displayData.currentSymptoms.length === 0) && (
                      <p className="text-gray-500 italic">No current symptoms recorded</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Medical Reports Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <SectionHeader
                  title="Medical Reports"
                  icon={<FaFile className="text-blue-600" />}
                  section="medicalReports"
                  bgColor="bg-blue-50"
                  textColor="text-blue-800"
                  borderColor="border-blue-100"
                />
                <div className="p-6">
                  {(!displayData.medicalReports || displayData.medicalReports.length === 0) ? (
                    <div className="text-center py-8">
                      <div className="flex justify-center mb-4">
                        <FaFile className="w-12 h-12 text-gray-300" />
                      </div>
                      <h3 className="text-gray-500 text-lg font-medium mb-2">No Medical Reports</h3>
                      <p className="text-gray-400 text-sm">
                        No medical reports have been uploaded yet
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {displayData.medicalReports.map((report, index) => (
                        <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {report.files && report.files.map((file, fileIndex) => {
                                const fileName = file.split('/').pop();
                                return (
                                  <div key={fileIndex} className="flex items-center">
                                    <div className="flex items-center space-x-2">
                                      {getFileIcon(fileName)}
                                      <span className="text-sm text-gray-600">{report.name}</span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            <div className="flex items-center space-x-2">
                              {report.files && report.files.map((file, fileIndex) => (
                                <button
                                  key={fileIndex}
                                  onClick={() => handleFileDownload(file)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                  title="Download"
                                >
                                  <FaDownload className="w-4 h-4" />
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      )}
    </>
  );
};

export default ViewMedicalHistory;