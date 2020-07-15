import React from 'react';
import Flatpickr from 'react-flatpickr';
import { French } from "flatpickr/dist/l10n/fr";
import 'flatpickr/dist/themes/material_blue.css';
import {START_HOURS, START_MINUTES, NUMBER_AVAILABLE} from "../../config/config";

const DateRangePicker = ({name, label, placeholder, booking, onChange, errors, disabledDates, editing}) => {

    const disabledDays = date => {
        let isDisabled = false;
        disabledDates.forEach(disabledDate => {
            if (isSameDate(date, disabledDate) && dailyCount(date) >= NUMBER_AVAILABLE && !isSelfBooking(date)) {
                isDisabled = true;
                return ;
            }
        });
        return isDisabled;
    };

    const isSameDate = (date1, date2) => {
        return (date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate()) ? true : false;
    };

    const dailyCount = date => {
        return disabledDates.reduce((sum, current) => {
            return sum + (isSameDate(date, current) ? 1 : 0);
        }, 0);
    };

    const isSelfBooking = date => {
        const {checkIn, checkOut} = booking;
        if (editing && typeof checkOut !== 'string') {
            date.setHours(START_HOURS, START_MINUTES, 0);
            if (date.getTime() <= checkOut.getTime() && date.getTime() >= checkIn.getTime())
                return true;
        }
        return false
    };

    return ( 
        <div className="form-group">
            <label htmlFor="datePicker">{label}</label>
            <Flatpickr
                name={name}
                placeholder={placeholder}
                value={ [booking.checkIn, booking.checkOut] }
                onChange={ onChange }
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
     );
}
 
export default DateRangePicker;