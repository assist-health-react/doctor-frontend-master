import { useState } from 'react';
import { FaTimes, FaDownload, FaUpload, FaInfoCircle, FaSignature } from 'react-icons/fa';
import { uploadMedia } from '../../../services/mediaService';
import { toast } from 'react-toastify';
import api from '../../../services/api';

const BulkAssessmentForm = ({ isOpen, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1); // 1: Guide, 2: Upload
  const [signatures, setSignatures] = useState({
    doctor: null,
    nurse: null
  });
  const [signatureUrls, setSignatureUrls] = useState({
    doctor: '',
    nurse: ''
  });
  const [signatureLoading, setSignatureLoading] = useState({
    doctor: false,
    nurse: false
  });

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv', // .csv
      'application/csv', // some systems use this mime type for csv
      'text/x-csv', // another csv mime type
      'application/x-csv', // another csv mime type
      'text/comma-separated-values', // another csv mime type
      'text/x-comma-separated-values', // another csv mime type
      'text/plain' // .csv files sometimes come as text/plain
    ];

    if (validTypes.includes(selectedFile.type) || selectedFile.name.endsWith('.csv')) {
      try {
        setLoading(true);
        setError(null);

        // Upload file using mediaService
        const response = await uploadMedia(selectedFile);

        if (response.success && response.imageUrl) {
          setFile(selectedFile); // Keep the file reference for display
          setFileUrl(response.imageUrl); // Store the uploaded URL
          toast.success('File uploaded successfully');
        } else {
          throw new Error('Failed to upload file');
        }
      } catch (err) {
        console.error('Error uploading file:', err);
        setError('Failed to upload file. Please try again.');
        toast.error('Failed to upload file');
        setFile(null);
        setFileUrl('');
      } finally {
        setLoading(false);
      }
    } else {
      setError('Please upload a valid Excel (.xlsx, .xls) or CSV file');
      setFile(null);
      setFileUrl('');
    }
  };

  const handleDownloadTemplate = () => {
    // Define the CSV headers based on the schema
    const headers = [
      'studentId',
      'schoolId',
      'name',
      'heightInFt',
      'heightInCm',
      'weightInKg',
      'bmi',
      'temperatureInCelsius',
      'temperatureInFahrenheit',
      'pulseRateBpm',
      'spo2Percentage',
      'bp',
      'oralHealth',
      'dentalIssues',
      'visionLeft',
      'visionRight',
      'visionComments',
      'hearingComments',
      'additionalComments'
    ];

    // Create example row with descriptions
    const exampleRow = [
      'student123', // studentId
      'school123', // schoolId
      'John Doe', // name
      '5.8', // heightInFt
      '177', // heightInCm
      '65.5', // weightInKg
      '20.8', // bmi
      '37', // temperatureInCelsius
      '98.6', // temperatureInFahrenheit
      '72', // pulseRateBpm
      '98', // spo2Percentage
      '120/80', // bp
      'Normal', // oralHealth
      'No issues found', // dentalIssues
      'Good', // visionLeft
      'Good', // visionRight
      'No vision issues', // visionComments
      'Hearing is normal', // hearingComments
      'Overall health is good' // additionalComments
    ];

    // Create CSV content
    const csvContent = [
      headers.join(','),
      exampleRow.join(',')
    ].join('\n');

    // Create a Blob containing the CSV data
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create a link element to trigger the download
    const link = document.createElement('a');
    
    // Create the download URL
    const url = URL.createObjectURL(blob);
    
    // Set link properties
    link.setAttribute('href', url);
    link.setAttribute('download', 'assessment_template.csv');
    link.style.visibility = 'hidden';
    
    // Add the link to the document
    document.body.appendChild(link);
    
    // Trigger the download
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSignatureUpload = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError(`Please upload a valid image file for ${type} signature`);
      return;
    }

    try {
      setSignatureLoading(prev => ({ ...prev, [type]: true }));
      setError(null);

      // Upload to server using mediaService
      const response = await uploadMedia(file);

      if (response.success && response.imageUrl) {
        // Create preview using FileReader
        const reader = new FileReader();
        reader.onloadend = () => {
          setSignatures(prev => ({ ...prev, [type]: reader.result }));
        };
        reader.readAsDataURL(file);

        // Store the actual uploaded URL
        setSignatureUrls(prev => ({ ...prev, [type]: response.imageUrl }));
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)}'s signature uploaded successfully`);
      } else {
        throw new Error('Failed to upload signature');
      }
    } catch (err) {
      console.error(`Error uploading ${type} signature:`, err);
      setError(`Failed to upload ${type} signature. Please try again.`);
      toast.error(`Failed to upload ${type}'s signature`);
    } finally {
      setSignatureLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleUpload = async () => {
    if (!fileUrl) {
      setError('Please select and upload a file first');
      return;
    }

    if (!signatureUrls.doctor || !signatureUrls.nurse) {
      setError('Both doctor and nurse signatures are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const uploadData = {
        fileUrl,
        doctorSignature: signatureUrls.doctor,
        nurseSignature: signatureUrls.nurse
      };
      
      // Call the bulk upload API
      const response = await api.post('/api/v1/assessments/bulk-upload', uploadData);
      
      if (response.status === 'success') {
        toast.success(response.message || 'Assessments uploaded successfully');
        // Reset form state
        setFile(null);
        setFileUrl('');
        setSignatures({ doctor: null, nurse: null });
        setSignatureUrls({ doctor: '', nurse: '' });
        setStep(1);
        // Close the modal and notify parent
        onSuccess();
        onClose();
      } else {
        throw new Error(response.message || 'Failed to upload assessments');
      }
    } catch (err) {
      console.error('Bulk upload error:', err);
      const errorMessage = err.message || 'Failed to process assessments. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-3xl w-full mx-4 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header - Fixed */}
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-800">Bulk Assessment Upload</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Steps */}
          <div className="flex items-center mb-8">
            <div className={`flex items-center ${step === 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className="w-8 h-8 border-2 rounded-full flex items-center justify-center font-semibold">
                1
              </div>
              <span className="ml-2">Guide</span>
            </div>
            <div className="w-16 h-0.5 mx-2 bg-gray-200"></div>
            <div className={`flex items-center ${step === 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className="w-8 h-8 border-2 rounded-full flex items-center justify-center font-semibold">
                2
              </div>
              <span className="ml-2">Upload</span>
            </div>
          </div>

          {step === 1 ? (
            /* Guide Step */
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-blue-800 mb-2 flex items-center">
                  <FaInfoCircle className="w-5 h-5 mr-2" />
                  How to Bulk Upload Assessments
                </h4>
                <ol className="list-decimal ml-5 space-y-2 text-blue-700 mb-4">
                  <li>Download the Excel template below</li>
                  <li>Fill in the assessment details in the template</li>
                  <li>In the next step, provide required signatures and upload the file</li>
                  <li>Review any errors and fix them if needed</li>
                </ol>

                <div className="mt-6">
                  <h5 className="font-semibold text-blue-800 mb-2">Required Fields</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Student Information:</p>
                      <ul className="list-disc ml-4 text-blue-700">
                        <li>studentId - Student's unique identifier</li>
                        <li>schoolId - School's unique identifier</li>
                        <li>name - Student's full name</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium">Basic Measurements:</p>
                      <ul className="list-disc ml-4 text-blue-700">
                        <li>heightInFt - Height in feet (e.g., 5.6)</li>
                        <li>heightInCm - Height in centimeters (e.g., 170)</li>
                        <li>weightInKg - Weight in kilograms (e.g., 55.5)</li>
                        <li>bmi - Body Mass Index (auto-calculated)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h5 className="font-semibold text-blue-800 mb-2">Vital Signs</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <ul className="list-disc ml-4 text-blue-700">
                        <li>temperatureInCelsius - Temperature in °C (e.g., 37)</li>
                        <li>temperatureInFahrenheit - Temperature in °F (e.g., 98.6)</li>
                        <li>pulseRateBpm - Pulse rate in beats per minute (e.g., 72)</li>
                        <li>spo2Percentage - Blood oxygen level in % (e.g., 98)</li>
                        <li>bp - Blood pressure (format: "120/80")</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h5 className="font-semibold text-blue-800 mb-2">Health Assessments</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Oral Health:</p>
                      <ul className="list-disc ml-4 text-blue-700">
                        <li>oralHealth - Status (Normal, Decayed, Dental Strains, Cross Bite, Dentures, Other)</li>
                        <li>dentalIssues - Description of any dental problems</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium">Vision & Hearing:</p>
                      <ul className="list-disc ml-4 text-blue-700">
                        <li>visionLeft - Left eye vision (Good, Fair, Poor, Other)</li>
                        <li>visionRight - Right eye vision (Good, Fair, Poor, Other)</li>
                        <li>visionComments - Additional vision observations</li>
                        <li>hearingComments - Hearing assessment notes</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h5 className="font-semibold text-blue-800 mb-2">Additional Information</h5>
                  <div className="text-sm">
                    <ul className="list-disc ml-4 text-blue-700">
                      <li>additionalComments - Any other relevant health observations or notes</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
                  <p className="text-yellow-800 font-medium">Important Notes:</p>
                  <ul className="list-disc ml-4 text-yellow-700 text-sm">
                    <li>Student ID and School ID are mandatory fields</li>
                    <li>Height can be provided in either feet or centimeters (or both)</li>
                    <li>Temperature can be provided in either Celsius or Fahrenheit (or both)</li>
                    <li>Blood pressure must be in format "systolic/diastolic" (e.g., 120/80)</li>
                    <li>When selecting "Other" for any field, provide details in the corresponding comments field</li>
                  </ul>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleDownloadTemplate}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <FaDownload className="w-5 h-5 mr-2" />
                  Download Template
                </button>
              </div>

              <div className="border-t pt-6 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Continue to Upload
                </button>
              </div>
            </div>
          ) : (
            /* Upload Step */
            <div className="space-y-6">
              {/* Signature Section */}
              <div className="mb-8">
                <h5 className="font-semibold text-blue-800 mb-4">Required Signatures</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Doctor Signature */}
                  <div className="border rounded-lg p-4">
                    <p className="font-medium mb-3">Doctor's Signature</p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                        {signatures.doctor ? (
                          <div className="relative group">
                            <img 
                              src={signatures.doctor} 
                              alt="Doctor's signature" 
                              className="max-h-24 object-contain"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 hidden group-hover:flex items-center justify-center">
                              <label 
                                htmlFor="doctor-signature"
                                className="cursor-pointer text-white text-sm hover:underline"
                              >
                                Change
                              </label>
                            </div>
                          </div>
                        ) : (
                          <label 
                            htmlFor="doctor-signature" 
                            className="flex flex-col items-center cursor-pointer"
                          >
                            <FaSignature className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500">Upload Signature</span>
                          </label>
                        )}
                      </div>
                      <input
                        type="file"
                        id="doctor-signature"
                        accept="image/*"
                        onChange={(e) => handleSignatureUpload(e, 'doctor')}
                        className="hidden"
                      />
                      {signatureLoading.doctor && (
                        <div className="text-center text-sm text-gray-500">
                          Uploading...
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Nurse Signature */}
                  <div className="border rounded-lg p-4">
                    <p className="font-medium mb-3">Nurse's Signature</p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                        {signatures.nurse ? (
                          <div className="relative group">
                            <img 
                              src={signatures.nurse} 
                              alt="Nurse's signature" 
                              className="max-h-24 object-contain"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 hidden group-hover:flex items-center justify-center">
                              <label 
                                htmlFor="nurse-signature"
                                className="cursor-pointer text-white text-sm hover:underline"
                              >
                                Change
                              </label>
                            </div>
                          </div>
                        ) : (
                          <label 
                            htmlFor="nurse-signature" 
                            className="flex flex-col items-center cursor-pointer"
                          >
                            <FaSignature className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500">Upload Signature</span>
                          </label>
                        )}
                      </div>
                      <input
                        type="file"
                        id="nurse-signature"
                        accept="image/*"
                        onChange={(e) => handleSignatureUpload(e, 'nurse')}
                        className="hidden"
                      />
                      {signatureLoading.nurse && (
                        <div className="text-center text-sm text-gray-500">
                          Uploading...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* File Upload Section - Only visible when both signatures are present */}
              {signatures.doctor && signatures.nurse ? (
                <>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                    <div className="text-center">
                      <FaUpload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-4">
                        {loading ? 'Uploading file...' : 'Drag and drop your Excel or CSV file here, or click to browse'}
                      </p>
                      <input
                        type="file"
                        accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                        disabled={loading}
                      />
                      <label
                        htmlFor="file-upload"
                        className={`px-4 py-2 ${loading ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 cursor-pointer'} text-gray-700 rounded-lg transition-colors`}
                      >
                        {loading ? (
                          <div className="flex items-center">
                            <div className="w-4 h-4 border-t-2 border-b-2 border-gray-700 rounded-full animate-spin mr-2"></div>
                            Uploading...
                          </div>
                        ) : (
                          'Choose File'
                        )}
                      </label>
                    </div>
                  </div>

                  {file && (
                    <div className="bg-green-50 p-4 rounded-lg flex items-center justify-between">
                      <div className="flex items-center">
                        <FaUpload className="w-5 h-5 text-green-600 mr-2" />
                        <span className="text-green-700">{file.name}</span>
                      </div>
                      <button
                        onClick={() => setFile(null)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <FaTimes className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-yellow-50 p-4 rounded-lg text-yellow-800">
                  <p className="flex items-center">
                    <FaInfoCircle className="w-5 h-5 mr-2" />
                    Please upload both Doctor and Nurse signatures before proceeding with file upload
                  </p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 p-4 rounded-lg text-red-700">
                  {error}
                </div>
              )}

              <div className="border-t pt-6 flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Back to Guide
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!fileUrl || loading || !signatureUrls.doctor || !signatureUrls.nurse}
                  className={`px-6 py-2 rounded-lg ${
                    !fileUrl || loading || !signatureUrls.doctor || !signatureUrls.nurse
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white transition-colors flex items-center`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    'Upload Assessments'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkAssessmentForm; 