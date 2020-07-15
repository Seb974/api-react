import React, { useState, useEffect } from 'react';
import Field from '../components/Forms/Field';
import { Link } from 'react-router-dom';
import BookingsActions from '../actions/BookingsActions';
import DateRangePicker from '../components/Forms/DateRangePicker';
import {START_HOURS, START_MINUTES, STOP_HOURS, STOP_MINUTES, TIMEZONE} from "../config/config";

const initialBooking = {
    email: '',
    checkIn: '',
    checkOut: ''
};

const BookingPage = ({match, history}) => {

    const {id = "new"} = match.params;

    const [editing, setEditing] = useState(false);
    const [booking, setBooking] = useState(initialBooking);
    const [errors, setErrors] = useState(initialBooking);
    const [disabledDates, setDisabledDates] = useState([]);

    useEffect(() => fetchBookedDays(), []);
    
    useEffect(() => {
        if (id !== "new") {
            setEditing(true);
            fetchBooking(id);
        }
    }, [id]);

    const fetchBooking = async id => {
        try {
            const { email, checkIn, checkOut } = await BookingsActions.find(id);
            setBooking({email, checkIn: new Date(checkIn), checkOut: new Date(checkOut)});
        } catch (error) {
            history.replace("/bookings");
        }
    };

    const fetchBookedDays = () => {
        BookingsActions.getBookedDays()
            .then(response => setDisabledDates(response))
            .catch(error => console.log(error));
    };

    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget;
        setBooking({...booking, [name]: value});
    };

    const handleDateChange = time => {
        if (time[1]) {
            setBooking({
                ...booking, 
                checkIn: new Date(time[0].setHours(START_HOURS, START_MINUTES - TIMEZONE, 0)),
                checkOut: new Date(time[1].setHours(STOP_HOURS, STOP_MINUTES - TIMEZONE, 0))
            });
        }
    };

    const handleSubmit = async event => {
        event.preventDefault();
        try {
            if (editing) {
                await BookingsActions.update(id, booking);
                setErrors(initialBooking);
            } else {
                await BookingsActions.create(booking)
                setErrors(initialBooking);
                history.replace("/bookings");
            }
        } catch ({response}) {
            const {violations} = response.data;
            if (violations) {
                const submittedErrors = {};
                violations.map(({propertyPath, message}) => {
                    submittedErrors[propertyPath] = message
                });
                setErrors(submittedErrors);
            }
        }
    };

    return (
        <>
            <h2>{(!editing && "Création d'une") || ("Modification de la ")} réservation</h2>
            <form onSubmit={handleSubmit}>
                <Field
                    type="email"
                    name="email"
                    label="Adresse email"
                    value={booking.email}
                    onChange={handleChange}
                    error={errors.email}
                />
                <DateRangePicker
                    name="dateRangePicker"
                    label="Dates de réservation"
                    placeholder="Cliquez pour sélectionner vos dates"
                    booking={booking}
                    onChange={ handleDateChange }
                    errors={errors}
                    disabledDates={disabledDates}
                    editing={editing}
                />
                <div className="form-group">
                    <button type="submit" className="btn btn-success">Enregistrer</button>
                    <Link to="/bookings" className="btn btn-link">Retour à la liste</Link>
                </div>
            </form>
        </> 
    );
}
 
export default BookingPage;