import { useState } from 'react';

const ProfileForm = ({ isOpen, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    number: '+1 234 567 8900',
    dob: '1990-01-01',
    gender: 'male',
    profilePic: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePic') {
      setFormData(prev => ({
        ...prev,
        profilePic: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
    setIsEditing(false);
  };

  const handleClose = () => {
    setIsEditing(false);
    onClose();
  };

  if (!isOpen) return null;

  const ViewMode = () => (
    <div className="space-y-4">
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-semibold">
          {formData.name.split(' ').map(n => n[0]).join('')}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-500">Name</label>
          <div className="mt-1 text-gray-900">{formData.name}</div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500">Email</label>
          <div className="mt-1 text-gray-900">{formData.email}</div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500">Phone Number</label>
          <div className="mt-1 text-gray-900">{formData.number}</div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500">Date of Birth</label>
          <div className="mt-1 text-gray-900">
            {new Date(formData.dob).toLocaleDateString()}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500">Gender</label>
          <div className="mt-1 text-gray-900 capitalize">{formData.gender}</div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={handleClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Close
        </button>
      </div>
    </div>
  );

  const EditMode = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
        <input
          type="tel"
          name="number"
          value={formData.number}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Gender</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
        <input
          type="file"
          name="profilePic"
          onChange={handleChange}
          accept="image/*"
          className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </form>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {isEditing ? 'Edit Profile' : 'Profile Details'}
          </h2>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-gray-500 hover:text-gray-700"
                title="Edit Profile"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
            )}
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700"
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>
        
        {isEditing ? <EditMode /> : <ViewMode />}
      </div>
    </div>
  );
};

export default ProfileForm;