import axios from "axios";
import jwtDecode from "jwt-decode";

const logout = () => {
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"];
};

const authenticate = credentials => {
    return axios
        .post("http://localhost:8000/api/login_check", credentials)
        .then(response => response.data.token)
        .then(token => {
            window.localStorage.setItem("authToken", token);
            setAxiosToken(token);
        });
};

const setup = () => {
    const token = window.localStorage.getItem("authToken");
    if (token) {
        const {exp : expiration} = jwtDecode(token);
        if (expiration * 1000 > new Date().getTime()) {
            setAxiosToken(token);
            return ;
        }
    }
    logout();
};

const isAuthenticated = () => {
    const token = window.localStorage.getItem("authToken");
    if (token) {
        const {exp : expiration} = jwtDecode(token);
        if (expiration * 1000 > new Date().getTime()) {
            return true;
        }
    }
    return false
};

const setAxiosToken = (token) => {
    axios.defaults.headers["Authorization"] = "Bearer " + token;
}

export default {
    authenticate,
    logout,
    setup,
    isAuthenticated
}