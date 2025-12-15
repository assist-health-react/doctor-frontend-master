import { useState, useEffect } from 'react'
import WelcomeCard from './WelcomeCard'
import StatsGrid from './StatsGrid'
import AppointmentCalendar from './AppointmentCalendar'
import { sampleMembers, sampleAppointments } from './constants'
import { doctorsService } from '../../services/doctorsService'
//import { navigatorsService } from '../../services/navigatorsService'
import './styles.css'

const Dashboard = () => {
  const [view, setView] = useState('week')
  const [date, setDate] = useState(new Date())
  const [members, setMembers] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const [navigator, setNavigator] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch navigator profile data
  useEffect(() => {
    const fetchNavigatorProfile = async () => {
      try {
        setLoading(true)
        const response = await doctorsService.getProfile()
        if (response?.status === 'success' && response?.data) {
          setNavigator(response.data)
        } else {
          throw new Error('Failed to fetch profile')
        }
      } catch (err) {
        console.error('Error fetching profile:', err)
        setError(err.message || 'Failed to fetch profile')
      } finally {
        setLoading(false)
      }
    }

    fetchNavigatorProfile()
  }, [])

  // Fetch members data
  useEffect(() => {
    setMembers(sampleMembers)
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
          end: new Date(birthday.getTime() + 24 * 60 * 60 * 1000),
          allDay: true,
          type: 'birthday'
        })

        // Add birthday for next year
        const nextYearBirthday = new Date(currentYear + 1, dob.getMonth(), dob.getDate())
        birthdayEvents.push({
          id: `birthday-${member.id}-${currentYear + 1}`,
          title: `🎂 ${member.name}'s Birthday`,
          start: nextYearBirthday,
          end: new Date(nextYearBirthday.getTime() + 24 * 60 * 60 * 1000),
          allDay: true,
          type: 'birthday'
        })
      }
    })

    return birthdayEvents
  }

  // Combine appointments and birthdays
  const events = [...sampleAppointments, ...createBirthdayEvents()]

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

  return (
    <div className="p-4">
      {error ? (
        <div className="text-red-600 mb-4">
          {error}
        </div>
      ) : loading ? (
        <div className="animate-pulse">
          <div className="h-48 bg-gray-200 rounded-2xl mb-8"></div>
          <div className="h-8 bg-gray-200 rounded mb-6 w-48"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded-xl"></div>
            <div className="h-96 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      ) : (
        <>
          <WelcomeCard navigator={navigator} />
          <h2 className="text-2xl font-semibold mb-6">Dashboard Overview</h2>
          <StatsGrid />
          <AppointmentCalendar
            events={events}
            view={view}
            date={date}
            onView={setView}
            onNavigate={setDate}
            selectedEvent={selectedEvent}
            tooltipPosition={tooltipPosition}
            handleEventMouseEnter={handleEventMouseEnter}
            handleEventMouseLeave={handleEventMouseLeave}
            members={members}
          />
        </>
      )}
    </div>
  )
}

export default Dashboard 