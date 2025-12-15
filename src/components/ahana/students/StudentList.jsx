import { useState } from 'react';
import { FiEdit2, FiEye } from 'react-icons/fi';
import boyStudentIcon from '../../../assets/icons/boy-student.png';
import girlStudentIcon from '../../../assets/icons/girl-student.png';

const StudentList = ({ 
  students = [], 
  loading,
  onViewDetails,
  onSelectStudent
}) => {
  console.log('StudentList rendered with students:', students);

  const getProfileImage = (student) => {
    // If profile picture exists, show it
    if (student.profilePic) {
      return (
        <img 
          src={student.profilePic} 
          alt={student.name}
          className="w-10 h-10 rounded-full object-cover"
          onError={(e) => {
            // If profile pic fails to load, fall back to gender icon
            e.target.onerror = null; // Prevent infinite loop
            e.target.src = student.gender?.toLowerCase() === 'female' ? girlStudentIcon : boyStudentIcon;
          }}
        />
      );
    }

    // If no profile picture, show gender-based icon
    const normalizedGender = (student.gender || '').toLowerCase().trim();
    if (normalizedGender === 'female') {
      return <img src={girlStudentIcon} alt="Female Student" className="w-10 h-10 object-contain" />;
    } else {
      return <img src={boyStudentIcon} alt="Male Student" className="w-10 h-10 object-contain" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Profile
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Class
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Section
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gender
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mobile
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.length > 0 ? (
              students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    {getProfileImage(student)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.studentId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.class}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.section}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.gender}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.mobile}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onViewDetails(student)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      title="View Details"
                    >
                      <FiEye className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center text-gray-500 bg-gray-50">
                  <p className="text-lg font-medium">No students found</p>
                  <p className="text-sm mt-1">Add students using the button above</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {loading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};

export default StudentList; 