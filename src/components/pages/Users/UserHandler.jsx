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

const baseurladmin = "/admin";
const baseurl = "/users";

const getAllUsers = (userId, PCSGroupId, PCSId, ClientId, setUsers) => {
    axiosInstance
        .get(`${baseurl}`, { params: { UserId: userId, PCSGroupId: PCSGroupId, PCSId: PCSId, ClientId: ClientId, }, })
        .then(({ data }) => {
            setUsers(data);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
};

const getFilteredUsers = (userId, PCSGroupId, PCSId, ClientId, UserGroupId, setUsers) => {
    axiosInstance
        .get(`${baseurl}/filteredusers`, {
            params: { UserId: userId, PCSGroupId: PCSGroupId, PCSId: PCSId, ClientId: ClientId, UserGroupId: UserGroupId },
        })
        .then(({ data }) => {
            setUsers(data);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
};

const addUser = (formData, userId, PCSGroupId, PCSId, ClientId, createdBy, setUsers, setIsAddUserModalOpen, setFormData, callback) => {
    const { fullname, username, userEmail, userContact, userPassword, department, UserGroupId, Gender, endDate } = formData;
    return axiosInstance
        .post(`${baseurl}/save`, {
            fullname: fullname,
            userName: username,
            userEmail: userEmail,
            userContact: userContact,
            userPassword: userPassword,
            Department: department,
            UserGroupId: UserGroupId,
            PCSGroupId: PCSGroupId,
            PCSId: PCSId,
            Gender: Gender,
            end_date: endDate,
            createdBy: createdBy
        })
        .then((data) => {
            setTimeout(() => {
                getAllUsers(userId, PCSGroupId, PCSId, ClientId, setUsers);
                setFormData({ fullname: "", username: "", userEmail: "", userPassword: "", department: [], UserGroupId: "", PCSGroupId: "", PCSId: "", Gender: "", endDate: "", });
                toast.success("User Added Successfully");
                setIsAddUserModalOpen(false);
                callback();
            }, 500);
        })
        .catch((err) => {
            console.log(err);
            toast.error("Failed to Add User");
            setIsAddUserModalOpen(false);
            callback();
        });
};


const updateUser = (userId, fullname, username, userEmail, userContact, userPassword, department, UserGroupId, PCSGroupId, PCSId, Gender, ClientId, endDate, createdBy, setUsers, setIsAddUserModalOpen, setFormData, setIsUpdating, callback) => {
    axiosInstance
        .post(`${baseurl}/update`, { userId, fullname, userName: username, userEmail, userContact, userPassword, Department: department, UserGroupId, PCSGroupId, PCSId, Gender, end_date: endDate, createdBy })
        .then((data) => {
            setTimeout(() => {
                getAllUsers(userId, PCSGroupId, PCSId, ClientId, setUsers);
                setFormData({ fullname: "", username: "", userEmail: "", userPassword: "", department: [], UserGroupId: "", PCSGroupId: "", PCSId: "", Gender: "", endDate: "", });
                setIsAddUserModalOpen(false);
                setIsUpdating(false)
                callback();
                toast.success("User Updated Successfully");
            }, 500);
        })
        .catch((err) => {
            toast.error("Unable to Update user");
            setIsAddUserModalOpen(false);
            callback();
        });
};


const updateUserDisable = (userId, PCSId, PCSGroupId, ClientId, Disableflag, setUsers) => {
    axiosInstance
        .post(`${baseurl}/disable`, { userId, PCSId, PCSGroupId, Disableflag })
        .then((data) => {
            getAllUsers(userId, PCSGroupId, PCSId, ClientId, setUsers);
        })
        .catch((err) => console.log(err));
};


const updateUserPassword = (userId, userPassword, userImage, pcsGroup, pcs,) => {
    axiosInstance
        .post(`${baseurl}/password`, { userId: userId, userPassword: userPassword, userImage: userImage, PCSGroupId: pcsGroup, PCSId: pcs })
        .then((data) => {
            toast.success("Password Updated Successfully");
        })
        .catch((err) => {
            console.log(err);
            toast.error("Unable to Update Password");
        });
};


const checkUserDuplication = (userId, PCSGroupId, PCSId, ClientId, username, setIsValidUserName) => {
    axiosInstance
        .post(`${baseurl}/checkuserdup`, { userId, PCSGroupId, PCSId, ClientId, username })
        .then((response) => {
            const { validuseroutput } = response.data
            setIsValidUserName(validuseroutput)
        })
        .catch((err) => {
            console.log(err);
        });
};

const UpdateNotificationSettings = (userId, PCSGroupId, PCSId, NotificationEventId, NotificationType, NotificationValue, setNotificationSettings) => {
    axiosInstance
        .post(`${baseurl}/notify/update`, { userId, PCSGroupId, PCSId, NotificationEventId, NotificationType, NotificationValue })
        .then((data) => {
            getNotificationSettings(userId, PCSGroupId, PCSId, setNotificationSettings)
        })
        .catch((err) => {
            console.log(err);
            toast.error("Unable to Update settings");
        });
};

const getUserGroups = (userId, PCSGroupId, PCSId, ClientId, setuserGroup) => {
    axiosInstance
        .get(`${baseurladmin}/userGroups`, { params: { UserId: userId, PCSGroupId, PCSId, ClientId } })
        .then(({ data }) => {
            setuserGroup(data);
        });
};

const getPCSGroups = (userId, PCSGroupId, PCSId, ClientId, setPCSGroups) => {
    axiosInstance
        .get(`${baseurladmin}/pcsgroups`, { params: { UserId: userId, PCSGroupId, PCSId, ClientId } })
        .then(({ data }) => {
            setPCSGroups(data);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
};

const getPCS = (userId, PCSGroupId, PCSId, ClientId, setPCS) => {
    axiosInstance
        .get(`${baseurladmin}/pcs`, { params: { UserId: userId, PCSGroupId: PCSGroupId, PCSId: PCSId, ClientId: ClientId, }, })
        .then(({ data }) => {
            setPCS(data);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
};



export { getAllUsers, getFilteredUsers, addUser, updateUser, updateUserPassword, updateUserDisable, checkUserDuplication, UpdateNotificationSettings, getUserGroups, getPCSGroups, getPCS }