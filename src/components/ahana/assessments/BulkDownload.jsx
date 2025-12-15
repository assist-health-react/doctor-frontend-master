import { useState, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import { FaFileAlt, FaDownload } from 'react-icons/fa';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../../services/api';

const BulkDownload = ({ isOpen, onClose }) => {
  const context = useOutletContext();
  const { schoolId, school } = context || {};

  const [loading, setLoading] = useState(false);
  const [generatingAll, setGeneratingAll] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [availableSections, setAvailableSections] = useState([]);
  const [reportsGenerated, setReportsGenerated] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [expirationTime, setExpirationTime] = useState(null);

  // Check if the download URL has expired
  useEffect(() => {
    if (expirationTime) {
      const checkExpiration = () => {
        const now = new Date().getTime();
        if (now >= expirationTime) {
          setDownloadUrl(null);
          setExpirationTime(null);
          setReportsGenerated(false);
        }
      };

      // Check immediately and every minute
      checkExpiration();
      const interval = setInterval(checkExpiration, 60000);
      return () => clearInterval(interval);
    }
  }, [expirationTime]);

  // Get grades from school data
  const grades = Array.isArray(school?.grades) 
    ? school.grades.map(grade => ({
        id: grade._id,
        name: grade.class
      }))
    : [];
  
  useEffect(() => {
    if (selectedGrade && Array.isArray(school?.grades)) {
      try {
        // Find the selected grade object
        const selectedGradeObj = school.grades.find(g => g.class === selectedGrade);
        
        if (selectedGradeObj && Array.isArray(selectedGradeObj.section)) {
          // Map sections from the selected grade
          const sections = selectedGradeObj.section.map(section => ({
            id: section._id || `${selectedGrade}-${section.name}`,
            name: section.name
          }));

          setAvailableSections(sections);
        } else {
          setAvailableSections([]);
        }
      } catch (error) {
        console.error('Error processing sections:', error);
        setAvailableSections([]);
      }
    } else {
      setAvailableSections([]);
    }
    // Reset section when grade changes
    setSelectedSection('');
  }, [selectedGrade, school?.grades]);

  const handleGenerateAll = async () => {
    try {
      setGeneratingAll(true);
      setReportsGenerated(false);
      setDownloadUrl(null);
      setExpirationTime(null);
      
      const response = await api.post('/api/v1/assessments/pdf', {
        schoolId: schoolId
      });

      if (response?.data?.status === 'success') {
        const { downloadUrl: url, expiresIn } = response.data.data;
        
        // Set download URL
        setDownloadUrl(url);
        
        // Calculate expiration time (24 hours from now)
        const expirationTime = new Date().getTime() + (24 * 60 * 60 * 1000);
        setExpirationTime(expirationTime);
        
        setReportsGenerated(true);
        toast.success('Reports generated successfully. You can now download them.');
      } else {
        throw new Error(response?.data?.message || 'Failed to generate reports');
      }
    } catch (error) {
      console.error('Error generating reports:', error);
      toast.error(error.message || 'Failed to generate reports. Please try again.');
      setReportsGenerated(false);
    } finally {
      setGeneratingAll(false);
    }
  };

  const handleGenerateSelected = async () => {
    try {
      setGeneratingAll(true);
      setReportsGenerated(false);
      setDownloadUrl(null);
      setExpirationTime(null);
      
      // Create request body with required fields
      const requestBody = {
        schoolId: schoolId,
        grade: selectedGrade,
      };

      // Only add section if it's selected
      if (selectedSection) {
        requestBody.section = selectedSection;
      }
      
      const response = await api.post('/api/v1/assessments/pdf', requestBody);

      if (response?.data?.status === 'success') {
        const { downloadUrl: url, expiresIn } = response.data.data;
        
        // Set download URL
        setDownloadUrl(url);
        
        // Calculate expiration time (24 hours from now)
        const expirationTime = new Date().getTime() + (24 * 60 * 60 * 1000);
        setExpirationTime(expirationTime);
        
        setReportsGenerated(true);
        toast.success('Reports generated successfully. You can now download them.');
      } else {
        throw new Error(response?.data?.message || 'Failed to generate reports');
      }
    } catch (error) {
      console.error('Error generating reports:', error);
      toast.error(error.message || 'Failed to generate reports. Please try again.');
      setReportsGenerated(false);
    } finally {
      setGeneratingAll(false);
    }
  };

  const handleDownload = async () => {
    try {
      // Check if URL has expired
      if (expirationTime && new Date().getTime() >= expirationTime) {
        toast.error('Download link has expired. Please generate reports again.');
        setDownloadUrl(null);
        setExpirationTime(null);
        setReportsGenerated(false);
        return;
      }

      if (!downloadUrl) {
        toast.error('No download URL available. Please generate reports first.');
        return;
      }

      setLoading(true);
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.target = '_blank';
      link.download = `assessment-reports-${new Date().toISOString()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Downloading reports...');
    } catch (error) {
      console.error('Error downloading reports:', error);
      toast.error(error.message || 'Failed to download reports. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Bulk Download Reports</h2>
            {expirationTime && (
              <p className="text-xs text-gray-400 mt-1">
                Reports expire in: {Math.max(0, Math.floor((expirationTime - new Date().getTime()) / (1000 * 60 * 60)))} hours
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <IoMdClose className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Generate All Reports Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Generate All Reports</h3>
                <p className="text-sm text-gray-500 mt-1">Generate reports for all students in the selected grade and section</p>
              </div>
              <button
                onClick={handleGenerateAll}
                disabled={generatingAll}
                className={`flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors ${
                  generatingAll ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {generatingAll ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <FaFileAlt className="w-4 h-4" />
                    Generate All
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Filters Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Filters</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Grade Dropdown */}
              <div>
                <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
                  Grade
                </label>
                <select
                  id="grade"
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Grades</option>
                  {grades.map((grade) => (
                    <option key={grade.id} value={grade.name}>
                      {grade.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section Dropdown */}
              <div>
                <label htmlFor="section" className="block text-sm font-medium text-gray-700 mb-1">
                  Section
                </label>
                <select
                  id="section"
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  disabled={!selectedGrade}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !selectedGrade ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                >
                  <option value="">All Sections</option>
                  {availableSections.map((section) => (
                    <option key={section.id} value={section.name}>
                      {section.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Generate Selected Button */}
            <div className="flex justify-end mt-4">
              <button
                onClick={handleGenerateSelected}
                disabled={generatingAll}
                className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
                  generatingAll ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {generatingAll ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaFileAlt className="w-4 h-4" />
                    Generate Selected
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Close
          </button>
          <button
            onClick={handleDownload}
            disabled={!downloadUrl || !reportsGenerated || loading || (expirationTime && new Date().getTime() >= expirationTime)}
            className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2 ${
              (!downloadUrl || !reportsGenerated || loading || (expirationTime && new Date().getTime() >= expirationTime)) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title={!downloadUrl ? "Generate reports first" : (expirationTime && new Date().getTime() >= expirationTime) ? "Download link expired" : "Download Reports"}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Downloading...
              </>
            ) : (
              <>
                <FaDownload className="w-4 h-4" />
                Download Reports
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkDownload; 