import React from 'react'

const BasicSettings = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
    <div className="bg-white p-4 rounded-lg shadow-sm max-w-sm">
      <h3 className="text-base font-medium text-gray-800 mb-3">Profile Settings</h3>
      {/* ... existing BasicSettings code ... */}
    </div>

    <div className="bg-white p-4 rounded-lg shadow-sm max-w-sm">
      <h3 className="text-base font-medium text-gray-800 mb-3">Notification Preferences</h3>
      {/* ... existing BasicSettings code ... */}
    </div>
  </div>
)

export default BasicSettings 