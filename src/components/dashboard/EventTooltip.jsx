import { FaBirthdayCake } from 'react-icons/fa'

const EventTooltip = ({ event, members }) => {
  if (event.type === 'birthday') {
    const dob = new Date(members.find(m => m.id === event.id.split('-')[1])?.dob)
    const age = new Date().getFullYear() - dob.getFullYear()
    
    return (
      <div className="bg-white p-2 rounded-lg shadow-lg border border-gray-200">
        <div className="flex items-center gap-2">
          <FaBirthdayCake className="text-amber-500" />
          <span className="font-medium">{event.title}</span>
        </div>
        <div className="text-sm text-gray-600 mt-1">
          Turning {age} years old
        </div>
      </div>
    )
  }
  
  return (
    <div className="bg-white p-2 rounded-lg shadow-lg border border-gray-200">
      <span>{event.title}</span>
    </div>
  )
}

export default EventTooltip 