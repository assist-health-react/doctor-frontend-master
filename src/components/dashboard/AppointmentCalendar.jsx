import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'
import EventTooltip from './EventTooltip'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const locales = {
  'en-US': enUS
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

const AppointmentCalendar = ({ 
  events, 
  view, 
  date, 
  onView, 
  onNavigate,
  selectedEvent,
  tooltipPosition,
  handleEventMouseEnter,
  handleEventMouseLeave,
  members
}) => {
  const eventStyleGetter = (event) => {
    if (event.type === 'birthday') {
      return {
        style: {
          backgroundColor: '#F59E0B',
          borderRadius: '4px',
          opacity: 0.8,
          color: 'white',
          border: '0',
          display: 'block',
          cursor: 'pointer'
        }
      }
    }
    return {
      style: {
        backgroundColor: '#3B82F6',
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0',
        display: 'block',
        cursor: 'pointer'
      }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Appointment Calendar</h3>
      <div style={{ height: '600px' }} className="relative">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          view={view}
          onView={onView}
          date={date}
          onNavigate={onNavigate}
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
          min={new Date(2024, 0, 1, 8, 0)}
          max={new Date(2024, 0, 1, 20, 0)}
          step={30}
          timeslots={2}
          popup
          selectable
          onSelectEvent={event => console.log(event)}
          onSelectSlot={slotInfo => console.log(slotInfo)}
          eventStyleGetter={eventStyleGetter}
          onShowMore={(events, date) => console.log('show more', events, date)}
          components={{
            eventWrapper: ({ event, children }) => (
              <div
                onMouseEnter={(e) => handleEventMouseEnter(event, e)}
                onMouseLeave={handleEventMouseLeave}
              >
                {children}
              </div>
            )
          }}
        />
        
        {selectedEvent && (
          <div
            style={{
              position: 'absolute',
              top: tooltipPosition.top,
              left: tooltipPosition.left,
              transform: 'translate(-50%, -100%)',
              zIndex: 1000
            }}
          >
            <EventTooltip event={selectedEvent} members={members} />
          </div>
        )}
      </div>
    </div>
  )
}

export default AppointmentCalendar 