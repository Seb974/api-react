import axios from "axios";

const find = id => {
    return axios
        .get("http://localhost:8000/api/messages/" + id)
        .then(response => response.data);
};

const findAll = () => {
    return axios
        .get("http://localhost:8000/api/messages")
        .then(response => response.data['hydra:member']);
};

const create = message => {
    return axios
        .post("http://localhost:8000/api/messages", message);
};

const update = (id, message) => {
    return axios
        .put("http://localhost:8000/api/messages/" + id, message);
};

const deleteMessage = id => {
    return axios
        .delete("http://localhost:8000/api/messages/" + id);
};

export default {
    find,
    findAll,
    create,
    update,
    delete: deleteMessage
}