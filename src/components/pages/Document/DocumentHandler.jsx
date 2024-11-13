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


const baseurl = "/dmdocument";

/* Document*/
const getAllDocument = ( UserId, PCSGroupId, PCSId, ClientId, setDocument ) => {
  axiosInstance
    .get(`${baseurl}`, { params: { UserId, PCSGroupId, PCSId, ClientId, }, })
    .then(({ data }) => {
      console.log(data)
      setDocument(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

const saveDocument = ( DocumentDesc, userId, PCSGroupId, PCSId, ClientId, setDocumentDesc, setDocument, setDocumentModal, handleAddDocumentToActivityModalCallback ) => {
  axiosInstance
    .post(`${baseurl}/save`, { DocumentDesc, userId, PCSGroupId, PCSId, ClientId, })
    .then((data) => {
      setDocumentDesc("");
      setDocumentModal(false);
      const documentId = data.data.DocumentID; 
      console.log(documentId)
      handleAddDocumentToActivityModalCallback(documentId);
      getAllDocument(userId, PCSGroupId, PCSId, ClientId, setDocument);
      toast.success("Document Added Successfully");
    })
    .catch((err) => {
      toast.error("Unable to Add Document");
    });
};

const UpdateDocument = ( DocumentID, DocumentDesc, userId, PCSGroupId, PCSId, ClientId, setDocument, setDocumentDesc, setIsUpdating, setDocumentModal ) => {
  axiosInstance
    .post(`${baseurl}/update`, { DocumentID, DocumentDesc, userId, PCSGroupId, PCSId, })
    .then((data) => {
      setDocumentDesc("");
      setIsUpdating(false);
      setDocumentModal(false);
      getAllDocument(userId, PCSGroupId, PCSId, ClientId, setDocument);
      toast.success("Document Updated Successfully");
    })
    .catch((err) => {
      console.log(err);
      toast.error("Unable to Update Document");
    });
};

const DeleteDocument = ( DocumentID, userId, PCSGroupId, PCSId, ClientId, setDocument ) => {
  axiosInstance
    .post(`${baseurl}/delete`, { DocumentID, userId })
    .then((data) => {
      getAllDocument(userId, PCSGroupId, PCSId, ClientId, setDocument);
      toast.success("Document Deleted Successfully");
    })
    .catch((err) => {
      console.log(err);
      toast.error("Unable to Delete Document");
    });
};

export { getAllDocument, saveDocument, UpdateDocument, DeleteDocument };
