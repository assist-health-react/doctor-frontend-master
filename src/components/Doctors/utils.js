export const languageOptions = [
  'Tamil', 'English', 'Hindi', 'Malayalam', 'Telugu', 'Kannada'
]

export const areaOptions = [
  { value: 'north_delhi', label: 'North Delhi' },
  { value: 'south_delhi', label: 'South Delhi' },
  { value: 'east_delhi', label: 'East Delhi' },
  { value: 'west_delhi', label: 'West Delhi' },
  { value: 'central_delhi', label: 'Central Delhi' },
  { value: 'new_delhi', label: 'New Delhi' },
  { value: 'noida', label: 'Noida' },
  { value: 'gurgaon', label: 'Gurgaon' },
  { value: 'faridabad', label: 'Faridabad' },
  { value: 'ghaziabad', label: 'Ghaziabad' },
  { value: 'greater_noida', label: 'Greater Noida' },
  { value: 'meerut', label: 'Meerut' },
  { value: 'agra', label: 'Agra' },
  { value: 'jaipur', label: 'Jaipur' },
  { value: 'chandigarh', label: 'Chandigarh' },
  { value: 'mumbai', label: 'Mumbai' },
  { value: 'bangalore', label: 'Bangalore' },
  { value: 'chennai', label: 'Chennai' },
  { value: 'kolkata', label: 'Kolkata' },
  { value: 'hyderabad', label: 'Hyderabad' }
];

export const formatTime = (time) => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes));
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric',
    minute: '2-digit',
    hour12: true 
  });
} 