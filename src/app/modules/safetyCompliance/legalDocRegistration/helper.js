import axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../_helper/_dateFormate";

// save api for create or edit
export const saveLegalDocumentRegistration = async (data, setDisabled, cb) => {
  try {
    setDisabled(true);
    const res = await axios.post(
      `/hcm/SafetyAndCompliance/LegalDocumentALL`,
      data
    );
    setDisabled(false);
    cb();
    toast.success(res?.data?.[0]?.message || "Submitted successfully");
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message || "Please try again");
  }
};

// Attachment
export const attachment_action = async (attachment, setLoading) => {
  setLoading && setLoading(true);
  let formData = new FormData();
  formData.append("files", attachment[0]);
  try {
    let { data } = await axios.post("/domain/Document/UploadFile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    setLoading && setLoading(false);
    toast.success("Upload  successfully");
    return data;
  } catch (error) {
    setLoading && setLoading(false);
    toast.error("File Size is too large or inValid File!");
    return error;
  }
};

// get data by id
export const GetLegalDocRegDataById = async (id, setter, setLoading) => {
  setLoading(true);
  try {
    const { data } = await axios.get(
      `/hcm/SafetyAndCompliance/LegalDocumentALLGET?strPartType=LegalDocumentRegistrationById&intLegalDocumentRegId=${id}
      `
    );
    const modifyData = {
      unit: {
        value: data?.[0]?.intBusinessUnitId,
        label: data?.[0]?.strBusinessUnitName,
      },
      workplaceGroup: {
        value: data?.[0]?.intWorkplaceGroupId,
        label: data?.[0]?.strWorkplaceGroupName,
      },
      workplace: {
        value: data?.[0]?.intWorkplaceId,
        label: data?.[0]?.strWorkplaceName,
      },
      documentName: {
        value: data?.[0]?.intLegalDocumentNameId,
        label: data?.[0]?.strDocumentName,
      },
      contPerson: {
        value: data?.[0]?.intEmployeeId,
        label: data?.[0]?.strEmployeeFullName,
      },
      renewalType: {
        value: data?.[0]?.strRenualType,
        label: data?.[0]?.strRenualType,
      },
      documentStatus: {
        value: data?.[0]?.strDocumentStatus,
        label: data?.[0]?.strDocumentStatus,
      },
      authority: data?.[0]?.strAuthorName,
      address: data?.[0]?.strAddress,
      renewalDate: _dateFormatter(data?.[0]?.dteRenewalDate),
      expiryDate: _dateFormatter(data?.[0]?.dteExpiryDate),
      lastUpdatedDate: _dateFormatter(data?.[0]?.dteLastUpdateDate),
      documentNo: data?.[0]?.strDocumentNo,
      // checkBox: data?.[0]?.strStatus === "Applied" ? true : false,
      remarks: data?.[0]?.strRemarks,
    };
    setter(modifyData);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

// get legal doc file list by id
export const GetLegalDocFileListById = async (id, setter, setLoading) => {
  setLoading(true);
  try {
    const { data } = await axios.get(
      `/hcm/SafetyAndCompliance/LegalDocumentALLGET?strPartType=LegalDocumentFileListByRegistrationId&intLegalDocumentRegId=${id}
      `
    );
    const modifyData = data?.map((item) => ({
      ...item,
      fileName: item?.strFileUrl,
      isCreate: false,
      isDelete: false,
    }));
    setter(modifyData);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

// name cutter function
export const nameCutter = (start, end, name) => {
  if (!name) return false;
  let newName = name.slice(start, end);
  if (name.length > end) {
    return `${newName}...`;
  } else {
    return name;
  }
};
