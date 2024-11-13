import axios from "axios";

const axiosInstance = axios.create({ baseURL: 'http://103.142.175.92:5001', withCredentials: true, });
axiosInstance.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("token");
        if (token) { config.headers["Authorization"] = `Bearer ${token}`; }
        return config;
    },
    (error) => { return Promise.reject(error); }
);

const baseurl = "/client";

const getClient = (userId, PCSGroupId, PCSId, ClientId, setClient) => {
    axiosInstance
        .get(`${baseurl}`, { params: { UserId: userId, PCSGroupId: PCSGroupId, PCSId: PCSId, ClientId: ClientId, }, })
        .then(({ data }) => { setClient(data); })
        .catch((error) => { console.error("Error:", error); });
};

const addClient = ( userId, PCSId, PCSGroupId, ClientId, AdditionalData, EntityGroupId, IsClientEntityGroup, SelectedDepartmentId, SelectedUserId, ClientTypeId, setClient, setCurrentStep, setIsCompanyEdited, setClientAdded, setClientId, setSelectedDepartmentId, setSelectedUserGroupId, setSelectedUserId, setClientTypeId, setClientModal ) => {
    axiosInstance.post(`${baseurl}/save`, { userId, PCSId, PCSGroupId, AdditionalData, EntityGroupId, IsClientEntityGroup, SelectedDepartmentId, SelectedUserId, ClientTypeId })
        .then((response) => {
            const { clientIdOutput } = response.data;
            if (clientIdOutput > 0) {
                setClientAdded(true);
                setClientId(clientIdOutput)
                setIsCompanyEdited(false)
                setSelectedDepartmentId(null)
                setSelectedUserGroupId(null)
                setSelectedUserId(null)
                setClientTypeId(null)
                if (AdditionalData.NewClient === "false") { setClientModal(false); setCurrentStep(1); } 
                else { setCurrentStep((prevStep) => prevStep + 1); }
            } else {
                console.warn('Please fill all the details Correctly Before Proceeding!');
            }
            getClient(userId, PCSGroupId, PCSId, ClientId, setClient);
            console.log("Client Added Successfully")
        })
        .catch((err) => console.log(err));
};

const updateClient = ( ClientId, PCSId, PCSGroupId, AdditionalData, userId, SelectedDepartmentId, SelectedUserId, ClientTypeId, setClient, setIsCompanyEdited, setCurrentStep, setSelectedDepartmentId, setSelectedUserGroupId, setSelectedUserId, setClientTypeId, setClientModal ) => {
    axiosInstance.post(`${baseurl}/update`, { ClientId, PCSId, PCSGroupId, AdditionalData, userId, SelectedDepartmentId, SelectedUserId, ClientTypeId })
        .then((data) => {
            setIsCompanyEdited(false)
            setSelectedDepartmentId(null)
            setSelectedUserGroupId(null)
            setSelectedUserId(null)
            setClientTypeId(null)
            getClient(userId, PCSGroupId, PCSId, ClientId, setClient);
            console.log("Client Updated Successfully")
            if (AdditionalData.NewClient === "false") { setClientModal(false); setCurrentStep(1); } 
            else { setCurrentStep((prevStep) => prevStep + 1); }
        })
        .catch((err) => {
            console.log(err);
            console.error("Unable to Update Client");
        });
};

const deleteClient = (userId, PCSGroupId, PCSId, ClientId, setClient) => {
    axiosInstance
        .post(`${baseurl}/delete`, { ClientId, LastActivityBy: userId })
        .then((data) => {
            getClient(userId, PCSGroupId, PCSId, ClientId, setClient);
            console.log("Company Details Deleted Successfully");
        })
        .catch((err) => {
            console.log(err);
            console.error("Unable to Delete PCS");
        });
};

export { getClient, addClient, updateClient, deleteClient };
