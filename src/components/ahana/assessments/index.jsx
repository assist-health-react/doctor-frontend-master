import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { FaSearch, FaFilter, FaTimes, FaDownload, FaUpload, FaPlus, FaEye } from 'react-icons/fa';
import ViewAssessmentDetails from './ViewAssessmentDetails';
import AddAssessmentForm from './AddAssessmentForm';
import { useOutletContext } from 'react-router-dom';
import StudentAssessmentList from './StudentAssessmentList';
import AssessmentFilters from './AssessmentFilters';
import AssessmentList from './AssessmentList';
import { membersService } from '../../../services/membersService';
import BulkDownload from './BulkDownload';
import BulkAssessmentForm from './BulkAssessmentForm';

const AssessmentReport = () => {
  console.log('AssessmentReport component rendered');
  const { schoolId, schoolData, isLoading: isLoadingSchool } = useOutletContext();
  console.log('Context received:', { schoolId, schoolData, isLoadingSchool });
  
  const [showFilters, setShowFilters] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showAssessmentList, setShowAssessmentList] = useState(false);
  const [showBulkDownload, setShowBulkDownload] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
    grade: '',
    section: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(false);
  const isInitialMount = useRef(true);

  // Extract grades and sections from schoolData
  const availableGrades = useMemo(() => {
    if (!schoolData?.grades) return [];
    return schoolData.grades.map(grade => grade.class);
  }, [schoolData?.grades]);

  // Get sections for the selected grade
  const availableSections = useMemo(() => {
    if (!schoolData?.grades || !filters.grade) return [];
    const selectedGrade = schoolData.grades.find(g => g.class === filters.grade);
    return selectedGrade?.section?.map(s => s.name) || [];
  }, [schoolData?.grades, filters.grade]);

  // Effect to handle initial load
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (schoolId) {
        setShouldFetch(true);
      }
    }
  }, [schoolId]);

  const handleFilterChange = (filterName, value) => {
    console.log('Filter changed:', filterName, value);
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleApplyFilters = () => {
    console.log('Applying filters:', filters);
    setShouldFetch(true);
  };

  const handleSearch = () => {
    if (schoolId) {
      console.log('Searching with term:', searchTerm);
      setShouldFetch(true);
    }
  };

  const handleSearchInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleFetchComplete = () => {
    setShouldFetch(false);
  };

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setShowAssessmentList(true);
  };

  const handleCloseAssessmentList = () => {
    setSelectedStudent(null);
    setShowAssessmentList(false);
  };

  return (
    <div className="flex flex-col h-full bg-white p-6">
      {/* Search and Actions Bar */}
      <div className="mb-6">
        <div className="relative flex gap-4">
          <div className="w-96">
            <input
              type="text"
              placeholder="Search assessments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleSearchInputKeyPress}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <FaSearch />
            Search
          </button>
          <button
            onClick={() => setShowFilters(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <FaFilter />
            Filters
          </button>
          <button
            onClick={() => setShowBulkUpload(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <FaUpload />
            Bulk Upload
          </button>
          <button
            onClick={() => setShowBulkDownload(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <FaDownload />
            Bulk Download
          </button>
        </div>

        {/* Active Filters Display */}
        {Object.values(filters).some(value => value) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => {
              if (!value) return null;
              return (
                <div key={key} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  <span>{key}: {value}</span>
                  <button
                    onClick={() => handleFilterChange(key, '')}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Assessment List */}
      <div className="flex-1 overflow-hidden">
        <AssessmentList
          onViewDetails={handleViewDetails}
          loading={loading}
          searchTerm={searchTerm}
          filters={filters}
          schoolId={schoolId}
          shouldFetch={shouldFetch}
          onFetchComplete={handleFetchComplete}
        />
      </div>

      {/* Assessment Details Modal */}
      <ViewAssessmentDetails
        isOpen={showDetails}
        onClose={() => {
          setShowDetails(false);
          setSelectedAssessment(null);
        }}
        assessment={selectedAssessment}
      />

      {/* Add Assessment Form Modal */}
      <AddAssessmentForm
        isOpen={showAddForm}
        onClose={() => {
          setShowAddForm(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent}
      />

      {/* Student Assessment List */}
      <StudentAssessmentList
        isOpen={showAssessmentList}
        onClose={handleCloseAssessmentList}
        student={selectedStudent}
      />

      {/* Filters Modal */}
      <AssessmentFilters
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onApplyFilters={handleApplyFilters}
        schoolData={schoolData}
        isLoading={isLoadingSchool}
      />

      <BulkDownload
        isOpen={showBulkDownload}
        onClose={() => setShowBulkDownload(false)}
      />

      <BulkAssessmentForm
        isOpen={showBulkUpload}
        onClose={() => setShowBulkUpload(false)}
        onSuccess={() => {
          setShowBulkUpload(false);
          setShouldFetch(true);
        }}
      />
    </div>
  );
};

export default AssessmentReport; 