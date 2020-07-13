import axios from "axios";

const findAll = () => {
    return axios
        .get("http://localhost:8000/api/messages")
        .then(response => response.data['hydra:member'])
};

const deleteMessage = (id) => {
    return axios
        .delete("http://localhost:8000/api/messages/" + id)
}

export default {
    findAll,
    delete: deleteMessage
}