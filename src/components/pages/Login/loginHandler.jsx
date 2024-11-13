import axios from "axios";

// Set up axios instance
const axiosInstance = axios.create({
  baseURL: 'http://103.142.175.92:5001',
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const baseurl = "/login";


export const handleLoginSubmit = async (data) => {
  try {
    const response = await axiosInstance.post(baseurl, data);
    console.log('Full Response:', response);
    return response.data;
  } catch (err) {
    console.error("Error during API call:", err);
    throw err;
  }
};
