import React from 'react'
import { FaGlobe, FaPhone, FaEnvelope, FaMapMarkerAlt, FaUserTie, FaGraduationCap, FaMapPin, FaLocationArrow, FaCity, FaFlag } from 'react-icons/fa'

const SchoolDetails = ({ school }) => {
  if (!school) return null

  const renderContactItem = (icon, label, value, isLink = false) => (
    <div className="flex items-start gap-3">
      <div className="mt-1 text-blue-500">{icon}</div>
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-500">{label}</div>
        {isLink ? (
          <a 
            href={value} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:text-blue-700 hover:underline mt-0.5 block"
          >
            {value}
          </a>
        ) : (
          <div className="text-gray-900 mt-0.5">{value || 'Not specified'}</div>
        )}
      </div>
    </div>
  )

  const SectionHeader = ({ icon, title }) => (
    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
      <div className="text-blue-500 text-xl">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with Logo and Basic Info */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <div className="flex gap-6 items-start">
          <div className="flex-shrink-0">
            {school.logo ? (
              <img
                src={school.logo}
                alt={`${school.name} logo`}
                className="w-32 h-32 rounded-xl object-cover border border-gray-100 shadow-sm"
              />
            ) : (
              <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center border border-gray-100 shadow-sm">
                <span className="text-6xl font-semibold text-blue-500">
                  {school.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="flex-grow pt-2">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-2xl font-semibold text-gray-800">{school.name}</h2>
              {school.schoolId && (
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full font-medium">
                  ID: {school.schoolId}
                </span>
              )}
              {school.isActive && (
                <span className="px-3 py-1 bg-green-50 text-green-600 text-sm rounded-full font-medium">
                  Active
                </span>
              )}
            </div>
            <p className="text-gray-600 leading-relaxed">{school.description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Information */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <SectionHeader icon={<FaPhone />} title="Contact Information" />
          <div className="space-y-6">
            {renderContactItem(
              <FaPhone />,
              "Phone Number",
              school.contactNumber
            )}
            {renderContactItem(
              <FaEnvelope />,
              "Email Address",
              school.email
            )}
            {school.website && renderContactItem(
              <FaGlobe />,
              "Website",
              school.website,
              true
            )}
          </div>
        </div>

        {/* Principal Information */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <SectionHeader icon={<FaUserTie />} title="Principal Details" />
          <div className="space-y-6">
            {renderContactItem(
              <FaUserTie />,
              "Name",
              school.principal?.name
            )}
            {renderContactItem(
              <FaPhone />,
              "Contact",
              school.principal?.phone
            )}
            {renderContactItem(
              <FaEnvelope />,
              "Email",
              school.principal?.email
            )}
          </div>
        </div>

        {/* Location Information */}
        <div className="bg-white rounded-xl p-6 shadow-sm lg:col-span-2">
          <SectionHeader icon={<FaMapMarkerAlt />} title="Location Details" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="md:col-span-2">
              {renderContactItem(
                <FaMapMarkerAlt />,
                "Address",
                school.address?.description
              )}
            </div>
            <div>
              {renderContactItem(
                <FaLocationArrow />,
                "Landmark",
                school.address?.landmark
              )}
            </div>
            <div>
              {renderContactItem(
                <FaMapPin />,
                "PIN Code",
                school.address?.pinCode
              )}
            </div>
            <div>
              {renderContactItem(
                <FaMapPin />,
                "Region",
                school.address?.region
              )}
            </div>
            <div>
              {renderContactItem(
                <FaCity />,
                "City",
                school.address?.city || (school.address?.region ? school.address.region.split('(')[1]?.replace(')', '') : 'Not specified')
              )}
            </div>
            <div>
              {renderContactItem(
                <FaFlag />,
                "State",
                school.address?.state
              )}
            </div>
            <div>
              {renderContactItem(
                <FaGlobe />,
                "Country",
                school.address?.country || 'India'
              )}
            </div>
          </div>
        </div>

        {/* Grades Information */}
        <div className="bg-white rounded-xl p-6 shadow-sm lg:col-span-2">
          <SectionHeader icon={<FaGraduationCap />} title="Grades & Sections" />
          <div className="space-y-6">
            {school.grades?.length > 0 ? (
              school.grades.map((grade, index) => (
                <div key={index} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                  <h4 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </span>
                    {grade.class}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {grade.section.map((section, sIndex) => (
                      <div 
                        key={sIndex} 
                        className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors"
                      >
                        <div className="text-sm font-medium text-gray-700 mb-1">Section {section.name}</div>
                        <div className="text-sm text-blue-600 font-medium">
                          {section.studentsCount} students
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FaGraduationCap className="text-gray-400 text-4xl mx-auto mb-3" />
                <p>No grades configured</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SchoolDetails 