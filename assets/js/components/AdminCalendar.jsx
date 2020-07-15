import React from 'react';
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from 'moment'
import moment_timezone from 'moment-timezone';
import 'moment/locale/fr';
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../../css/calendar.css";

const AdminCalendar = ({bookings, history}) => {

    moment_timezone.tz.setDefault('Indian/Reunion');
    const localizer = momentLocalizer(moment_timezone);

    const messages = {
        allDay: 'journée',
        previous: 'précédent',
        next: 'suivant',
        today: 'aujourd\'hui',
        month: 'mois',
        week: 'semaine',
        day: 'jour',
        agenda: 'Agenda',
        date: 'date',
        time: 'heure',
        event: 'événement', // Or anything you want
        showMore: total => `+ ${total} événement(s) supplémentaire(s)`
    };

    const handleSelect = ({ start, end }) => {
        const title = window.prompt('Nom de l\'évènement')
        if (title) {
            console.log(start);
            console.log(end);
            console.log(title);
            console.log((new Date()).getTime());
            bookings = [
                ...bookings, 
                { start: new Date(start), end: new Date(end), title, id: (new Date()).getTime() }
            ];
        }
    };

    return ( 
        <div id="calendar" className="mb-5">
            <Calendar
                localizer={localizer}
                events={bookings}
                startAccessor="start"
                endAccessor="end"
                messages={messages}
                onSelectEvent={event => {history.replace("/bookings/" + event.id)}}
                onSelectSlot={handleSelect}
                selectable
            />
        </div>
    );
}
 
export default AdminCalendar;