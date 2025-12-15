import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { doctorsService } from '../../services/doctorsService';

export const ProfileMenu = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    profilePic: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Get initials from the user name
  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await doctorsService.getProfile();
        console.log('API Response:', response); // Debug log
        
        if (response?.status === 'success' && response?.data) {
          // Only use the name field from the API response
          const displayName = response.data.name;
          
          // Only set profile data if we have a name
          if (displayName) {
            setProfileData({
              name: displayName,
              email: response.data.email || '',
              profilePic: response.data.profilePic || null
            });
          } else {
            console.log('No name found in API response');
          }
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    onLogout();
    setIsOpen(false);
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 focus:outline-none"
      >
        <div className="h-10 w-10 rounded-full overflow-hidden">
          {profileData.profilePic ? (
            <img 
              src={profileData.profilePic} 
              alt={profileData.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-blue-500 flex items-center justify-center text-white font-semibold">
              {getInitials(profileData.name)}
            </div>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-1 z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-800">{profileData.name}</p>
            <p className="text-xs text-gray-500">{profileData.email}</p>
          </div>
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