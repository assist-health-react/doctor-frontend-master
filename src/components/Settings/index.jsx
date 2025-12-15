import React, { useState, useEffect } from 'react'
import { useLocation, Routes, Route } from 'react-router-dom'
import TabButton from './TabButton'
import BasicSettings from './BasicSettings'
import SecondarySettings from './SecondarySettings'
import Utilities from './Utilities'
import SchoolManagement from './school'
import HealthcareManagement from './healthcare'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('basic')
  const location = useLocation()

  useEffect(() => {
    if (location.state?.from === 'profile') {
      setActiveTab('secondary')
    }
  }, [location])

  const tabs = [
    { id: 'basic', label: 'Basic Settings' },
    { id: 'secondary', label: 'Secondary Settings' },
    { id: 'utilities', label: 'Utilities' }
  ]

  return (
    <div className="p-4 space-y-4">
      <Routes>
        <Route path="school/*" element={<SchoolManagement />} />
        <Route path="healthcare/*" element={<HealthcareManagement />} />
        <Route path="*" element={
          <>
            {/* Tab Navigation */}
            <div className="bg-gray-50 p-1 rounded-lg inline-flex gap-2">
              {tabs.map(tab => (
                <TabButton
                  key={tab.id}
                  active={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </TabButton>
              ))}
            </div>

            {/* Tab Content */}
            <div className="mt-4">
              {activeTab === 'basic' && <BasicSettings />}
              {activeTab === 'secondary' && <SecondarySettings />}
              {activeTab === 'utilities' && <Utilities />}
            </div>
          </>
        } />
      </Routes>
    </div>
  )
}

export default Settings 