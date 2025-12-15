import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import { useOutletContext } from 'react-router-dom';
import ReportFilters from './ReportFilters';
import ReportList from './ReportList';
import { getAllInfirmaryRecords } from '../../../services/infirmaryService';

const Report = () => {
  const { schoolId, schoolData } = useOutletContext() || {};
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    studentId: '',
    name: '',
    grade: '',
    section: '',
    fromDate: '',
    toDate: ''
  });
  const [appliedFilters, setAppliedFilters] = useState({
    studentId: '',
    name: '',
    grade: '',
    section: '',
    fromDate: '',
    toDate: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInputValue, setSearchInputValue] = useState('');
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [reports, setReports] = useState([]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      
      // Prepare query parameters
      const params = {
        schoolId,
        class: appliedFilters.grade || undefined,
        section: appliedFilters.section || undefined,
        studentId: appliedFilters.studentId || undefined,
        name: appliedFilters.name || undefined,
        fromDate: appliedFilters.fromDate || undefined,
        toDate: appliedFilters.toDate || undefined,
        search: searchTerm || undefined
      };

      // Remove undefined values
      Object.keys(params).forEach(key => 
        params[key] === undefined && delete params[key]
      );

      console.log('Fetching reports with params:', params);
      const response = await getAllInfirmaryRecords(params);
      
      if (response && response.data) {
        const formattedReports = response.data.map(record => ({
          id: record._id,
          date: record.date,
          type: 'Infirmary',
          details: {
            name: record.studentId?.name || 'N/A',
            studentId: record.studentId?.memberId || 'N/A',
            school: record.schoolId?.name || 'N/A',
            complaints: record.complaints || 'N/A',
            details: record.details || 'N/A',
            consentFrom: record.consentFrom || 'N/A',
            treatment: record.treatmentGiven || record.treatment || 'N/A'
          }
        }));
        setReports(formattedReports);
        setHasMore(false); // Since we're getting all records at once
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [appliedFilters, searchTerm]);

  const filteredData = useMemo(() => {
    return reports;
  }, [reports]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    setShowFilters(false);
  };

  const handleRemoveFilter = (key) => {
    const newFilters = {
      ...filters,
      [key]: ''
    };
    setFilters(newFilters);
    setAppliedFilters(newFilters);
  };

  const handleSearch = () => {
    setSearchTerm(searchInputValue);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const loadMoreItems = () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setTimeout(() => {
      setVisibleRange(prev => ({
        start: prev.start,
        end: Math.min(prev.end + 10, filteredData.length)
      }));
      setHasMore(visibleRange.end + 10 < filteredData.length);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="flex flex-col h-full bg-white p-6">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative flex gap-4">
          <div className="flex gap-2 w-96">
            <input
              type="text"
              placeholder="Search reports..."
              value={searchInputValue}
              onChange={(e) => setSearchInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
            >
              <FaSearch />
              Search
            </button>
          </div>
          <button
            onClick={() => setShowFilters(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <FaFilter />
            Filters
          </button>
        </div>

        {/* Active Filters Display */}
        {Object.entries(appliedFilters).some(([key, value]) => value) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(appliedFilters).map(([key, value]) => {
              if (!value) return null;
              return (
                <div key={key} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  <span>{key}: {value}</span>
                  <button
                    onClick={() => handleRemoveFilter(key)}
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

      {/* Report List */}
      <ReportList
        reports={filteredData.slice(visibleRange.start, visibleRange.end)}
        loading={loading}
        onLoadMore={loadMoreItems}
        hasMore={hasMore}
      />

      {/* Filters Modal */}
      <ReportFilters
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onApplyFilters={handleApplyFilters}
        schoolData={schoolData}
        isLoading={loading}
      />
    </div>
  );
};

export default Report; 