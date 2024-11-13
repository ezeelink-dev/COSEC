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

const baseurl = "/department";

const getAllDepartments = (userId, PCSGroupId, PCSId, ClientId, setDepartments) => {
  axiosInstance
    .get(`${baseurl}`, {
      params: {
        UserId: userId,
        PCSGroupId: PCSGroupId,
        PCSId: PCSId,
        ClientId: ClientId,
      },
    })
    .then(({ data }) => {
      setDepartments(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

const getDepUsers = (
  userId,
  PCSGroupId,
  PCSId,
  ClientId,
  DepartmentId,
  setUsers
) => {
  axiosInstance
    .get(`${baseurl}/users`, {
      params: {
        UserId: userId,
        PCSGroupId: PCSGroupId,
        PCSId: PCSId,
        ClientId: ClientId,
        DepartmentId: DepartmentId
      },
    })
    .then(({ data }) => {
      setUsers(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

const addDepartment = (
  userId,
  PCSGroupId,
  PCSId,
  ClientId,
  DepartmentDesc,
  setDepartmentDesc,
  setDepartments,
  callback
) => {
  axiosInstance
    .post(`${baseurl}/save`, {
      userId,
      PCSGroupId,
      PCSId,
      ClientId,
      DepartmentDesc
    })
    .then((data) => {
      setTimeout(() => {
        Swal.fire({
          title: "Department saved Successfully!",
          showClass: {
            popup: `
              animate__animated
              animate__fadeInUp
              animate__faster
            `
          },
          hideClass: {
            popup: `
              animate__animated
              animate__fadeOutDown
              animate__faster
            `
          }
        });
  
          setDepartmentDesc("")
          getAllDepartments(userId, PCSGroupId, PCSId, ClientId, setDepartments)
          callback();
        }, 500);
  
    })
    .catch((err) => console.log(err));
};

const updateDepartment = (
  userId, PCSGroupId, PCSId, ClientId, DepartmentId, DepartmentDesc, setDepartmentDesc, setDepartments, setIsUpdating,  callback 
) => {
  axiosInstance
    .post(`${baseurl}/update`, {
      userId,
      PCSGroupId,
      PCSId,
      ClientId,
      DepartmentId,
      DepartmentDesc
    })
    .then((data) => {
      setTimeout(() => {
      Swal.fire({
        title: "Department name updated Successfully!",
        showClass: {
          popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
          `
        },
        hideClass: {
          popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
          `
        }
      });
        setIsUpdating(false)
        setDepartmentDesc("")
        getAllDepartments(userId, PCSGroupId, PCSId, ClientId, setDepartments)
        callback();
      }, 500);

    })
    .catch((err) => console.log(err));
};


const deleteDepartment = (
  userId,
  PCSGroupId,
  PCSId,
  ClientId,
  DepartmentId,
  setDepartments,
  callback
) => {
  axiosInstance
    .post(`${baseurl}/delete`, {
      userId,
      PCSGroupId,
      PCSId,
      ClientId,
      DepartmentId
    })
    .then((data) => {
      setTimeout(() => {
        Swal.fire({
          title: "Department deleted Successfully!",
          showClass: {
            popup: `
              animate__animated
              animate__fadeInUp
              animate__faster
            `
          },
          hideClass: {
            popup: `
              animate__animated
              animate__fadeOutDown
              animate__faster
            `
          }
        });
        // Introduce a delay of 1 second (1000 milliseconds) before calling the callback
          getAllDepartments(userId, PCSGroupId, PCSId, ClientId, setDepartments)
          callback();
        }, 500);
    })
    .catch((err) => console.log(err));
};
export { getAllDepartments, getDepUsers, addDepartment, updateDepartment, deleteDepartment }