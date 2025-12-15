import React, { useState, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import { FaUser, FaHeartbeat, FaTooth, FaEye, FaCommentAlt, FaUpload, FaSpinner, FaSignature } from 'react-icons/fa';
import { FaEarListen } from 'react-icons/fa6';
import { createAssessment, updateAssessment } from '../../../services/assessmentService';
import { toast } from 'react-toastify';
import assessmentMediaService from '../../../services/assessmentMediaService';

const AddAssessmentForm = ({ isOpen, onClose, student = {}, onSuccess, initialData = null, isEditing = false }) => {
  const [formData, setFormData] = useState({
    studentId: student?.id || '',
    schoolId: student?.studentDetails?.schoolId || '',
    memberId: student?.memberId || '',
    name: student?.name || '',
    heightInCm: '',
    weightInKg: '',
    bmi: '',
    temperatureInCelsius: '',
    temperatureInFahrenheit: '',
    pulseRateBpm: '',
    spo2Percentage: '',
    bp: '',
    oralHealth: 'Normal',
    dentalIssues: '',
    visionLeft: '',
    visionRight: '',
    visionComments: '',
    hearingComments: '',
    additionalComments: '',
    nurseSignature: '',
    doctorSignature: '',
    guardianSignature: '',
    otherOralHealth: '',
    otherVisionLeft: '',
    otherVisionRight: ''
  });

  const [signaturePreview, setSignaturePreview] = useState({
    nurse: null,
    doctor: null,
    guardian: null
  });

  const [isUploadingSignature, setIsUploadingSignature] = useState({
    nurse: false,
    doctor: false,
    guardian: false
  });

  useEffect(() => {
    if (isEditing && initialData) {
      setFormData({
        studentId: initialData.studentId || student?._id || '',
        schoolId: initialData.schoolId || student?.studentDetails?.schoolId || '',
        memberId: initialData.memberId || student?.memberId || '',
        name: initialData.name || student?.name || '',
        heightInCm: initialData.heightInCm?.toString() || '',
        weightInKg: initialData.weightInKg?.toString() || '',
        bmi: initialData.bmi?.toString() || '',
        temperatureInCelsius: initialData.temperatureInCelsius?.toString() || '',
        temperatureInFahrenheit: initialData.temperatureInFahrenheit?.toString() || '',
        pulseRateBpm: initialData.pulseRateBpm?.toString() || '',
        spo2Percentage: initialData.spo2Percentage?.toString() || '',
        bp: initialData.bp || '',
        oralHealth: initialData.oralHealth || 'Normal',
        dentalIssues: initialData.dentalIssues || '',
        visionLeft: initialData.visionLeft || '',
        visionRight: initialData.visionRight || '',
        visionComments: initialData.visionComments || '',
        hearingComments: initialData.hearingComments || '',
        additionalComments: initialData.additionalComments || '',
        nurseSignature: initialData.nurseSignature || '',
        doctorSignature: initialData.doctorSignature || '',
        guardianSignature: initialData.guardianSignature || '',
        otherOralHealth: initialData.otherOralHealth || '',
        otherVisionLeft: initialData.otherVisionLeft || '',
        otherVisionRight: initialData.otherVisionRight || ''
      });

      // Check if oral health value is not in predefined list
      const oralHealthOptions = ['Normal', 'Decayed', 'Dental Strains', 'Cross Bite', 'Dentures'];
      if (initialData.oralHealth && !oralHealthOptions.includes(initialData.oralHealth)) {
        setFormData(prev => ({
          ...prev,
          oralHealth: 'Other',
          otherOralHealth: initialData.oralHealth
        }));
      }

      // Check if vision left value is not in predefined list
      const visionOptions = ['good', 'fair', 'poor'];
      if (initialData.visionLeft && !visionOptions.includes(initialData.visionLeft.toLowerCase())) {
        setFormData(prev => ({
          ...prev,
          visionLeft: 'Other',
          otherVisionLeft: initialData.visionLeft
        }));
      }

      // Check if vision right value is not in predefined list
      if (initialData.visionRight && !visionOptions.includes(initialData.visionRight.toLowerCase())) {
        setFormData(prev => ({
          ...prev,
          visionRight: 'Other',
          otherVisionRight: initialData.visionRight
        }));
      }
    } else if (student) {
      setFormData(prev => ({
        ...prev,
        studentId: student._id || '',
        schoolId: student.studentDetails?.schoolId || '',
        memberId: student.memberId || '',
        name: student.name || ''
      }));
    }
  }, [isEditing, initialData, student]);

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Calculate BMI when height or weight changes
    if (name === 'heightInCm' || name === 'weightInKg') {
      const height = name === 'heightInCm' ? parseFloat(value) : parseFloat(formData.heightInCm);
      const weight = name === 'weightInKg' ? parseFloat(value) : parseFloat(formData.weightInKg);

      if (height && weight) {
        const heightInMeters = height / 100; // Convert cm to meters
        const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
        setFormData(prev => ({
          ...prev,
          bmi: bmi
        }));
      }
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    const requiredFields = [
      'heightInCm',
      'weightInKg',
      'temperatureInFahrenheit',
      'pulseRateBpm',
      'spo2Percentage',
      'bp'
    ];

    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = `${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`;
      }
    });

    // Validate student ID is available
    if (!student?.id) {
      newErrors.studentId = 'Student information is missing';
    }
    
    // Numeric validation
    const numericFields = ['heightInCm', 'weightInKg', 'temperatureInFahrenheit', 'temperatureInCelsius', 'pulseRateBpm', 'spo2Percentage'];
    numericFields.forEach(field => {
      if (formData[field] && isNaN(formData[field])) {
        newErrors[field] = `${field.replace(/([A-Z])/g, ' $1').toLowerCase()} must be a number`;
      }
    });

    // Validate height range (typically 30cm to 250cm)
    if (parseFloat(formData.heightInCm) < 30 || parseFloat(formData.heightInCm) > 250) {
      newErrors.heightInCm = 'Height must be between 30cm and 250cm';
    }

    // Validate weight range (typically 1kg to 300kg)
    if (parseFloat(formData.weightInKg) < 1 || parseFloat(formData.weightInKg) > 300) {
      newErrors.weightInKg = 'Weight must be between 1kg and 300kg';
    }

    // Validate oralHealth enum
    if (!['Normal', 'Decayed', 'Dental Strains', 'Cross Bite', 'Dentures', 'Other'].includes(formData.oralHealth)) {
      newErrors.oralHealth = 'Oral health must be Normal, Decayed, Dental Strains, Cross Bite, Dentures, or Other';
    }

    // Validate blood pressure format (e.g., "120/80")
    if (formData.bp && !/^\d{2,3}\/\d{2,3}$/.test(formData.bp)) {
      newErrors.bp = 'Blood pressure must be in format "120/80"';
    }

    // Validate otherOralHealth if oralHealth is "Other"
    if (formData.oralHealth === 'Other' && !formData.otherOralHealth) {
      newErrors.otherOralHealth = 'Please specify other oral health condition';
    }

    // Validate otherVisionLeft if visionLeft is "Other"
    if (formData.visionLeft === 'Other' && !formData.otherVisionLeft) {
      newErrors.otherVisionLeft = 'Please specify other left eye condition';
    }

    // Validate otherVisionRight if visionRight is "Other"
    if (formData.visionRight === 'Other' && !formData.otherVisionRight) {
      newErrors.otherVisionRight = 'Please specify other right eye condition';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submission started');
    console.log('Student data:', student);
    
    if (!validateForm()) {
      console.log('Form validation failed', errors);
      return;
    }

    try {
      const payload = {
        studentId: student.id,
        schoolId: student.studentDetails?.schoolId,
        name: student.name,
        heightInCm: parseFloat(formData.heightInCm) || 0,
        weightInKg: parseFloat(formData.weightInKg) || 0,
        bmi: parseFloat(formData.bmi) || 0,
        temperatureInCelsius: parseFloat(formData.temperatureInCelsius) || 0,
        temperatureInFahrenheit: parseFloat(formData.temperatureInFahrenheit) || 0,
        pulseRateBpm: parseFloat(formData.pulseRateBpm) || 0,
        spo2Percentage: parseFloat(formData.spo2Percentage) || 0,
        bp: formData.bp,
        oralHealth: formData.oralHealth === 'Other' ? formData.otherOralHealth : formData.oralHealth,
        dentalIssues: formData.dentalIssues || '',
        visionLeft: formData.visionLeft === 'Other' ? formData.otherVisionLeft : formData.visionLeft,
        visionRight: formData.visionRight === 'Other' ? formData.otherVisionRight : formData.visionRight,
        visionComments: formData.visionComments || '',
        hearingComments: formData.hearingComments || '',
        additionalComments: formData.additionalComments || '',
        nurseSignature: formData.nurseSignature,
        doctorSignature: formData.doctorSignature,
        guardianSignature: formData.guardianSignature
      };

      console.log('Submitting assessment with payload:', payload);

      let response;
      if (isEditing && initialData?._id) {
        response = await updateAssessment(initialData._id, payload);
      } else {
        response = await createAssessment(payload);
      }
      
      console.log('API response:', response);
      
      if (response.data) {
        toast.success(`Assessment ${isEditing ? 'updated' : 'created'} successfully`);
        if (onSuccess) {
          onSuccess(response.data);
        }
        onClose();
      }
    } catch (error) {
      console.error('Error submitting assessment:', error);
      toast.error(error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} assessment`);
    }
  };

  const handleFileChange = async (e, signatureType) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }

    try {
      setIsUploadingSignature(prev => ({ ...prev, [signatureType]: true }));
      const imageUrl = await assessmentMediaService.uploadMedia(file);
      
      setFormData(prev => ({
        ...prev,
        [signatureType + 'Signature']: imageUrl
      }));
      setSignaturePreview(prev => ({
        ...prev,
        [signatureType]: URL.createObjectURL(file)
      }));
      toast.success('Signature uploaded successfully');
    } catch (error) {
      console.error('Error uploading signature:', error);
      toast.error(error.message || 'Failed to upload signature');
    } finally {
      setIsUploadingSignature(prev => ({ ...prev, [signatureType]: false }));
    }
  };

  // Add this constant for input field styles
  const inputStyles = {
    base: "mt-1 block w-full h-11 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2.5",
    disabled: "mt-1 block w-full h-11 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2.5 bg-gray-100",
    error: "mt-1 block w-full h-11 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2.5 border-red-500",
    textarea: "mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2.5 min-h-[100px]"
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Assessment' : 'Add Assessment'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <IoMdClose className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-8">
          {/* Student Information */}
          <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center space-x-2">
              <FaUser className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Student Information</h3>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Student ID</label>
                <input
                  type="text"
                  name="memberId"
                  value={formData.memberId}
                  disabled
                  className={inputStyles.disabled}
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  disabled
                  className={inputStyles.disabled}
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
                <input
                  type="number"
                  name="heightInCm"
                  value={formData.heightInCm}
                  onChange={handleChange}
                  className={errors.heightInCm ? inputStyles.error : inputStyles.base}
                  placeholder="Enter height in centimeters"
                />
                {errors.heightInCm && <p className="mt-1 text-sm text-red-600">{errors.heightInCm}</p>}
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                <input
                  type="number"
                  name="weightInKg"
                  value={formData.weightInKg}
                  onChange={handleChange}
                  className={errors.weightInKg ? inputStyles.error : inputStyles.base}
                  placeholder="Enter weight in kilograms"
                />
                {errors.weightInKg && <p className="mt-1 text-sm text-red-600">{errors.weightInKg}</p>}
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">BMI</label>
                <input
                  type="text"
                  name="bmi"
                  value={formData.bmi}
                  disabled
                  className={inputStyles.disabled}
                />
              </div>
            </div>
          </div>

          {/* Vital Signs */}
          <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center space-x-2">
              <FaHeartbeat className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Vital Signs</h3>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Temperature (°F)</label>
                <input
                  type="number"
                  name="temperatureInFahrenheit"
                  value={formData.temperatureInFahrenheit}
                  onChange={handleChange}
                  className={errors.temperatureInFahrenheit ? inputStyles.error : inputStyles.base}
                  placeholder="Enter temperature in Fahrenheit"
                />
                {errors.temperatureInFahrenheit && <p className="mt-1 text-sm text-red-600">{errors.temperatureInFahrenheit}</p>}
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Pulse Rate (bpm)</label>
                <input
                  type="number"
                  name="pulseRateBpm"
                  value={formData.pulseRateBpm}
                  onChange={handleChange}
                  className={errors.pulseRateBpm ? inputStyles.error : inputStyles.base}
                />
                {errors.pulseRateBpm && <p className="mt-1 text-sm text-red-600">{errors.pulseRateBpm}</p>}
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">SpO2 (%)</label>
                <input
                  type="number"
                  name="spo2Percentage"
                  value={formData.spo2Percentage}
                  onChange={handleChange}
                  className={errors.spo2Percentage ? inputStyles.error : inputStyles.base}
                />
                {errors.spo2Percentage && <p className="mt-1 text-sm text-red-600">{errors.spo2Percentage}</p>}
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Blood Pressure (mmHg)</label>
                <input
                  type="text"
                  name="bp"
                  value={formData.bp}
                  onChange={handleChange}
                  className={errors.bp ? inputStyles.error : inputStyles.base}
                />
                {errors.bp && <p className="mt-1 text-sm text-red-600">{errors.bp}</p>}
              </div>
            </div>
          </div>

          {/* Oral Health */}
          <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center space-x-2">
              <FaTooth className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Oral Health</h3>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  name="oralHealth"
                  value={formData.oralHealth}
                  onChange={handleChange}
                  className={errors.oralHealth ? inputStyles.error : inputStyles.base}
                >
                  <option value="">Select status</option>
                  <option value="Normal">Normal</option>
                  <option value="Decayed">Decayed</option>
                  <option value="Dental Strains">Dental Strains</option>
                  <option value="Cross Bite">Cross Bite</option>
                  <option value="Dentures">Dentures</option>
                  <option value="Other">Other</option>
                </select>
                {errors.oralHealth && <p className="mt-1 text-sm text-red-600">{errors.oralHealth}</p>}
              </div>
              {formData.oralHealth === 'Other' && (
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Specify Other</label>
                  <input
                    type="text"
                    name="otherOralHealth"
                    value={formData.otherOralHealth}
                    onChange={handleChange}
                    className={errors.otherOralHealth ? inputStyles.error : inputStyles.base}
                    placeholder="Please specify oral health condition"
                  />
                  {errors.otherOralHealth && <p className="mt-1 text-sm text-red-600">{errors.otherOralHealth}</p>}
                </div>
              )}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Dental Issues</label>
                <input
                  type="text"
                  name="dentalIssues"
                  value={formData.dentalIssues}
                  onChange={handleChange}
                  className={inputStyles.base}
                  placeholder="Enter any dental issues"
                />
              </div>
            </div>
          </div>

          {/* Vision Assessment */}
          <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center space-x-2">
              <FaEye className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Vision Assessment</h3>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Left Eye</label>
                <select
                  name="visionLeft"
                  value={formData.visionLeft}
                  onChange={handleChange}
                  className={errors.visionLeft ? inputStyles.error : inputStyles.base}
                >
                  <option value="">Select status</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                  <option value="Other">Other</option>
                </select>
                {errors.visionLeft && <p className="mt-1 text-sm text-red-600">{errors.visionLeft}</p>}
                {formData.visionLeft === 'Other' && (
                  <div className="mt-2">
                    <input
                      type="text"
                      name="otherVisionLeft"
                      value={formData.otherVisionLeft}
                      onChange={handleChange}
                      className={errors.otherVisionLeft ? inputStyles.error : inputStyles.base}
                      placeholder="Specify left eye condition"
                    />
                    {errors.otherVisionLeft && <p className="mt-1 text-sm text-red-600">{errors.otherVisionLeft}</p>}
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Right Eye</label>
                <select
                  name="visionRight"
                  value={formData.visionRight}
                  onChange={handleChange}
                  className={errors.visionRight ? inputStyles.error : inputStyles.base}
                >
                  <option value="">Select status</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                  <option value="Other">Other</option>
                </select>
                {errors.visionRight && <p className="mt-1 text-sm text-red-600">{errors.visionRight}</p>}
                {formData.visionRight === 'Other' && (
                  <div className="mt-2">
                    <input
                      type="text"
                      name="otherVisionRight"
                      value={formData.otherVisionRight}
                      onChange={handleChange}
                      className={errors.otherVisionRight ? inputStyles.error : inputStyles.base}
                      placeholder="Specify right eye condition"
                    />
                    {errors.otherVisionRight && <p className="mt-1 text-sm text-red-600">{errors.otherVisionRight}</p>}
                  </div>
                )}
              </div>
              <div className="col-span-2 space-y-1">
                <label className="block text-sm font-medium text-gray-700">Vision Comments</label>
                <textarea
                  name="visionComments"
                  value={formData.visionComments}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Enter any observations about student's vision..."
                  className={inputStyles.textarea}
                />
              </div>
            </div>
          </div>

          {/* Hearing Assessment */}
          <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center space-x-2">
              <FaEarListen className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Hearing Assessment</h3>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Hearing Comments</label>
              <textarea
                name="hearingComments"
                value={formData.hearingComments}
                onChange={handleChange}
                rows={3}
                placeholder="Enter any observations about student's hearing..."
                className={errors.hearingComments ? inputStyles.error : inputStyles.textarea}
              />
              {errors.hearingComments && <p className="mt-1 text-sm text-red-600">{errors.hearingComments}</p>}
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center space-x-2">
              <FaCommentAlt className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Additional Comments</label>
                <textarea
                  name="additionalComments"
                  value={formData.additionalComments}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Enter any additional observations or comments..."
                  className={inputStyles.textarea}
                />
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center space-x-2">
              <FaSignature className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Signatures</h3>
            </div>
            <div className="grid grid-cols-3 gap-6">
              {/* Nurse Signature */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Nurse Signature</label>
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-24 h-24 border-2 border-gray-300 border-dashed rounded-lg overflow-hidden">
                    {signaturePreview.nurse || formData.nurseSignature ? (
                      <img
                        src={signaturePreview.nurse || formData.nurseSignature}
                        alt="Nurse signature preview"
                        className="w-full h-full object-contain bg-white"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <FaSignature className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      {isUploadingSignature.nurse ? (
                        <FaSpinner className="mr-2 -ml-1 h-5 w-5 text-gray-400 animate-spin" />
                      ) : (
                        <FaUpload className="mr-2 -ml-1 h-5 w-5 text-gray-400" />
                      )}
                      {isUploadingSignature.nurse ? 'Uploading...' : 'Upload Signature'}
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'nurse')}
                        disabled={isUploadingSignature.nurse}
                      />
                    </label>
                  </div>
                </div>
                {errors.nurseSignature && <p className="mt-1 text-sm text-red-600">{errors.nurseSignature}</p>}
              </div>

              {/* Doctor Signature */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Doctor Signature</label>
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-24 h-24 border-2 border-gray-300 border-dashed rounded-lg overflow-hidden">
                    {signaturePreview.doctor || formData.doctorSignature ? (
                      <img
                        src={signaturePreview.doctor || formData.doctorSignature}
                        alt="Doctor signature preview"
                        className="w-full h-full object-contain bg-white"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <FaSignature className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      {isUploadingSignature.doctor ? (
                        <FaSpinner className="mr-2 -ml-1 h-5 w-5 text-gray-400 animate-spin" />
                      ) : (
                        <FaUpload className="mr-2 -ml-1 h-5 w-5 text-gray-400" />
                      )}
                      {isUploadingSignature.doctor ? 'Uploading...' : 'Upload Signature'}
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'doctor')}
                        disabled={isUploadingSignature.doctor}
                      />
                    </label>
                  </div>
                </div>
                {errors.doctorSignature && <p className="mt-1 text-sm text-red-600">{errors.doctorSignature}</p>}
              </div>

              {/* Guardian Signature */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Guardian Signature</label>
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-24 h-24 border-2 border-gray-300 border-dashed rounded-lg overflow-hidden">
                    {signaturePreview.guardian || formData.guardianSignature ? (
                      <img
                        src={signaturePreview.guardian || formData.guardianSignature}
                        alt="Guardian signature preview"
                        className="w-full h-full object-contain bg-white"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <FaSignature className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      {isUploadingSignature.guardian ? (
                        <FaSpinner className="mr-2 -ml-1 h-5 w-5 text-gray-400 animate-spin" />
                      ) : (
                        <FaUpload className="mr-2 -ml-1 h-5 w-5 text-gray-400" />
                      )}
                      {isUploadingSignature.guardian ? 'Uploading...' : 'Upload Signature'}
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'guardian')}
                        disabled={isUploadingSignature.guardian}
                      />
                    </label>
                  </div>
                </div>
                {errors.guardianSignature && <p className="mt-1 text-sm text-red-600">{errors.guardianSignature}</p>}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {isEditing ? 'Update' : 'Save'} Assessment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAssessmentForm; 