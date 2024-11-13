import axios from "axios";

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

const baseurl = "/dashboard";


const getAllDTTask = (
    userId,
    PCSGroupId,
    PCSId,
    ClientId,
    StatusId,
    selected,
    setDTTask
  ) => {
  
    axiosInstance
      .get(`${baseurl}/task`, {
        params: {
          UserId: userId,
          PCSGroupId: PCSGroupId,
          PCSId: PCSId,
          ClientId: ClientId,
          StatusId: StatusId,
          TaskType: selected,
        },
      })
      .then(({ data }) => {
        setDTTask(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  export {getAllDTTask}