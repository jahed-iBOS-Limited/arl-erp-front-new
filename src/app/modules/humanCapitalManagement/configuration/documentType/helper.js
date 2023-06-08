import Axios from "axios";
import { toast } from "react-toastify";

export const saveDocumentType = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/hcm/DocumentType/CreateDocumentType`,
      data
    );
    if (res.status === 200) {
      toast.success(res.data?.message || "Submitted successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const GetDocumentTypePagination = async (
  accId,
  setter,
  setLoader,
  pageNo,
  pageSize,
  search
) => {
  setLoader(true);
  const searchPath = search ? `${search}&` : ''
  try {
    const res = await Axios.get(
      `/hcm/DocumentType/GetDocumentTypeLanding?AccountId=${accId}&Search=${searchPath}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    );
    if (res.status === 200 && res?.data?.data) {
      setter(res?.data);
      setLoader(false);
    }
  } catch (error) {
    
    setLoader(false);
  }
};

export const getSingleDataById = async (docTypeId, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/DocumentType/GetDocumentTypeByID?DocTypeId=${docTypeId}`
    );

    if (res?.status === 200) {
      const {
        strDocType,
      } = res?.data[0];

      const newData = {
        documnetType: strDocType,
        
      };
      setter(newData);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const saveEditedDocumentType = async (data, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.put(`/hcm/DocumentType/EditDocumentType`, data);
    if (res.status === 200) {
      toast.success(res.data?.message || "Edited successfully");
      setDisabled(false);
    }
  } catch (error) {
    
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

// Document Type Helper End
