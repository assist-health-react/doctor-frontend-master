import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import  ProfileMenu  from './ProfileMenu';
import  NotificationMenu  from './NotificationMenu';
import { doctorsService } from '../../services/doctorsService';
//import { navigatorsService } from '../../services/navigatorsService';

export const Header = ({ onLogout }) => {
  const location = useLocation();
  const [profileData, setProfileData] = useState({
    name: '',
    email: ''
  });
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await doctorsService.getProfile();
        if (response?.status === 'success' && response?.data) {
          setProfileData({
            name: response.data.name || '',
            email: response.data.email || ''
          });
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    fetchProfile();
  }, []);
  
  // Function to get the current section title
  const getCurrentTitle = () => {
    const path = location.pathname;
    
    // Map of paths to their display names
    const titles = {
      '/': 'Dashboard',
      '/navigators': 'Navigators',
      '/doctors': 'Doctors',
      '/members': 'Members',
      '/ahana': 'Ahana',
      '/empanelled-doctors': 'Empanelled Doctors',
      '/appointments': 'Appointments',
      '/blog': 'Blog',
      '/ecommerce': 'E-commerce',
      '/settings': 'Settings',
      '/profile': 'Profile'
    };
    
    return titles[path] || '';
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="flex items-center justify-between h-[72px] px-8 border-b">
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-gray-800">
            {getCurrentTitle()}
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <NotificationMenu />
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-700 font-medium">
              {profileData.name || 'Loading...'}
            </span>
            <ProfileMenu onLogout={onLogout} />
          </div>
        </div>
      </div>
    </header>
  );
}; 