import axios from "axios";

const instance = axios.create({
  baseURL: "https://homefood-api-uka6.onrender.com/api",
});

export default instance;