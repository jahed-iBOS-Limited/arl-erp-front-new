import Axios from "axios";
import { toast } from "react-toastify";
import { APIUrl } from "../../../../../../../App";

export const getDocumentTypeDDL = async (accId, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/HCMDDL/GetDocumentType?AccountId=${accId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};

export const saveDocManagement_api = async (payload, cb, setDisabled) => {
  try {
    setDisabled(true);
    const res = await Axios.post(
      "/hcm/DocumentAttachment/CreateDocumentAttachment",
      payload
    );
    if (res.status === 200) {
      toast.success(res?.data?.message || "Submitted Successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

//getEmployeeBankInformationById
export const getDocumentAttachmentByEmployeeId_api = async (id, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/DocumentAttachment/GetDocumentAttachmentByEmployeeId?EmployeeId=${id}`
    );
    if (res.status === 200 && res?.data) {
      // const data = res?.data?.length;
      const newData = res?.data;
      // console.log(res?.data, "ataData");
      if (res?.data?.length > 0) {
        let newDataRow = newData.map(data => {
          return {
            ...data,
            intActionBy:data.createdBy,
          }
        })
        setter(newDataRow);
      } else {
        setter([]);
      }
    }
  } catch (error) {
    
  }
};

export const editDocManagement_api = async (payload, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.put(
      "/hcm/DocumentAttachment/EditDocumentAttachment",
      payload
    );
    if (res.status === 200) {
      toast.success(res?.data?.message || "Submitted Successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};



export const getImageFile_API= async (id) => {
 
  try {
    const res = await Axios.get(
      `${APIUrl}/domain/Document/DownlloadFile?id=${id}`
    )

    if (res.status === 200 && res.data) {
      return res?.config?.url
    }
  } catch (error) {}
}
