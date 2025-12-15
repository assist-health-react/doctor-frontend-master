import { useState, useEffect, Suspense, useMemo } from 'react';
import { useParams, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { FaUserGraduate, FaClipboardList, FaHospital, FaChartBar, FaArrowLeft, FaBoxes } from 'react-icons/fa';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { getSchoolById } from '../../../services/schoolsService';

const tabs = [
  {
    id: 'students',
    label: 'Students',
    icon: FaUserGraduate
  },
  {
    id: 'assessments',
    label: 'Assessment Report',
    icon: FaClipboardList
  },
  {
    id: 'infirmary',
    label: 'Infirmary',
    icon: FaHospital
  },
  {
    id: 'reports',
    label: 'Infirmary Reports',
    icon: FaChartBar
  },
  {
    id: 'inventory',
    label: 'Inventory',
    icon: FaBoxes
  }
];

const SchoolView = () => {
  const { schoolId: schoolMongoId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('students');
  const [schoolData, setSchoolData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch school data when component mounts
  useEffect(() => {
    const fetchSchoolData = async () => {
      if (!schoolMongoId) return;
      
      try {
        setLoading(true);
        const response = await getSchoolById(schoolMongoId);
        console.log('School API Response:', response);
        
        if (response.status === 'success' && response.data) {
          console.log('Setting school data:', response.data);
          setSchoolData(response.data);
        } else {
          throw new Error('Failed to fetch school data');
        }
      } catch (error) {
        console.error('Error fetching school data:', error);
        setError('Failed to fetch school data');
      } finally {
        setLoading(false);
      }
    };

    fetchSchoolData();
  }, [schoolMongoId]);

  // Navigate to students tab by default if no specific tab is selected
  useEffect(() => {
    const path = location.pathname;
    const currentTab = path.split('/').pop();
    
    if (currentTab === schoolMongoId || currentTab === '') {
      navigate(`/ahana/${schoolMongoId}/students`);
    } else if (currentTab && tabs.some(tab => tab.id === currentTab)) {
      setActiveTab(currentTab);
    }
  }, [location.pathname, schoolMongoId, navigate]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    navigate(`/ahana/${schoolMongoId}/${tabId}`);
  };

  const handleBackClick = () => {
    navigate('/ahana');
  };

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => {
    console.log('Creating context value with:', {
      schoolData,
      schoolMongoId,
      loading
    });
    
    return {
      school: schoolData,
      schoolId: schoolData?.schoolId || schoolMongoId,
      schoolData,
      isLoading: loading
    };
  }, [schoolData, schoolMongoId, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={handleBackClick}
          className="flex items-center px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
        >
          <FaArrowLeft className="mr-2" />
          Back to Schools
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Back button and tabs */}
      <div className="bg-white border-b px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
          <button
            onClick={handleBackClick}
              className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to Schools
          </button>
            {schoolData?.schoolId && (
              <span className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full font-medium">
                ID: {schoolData.schoolId}
              </span>
            )}
          </div>
        </div>

        <div className="flex space-x-4">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleTabClick(id)}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                activeTab === id
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="mr-2" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 p-6">
        <Suspense fallback={
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner />
          </div>
        }>
          <Outlet context={contextValue} />
        </Suspense>
      </div>
    </div>
  );
};

export default SchoolView; 