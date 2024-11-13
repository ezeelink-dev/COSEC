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

const baseurl = "/tasks";

const getAllTask = (userId, PCSGroupId, PCSId, ClientId, setTask) => {
  axiosInstance
    .get(`${baseurl}`, {
      params: {
        UserId: userId,
        PCSGroupId: PCSGroupId,
        PCSId: PCSId,
      },
    })
    .then(({ data }) => {
      console.log(data);
      setTask(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

const addTask = (
  task_desc,
  TaskTypeId,
  userId,
  DepartmentId,
  IsNewClientTask,
  IsIncClientTask,
  IsRecurringTask,
  ClientTypeId,
  NextRecurringOn,
  FrequencyId,
  RequiredTime,
  PCSGroupId,
  PCSId,
  ClientId,
  setTask,
  setTaskId,
  setIsUpdating,
  setEditModalData,
  setTaskdesc,
  setTaskTypeId,
  setDepartmentId,
  setIsNewClientTask,
  setIsIncClientTask,
  setIsRecurringTask,
  setClientTypeId,
  setFrequencyId,
  setNextRecurringOn,
  setRequiredTime,
  setTaskModal,
  callback
) => {
  axiosInstance
    .post(`${baseurl}/save`, {
      task_desc,
      TaskTypeId,
      userId,
      DepartmentId,
      IsNewClientTask,
      IsIncClientTask,
      IsRecurringTask,
      ClientTypeId,
      NextRecurringOn,
      FrequencyId,
      RequiredTime,
      PCSGroupId,
      PCSId,
      ClientId,
    })
    .then((data) => {
     if(data.data.TaskId){
      setTimeout(() => {
        setTaskId(data.data.TaskId)
        setIsUpdating(true)
        setEditModalData((prevData) => ({
          task_id: data.data.TaskId,
          task_desc: task_desc,
          activities: [],
        }));
        toast.success("Task Added Successfully");
        callback();
      }, 500);
     }
    })
    .catch((err) => { console.log(err); callback(); });
};

const updateTask = (
  task_id,
  task_desc,
  TaskTypeId,
  userId,
  DepartmentId,
  IsNewClientTask,
  IsIncClientTask,
  IsRecurringTask,
  ClientTypeId,
  NextRecurringOn,
  FrequencyId,
  RequiredTime,
  PCSGroupId,
  PCSId,
  ClientId,
  setTask,
  setTaskdesc,
  setTaskTypeId,
  setDepartmentId,
  setIsNewClientTask,
  setIsIncClientTask,
  setIsRecurringTask,
  setClientTypeId,
  setFrequencyId,
  setNextRecurringOn,
  setRequiredTime,
  setIsUpdating,
  setTaskModal,
  callback
) => {
  axiosInstance
    .post(`${baseurl}/update`, {
      task_id,
      task_desc,
      TaskTypeId,
      userId,
      DepartmentId,
      IsNewClientTask,
      IsIncClientTask,
      IsRecurringTask,
      ClientTypeId,
      NextRecurringOn,
      FrequencyId,
      RequiredTime,
      PCSGroupId,
      PCSId,
      ClientId,
    })
    .then((data) => {
      setTimeout(() => {
        setTaskdesc("");
        setIsNewClientTask(false)
        setIsIncClientTask(false)
        setIsRecurringTask(false)
        setClientTypeId()
        setFrequencyId()
        setNextRecurringOn()
        setRequiredTime()
        setIsUpdating(false);
        getAllTask(userId, PCSGroupId, PCSId, ClientId, setTask);
        setTaskModal(false);
        setTaskTypeId();
        setDepartmentId();
        toast.success("Task Updated Successfully");
        callback();
      }, 500);
    })
    .catch((err) => {
      console.log(err);
      toast.error("Unable to Update Task");
      callback();
    });
};

const updateIsNewClientTask = (
  IsNewClientTask,
  task_id,
  userId,
  PCSId,
  PCSGroupId,
  ClientId,
  setTask
) => {
  axiosInstance
    .post(`${baseurl}/isnewclienttask`, {
      IsNewClientTask,
      task_id,
      userId,
      PCSId,
      PCSGroupId,
      ClientId,
    })
    .then((data) => {
      getAllTask(setTask);
      toast.success("Task Updated Successfully");
    })
    .catch((err) => {
      console.log(err);
      toast.error("Unable to Update Task");
    });
};

const deleteTask = (task_id, userId, PCSGroupId, PCSId, ClientId, setTask, callback) => {
  axiosInstance
    .post(`${baseurl}/delete`, { task_id, LastActionBy: userId, PCSGroupId })
    .then((data) => {
      setTimeout(() => {
        getAllTask(userId, PCSGroupId, PCSId, ClientId, setTask);
        toast.success("Task Deleted Successfully");
        callback();
      }, 500);


      toast.success("Task Deleted Successfully");
    })
    .catch((err) => {
      console.log(err);
      toast.error("Unable to Delete Task");
    });
};

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


/*Items*/
const getAllItems = (setItems) => {
  axiosInstance.get(baseurlItem).then(({ data }) => {
    console.log("data -->", data);
    setItems(data);
  });
};



export {
  getAllTask,
  addTask,
  updateTask,
  deleteTask,
  updateIsNewClientTask,
  getAllTaskActivity,
  addTaskActivity,
};
