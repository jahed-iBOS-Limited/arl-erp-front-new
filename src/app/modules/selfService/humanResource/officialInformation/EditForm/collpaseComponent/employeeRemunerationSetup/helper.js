import axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../../../../_helper/_dateFormate";

// type id 5 for other allowance hard code! Assign by Jayed Sir
export const getBenifitsAndAllowancesDDL = async (accId, setter) => {
  try {
    const res = await axios.get(`/hcm/EmployeeRemunerationSetup/GetEmployeeRemunerationComponentByTypeId?AccountId=${accId}&RemunerationComponentTypeId=5
    `);
    if (res.status === 200) {
      let newObj = res.data.map((item) => {
        return {
          value: item?.remunerationComponentId,
          code: item?.remunerationComponentCode,
          label: `${item?.remunerationComponent}[${item?.remunerationComponentCode}]`,
        };
      });
      setter(newObj);
    }
  } catch (error) {}
};

export const getLandingData = async (empId, accId, buId, setter) => {
  try {
    const res = await axios.get(`/hcm/EmployeeRemunerationSetup/EmployeeRemunerationLandingPagination?EmployeeId=${empId}&AccountId=${accId}&BusinessUnitId=${buId}&viewOrder=desc&PageNo=1&PageSize=100
    `);
    if (res.status === 200) {
      setter(res.data.data);
    }
  } catch (error) {}
};

/* Type id 1 for standard remu, 4 for Deduction, 5 for Benifits & Allowances */
export const getEmpRemuType = async (
  accId,
  typeId,
  setter,
  setDisabled,
  cb
) => {
  setDisabled(true);
  try {
    const res = await axios.get(
      `/hcm/EmployeeRemunerationSetup/GetEmployeeRemunerationComponentByTypeId?AccountId=${accId}&RemunerationComponentTypeId=${typeId}`
    );
    if (res.status === 200) {
      let newArray = res.data.map((item) => {
        let obj = {
          accountId: item?.accountId,
          actionBy: item?.actionBy,
          defaultPercentOnBasic: item?.defaultPercentOnBasic,
          remunerationComponent: item?.remunerationComponent,
          remunerationComponentCode: item?.remunerationComponentCode,
          remunerationComponentId: item?.remunerationComponentId,
          remunerationComponentTypeId: item?.remunerationComponentTypeId,
          isOnBasic: item?.isOnBasic,
          amount: "",
        };
        return obj;
      });
      setter(newArray);
      setDisabled(false);
      cb();
    }
  } catch (error) {
    setDisabled(false);
  }
};

export const createEmpRemuSetup = async (
  data,
  cb,
  id,
  accId,
  buId,
  setLandingData,
  setDisabled,
  setNetPayable,
  setBasicSalery,
  setGrossAmount
) => {
  setDisabled(true);
  try {
    const res = await axios.post(
      `/hcm/EmployeeRemunerationSetup/CreateEmployeeRemunerationSetup`,
      data
    );
    if (res.status === 200) {
      toast.success(res?.message || "Submitted successfully");
      getLandingData(id, accId, buId, setLandingData);
      setNetPayable(0);
      setBasicSalery(0);
      setGrossAmount(0);
      cb();
      setDisabled(false);
    }
  } catch (error) {
    setDisabled(false);
  }
};

export const getSingleDataById = async (empId, remId, accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/EmployeeRemunerationSetup/GetEmployeeRemunerationSetupById?AccountId=${accId}&BusinessUnitId=${buId}&EmployeeId=${empId}&EmployeeRemunerationSetupId=${remId}`
    );
    setter(res?.data);
  } catch (error) {}
};

export const getCurrencyDDL = async (setter) => {
  try {
    const res = await axios.get(`/domain/Purchase/GetBaseCurrencyList`);
    if (res.status === 200) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const editEmpRemuData = () => {};
