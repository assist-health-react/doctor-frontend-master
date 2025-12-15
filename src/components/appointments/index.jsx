import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddAppointmentForm from './AddAppointmentForm';
import EditAppointmentForm from './EditAppointmentForm';
import AppointmentDetailsModal from './AppointmentDetailsModal';
import AppointmentsList from './AppointmentsList';
import SearchAndFilters from './SearchAndFilters';
import Pagination from './Pagination';
import { appointmentsService } from '../../services/appointmentsService';
import { toast } from 'react-toastify';

const Appointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchAppointments = async (page = currentPage, search = searchTerm, status = statusFilter) => {
    try {
      setLoading(true);
      setError(null);

      // Get user from localStorage to get navigatorId
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.userId) {
        throw new Error('User not authenticated');
      }

      const response = await appointmentsService.getAppointments({
        page,
        limit: itemsPerPage,
        search: search,
        status: status !== 'all' ? status : undefined,
        doctorId: user.userId
      });

      if (response?.status === 'success') {
        setAppointments(response.data || []);
        // Update pagination state
        const pagination = response.pagination || { total: 0, page: 1, pages: 1 };
        setTotalItems(pagination.total);
        setTotalPages(pagination.pages);
        setItemsPerPage(pagination.limit || itemsPerPage);
        setCurrentPage(pagination.page || page);
      } else {
        throw new Error('Failed to fetch appointments');
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(err.message || 'Failed to fetch appointments');
      toast.error(err.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearch = (term, status) => {
    setSearchTerm(term);
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when searching
    fetchAppointments(1, term, status); // Immediately fetch with new search term
  };

  const handleViewAppointment = async (appointmentId) => {
    if (!appointmentId) {
      setSelectedAppointmentId(null);
      setSelectedAppointment(null);
      return;
    }

    try {
      setLoading(true);
      const response = await appointmentsService.getAppointmentById(appointmentId);
      if (response?.data?.status === 'success') {
        setSelectedAppointment(response.data.data);
        setSelectedAppointmentId(appointmentId);
      } else {
        throw new Error('Failed to fetch appointment details');
      }
    } catch (err) {
      console.error('Error fetching appointment details:', err);
      toast.error(err.message || 'Failed to fetch appointment details');
    } finally {
      setLoading(false);
    }
  };

  const handleEditAppointment = async (appointmentId) => {
    try {
      setLoading(true);
      const response = await appointmentsService.getAppointmentById(appointmentId);
      if (response?.data?.status === 'success') {
        setSelectedAppointment(response.data.data);
        setShowEditForm(true);
      } else {
        throw new Error('Failed to fetch appointment details');
      }
    } catch (err) {
      console.error('Error fetching appointment details:', err);
      toast.error(err.message || 'Failed to fetch appointment details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Appointments</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Appointment
        </button>
      </div>

      <div className="mb-6">
        <SearchAndFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onSearch={handleSearch}
        />
      </div>

      <AppointmentsList
        appointments={appointments}
        loading={loading}
        handleViewAppointment={handleViewAppointment}
        handleEditAppointment={handleEditAppointment}
        onRefresh={() => fetchAppointments(currentPage, searchTerm, statusFilter)}
      />

      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}

      {showAddForm && (
        <AddAppointmentForm
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            setShowAddForm(false);
            fetchAppointments(1); // Fetch first page after adding
          }}
        />
      )}

      {showEditForm && selectedAppointment && (
        <EditAppointmentForm
          onClose={() => {
            setShowEditForm(false);
            setSelectedAppointmentId(null);
            setSelectedAppointment(null);
          }}
          onSuccess={() => {
            setShowEditForm(false);
            setSelectedAppointmentId(null);
            setSelectedAppointment(null);
            fetchAppointments(currentPage);
          }}
          appointment={selectedAppointment}
        />
      )}
    </div>
  );
};

export default Appointments; 