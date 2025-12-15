import { FaUserMd, FaUsers, FaCalendarCheck, FaCalendarAlt, FaSpinner, FaCheckCircle, FaUserPlus } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getStats } from '../../services/statsService'

const StatsGrid = () => {
  const navigate = useNavigate()
  const [statsData, setStatsData] = useState({
    members: 0,
    doctors: 0,
    appointments: 0,
    pending: 0,
    ongoing: 0,
    completed: 0,
    newMembers: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchStats()
  }, [])

  // const fetchStats = async () => {
  //   try {
  //     setIsLoading(true)
  //     const response = await getStats()
  //     if (response.status === 'success') {
  //       setStatsData(response.data)
  //     }
  //   } catch (err) {
  //     console.error('Error fetching stats:', err)
  //     setError('Failed to load statistics')
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }
  const fetchStats = async () => {
  try {
    setIsLoading(true)
    const response = await getStats()

    if (response.status === 'success') {
      setStatsData(prev => ({
        ...prev,
        ...response.data
      }))
    }
  } catch (err) {
    console.error('Error fetching stats:', err)
    setError('Failed to load statistics')
  } finally {
    setIsLoading(false)
  }
}


  const stats = [
    { 
      name: 'Members', 
      count: statsData.members, 
      icon: FaUsers, 
      gradient: 'bg-gradient-to-br from-blue-500 to-blue-700', 
      path: '/members' 
    },
    { 
      name: 'Doctors', 
      count: statsData.doctors, 
      icon: FaUserMd, 
      gradient: 'bg-gradient-to-br from-green-500 to-green-700', 
      path: '/doctors' 
    },
    { 
      name: 'Appointments', 
      count: statsData.appointments, 
      icon: FaCalendarAlt, 
      gradient: 'bg-gradient-to-br from-purple-500 to-purple-700', 
      path: '/appointments' 
    },
    { 
      name: 'Pending Appointments', 
      count: statsData.pending, 
      icon: FaCalendarCheck, 
      gradient: 'bg-gradient-to-br from-yellow-500 to-yellow-700', 
      path: '/appointments?status=pending' 
    },
    { 
      name: 'Ongoing Appointments', 
      count: statsData.ongoing, 
      icon: FaSpinner, 
      gradient: 'bg-gradient-to-br from-orange-500 to-orange-700', 
      path: '/appointments?status=ongoing' 
    },
    { 
      name: 'Completed Appointments', 
      count: statsData.completed, 
      icon: FaCheckCircle, 
      gradient: 'bg-gradient-to-br from-teal-500 to-teal-700', 
      path: '/appointments?status=completed' 
    },
    { 
      name: 'New Members', 
      count: statsData.newMembers, 
      icon: FaUserPlus, 
      gradient: 'bg-gradient-to-br from-pink-500 to-pink-700', 
      path: '/members?filter=new' 
    }
  ]

  const handleClick = (path) => {
    if (path) {
      navigate(path)
    }
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    )
  }

  return (
    // <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 w-full">

      {stats.map((item) => (
        <div
          key={item.name}
          className={`${item.gradient} rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 hover:brightness-110 cursor-pointer`}
          onClick={() => handleClick(item.path)}
        >
         <div className="p-4 sm:p-6 relative">

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
                    {isLoading ? (
                      <span className="inline-block w-12 h-8 bg-white/20 rounded animate-pulse"></span>
                    ) : (
                      (Number(item.count) || 0).toLocaleString()
                    )}
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
  )
}

export default StatsGrid 