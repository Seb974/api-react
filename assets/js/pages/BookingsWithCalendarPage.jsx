import React, { useEffect, useState } from 'react';
import BookingsActions from '../actions/BookingsActions';
import { Link } from 'react-router-dom';
import AdminCalendar from '../components/AdminCalendar';

const BookingsWithCalendarPage = ({history}) => {

    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        fetchBookings()
    }, []);

    const fetchBookings = () => {
        BookingsActions
            .findAll()
            .then(data => {
                let reservations = data.map(item => { 
                    return {title: item.email, start: item.checkIn, end: item.checkOut, id: item.id}
                });
                setBookings(reservations);
            })
            .catch(error => console.log(error.response));
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Liste des réservations</h2>
                <Link to="/bookings/new" className="btn btn-light">Créer une réservation</Link>
            </div>
            <AdminCalendar bookings={bookings} history={history}/>
            <div className="d-flex justify-content-left mt-5">
                <Link to="/bookings-list" className="btn btn-warning">Liste des réservations</Link>
            </div>
        </>
    );
}
 
export default BookingsWithCalendarPage;