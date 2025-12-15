import { NavLink } from 'react-router-dom';
import { FiUsers, FiClipboard, FiActivity, FiBarChart2 } from 'react-icons/fi';

const MainLayout = ({ children }) => {
  const navItems = [
    { path: '/ahana/students', label: 'Students', icon: FiUsers },
    { path: '/ahana/assessments', label: 'Assessments', icon: FiClipboard },
    { path: '/ahana/infirmary', label: 'Infirmary', icon: FiActivity },
    { path: '/ahana/reports', label: 'Reports', icon: FiBarChart2 },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-indigo-600">Ahana</h1>
        </div>
        <nav className="mt-6">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-6 py-3 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 ${
                  isActive ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600' : ''
                }`
              }
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default MainLayout; 