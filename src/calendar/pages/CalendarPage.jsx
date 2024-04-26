import { Calendar } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { addHours } from 'date-fns'

import { Navbar } from "../"
import { localizer, getMessagesES } from '../../herlpers'




const events = [{
  title: 'Cumpleaños del Jefe',
  notes: 'Hay que comprar el pastel',
  start: new Date(),
  end: addHours( new Date(), 2 ),
  bgColor: 'red',
  user: {
    _id: '123',
    name: 'Mauricio'
  }
}]

export const CalendarPage = () => {

  const eventStyleGetter = ( event, start, end, isSelected ) => {
    console.log({event, start, end, isSelected})

    const style = {
      backgroundColor: '#347cF7',
      borderRadius: '0px',
      opacity: 0.8,
      color: 'white'
    }

    return {

    }
  }

  return (
    <>
      <Navbar/>

      <Calendar
        culture='es'
        localizer={ localizer }
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 'calc( 100vh - 80px )' }}
        messages={ getMessagesES() }
        eventPropGetter={ eventStyleGetter }
      />
    </>
  )
}
