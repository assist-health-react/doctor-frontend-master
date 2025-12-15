import React, { useState } from 'react';
import { FaTimes, FaDownload, FaUpload } from 'react-icons/fa';
import api from '../../../services/api';
import { useOutletContext } from 'react-router-dom';

const StudentBulkUploadGuide = ({ isOpen, onClose, onFileUpload, mode = 'insert' }) => {
  if (!isOpen) return null;
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const { school } = useOutletContext() || {};
  const schoolId = school?.schoolId;

  const getRequiredFields = () => {
    if (mode === 'insert') {
      return [
        { field: 'name', description: 'Full name of the student', example: 'John Doe' },
        { field: 'phone', description: 'Phone number with country code', example: '+919876543210' },
        { field: 'studentDetails.schoolName', description: 'Name of the school', example: 'Delhi Public School' },
        { field: 'studentDetails.grade', description: 'Grade/Class of the student', example: '10' },
        { field: 'studentDetails.section', description: 'Section', example: 'A' },
        { field: 'studentDetails.schoolId', description: 'School ID if available', example: 'SCH001' },
        { field: 'gender', description: 'Gender (male/female/other)', example: 'male' },
        { field: 'studentDetails.guardians[0].name', description: 'First guardian name', example: 'Jane Doe' },
        { field: 'studentDetails.guardians[0].relation', description: 'First guardian relation (father/mother/guardian)', example: 'mother' },
        { field: 'studentDetails.guardians[0].phone', description: 'First guardian phone', example: '+919876543213' }
      ];
    } else {
      return [
        { field: 'StudentId', description: 'Unique member ID of the student', example: 'STU123' },
        { field: 'name', description: 'Full name of the student', example: 'John Doe' },
        { field: 'phone', description: 'Phone number with country code', example: '+919876543210' },
        { field: 'studentDetails.schoolName', description: 'Name of the school', example: 'Delhi Public School' },
        { field: 'studentDetails.grade', description: 'Grade/Class of the student', example: '10' },
        { field: 'studentDetails.section', description: 'Section', example: 'A' },
        { field: 'studentDetails.schoolId', description: 'School ID if available', example: 'SCH001' }
      ];
    }
  };

  const requiredFields = getRequiredFields();

  const optionalFields = [
    { field: 'email', description: 'Email address', example: 'john@example.com' },
    { field: 'dob', description: 'Date of Birth (YYYY-MM-DD)', example: '2010-01-01' },
   
    { field: 'bloodGroup', description: 'Blood group', example: 'O+' },
    { field: 'heightInFt', description: 'Height in feet', example: '5.2' },
    { field: 'weightInKg', description: 'Weight in kilograms', example: '45' },
    { field: 'studentDetails.alternatePhone', description: 'Alternate contact number', example: '9876543212' },
   
    
    { field: 'studentDetails.guardians[1].name', description: 'Second guardian name', example: 'John Doe' },
    { field: 'studentDetails.guardians[1].relation', description: 'Second guardian relation (father/mother/guardian)', example: 'father' },
    { field: 'studentDetails.guardians[1].phone', description: 'Second guardian phone', example: '+919876543214' },
    { field: 'address.description', description: 'Address description', example: '123 Main St' },
    { field: 'address.landmark', description: 'Landmark', example: 'Near City Park' },
    { field: 'address.pinCode', description: 'PIN code', example: '560001' },
    { field: 'address.region', description: 'Region/Area', example: 'Koramangala' },
    { field: 'address.city', description: 'City', example: 'Bangalore' },
    { field: 'address.state', description: 'State', example: 'Karnataka' },
    { field: 'address.country', description: 'Country', example: 'India' },
    { field: 'additionalInfo', description: 'Additional information', example: 'Allergic to peanuts' }
  ];

  const downloadSampleCSV = () => {
    const headers = [...requiredFields, ...optionalFields].map(f => f.field).join(',');
    const sampleData = [...requiredFields, ...optionalFields].map(f => f.example).join(',');
    const csv = `${headers}\n${sampleData}`;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mode === 'insert' ? 'students_insert_template.csv' : 'students_update_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!schoolId) {
      setError('School identifier is required for bulk upload');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${api.defaults.baseURL}/api/v1/members/bulk-insert-students/${schoolId}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (data.status === 'success') {
        onFileUpload?.(file);
        onClose();
      } else {
        throw new Error(data.message || 'Failed to upload students');
      }
    } catch (error) {
      console.error('Error uploading students:', error);
      setError(error.message || 'Failed to upload students');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-7xl w-[95%] mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Student Bulk {mode === 'insert' ? 'Insert' : 'Update'} Guide
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={24} />
          </button>
        </div>

        {/* Upload and Template Buttons */}
        <div className="flex gap-4 mb-6">
          <label className={`flex items-center gap-2 ${uploading ? 'bg-blue-400' : 'bg-blue-500'} text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer ${uploading ? 'cursor-not-allowed opacity-70' : ''}`}>
            <FaUpload />
            <span>{uploading ? 'Uploading...' : 'Upload CSV'}</span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
          <button
            onClick={downloadSampleCSV}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            disabled={uploading}
          >
            <FaDownload />
            <span>Download Template</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Required Fields */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Required Fields</h3>
            <div className="bg-white border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Field</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Example</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {requiredFields.map((field, index) => (
                    <tr key={field.field} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-2 text-sm font-medium text-gray-900">{field.field}</td>
                      <td className="px-6 py-2 text-sm text-gray-500">{field.description}</td>
                      <td className="px-6 py-2 text-sm text-gray-500">{field.example}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Optional Fields */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Optional Fields</h3>
            <div className="bg-white border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Field</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Example</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {optionalFields.map((field, index) => (
                    <tr key={field.field} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-2 text-sm font-medium text-gray-900">{field.field}</td>
                      <td className="px-6 py-2 text-sm text-gray-500">{field.description}</td>
                      <td className="px-6 py-2 text-sm text-gray-500">{field.example}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentBulkUploadGuide; 