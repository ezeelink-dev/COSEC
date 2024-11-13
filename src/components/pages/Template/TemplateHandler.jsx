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

const baseurl = "/documentemplate";

const getAllDocumentTemplates = (userId, PCSGroupId, PCSId, ClientId,setDocumentTemplates) => {
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
      setDocumentTemplates(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

  
  const addDocumentTemplates = (DocumentID, selectedTemplates, userId,  PCSGroupId, PCSId, ClientId, setDocumentTemplates) => {
    axiosInstance
      .post(`${baseurl}/save`, { DocumentID, selectedTemplates, userId,  PCSGroupId, PCSId, ClientId, })
      .then((data) => {
        getAllDocumentTemplates(userId, PCSGroupId, PCSId, ClientId,setDocumentTemplates)
        toast.success("Templates updated to Document Successfully");
      })
      .catch((err) => {
        console.log(err)
        toast.error("Error updating Templates to Document");
      });
  };
  
  export {getAllDocumentTemplates, addDocumentTemplates}