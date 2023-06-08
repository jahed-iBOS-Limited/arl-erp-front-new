import Axios from "axios";
import { toast } from "react-toastify";

export const getEmployeeNameDDL = async (accountId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/hcm/HCMDDL/EmployeeInfoDDL?AccountId=${accountId}&BusinessUnitId=${buId}`
    );

    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getLoanTypeDDL = async (setter) => {
  try {
    const res = await Axios.get(`/hcm/HCMDDL/GetLoanTypeDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const saveLoanAppAction = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/hcm/LoanApplication/CreateLoanApplication`,
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

// edit loan application
export const editLoanApplication = async (data, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.put(
      `/hcm/LoanApplication/EditLoanApplicationForReject`,
      data
    );
    if (res.status === 200) {
      toast.success(res?.message || "Edited successfully");
      setDisabled(false);
    }
  } catch (error) {
    setDisabled(false);
  }
};

export const getLoanApplicationLandingPasignation = async (
  id,
  accId,
  buId,
  pageNo,
  pagesize,
  setter,
  setLoader
) => {
  setLoader(true);
  try {
    const res = await Axios.get(
      `/hcm/JobApplication/ViewApplicant?RequisitionId=${id}`
    );
    
    if (res.status === 200) {
      setter(res?.data);
      setLoader(false);
    }
  } catch (error) {
    setLoader(false);
  }
};

// Update Remove Loan data
export const removeLoanApplication = async (id, updateRowDto, setRowDto) => {
  try {
    const res = await Axios.put(
      `/hcm/LoanApplication/CancelLoanApplication?LoanApplication=${id}`
    );
    if (res.status === 200) {
      toast.success(res.data?.message || "Loan remove successfully");
      setRowDto(updateRowDto);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

// get loanApplication by id
export const getLoanApplicationById = async (
  employeeId,
  applicationId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/hcm/LoanApplication/GetLoanApplicationById?EmployeeId=${employeeId}&Applicationid=${applicationId}`
    );
    if (res.status === 200 && res?.data) {
      const newData = {
        ...res?.data,
        employeeName: {
          value: res?.data[0]?.employeeId,
          label: res?.data[0]?.employeeName,
          employeeInfoDesignation: res?.data[0]?.designation,
          employeeInfoDepartment: res?.data[0]?.department,
          employeeBusinessUnit: res?.data[0]?.businessUnit,
        },
        loanType: {
          value: res?.data[0]?.loanTypeId,
          label: res?.data[0]?.loanTypeName,
        },
        loanAmount: res?.data[0]?.loanAmount,
        numberOfInstallment: res?.data[0]?.numberOfInstallment,
        installmentAmount: res?.data[0]?.numberOfInstallmentAmount,
        strReferenceNo: res?.data[0]?.strReferenceNo,
      };
      setter(newData);
    }
  } catch (error) {}
};


export const saveAttachment_action = async (attachment, cb) => {
  let formData = new FormData();
  attachment.forEach((file) => {
    formData.append("files", file?.file);
  });
  try {
    let { data } = await Axios.post("/domain/Document/UploadFile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    // toast.success(res?.data?.message || "Submitted Successfully");
    toast.success("Attachment Upload  successfully");
    return data;
  } catch (error) {
    toast.error("Document not upload");
  }
};


export const addAndEditJobCircular = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/hcm/JobRequisition/CreateOrEditJobRequisition`,
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

// get loanApplication by id
export const getCircularById = async (
  circularId,
  setter,
  setLoading
) => {
  setLoading(true)
  try {
    const res = await Axios.get(
      `/hcm/JobRequisition/GetJobRequisitionById?RequisitionId=${circularId}`
    );
    if (res.status === 200 && res?.data) {
      const circularData = res?.data[0]
      let newData = {
        ...circularData,
        title: circularData?.strDesignation || "",
        description:circularData?.strRequisitionSummery || "",
      };
      setter(newData);
      setLoading(false)
    }
  } catch (error) {
    setLoading(false)
  }
};