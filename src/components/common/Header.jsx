import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProfileMenu from './ProfileMenu';
import NotificationMenu from './NotificationMenu';

const Header = ({ onLogout }) => {
  const location = useLocation();
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const profile = localStorage.getItem('userProfile');
      if (profile) {
        const parsedProfile = JSON.parse(profile);
        return {
          name: parsedProfile.name || 'Admin',
          email: parsedProfile.email || '',
          phoneNumber: parsedProfile.phoneNumber || '',
          profilePic: parsedProfile.profilePic || null
        };
      }
    } catch (error) {
      console.error('Error parsing profile:', error);
    }
    return { name: 'Admin', email: '', phoneNumber: '', profilePic: null };
  });
  
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const profile = localStorage.getItem('userProfile');
        if (profile) {
          const parsedProfile = JSON.parse(profile);
          setUserProfile({
            name: parsedProfile.name || 'Admin',
            email: parsedProfile.email || '',
            phoneNumber: parsedProfile.phoneNumber || '',
            profilePic: parsedProfile.profilePic || null
          });
        }
      } catch (error) {
        console.error('Error handling storage change:', error);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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
      '/profile': 'Profile',
      '/directory/hospitals': 'Hospitals',
      '/directory/doctors': 'Doctors',
      '/directory/diagnostics': 'Diagnostics',
      '/directory/physiotherapy': 'Physiotherapy',
      '/directory/homecare': 'Homecare',
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
            <span className="text-sm text-gray-700 font-medium">{userProfile.name}</span>
            <ProfileMenu onLogout={onLogout} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 