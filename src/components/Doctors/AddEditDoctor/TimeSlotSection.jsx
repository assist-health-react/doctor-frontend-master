import { useState } from 'react';
import { FaTimes, FaPlus } from 'react-icons/fa';

const TimeSlotSection = ({
  type,
  timeSlots,
  handleAddTimeSlot,
  handleAddTimeToSlot,
  handleRemoveTimeFromSlot,
  handleRemoveDaySlots
}) => {
  const [timeInputs, setTimeInputs] = useState({});

  const handleTimeInputChange = (dayIndex, field, value) => {
    setTimeInputs(prev => ({
      ...prev,
      [`${dayIndex}-${field}`]: value
    }));
  };

  const handleAddTime = (dayIndex) => {
    const startTime = timeInputs[`${dayIndex}-start`];
    const endTime = timeInputs[`${dayIndex}-end`];

    if (startTime && endTime) {
      // Check if this exact time slot already exists
      const timeString = `${startTime} - ${endTime}`;
      const existingSlots = timeSlots[dayIndex].slots || [];
      
      if (existingSlots.includes(timeString)) {
        return; // Don't add if it already exists
      }

      handleAddTimeToSlot(type, dayIndex, startTime, endTime);
      // Clear the inputs after adding
      setTimeInputs(prev => ({
        ...prev,
        [`${dayIndex}-start`]: '',
        [`${dayIndex}-end`]: ''
      }));
    }
  };

  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <h5 className="text-lg font-semibold text-gray-800 mb-4">
        {type === 'online' ? 'Online' : 'Offline'} Consultation Time Slots
      </h5>
      <div className="space-y-4">
        {timeSlots.map((daySlot, dayIndex) => (
          <div key={dayIndex} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h6 className="font-medium capitalize">{daySlot.day}</h6>
              <button
                type="button"
                onClick={() => handleRemoveDaySlots(type, dayIndex)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTimes />
              </button>
            </div>
            <div className="space-y-2">
              {daySlot.slots.map((timeSlot, timeIndex) => (
                <div key={timeIndex} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                  <span className="text-gray-600">{timeSlot}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTimeFromSlot(type, dayIndex, timeIndex)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
              <div className="flex gap-2 items-center mt-2">
                <input
                  type="time"
                  className="border rounded px-2 py-1"
                  value={timeInputs[`${dayIndex}-start`] || ''}
                  onChange={(e) => handleTimeInputChange(dayIndex, 'start', e.target.value)}
                />
                <span>to</span>
                <input
                  type="time"
                  className="border rounded px-2 py-1"
                  value={timeInputs[`${dayIndex}-end`] || ''}
                  onChange={(e) => handleTimeInputChange(dayIndex, 'end', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => handleAddTime(dayIndex)}
                  className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add Time
                </button>
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => handleAddTimeSlot(type)}
          className="text-blue-500 hover:text-blue-700 flex items-center gap-2"
        >
          <FaPlus /> Add Day
        </button>
      </div>
    </div>
  );
};

export default TimeSlotSection; 