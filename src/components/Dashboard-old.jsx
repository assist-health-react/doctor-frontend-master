import { FaUserMd, FaUsers, FaCalendarCheck, FaCalendarAlt, FaSpinner, FaCheckCircle, FaUserPlus, FaEnvelope, FaPhone, FaUserCircle, FaBirthdayCake } from 'react-icons/fa'
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'
import { useState, useEffect } from 'react'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './Dashboard.css'

const locales = {
  'en-US': enUS
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

// Custom Tooltip Component
const EventTooltip = ({ event }) => {
  if (event.type === 'birthday') {
    const dob = new Date(members.find(m => m.id === event.id.split('-')[1])?.dob)
    const age = new Date().getFullYear() - dob.getFullYear()
    
    return (
      <div className="bg-white p-2 rounded-lg shadow-lg border border-gray-200">
        <div className="flex items-center gap-2">
          <FaBirthdayCake className="text-amber-500" />
          <span className="font-medium">{event.title}</span>
        </div>
        <div className="text-sm text-gray-600 mt-1">
          Turning {age} years old
        </div>
      </div>
    )
  }
  
  return (
    <div className="bg-white p-2 rounded-lg shadow-lg border border-gray-200">
      <span>{event.title}</span>
    </div>
  )
}

const Dashboard = () => {
  const [view, setView] = useState('week')
  const [date, setDate] = useState(new Date())
  const [members, setMembers] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })

  // Sample navigator data - replace with actual data from your backend
  const navigator = {
    name: "Sarah Johnson",
    email: "sarah.johnson@assisthealth.com",
    phone: "+91 98765 43210",
    profileImage: null // Add profile image URL if available
  }

  // Fetch members data
  useEffect(() => {
    // This would typically be an API call
    const fetchMembers = () => {
      // For now, using the sample data from Members component
      const sampleMembers = [
        {
          id: "MEM001",
          name: "Rajesh Kumar",
          dob: "1985-05-15",
        },
        {
          id: "MEM002",
          name: "Priya Sharma",
          dob: "1990-08-25",
        },
        {
          id: "MEM003",
          name: "Arun Patel",
          dob: "1975-11-30",
        },
        {
          id: "MEM004",
          name: "Lakshmi Venkatesh",
          dob: "1982-03-18",
        },
        {
          id: "MEM005",
          name: "Mohammed Khan",
          dob: "1978-07-22",
        },
        {
          id: "MEM006",
          name: "Anjali Desai",
          dob: "1988-12-05",
        },
        {
          id: "MEM007",
          name: "Suresh Reddy",
          dob: "1980-09-28",
        },
        {
          id: "MEM008",
          name: "Kavita Malhotra",
          dob: "1992-04-15",
        }
      ]
      setMembers(sampleMembers)
    }

    fetchMembers()
  }, [])

  // Create birthday events
  const createBirthdayEvents = () => {
    const currentYear = new Date().getFullYear()
    const birthdayEvents = []

    members.forEach(member => {
      if (member.dob) {
        const dob = new Date(member.dob)
        const birthday = new Date(currentYear, dob.getMonth(), dob.getDate())
        
        // Add birthday for current year
        birthdayEvents.push({
          id: `birthday-${member.id}-${currentYear}`,
          title: `🎂 ${member.name}'s Birthday`,
          start: birthday,
          end: new Date(birthday.getTime() + 24 * 60 * 60 * 1000), // End of the day
          allDay: true,
          type: 'birthday'
        })

        // Add birthday for next year
        const nextYearBirthday = new Date(currentYear + 1, dob.getMonth(), dob.getDate())
        birthdayEvents.push({
          id: `birthday-${member.id}-${currentYear + 1}`,
          title: `🎂 ${member.name}'s Birthday`,
          start: nextYearBirthday,
          end: new Date(nextYearBirthday.getTime() + 24 * 60 * 60 * 1000), // End of the day
          allDay: true,
          type: 'birthday'
        })
      }
    })

    return birthdayEvents
  }

  // Sample events - replace with your actual events data
  const appointments = [
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

  // Combine appointments and birthdays
  const events = [...appointments, ...createBirthdayEvents()]

  // Handle mouse events for tooltip
  const handleEventMouseEnter = (event, e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setSelectedEvent(event)
    setTooltipPosition({
      top: rect.top + window.scrollY - 10,
      left: rect.left + window.scrollX + rect.width / 2
    })
  }

  const handleEventMouseLeave = () => {
    setSelectedEvent(null)
  }

  // Custom event styles
  const eventStyleGetter = (event) => {
    if (event.type === 'birthday') {
      return {
        style: {
          backgroundColor: '#F59E0B',
          borderRadius: '4px',
          opacity: 0.8,
          color: 'white',
          border: '0',
          display: 'block',
          cursor: 'pointer'
        }
      }
    }
    return {
      style: {
        backgroundColor: '#3B82F6',
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0',
        display: 'block',
        cursor: 'pointer'
      }
    }
  }

  // Calendar event handlers
  const handleNavigate = (newDate) => setDate(newDate)
  const handleView = (newView) => setView(newView)

  // This would typically come from your backend/API
  const stats = [
    { name: 'Members', count: 847, icon: FaUsers, gradient: 'bg-gradient-to-br from-blue-500 to-blue-700' },
    { name: 'Doctors', count: 128, icon: FaUserMd, gradient: 'bg-gradient-to-br from-green-500 to-green-700' },
    { name: 'Appointments', count: 156, icon: FaCalendarAlt, gradient: 'bg-gradient-to-br from-purple-500 to-purple-700' },
    { name: 'Pending Appointments', count: 45, icon: FaCalendarCheck, gradient: 'bg-gradient-to-br from-yellow-500 to-yellow-700' },
    { name: 'Ongoing Appointments', count: 23, icon: FaSpinner, gradient: 'bg-gradient-to-br from-orange-500 to-orange-700' },
    { name: 'Completed Appointments', count: 88, icon: FaCheckCircle, gradient: 'bg-gradient-to-br from-teal-500 to-teal-700' },
    { name: 'New Members', count: 34, icon: FaUserPlus, gradient: 'bg-gradient-to-br from-pink-500 to-pink-700' }
  ]

  return (
    <div className="p-4">
      {/* Welcome Card with Glassmorphism */}
      <div className="relative mb-8 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-blue-400/90 backdrop-blur-xl"></div>
        <div className="absolute inset-0 bg-white/10"></div>
        <div className="relative backdrop-blur-sm border border-white/20 rounded-2xl p-8">
          <div className="flex items-center gap-8">
            <div className="shrink-0 bg-gradient-to-br from-white/20 to-white/10 p-4 rounded-2xl shadow-xl backdrop-blur-sm border border-white/20">
              {navigator.profileImage ? (
                <img 
                  src={navigator.profileImage} 
                  alt={navigator.name}
                  className="w-24 h-24 rounded-xl object-cover"
                />
              ) : (
                <FaUserCircle className="w-24 h-24 text-white/90" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-col">
                <h1 className="text-4xl font-bold text-white mb-6 tracking-tight">
                  Welcome, {navigator.name}
                </h1>
                <div className="space-y-4">
                  <div className="flex items-center text-white/90 hover:text-white transition-colors group">
                    <div className="bg-white/10 p-3 rounded-xl mr-4 group-hover:bg-white/20 transition-colors border border-white/10 backdrop-blur-sm">
                      <FaEnvelope className="w-6 h-6" />
                    </div>
                    <span className="text-lg font-medium tracking-wide">{navigator.email}</span>
                  </div>
                  <div className="flex items-center text-white/90 hover:text-white transition-colors group">
                    <div className="bg-white/10 p-3 rounded-xl mr-4 group-hover:bg-white/20 transition-colors border border-white/10 backdrop-blur-sm">
                      <FaPhone className="w-6 h-6" />
                    </div>
                    <span className="text-lg font-medium tracking-wide">{navigator.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((item) => (
          <div
            key={item.name}
            className={`${item.gradient} rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 hover:brightness-110`}
          >
            <div className="p-6 relative">
              <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 bg-white/10 rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="bg-white/20 p-3 rounded-lg shadow-lg backdrop-blur-sm">
                        <item.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                    </div>
                    <p className="mt-4 text-3xl font-bold text-white">
                      {item.count.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm text-white/90 hover:text-white">
                    <span className="flex items-center">
                      View Details
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Calendar Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Appointment Calendar</h3>
        <div style={{ height: '600px' }} className="relative">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            view={view}
            onView={handleView}
            date={date}
            onNavigate={handleNavigate}
            views={[Views.MONTH, Views.WEEK, Views.DAY]}
            min={new Date(2024, 0, 1, 8, 0)} // 8:00 AM
            max={new Date(2024, 0, 1, 20, 0)} // 8:00 PM
            step={30}
            timeslots={2}
            popup
            selectable
            onSelectEvent={event => console.log(event)}
            onSelectSlot={slotInfo => console.log(slotInfo)}
            eventStyleGetter={eventStyleGetter}
            onShowMore={(events, date) => console.log('show more', events, date)}
            components={{
              eventWrapper: ({ event, children }) => (
                <div
                  onMouseEnter={(e) => handleEventMouseEnter(event, e)}
                  onMouseLeave={handleEventMouseLeave}
                >
                  {children}
                </div>
              )
            }}
          />
          
          {/* Tooltip */}
          {selectedEvent && (
            <div
              style={{
                position: 'absolute',
                top: tooltipPosition.top,
                left: tooltipPosition.left,
                transform: 'translate(-50%, -100%)',
                zIndex: 1000
              }}
            >
              <EventTooltip event={selectedEvent} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard 