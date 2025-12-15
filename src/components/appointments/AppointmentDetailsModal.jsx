import React, { useState, useEffect } from 'react';
import { FaTimes, FaTrash } from 'react-icons/fa';
import { appointmentsService } from '../../services/appointmentsService';
import { toast } from 'react-toastify';
import EditAppointmentForm from './EditAppointmentForm';

const AppointmentDetailsModal = ({ isOpen, onClose, appointmentId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      if (!isOpen || !appointmentId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await appointmentsService.getAppointmentById(appointmentId);
        
        if (response?.data?.status === 'success' && response.data.data) {
          const appointmentData = response.data.data;
          setAppointment({
            _id: appointmentData._id,
            service: appointmentData.service,
            appointmentDateTime: appointmentData.appointmentDateTime,
            additionalInfo: appointmentData.additionalInfo || '',
            notes: appointmentData.notes || '',
            payment: appointmentData.payment || 'pending',
            status: appointmentData.status,
            doctorId: appointmentData.doctorId || null,
            specialization: appointmentData.specialization || 'Not Specified',
            hospitalName: appointmentData.hospitalName || 'Not Specified',
            hospitalAddress: appointmentData.hospitalAddress || '',
            appointedBy: appointmentData.appointedBy,
            navigatorId: appointmentData.navigatorId,
            member: {
              name: appointmentData.memberId?.name || 'N/A',
              memberId: appointmentData.memberId?.memberId || 'N/A',
              gender: appointmentData.memberId?.gender || 'Not Specified',
              phone: appointmentData.memberId?.phone || 'N/A',
              profilePic: appointmentData.memberId?.profilePic,
              address: appointmentData.memberAddress || null
            },
            prescription: appointmentData.prescription || { medicines: [] },
            appointmentDTLocal: appointmentData.appointmentDTLocal
          });
        } else {
          throw new Error('Failed to fetch appointment details');
        }
      } catch (err) {
        console.error('Error fetching appointment details:', err);
        setError(err.message || 'Failed to fetch appointment details');
        toast.error(err.message || 'Failed to fetch appointment details');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentDetails();
  }, [isOpen, appointmentId]);

  const handleEditSuccess = () => {
    setShowEditForm(false);
    // Refresh appointment details
    fetchAppointmentDetails();
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await appointmentsService.deleteAppointment(appointmentId);
      
      if (response?.data?.status === 'success') {
        toast.success('Appointment deleted successfully');
        setShowDeleteConfirm(false);
        onClose(); // Close the modal first
        if (typeof onSuccess === 'function') {
          onSuccess(); // Then trigger the refresh
        }
      } else {
        throw new Error('Failed to delete appointment');
      }
    } catch (err) {
      console.error('Error deleting appointment:', err);
      toast.error(err.message || 'Failed to delete appointment');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const DeleteConfirmationDialog = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]" onClick={(e) => e.stopPropagation()}>
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Confirm Delete</h3>
        <p className="text-gray-600 mb-6">Are you sure you want to delete this appointment? This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Deleting...
              </>
            ) : (
              <>
                <FaTrash className="w-4 h-4" />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  if (showEditForm) {
    return (
      <EditAppointmentForm
        onClose={() => setShowEditForm(false)}
        onSuccess={handleEditSuccess}
        appointment={{
          service: appointment.service,
          appointmentDateTime: new Date(appointment.appointmentDateTime).toISOString().slice(0, 16),
          additionalInfo: appointment.additionalInfo || '',
          comments: appointment.notes || '',
          paymentStatus: appointment.payment || 'pending',
          appointmentStatus: appointment.status,
          doctorName: appointment.doctorId?.name || 'Not Assigned',
          specialization: appointment.specialization !== 'Not Specified' ? { value: appointment.specialization, label: appointment.specialization } : null,
          clinicName: appointment.hospitalName !== 'Not Specified' ? appointment.hospitalName : '',
          memberDetails: {
            name: appointment.member.name || 'N/A',
            memberId: appointment.member.memberId || 'N/A',
            gender: appointment.member.gender || 'Not Specified',
            phone: appointment.member.phone || 'N/A',
            address: appointment.member.address ? {
              description: appointment.member.address.description || '',
              landmark: appointment.member.address.landmark || '',
              region: appointment.member.address.region || '',
              state: appointment.member.address.state || '',
              country: appointment.member.address.country || '',
              pinCode: appointment.member.address.pinCode || ''
            } : null
          }
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">Appointment Details</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 hover:bg-red-100 text-red-600 rounded-full"
              title="Delete Appointment"
            >
              <FaTrash className="w-4 h-4" />
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <FaTimes className="text-gray-500" />
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : appointment ? (
          <div className="space-y-6">
            {/* Member Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-700 mb-3">Member Details</h4>
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0">
                  <img
                    src={appointment.member?.profilePic || 'https://via.placeholder.com/100?text=No+Image'}
                    alt={appointment.member?.name}
                    className="w-24 h-24 rounded-lg object-cover border-2 border-gray-200"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100?text=No+Image';
                    }}
                  />
                </div>
                <div className="flex-grow grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{appointment.member.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Member ID</p>
                    <p className="font-medium">{appointment.member.memberId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium">{appointment.member.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Mobile Number</p>
                    <p className="font-medium">{appointment.member.phone}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">Address</p>
                {appointment.member.address ? (
                  <div className="space-y-1">
                    <p className="font-medium">{appointment.member.address.description}</p>
                    {appointment.member.address.landmark && (
                      <p className="font-medium">Landmark: {appointment.member.address.landmark}</p>
                    )}
                    <p className="font-medium">
                      {appointment.member.address.region}, {appointment.member.address.state}, {appointment.member.address.country}
                    </p>
                    <p className="font-medium">PIN: {appointment.member.address.pinCode}</p>
                  </div>
                ) : (
                  <p className="font-medium">Address not available</p>
                )}
              </div>
            </div>

            {/* Appointment Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Service</p>
                <p className="font-medium">{appointment.service}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date & Time</p>
                <p className="font-medium">{appointment.appointmentDTLocal || new Date(appointment.appointmentDateTime).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Doctor's Name</p>
                <p className="font-medium">{appointment.doctorId?.name || 'Not Assigned'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Doctor ID</p>
                <p className="font-medium">{appointment.doctorId?.doctorId || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Specialization</p>
                <p className="font-medium">{appointment.specialization}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Status</p>
                <p className="font-medium capitalize">{appointment.payment}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Appointment Status</p>
                <p className="font-medium capitalize">{appointment.status}</p>
              </div>
            </div>

            {/* Clinic/Hospital Details */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Hospital/Clinic Name</p>
                <p className="font-medium">{appointment.hospitalName}</p>
              </div>
              {appointment.hospitalAddress && (
                <div>
                  <p className="text-sm text-gray-500">Hospital/Clinic Address</p>
                  <p className="font-medium whitespace-pre-line">{appointment.hospitalAddress}</p>
                </div>
              )}
            </div>

            {/* Additional Information */}
            {appointment.additionalInfo && (
              <div>
                <p className="text-sm text-gray-500">Additional Information</p>
                <p className="font-medium">{appointment.additionalInfo}</p>
              </div>
            )}

            {/* Notes */}
            {appointment.notes && (
              <div>
                <p className="text-sm text-gray-500">Notes</p>
                <p className="font-medium">{appointment.notes}</p>
              </div>
            )}

            {/* Prescription */}
            {appointment.prescription?.medicines?.length > 0 && (
              <div>
                <p className="text-sm text-gray-500">Prescription</p>
                <div className="mt-2">
                  {appointment.prescription.medicines.map((medicine, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg mb-2">
                      <p className="font-medium">{medicine.name}</p>
                      {medicine.dosage && <p className="text-sm text-gray-600">Dosage: {medicine.dosage}</p>}
                      {medicine.duration && <p className="text-sm text-gray-600">Duration: {medicine.duration}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No appointment details found
          </div>
        )}
      </div>
      {showDeleteConfirm && <DeleteConfirmationDialog />}
    </div>
  );
};

export default AppointmentDetailsModal; 