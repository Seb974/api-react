import React, { useState, useEffect } from 'react';
import Field from '../components/Forms/Field';
import { Link } from 'react-router-dom';
import BookingsActions from '../actions/BookingsActions';
import Flatpickr from 'react-flatpickr';
import { French } from "flatpickr/dist/l10n/fr";

import 'flatpickr/dist/themes/material_blue.css'

const now = new Date();
const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
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
            const { name, email, content } = await BookingsActions.find(id);
            setBooking({name, email, content});
        } catch (error) {
            history.replace("/bookings");
        }
    };

    const fetchBookedDays = () => {
        BookingsActions.getBookedDays()
            .then(response => setDisabledDates(response))
            .catch(error => console.log(error));
    };

    const disabledDays = date => {
        let isDisabled = false;
        disabledDates.forEach(disabledDate => {
            if (isSameDate(date, disabledDate)) {
                isDisabled = true;
                return ;
            }
        });
        return isDisabled;
    };

    const isSameDate = (date1, date2) => {
        return (date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate()) ? true : false;
    };

    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget;
        setBooking({...booking, [name]: value});
    };

    const handleDateChange = time => {
        if (time[1]) {
            setBooking({...booking, checkIn: time[0], checkOut: time[1] });
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
                 <div className="form-group">
                    <label htmlFor="datePicker">Dates de réservation</label>
                    <Flatpickr
                        name="datePicker"
                        placeholder="Cliquez pour sélectionner vos dates"
                        value={ [booking.checkIn, booking.checkOut] }
                        onChange={ handleDateChange }
                        className={"form-control" + ((errors.checkIn || errors.checkOut) && " is-invalid")}
                        options={{
                            mode: "range",
                            dateFormat: "d/m/Y",
                            minDate: "today",
                            locale: "fr",
                            disable: [(date) => disabledDays(date)],
                        }}
                    />
                    { (errors.checkIn || errors.checkOut) &&
                        <p className="invalid-feedback">
                            { errors.checkIn.toLowerCase().includes("string") ? "Les dates de réservation sont obligatoires" : errors.checkIn }
                        </p>
                    }
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-success">Enregistrer</button>
                    <Link to="/bookings" className="btn btn-link">Retour à la liste</Link>
                </div>
            </form>
        </> 
    );
}
 
export default BookingPage;