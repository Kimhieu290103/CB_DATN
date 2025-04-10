import axios from "./custom-axios";

const Login = (values) => {
    return axios.post("/api/v1/users/login", values);
}

export {Login};