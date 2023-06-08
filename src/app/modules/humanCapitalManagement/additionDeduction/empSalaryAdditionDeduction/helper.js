import axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "./../../../_helper/_dateFormate";

export const getBuDDL = async (accId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/HCMReport/GetOnboardedBusinessUnitList?accountId=${accId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getAdditionDeductionDDL = async (
  accId,
  status,
  setter,
  isView = false
) => {
  try {
    let res = await axios.get(
      `/hcm/HCMDDL/GetAdditionDeductionType?AccountId=${accId}&IsAddition=${status}`
    );
    let data = res?.data?.map((item) => {
      return {
        ...item,
        value: item?.additionDeductionTypeId,
        label: item?.additionDeductionType,
      };
    });
    if (isView && res?.data?.length > 0) {
      setter([{ value: 0, label: "All" }, ...data]);
    } else {
      setter(data);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
    setter([]);
  }
};

export const getLandingData = async (
  empId,
  buId,
  monthId,
  yearId,
  typeId,
  isAuto,
  setDisabled,
  setter
) => {
  setDisabled(true);
  try {
    let res = await axios.get(
      `/hcm/EmpRemunerationAddDed/AdditionNDeductionReport?EmployeeId=${empId ||
        0}&BusinessUnitId=${buId ||
        0}&Month=${monthId}&Year=${yearId}&AdditionNDeductionTypeId=${typeId}&isAutoRenew=${isAuto ||
        false}`
    );
    setter(res?.data);
    setDisabled(false);
  } catch (err) {
    setter([]);
    toast.warning(err?.response?.data?.message);
    setDisabled(false);
  }
};

/*
`/hcm/EmpRemunerationAddDed/GetEmpSalaryAdditionDeductionLandingPasignation?AccountId=${accId}&EmployeeId=${empId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc&status=${isProcess}`

/hcm/EmpRemunerationAddDed/DeleteEmpSalaryAdditionDeductionById?AdditionNDeductionId=${id}
*/

export const createData = async (
  payload,
  setDisabled,
  cb,
  getEmpData,
  empId
) => {
  setDisabled(true);
  try {
    let res = await axios.post(
      `/hcm/EmpRemunerationAddDed/CreateEmpSalaryAddDed`,
      payload
    );
    cb();
    getEmpData(empId);
    toast.success(res?.data?.message, { toastId: "createData" });
    setDisabled(false);
  } catch (err) {
    toast.warning(err?.response?.data?.message, {
      toastId: "createDataError",
    });
    setDisabled(false);
  }
};

export const editData = async (payload, setDisabled) => {
  setDisabled(true);
  try {
    let res = await axios.post(
      `/hcm/EmpRemunerationAddDed/CreateEmpSalaryAddDed`,
      payload
    );
    toast.success(res?.data?.message, { toastId: "editData" });
    setDisabled(false);
  } catch (err) {
    toast.warning(err?.response?.data?.message, {
      toastId: "editDataError",
    });
    setDisabled(false);
  }
};

export const deleteEmpSalaryAdditionDeductionById = async (
  typeId,
  id,
  userId,
  cb
) => {
  try {
    let res = await axios.get(
      `/hcm/EmpRemunerationAddDed/DeleteEmpSalaryAdditionDeductionById?AdditionNDeductionId=${typeId}&EmployeeId=${id}&ActionBy=${userId}`
    );
    cb();
    toast.success(res?.data?.message || "Successfully Data Deleted");
  } catch (err) {
    toast.warning(err?.response?.data?.message || "Failed! Please try again");
  }
};

export const getById = async (
  empId,
  setDisabled,
  employee,
  setSingleData,
  setRowData,
  setTotalAddition,
  setTotalDeduction
) => {
  setDisabled(true);
  try {
    let res = await axios.get(
      `/hcm/EmpRemunerationAddDed/GetEmpSalaryAdditionDeductionById?employeeId=${empId}`
    );
    setDisabled(false);
    const data = res?.data?.header;
    const payload = {
      empRemunerationAddDedHeaderId: data?.empRemunerationAddDedHeaderId,
      employee: employee,
      empName: employee?.label,
      dteFromDate: _dateFormatter(data?.dteFromDate),
      dteToDate: _dateFormatter(data?.dteToDate),
      numTotalAdditionAmount: data?.numTotalAdditionAmount,
      numTotalDeductionAmount: data?.numTotalDeductionAmount,
      type: {
        value: 1,
        label: "Addition",
      },
      typeName: "",
      amount: "",
    };
    const rowData = res?.data?.row?.map((item) => {
      return {
        empSalaryAddDedRowId: item?.empRemunerationAddDedRowId,
        empRemunerationAddDedHeaderId: item?.empRemunerationAddDedHeaderId,
        isAddition: item?.isAddition,
        type: {
          value: item?.intTypeId,
          label: item?.strType,
        },
        typeId: item?.intTypeId,
        comments: item?.strComments,
        numAmount: item?.numAmount,
      };
    });
    if (rowData && payload) {
      setSingleData(payload);
      setRowData(rowData);
      setTotalAddition(data?.numTotalAdditionAmount);
      setTotalDeduction(data?.numTotalDeductionAmount);
    }
  } catch (err) {
    setSingleData("");
    toast.warning(err?.response?.data?.message);
    setDisabled(false);
  }
};
