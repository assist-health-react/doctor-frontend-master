import React from 'react';
import { FaEye, FaEdit } from 'react-icons/fa'
import AppointmentDetailsModal from './AppointmentDetailsModal'

const AppointmentsList = ({ 
  appointments, 
  loading,
  handleViewAppointment, 
  handleStatusChange,
  handleEditAppointment,
  onDownload,
  onRefresh
}) => {
  const [selectedAppointmentId, setSelectedAppointmentId] = React.useState(null);

  const handleViewClick = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    handleViewAppointment(appointmentId);
  };

  const handleCloseModal = () => {
    setSelectedAppointmentId(null);
    handleViewAppointment(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'ongoing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'ongoing':
        return 'Ongoing';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  if (loading && appointments.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md w-full p-8">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!appointments.length) {
    return (
      <div className="bg-white rounded-xl shadow-md w-full p-8 text-center">
        <p className="text-gray-500">No appointments found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md w-full">
      <div className="overflow-x-auto relative">
        <table className="w-full table-fixed divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="w-[5%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
              <th scope="col" className="w-[10%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">M-ID</th>
              <th scope="col" className="w-[20%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="w-[15%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
              <th scope="col" className="w-[10%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="w-[20%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Comments</th>
              <th scope="col" className="w-[10%] pl-6 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
              <th scope="col" className="w-[10%] px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appointments.map((appointment, index) => (
              <tr key={appointment._id} className="hover:bg-gray-50">
                <td className="px-3 py-4 whitespace-nowrap text-sm">
                  {index + 1}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm">
                  {appointment.memberId?.memberId || 'N/A'}
                </td>
                <td className="px-3 py-4 text-sm">
                  <div>
                    <div className="font-medium">{appointment.memberId?.name || 'N/A'}</div>
                  </div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm">
                  {appointment.memberId?.phone || 'N/A'}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                    {getStatusLabel(appointment.status)}
                  </span>
                </td>
                <td className="px-3 py-4 text-sm hidden lg:table-cell">
                  <div className="max-w-xs truncate">
                    {appointment.notes || appointment.additionalInfo || 'No comments'}
                  </div>
                </td>
                <td className="pl-6 px-3 py-4 whitespace-nowrap text-sm capitalize">
                  {appointment.payment || 'N/A'}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-center text-sm">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleViewClick(appointment._id)}
                      className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 text-sm inline-flex items-center justify-center"
                      title="View"
                    >
                      <FaEye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditAppointment(appointment._id)}
                      className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 text-sm inline-flex items-center justify-center"
                      title="Edit"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Appointment Details Modal */}
      <AppointmentDetailsModal
        isOpen={!!selectedAppointmentId}
        onClose={handleCloseModal}
        appointmentId={selectedAppointmentId}
        onSuccess={() => {
          handleCloseModal();
          // Call both the view handler and the refresh function
          if (typeof onRefresh === 'function') {
            onRefresh();
          }
        }}
      />
    </div>
  )
}

export default AppointmentsList 