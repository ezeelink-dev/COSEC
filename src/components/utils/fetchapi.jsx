import axios from "axios";

// Set up axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001',
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

const baseurl = "/Clienttype";
const baseurltt = "/tasktype";

const getClientType = (UserId, PCSGroupId, PCSId, ClientId, setClient) => {
  axiosInstance
    .get(`${baseurl}`, {
      params: {
        UserId,
        PCSGroupId,
        PCSId,
        ClientId,
      },
    })
    .then(({ data }) => {
      setClient(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};


const getTaskType = ( userId, PCSGroupId,PCSId, ClientId, setTaskTypes) => {
  axiosInstance
  .get(`${baseurltt}`, {
    params: {
      userId,
      PCSGroupId,
      PCSId,
      ClientId
    },
  })
  .then(({ data }) => {
    setTaskTypes(data)
  })
  .catch((error) => {
    console.error("Error:", console.log(error));
  });
};


export {getClientType, getTaskType};