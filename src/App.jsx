import { BrowserRouter as Router, Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Logo from './components/Logo'
import { Header } from './components/common/Header'
//import Header from './components/common/Header'
import { FaChevronLeft, FaChevronRight, FaChartBar, FaUserMd, FaUsers, 
  FaStar, FaCalendarAlt, FaNewspaper, FaCog,FaBars , FaClinicMedical } from 'react-icons/fa'
import './App.css'
import Dashboard from './components/dashboard'
import Doctors from './components/Doctors/index'
import Members from './components/members/index'
import EmpanelledDoctors from './components/empanelledDoctors/index'
import Appointments from './components/appointments/index'
import Blog from './components/blogs/index'
import Settings from './components/Settings/index'
import Ahana from './components/ahana/index'
import Profile from './components/profile/Profile'
import Login from './components/Login'
import ForgotPassword from './components/ForgotPassword'
import { SnackbarProvider } from './contexts/SnackbarContext'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  // Replace this with your actual authentication logic
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

// Layout Component
const Layout = ({ children }) => {
  const [isSidebarExpanded, setSidebarExpanded] = useState(true)
  const location = useLocation()

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    // Add any other logout logic here
  };
const iconColor = '#3ea767';
  const navigation = [
    { 
      name: 'Dashboard', 
      path: '/', 
      icon: <FaChartBar  style={{ color: iconColor }} />, 
      color: 'text-purple-500',
      description: 'Overview and Analytics'
    },
      { 
      name: 'Members', 
      path: '/members', 
      icon: <FaUsers   style={{ color: iconColor }} />, 
      color: 'text-indigo-500',
      description: 'Manage Patient Records'
    },
    { 
      name: 'Appointments', 
      path: '/appointments', 
      icon: <FaCalendarAlt  style={{ color: iconColor }} />, 
      color: 'text-blue-500',
      description: 'Schedule and Manage Appointments'
    },
  
    // { 
    //   name: 'Doctors', 
    //   path: '/doctors', 
    //   icon: <FaUserMd  style={{ color: iconColor }}/>, 
    //   color: 'text-green-500',
    //   description: 'Healthcare Providers Management'
    // },
    // { 
    //   name: 'Empanelled Doctors', 
    //   path: '/empanelled-doctors', 
    //   icon: <FaClinicMedical  style={{ color: iconColor }} />, 
    //   color: 'text-teal-500',
    //   description: 'Network Healthcare Providers'
    // },
    // { 
    //   name: 'Ahana', 
    //   path: '/ahana', 
    //   icon: <FaStar  style={{ color: iconColor }} />, 
    //   color: 'text-yellow-500',
    //   description: 'School Health Platform'
    // },
    { 
      name: 'Blog', 
      path: '/blog', 
      icon: <FaNewspaper  style={{ color: iconColor }} />, 
      color: 'text-pink-500',
      description: 'Health Articles & Updates'
    },
    { 
      name: 'Settings', 
      path: '/settings', 
      icon: <FaCog  style={{ color: iconColor }} />, 
      color: 'text-gray-500',
      description: 'System Preferences'
    }
  ]

  return (
    <div className="min-h-screen h-screen bg-gray-100 flex overflow-hidden">

        {/* Mobile Header */}
              <div className="lg:hidden flex items-center justify-between bg-white p-3 shadow-md fixed top-0 left-0 right-0 z-30">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setSidebarExpanded(!isSidebarExpanded)} 
                    className="p-2 rounded-md hover:bg-gray-100"
                  >
                    <FaBars className="w-6 h-6 text-gray-700" />
                  </button>
                  <img src="/assets/logo_new.png" alt="AssistHealth" className="h-8 object-contain" />
                </div>
              </div>
      {/* Sidebar - Now collapsible */}
      {/* <aside 
        className={`flex bg-white shadow-lg flex-col fixed h-full transition-all duration-300 ease-in-out
          ${isSidebarExpanded ? 'w-72' : 'w-20'} mobile:hidden tablet:flex`}
      > */}
        <aside
  className={`fixed inset-y-0 left-0 z-40 bg-white shadow-lg flex flex-col transition-all duration-300 ease-in-out
    ${isSidebarExpanded ? "w-72" : "w-20"} 
    ${isSidebarExpanded ? "translate-x-0" : "-translate-x-full"} 
    lg:translate-x-0`}
>
        {/* Logo Section */}
        <div className="p-2 sm:p-4 border-b flex items-center justify-between">
          {isSidebarExpanded ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <img 
                //src="/assets/assist-health-logo.png" 
                src="/assets/logo_new.png" 
                alt="AssistHealth" 
                className="h-12 w-auto"
                //className="h-12 w-8 sm:h-10 sm:w-10 object-contain"
              />
              {/* <div className="text-lg sm:text-xl font-semibold">
                <span className="text-gray-800">Assist</span>
                <span className="text-[#38B6FF]">Health</span>
              </div> */}
            </div>
          ) : (
            <img 
             // src="/assets/assist-health-logo.png" 
              src="/assets/logo_new.png" 
              alt="AH" 
              className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
            />
          )}
          <button 
            onClick={() => setSidebarExpanded(!isSidebarExpanded)}
            className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            {isSidebarExpanded ? <FaChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" /> : <FaChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-3">
            {navigation.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-4 py-3 rounded-lg transition-colors
                    ${isActive
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                    }`
                  }
                >
                  <span className={`text-xl ${item.color} transition-colors`}>{item.icon}</span>
                  {isSidebarExpanded && (
                    <span className="font-medium whitespace-nowrap">{item.name}</span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content Area - Adjusts with sidebar */}
      <main className={`flex-1 flex flex-col transition-all duration-300 ease-in-out
        ${isSidebarExpanded ? 'ml-72' : 'ml-20'} mobile:ml-0 w-[calc(100%-${isSidebarExpanded ? '18rem' : '5rem'})]`}>
        {/* Header */}
        <Header onLogout={handleLogout} userName="Navigator" />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 mobile:p-4">
          <div className="max-w-full mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}

function App() {
  return (
    <SnackbarProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/*" element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/doctors/*" element={<Doctors />} />
                  <Route path="/members/*" element={<Members />} />
                  <Route path="/empanelled-doctors/*" element={<EmpanelledDoctors />} />
                  <Route path="/appointments/*" element={<Appointments />} />
                  <Route path="/blog/*" element={<Blog />} />
                  <Route path="/settings/*" element={<Settings />} />
                  <Route path="/ahana/*" element={<Ahana />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </SnackbarProvider>
  )
}

export default App
