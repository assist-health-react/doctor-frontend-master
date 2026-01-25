import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';

const ProfileMenu = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const profile = localStorage.getItem('userProfile');
      if (profile) {
        const parsedProfile = JSON.parse(profile);
        return {
          name: parsedProfile.name || 'Admin',
          profilePic: parsedProfile.profilePic || null
        };
      }
    } catch (error) {
      console.error('Error parsing profile:', error);
    }
    return { name: 'Admin', profilePic: null };
  });
  const menuRef = useRef(null);

  // Get initials from the user name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleStorageChange = () => {
      try {
        const profile = localStorage.getItem('userProfile');
        if (profile) {
          const parsedProfile = JSON.parse(profile);
          setUserProfile({
            name: parsedProfile.name || 'Admin',
            profilePic: parsedProfile.profilePic || null
          });
        }
      } catch (error) {
        console.error('Error handling storage change:', error);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    onLogout();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 focus:outline-none"
      >
        <div className="h-10 w-10 rounded-full overflow-hidden">
          {userProfile.profilePic ? (
            <img 
              src={userProfile.profilePic} 
              alt={userProfile.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-blue-500 flex items-center justify-center text-white font-semibold">
              {getInitials(userProfile.name)}
            </div>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
          <Link
            to="/profile"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <FaUser className="mr-3" />
            Profile
          </Link>
          <Link
            to="/settings"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <FaCog className="mr-3" />
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <FaSignOutAlt className="mr-3" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu; 