import axios from "axios";
import moment from "moment";

const find = id => {
    return axios
        .get("http://localhost:8000/api/bookings/" + id)
        .then(response => response.data);
};

const findAll = () => {
    return axios
        .get("http://localhost:8000/api/bookings")
        .then(response => response.data['hydra:member']);
};

const create = booking => {
    return axios
        .post("http://localhost:8000/api/bookings", booking);
};

const update = (id, booking) => {
    return axios
        .put("http://localhost:8000/api/bookings/" + id, booking);
};

const deleteBooking = id => {
    return axios
        .delete("http://localhost:8000/api/bookings/" + id);
};

const getBookedDays = async () => {
    let bookedDays = [];
    const bookings = await findAll();
    let currentBookings = bookings.filter(booking => isCurrent(booking.checkOut));
    currentBookings.forEach(booking => {
        bookedDays.push(...getDatesDiff(booking.checkIn, booking.checkOut));
    });
    return bookedDays;
};

const isCurrent = checkOut => {
    const now = new Date();
    const out = new Date(checkOut);
    if (out.getFullYear() > now.getFullYear())
        return true;
    if (out.getFullYear() === now.getFullYear() && out.getMonth() > now.getMonth())
        return true;
    if (out.getMonth() === now.getMonth() && out.getDate() >= now.getDate())
        return true;

    return false
};

const getDatesDiff = (start_date, end_date, date_format = "YYYY-MM-DD") => {
    const getDateAsArray = date => {
      return moment(date.split(/\D+/), date_format);
    };
    const diff = getDateAsArray(end_date).diff(getDateAsArray(start_date), "days") + 1;
    const dates = [];
    for (let i = 0; i < diff; i++) {
        const nextDate = getDateAsArray(start_date).add(i, "day");

        // dates.push(nextDate.format(date_format));
        dates.push(new Date(nextDate.format(date_format)));
    }
    return dates;
};

export default {
    find,
    findAll,
    create,
    update,
    delete: deleteBooking,
    getBookedDays
}