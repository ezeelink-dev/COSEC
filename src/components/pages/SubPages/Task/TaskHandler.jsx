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


export const getAllTask = (userId, PCSGroupId, PCSId, ClientId, setTask) => {
    axiosInstance
        .get(`${baseurl}`, {
            params: {
                UserId: userId,
                PCSGroupId: PCSGroupId,
                PCSId: PCSId,
            },
        })
        .then(({ data }) => {
            setTask(data);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
};

export const addTask = (
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
            if (data.data.TaskId) {
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

export const updateTask = (
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

export const updateIsNewClientTask = (
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

export const deleteTask = (task_id, userId, PCSGroupId, PCSId, ClientId, setTask, callback) => {
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

