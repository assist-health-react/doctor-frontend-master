import { FaUserMd, FaUsers, FaCalendarCheck, FaCalendarAlt, FaSpinner, FaCheckCircle, FaUserPlus } from 'react-icons/fa'

export const stats = [
  { name: 'Members', count: 847, icon: FaUsers, gradient: 'bg-gradient-to-br from-blue-500 to-blue-700', path: '/members' },
  { name: 'Doctors', count: 128, icon: FaUserMd, gradient: 'bg-gradient-to-br from-green-500 to-green-700', path: '/doctors' },
  { name: 'Appointments', count: 156, icon: FaCalendarAlt, gradient: 'bg-gradient-to-br from-purple-500 to-purple-700', path: '/appointments' },
  { name: 'Pending Appointments', count: 45, icon: FaCalendarCheck, gradient: 'bg-gradient-to-br from-yellow-500 to-yellow-700', path: '/appointments?status=pending' },
  { name: 'Ongoing Appointments', count: 23, icon: FaSpinner, gradient: 'bg-gradient-to-br from-orange-500 to-orange-700', path: '/appointments?status=ongoing' },
  { name: 'Completed Appointments', count: 88, icon: FaCheckCircle, gradient: 'bg-gradient-to-br from-teal-500 to-teal-700', path: '/appointments?status=completed' },
  { name: 'New Members', count: 34, icon: FaUserPlus, gradient: 'bg-gradient-to-br from-pink-500 to-pink-700', path: '/members?filter=new' }
]

export const sampleMembers = [
  { id: "MEM001", name: "Rajesh Kumar", dob: "1985-05-15" },
  { id: "MEM002", name: "Priya Sharma", dob: "1990-08-25" },
  { id: "MEM003", name: "Arun Patel", dob: "1975-11-30" },
  { id: "MEM004", name: "Lakshmi Venkatesh", dob: "1982-03-18" },
  { id: "MEM005", name: "Mohammed Khan", dob: "1978-07-22" },
  { id: "MEM006", name: "Anjali Desai", dob: "1988-12-05" },
  { id: "MEM007", name: "Suresh Reddy", dob: "1980-09-28" },
  { id: "MEM008", name: "Kavita Malhotra", dob: "1992-04-15" }
]

export const sampleAppointments = [
  {
    title: 'Dental Checkup - Dr. Mehta',
    start: new Date(2025, 2, 13, 11, 0),
    end: new Date(2025, 2, 13, 12, 0),
    allDay: false,
    type: 'appointment'
  },
  {
    title: 'Cardiology Checkup - Dr. Sharma',
    start: new Date(2025, 2, 14, 10, 30),
    end: new Date(2025, 2, 14, 11, 30),
    allDay: false,
    type: 'appointment'
  }
] 