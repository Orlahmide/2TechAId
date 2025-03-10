import axios from "axios";

const username = "11231632";
const password = "60-dayfreetrial";


const API_BASE_URL = "http://localhost:5215/api";


const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  auth: {
    Username: username,
    Password: password,
  },
});


apiClient.interceptors.request.use(
  (config) => {
    if (!config.auth) {
      config.auth = { username, password };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
