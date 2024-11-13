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


const baseurlta = "/taskActivity";
const baseurlac = "/activities";


/* Activiity*/
const getAllActivity = (userId, PCSGroupId, PCSId, ClientId, setActivity) => {
  axiosInstance
    .get(`${baseurlac}`, {
      params: {
        UserId: userId,
        PCSGroupId: PCSGroupId,
        PCSId: PCSId,
        ClientId: ClientId,
      },
    })
    .then(({ data }) => {
      console.log("data -->", data);
      setActivity(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

const addActivity = (
  activity_desc,
  requiredTime,
  userId,
  PCSGroupId,
  PCSId,
  ClientId,
  setActivitydesc,
  setRequiredTime,
  setActivity,
  setActivityModal,
  handleAddActivityToEditModalCallback
) => {
  axiosInstance
    .post(`${baseurlac}/save`, {
      activity_desc,
      requiredTime,
      userId,
      PCSGroupId,
      PCSId,
      ClientId,
    })
    .then((data) => {
      const activityId = data.data.activity_id; 
      getAllActivity(userId, PCSGroupId, PCSId, ClientId, setActivity);
      handleAddActivityToEditModalCallback(activityId);
      setActivitydesc("");
      setRequiredTime();
      setActivityModal(false);
      toast.success("Activity Added Successfully");
    })
    .catch((err) => {
      console.log(err)
      toast.error("Unable to Add Activity");
    });
};

const updateActivity = (
  ActivityID,
  activity_desc,
  requiredTime,
  userId,
  PCSGroupId,
  PCSId,
  ClientId,
  setActivity,
  setActivitydesc,
  setRequiredTime,
  setIsUpdating,
  setActivityModal
) => {
  axiosInstance
    .post(`${baseurlac}/update`, {
      activity_id: ActivityID,
      activity_desc,
      requiredTime,
      userId,
      PCSGroupId,
      PCSId,
      ClientId,
    })
    .then((data) => {
      setActivitydesc("");
      setRequiredTime();
      setIsUpdating(false);
      setActivityModal(false);
      getAllActivity(userId, PCSGroupId, PCSId, ClientId, setActivity);
      toast.success("Activity Updated Successfully");
    })
    .catch((err) => {
      console.log(err);
      toast.error("Unable to Update Activity");
    });
};

const deleteActivity = (
  activity_id,
  userId,
  PCSGroupId,
  PCSId,
  ClientId,
  setActivity
) => {
  axiosInstance
    .post(`${baseurlac}/delete`, {
      activity_id: activity_id,
      LastActionBy: userId,
      PCSGroupId
    })
    .then((data) => {
      getAllActivity(userId, PCSGroupId, PCSId, ClientId, setActivity);
      toast.success("Activity Deleted Successfully");
    })
    .catch((err) => {
      console.log(err);
      toast.error("Unable to Delete Activity");
    });
};

/*Task Activities*/
const getAllTaskActivity = (
  userId,
  PCSGroupId,
  PCSId,
  ClientId,
  setTaskActivity
) => {
  axiosInstance
    .get(`${baseurlta}`, {
      params: {
        UserId: userId,
        PCSGroupId: PCSGroupId,
        PCSId: PCSId,
        ClientId: ClientId,
      },
    })
    .then(({ data }) => {
      setTaskActivity(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

const addTaskActivity = (
  task_id,
  selectedActivities,
  userId,
  PCSGroupId,
  PCSId,
  ClientId,
  setTaskActivity,
  setEditModalData,
  setDocumentModalData,
  setEditModal,
  setSelectedActivity, 
  setSelectedRowIndex
) => {
  axiosInstance
    .post(`${baseurlta}/save`, {
      task_id,
      selectedActivities,
      userId,
      PCSGroupId,
      PCSId,
      ClientId,
    })
    .then((data) => {
      getAllTaskActivity(userId, PCSGroupId, PCSId, ClientId, setTaskActivity);
      setEditModal(false)
      setEditModalData({task_desc: "",activities: []})
      setDocumentModalData({activity_desc: "",documents: []})
      setSelectedActivity(null)
      setSelectedRowIndex(null)
    })
    .catch((err) => {
      console.log(err);
      toast.error("Unable to Add Task & Activities");
    });
};

export {
  getAllActivity,
  addActivity,
  updateActivity,
  deleteActivity,
  getAllTaskActivity,
  addTaskActivity,
};
