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

const baseurl = "/activities";


export const getAllActivity = (userId, PCSGroupId, PCSId, ClientId, setActivity) => {
    axiosInstance
        .get(`${baseurl}`, {
            params: {
                UserId: userId,
                PCSGroupId: PCSGroupId,
                PCSId: PCSId,
            },
        })
        .then(({ data }) => {
            setActivity(data);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
};

export const addActivity = (
    activity_desc,
    ActivityTypeId,
    userId,
    DepartmentId,
    IsNewClientActivity,
    IsIncClientActivity,
    IsRecurringActivity,
    ClientTypeId,
    NextRecurringOn,
    FrequencyId,
    RequiredTime,
    PCSGroupId,
    PCSId,
    ClientId,
    setActivity,
    setActivityId,
    setIsUpdating,
    setEditModalData,
    setActivitydesc,
    setActivityTypeId,
    setDepartmentId,
    setIsNewClientActivity,
    setIsIncClientActivity,
    setIsRecurringActivity,
    setClientTypeId,
    setFrequencyId,
    setNextRecurringOn,
    setRequiredTime,
    setActivityModal,
    callback
) => {
    axiosInstance
        .post(`${baseurl}/save`, {
            activity_desc,
            ActivityTypeId,
            userId,
            DepartmentId,
            IsNewClientActivity,
            IsIncClientActivity,
            IsRecurringActivity,
            ClientTypeId,
            NextRecurringOn,
            FrequencyId,
            RequiredTime,
            PCSGroupId,
            PCSId,
            ClientId,
        })
        .then((data) => {
            if (data.data.ActivityId) {
                setTimeout(() => {
                    setActivityId(data.data.ActivityId)
                    setIsUpdating(true)
                    setEditModalData((prevData) => ({
                        activity_id: data.data.ActivityId,
                        activity_desc: activity_desc,
                        activities: [],
                    }));
                    toast.success("Activity Added Successfully");
                    callback();
                }, 500);
            }
        })
        .catch((err) => { console.log(err); callback(); });
};

export const updateActivity = (
    activity_id,
    activity_desc,
    ActivityTypeId,
    userId,
    DepartmentId,
    IsNewClientActivity,
    IsIncClientActivity,
    IsRecurringActivity,
    ClientTypeId,
    NextRecurringOn,
    FrequencyId,
    RequiredTime,
    PCSGroupId,
    PCSId,
    ClientId,
    setActivity,
    setActivitydesc,
    setActivityTypeId,
    setDepartmentId,
    setIsNewClientActivity,
    setIsIncClientActivity,
    setIsRecurringActivity,
    setClientTypeId,
    setFrequencyId,
    setNextRecurringOn,
    setRequiredTime,
    setIsUpdating,
    setActivityModal,
    callback
) => {
    axiosInstance
        .post(`${baseurl}/update`, {
            activity_id,
            activity_desc,
            ActivityTypeId,
            userId,
            DepartmentId,
            IsNewClientActivity,
            IsIncClientActivity,
            IsRecurringActivity,
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
                setActivitydesc("");
                setIsNewClientActivity(false)
                setIsIncClientActivity(false)
                setIsRecurringActivity(false)
                setClientTypeId()
                setFrequencyId()
                setNextRecurringOn()
                setRequiredTime()
                setIsUpdating(false);
                getAllActivity(userId, PCSGroupId, PCSId, ClientId, setActivity);
                setActivityModal(false);
                setActivityTypeId();
                setDepartmentId();
                toast.success("Activity Updated Successfully");
                callback();
            }, 500);
        })
        .catch((err) => {
            console.log(err);
            toast.error("Unable to Update Activity");
            callback();
        });
};

export const updateIsNewClientActivity = (
    IsNewClientActivity,
    activity_id,
    userId,
    PCSId,
    PCSGroupId,
    ClientId,
    setActivity
) => {
    axiosInstance
        .post(`${baseurl}/isnewclientactivity`, {
            IsNewClientActivity,
            activity_id,
            userId,
            PCSId,
            PCSGroupId,
            ClientId,
        })
        .then((data) => {
            getAllActivity(setActivity);
            toast.success("Activity Updated Successfully");
        })
        .catch((err) => {
            console.log(err);
            toast.error("Unable to Update Activity");
        });
};

export const deleteActivity = (activity_id, userId, PCSGroupId, PCSId, ClientId, setActivity, callback) => {
    axiosInstance
        .post(`${baseurl}/delete`, { activity_id, LastActionBy: userId, PCSGroupId })
        .then((data) => {
            setTimeout(() => {
                getAllActivity(userId, PCSGroupId, PCSId, ClientId, setActivity);
                toast.success("Activity Deleted Successfully");
                callback();
            }, 500);


            toast.success("Activity Deleted Successfully");
        })
        .catch((err) => {
            console.log(err);
            toast.error("Unable to Delete Activity");
        });
};

