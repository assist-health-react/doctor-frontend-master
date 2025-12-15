import { useState, useEffect } from 'react';
import { FaTimes, FaPlus } from 'react-icons/fa';
import MemberBasicInfo from './MemberBasicInfo';
import PrimaryCarePhysician from './PrimaryCarePhysician';
import MedicalHistorySection from './MedicalHistorySection';
import DynamicSection from './DynamicSection';
import { UploadSection } from './CommonComponents';
import { medicalHistoryService } from '../../../../services/medicalHistoryService';
import { uploadMedia } from '../../../../services/mediaService';
import { toast } from 'react-toastify';

const AddMedicalHistory = ({ member, onClose, onSave, initialData, isEdit = false }) => {
  const [formData, setFormData] = useState({
    primaryCarePhysician: {
      name: 'Dr. John Smith',
      contactNumber: '+91 98765-43210'
    },
    medicalHistory: [{
      condition: '',
      diagnosisDate: '',
      treatment: '',
      status: 'active',
      notes: ''
    }],
    treatingDoctors: [{
      name: '',
      hospitalName: '',
      speciality: ''
    }],
    followUps: [{
      date: '',
      specialistDetails: '',
      remarks: ''
    }],
    previousConditions: [{
      condition: '',
      diagnosedAt: new Date().toISOString().split('T')[0],
      treatmentReceived: '',
      notes: '',
      status: 'active'
    }],
    surgeries: [{
      procedure: '',
      date: new Date().toISOString().split('T')[0],
      surgeonName: ''
    }],
    allergies: [{
      medications: '',
      food: '',
      other: ''
    }],
    currentMedications: [{
      name: '',
      dosage: '',
      frequency: ''
    }],
    familyHistory: [{
      condition: '',
      relationship: 'father'
    }],
    immunizationHistory: [{
      vaccination: '',
      dateReceived: new Date().toISOString().split('T')[0]
    }],
    medicalTestResults: [{
      name: '',
      date: new Date().toISOString().split('T')[0],
      results: ''
    }],
    currentSymptoms: [{
      symptom: '',
      concerns: ''
    }],
    lifestyleHabits: {
      smoking: 'never',
      alcoholConsumption: 'never',
      exercise: 'never'
    },
    healthInsurance: {
      provider: '',
      policyNumber: '',
      expiryDate: new Date().toISOString().split('T')[0]
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [uploads, setUploads] = useState([
    { title: '', fileUrl: null, localFile: null, error: '', isUploading: false }
  ]);

  // Initialize form data with existing data in edit mode
  useEffect(() => {
    if (isEdit && initialData) {
      console.log('Initializing form data in edit mode:', { isEdit, initialData });
      const mappedData = {
        primaryCarePhysician: initialData.primaryCarePhysician || formData.primaryCarePhysician,
        medicalHistory: initialData.previousMedicalConditions?.length > 0 
          ? initialData.previousMedicalConditions.map(({ _id, ...rest }) => ({
              condition: rest.condition || '',
              diagnosisDate: rest.diagnosedAt || '',
              treatment: rest.treatmentReceived || '',
              status: rest.status || 'active',
              notes: rest.notes || ''
            }))
          : formData.medicalHistory,
        treatingDoctors: initialData.treatingDoctors?.length > 0 
          ? initialData.treatingDoctors.map(({ _id, ...rest }) => ({
              name: rest.name || '',
              hospitalName: rest.hospitalName || '',
              speciality: rest.speciality || ''
            }))
          : formData.treatingDoctors,
        followUps: initialData.followUps?.length > 0 
          ? initialData.followUps.map(({ _id, ...rest }) => ({
              date: rest.date?.split('T')[0] || '',
              specialistDetails: rest.specialistDetails || '',
              remarks: rest.remarks || ''
            }))
          : formData.followUps,
        familyHistory: initialData.familyHistory?.length > 0 
          ? initialData.familyHistory.map(({ _id, ...rest }) => ({
              condition: rest.condition || '',
              relationship: rest.relationship || 'father'
            }))
          : formData.familyHistory,
        allergies: initialData.allergies || formData.allergies,
        currentMedications: initialData.currentMedications?.length > 0 
          ? initialData.currentMedications.map(({ _id, ...rest }) => ({
              name: rest.name || '',
              dosage: rest.dosage || '',
              frequency: rest.frequency || ''
            }))
          : formData.currentMedications,
        surgeries: initialData.surgeries?.length > 0 
          ? initialData.surgeries.map(({ _id, ...rest }) => ({
              procedure: rest.procedure || '',
              date: rest.date?.split('T')[0] || '',
              surgeonName: rest.surgeonName || ''
            }))
          : formData.surgeries,
        previousConditions: initialData.previousMedicalConditions?.length > 0 
          ? initialData.previousMedicalConditions.map(({ _id, ...rest }) => ({
              condition: rest.condition || '',
              diagnosedAt: rest.diagnosedAt ? new Date(rest.diagnosedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              treatmentReceived: rest.treatmentReceived || '',
              notes: rest.notes || '',
              status: rest.status || 'active'
            }))
          : formData.previousConditions,
        immunizationHistory: initialData.immunizations?.length > 0 
          ? initialData.immunizations.map(({ _id, ...rest }) => ({
              vaccination: rest.vaccine || '',
              dateReceived: rest.date?.split('T')[0] || ''
            }))
          : formData.immunizationHistory,
        medicalTestResults: initialData.medicalReports?.length > 0
          ? initialData.medicalReports.map(({ _id, ...rest }) => ({
              name: rest.name || '',
              date: new Date().toISOString().split('T')[0],
              results: rest.files?.join(', ') || ''
            }))
          : formData.medicalTestResults,
        currentSymptoms: initialData.currentSymptoms?.length > 0 
          ? initialData.currentSymptoms.map(({ _id, ...rest }) => ({
              symptom: rest.symptom || '',
              concerns: rest.concerns || ''
            }))
          : formData.currentSymptoms,
        lifestyleHabits: initialData.lifestyleHabits 
          ? {
              smoking: ['never', 'occasional', 'daily'].includes(initialData.lifestyleHabits.smoking) 
                ? initialData.lifestyleHabits.smoking 
                : 'never',
              alcoholConsumption: ['never', 'occasional', 'daily'].includes(initialData.lifestyleHabits.alcoholConsumption)
                ? initialData.lifestyleHabits.alcoholConsumption
                : 'never',
              exercise: ['never', 'occasional', 'daily'].includes(initialData.lifestyleHabits.exercise)
                ? initialData.lifestyleHabits.exercise
                : 'never'
            }
          : formData.lifestyleHabits,
        healthInsurance: initialData.healthInsurance?.[0]
          ? {
              provider: initialData.healthInsurance[0].provider || '',
              policyNumber: initialData.healthInsurance[0].policyNumber || '',
              expiryDate: initialData.healthInsurance[0].expiryDate?.split('T')[0] || ''
            }
          : formData.healthInsurance
      };
      console.log('Mapped form data:', mappedData);
      setFormData(mappedData);

      // Initialize uploads if there are medical reports
      if (initialData.medicalReports?.length > 0) {
        const initialUploads = initialData.medicalReports.map(report => ({
          title: report.name || '',
          fileUrl: report.files?.[0] || null,
          localFile: null,
          error: '',
          isUploading: false
        }));
        console.log('Setting initial uploads:', initialUploads);
        setUploads(initialUploads);
      }
    }
  }, [isEdit, initialData]);

  const handleInputChange = (section, field, value, index = null) => {
    setFormData(prev => {
      if (index !== null) {
        const newSection = [...prev[section]];
        newSection[index] = { ...newSection[index], [field]: value };
        return { ...prev, [section]: newSection };
      }
      return { ...prev, [section]: { ...prev[section], [field]: value } };
    });
  };

  const handleAddItem = (section) => {
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], getEmptyItem(section)]
    }));
  };

  const handleRemoveItem = (section, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const getEmptyItem = (section) => {
    const today = new Date().toISOString().split('T')[0];
    switch (section) {
      case 'medicalHistory':
        return { condition: '', diagnosisDate: today, treatment: '', status: 'active', notes: '' };
      case 'allergies':
        return { medications: '', food: '', other: '' };
      case 'treatingDoctors':
        return { name: '', hospitalName: '', speciality: '' };
      case 'followUps':
        return { date: today, specialistDetails: '', remarks: '' };
      case 'previousConditions':
        return { 
          condition: '', 
          diagnosedAt: today,
          treatmentReceived: '', 
          notes: '', 
          status: 'active' 
        };
      case 'surgeries':
        return { procedure: '', date: today, surgeonName: '' };
      case 'currentMedications':
        return { name: '', dosage: '', frequency: '' };
      case 'familyHistory':
        return { condition: '', relationship: 'father' };
      case 'immunizationHistory':
        return { vaccination: '', dateReceived: today };
      case 'medicalTestResults':
        return { name: '', date: today, results: '' };
      case 'currentSymptoms':
        return { symptom: '', concerns: '' };
      default:
        return {};
    }
  };

  const handleUploadTitleChange = (index, title) => {
    setUploads(prev => prev.map((upload, i) => 
      i === index ? { ...upload, title, error: '' } : upload
    ));
  };

  const handleFileSelect = async (index, file) => {
    if (!file) return;

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setUploads(prev => prev.map((upload, i) => 
        i === index ? { ...upload, error: 'File size should be less than 10MB' } : upload
      ));
      return;
    }

    try {
      // Show loading state in the UI
      setUploads(prev => prev.map((upload, i) => 
        i === index ? { ...upload, error: '', isUploading: true } : upload
      ));

      // Upload the file immediately
      const response = await uploadMedia(file);
      
      if (response?.success && response?.imageUrl) {
        setUploads(prev => prev.map((upload, i) => 
          i === index ? { 
            ...upload, 
            fileUrl: response.imageUrl,
            localFile: { name: file.name, type: file.type },
            error: '',
            isUploading: false
          } : upload
        ));
      } else {
        throw new Error('Failed to upload file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploads(prev => prev.map((upload, i) => 
        i === index ? { 
          ...upload, 
          error: 'Failed to upload file. Please try again.',
          isUploading: false
        } : upload
      ));
    }
  };

  const handleAddUpload = () => {
    setUploads(prev => [...prev, { title: '', fileUrl: null, localFile: null, error: '', isUploading: false }]);
  };

  const handleRemoveUpload = (index) => {
    setUploads(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!member?._id && !member?.id) {
      toast.error('Member ID is required');
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('Form submission started:', { isEdit, initialData });
      console.log('Member data:', member);
      console.log('Form data before transform:', formData);

      // Transform the data to match API requirements
      const transformedData = {
        memberId: member._id || member.id,
        medicalReports: uploads
          .filter(upload => upload.title && upload.fileUrl)
          .map(upload => ({
            name: upload.title,
            files: [upload.fileUrl]
          })),
        treatingDoctors: formData.treatingDoctors.map(doctor => ({
          name: doctor.name,
          hospitalName: doctor.hospitalName,
          speciality: doctor.speciality
        })),
        followUps: formData.followUps.map(followUp => ({
          date: followUp.date ? new Date(followUp.date).toISOString() : null,
          specialistDetails: followUp.specialistDetails,
          remarks: followUp.remarks
        })),
        familyHistory: formData.familyHistory.map(history => ({
          condition: history.condition,
          relationship: history.relationship
        })),
        allergies: formData.allergies,
        currentMedications: formData.currentMedications,
        surgeries: formData.surgeries.map(surgery => ({
          procedure: surgery.procedure,
          date: surgery.date ? new Date(surgery.date).toISOString() : null,
          surgeonName: surgery.surgeonName
        })),
        previousMedicalConditions: formData.previousConditions.map(condition => {
          console.log('Processing condition:', condition);
          return {
            condition: condition.condition,
            diagnosedAt: condition.diagnosedAt ? new Date(condition.diagnosedAt).toISOString() : null,
            treatmentReceived: condition.treatmentReceived,
            notes: condition.notes || '',
            status: condition.status
          };
        }),
        immunizations: formData.immunizationHistory.map(immunization => ({
          vaccine: immunization.vaccination,
          date: immunization.dateReceived ? new Date(immunization.dateReceived).toISOString() : null
        })),
        currentSymptoms: formData.currentSymptoms,
        healthInsurance: [{
          provider: formData.healthInsurance.provider,
          policyNumber: formData.healthInsurance.policyNumber,
          expiryDate: formData.healthInsurance.expiryDate ? new Date(formData.healthInsurance.expiryDate).toISOString() : null
        }],
        lifestyleHabits: formData.lifestyleHabits,
        medicalTestResults: formData.medicalTestResults.map(test => ({
          name: test.name,
          date: test.date ? new Date(test.date).toISOString() : null,
          results: test.results
        }))
      };

      console.log('Transformed data:', transformedData);

      // Use the appropriate service method based on mode
      let response;
      if (isEdit) {
        console.log('Updating medical history with:', {
          historyId: initialData._id,
          memberId: member._id || member.id,
          data: transformedData
        });
        response = await medicalHistoryService.updateMedicalHistory(initialData._id, member._id || member.id, transformedData);
        console.log('Update response:', response);
        if (response.status === 'success') {
          toast.success('Medical history updated successfully');
        }
      } else {
        console.log('Creating new medical history:', transformedData);
        response = await medicalHistoryService.createMedicalHistory(transformedData);
        console.log('Create response:', response);
        if (response.status === 'success') {
          toast.success('Medical history created successfully');
        }
      }

      if (response && response.status === 'success') {
        onSave(response.data);
        onClose();
      } else {
        throw new Error(isEdit ? 'Failed to update medical history' : 'Failed to create medical history');
      }
    } catch (error) {
      console.error(isEdit ? 'Error updating medical history:' : 'Error creating medical history:', error);
      toast.error(error.message || (isEdit ? 'Failed to update medical history' : 'Failed to create medical history'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl mx-4 rounded-lg relative min-h-screen md:min-h-0 md:my-8">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-semibold text-gray-800">
            {isEdit ? 'Update Medical History' : 'Create Medical History'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content - Add padding bottom to account for fixed footer */}
        <div className="p-6 pb-24 overflow-y-auto max-h-[calc(100vh-16rem)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Member Details Card */}
            <MemberBasicInfo member={member} />

            {/* Primary Care Physician */}
            <PrimaryCarePhysician data={formData.primaryCarePhysician} />

            {/* Medical History Section */}
            <MedicalHistorySection
              data={formData.medicalHistory}
              handleInputChange={handleInputChange}
              handleAddItem={handleAddItem}
              handleRemoveItem={handleRemoveItem}
            />

            {/* Other sections */}
            {Object.entries(formData).map(([section, data]) => (
              section !== 'primaryCarePhysician' && section !== 'medicalHistory' && (
                <DynamicSection
                  key={section}
                  section={section}
                  data={data}
                  handleInputChange={handleInputChange}
                  handleAddItem={handleAddItem}
                  handleRemoveItem={handleRemoveItem}
                />
              )
            ))}

            {/* Medical Reports Upload Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Medical Reports</h3>
                <button
                  type="button"
                  onClick={handleAddUpload}
                  className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                >
                  <FaPlus className="w-4 h-4 mr-1" />
                  Add Report
                </button>
              </div>
              <div className="space-y-4">
                {uploads.map((upload, index) => (
                  <div key={index} className="space-y-3">
                    <UploadSection
                      title={upload.title}
                      onTitleChange={(title) => handleUploadTitleChange(index, title)}
                      onFileSelect={(file) => handleFileSelect(index, file)}
                      onRemove={uploads.length > 1 ? () => handleRemoveUpload(index) : undefined}
                      error={upload.error}
                    />
                    
                    {upload.localFile && (
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center justify-between bg-white p-3 rounded border">
                          <div className="flex items-center space-x-3">
                            <div className="text-sm text-gray-600">
                              {upload.localFile.name}
                            </div>
                          </div>
                          {upload.localFile.type.startsWith('image/') && upload.fileUrl && (
                            <img 
                              src={upload.fileUrl}
                              alt="Preview" 
                              className="h-16 w-16 object-cover rounded"
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* Fixed Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t flex justify-end gap-4 shadow-lg">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? (isEdit ? 'Updating...' : 'Creating...') 
              : (isEdit ? 'Update Medical History' : 'Create Medical History')
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMedicalHistory; 