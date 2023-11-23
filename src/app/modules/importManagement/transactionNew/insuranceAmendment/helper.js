import Axios from "axios";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import numberWithCommas from "../../../_helper/_numberWithCommas";
export const getLandingData = async (
  accId,
  setDisabled,
  setter,
  pageNo,
  pageSize,
  search
) => {
  setDisabled(true);
  const searchPath = search ? `Search=${search}&` : "";
  try {
    let res = await Axios.get(
      `/domain/CreateRoleManager/GetRoleManagerSearchLandingPasignation?${searchPath}AccountId=${accId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    );
    if (res?.status === 200) {
      setter(res?.data);
      setDisabled(false);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
    setDisabled(false);
  }
};

// Validation schema
export const validationSchema = Yup.object().shape({
  poId: Yup.number().required("PO ID is required"),
  ponumber: Yup.string().required("PO Number is required"),
  // reason: Yup.string().required("Reason is required"),
  exchangeRate: Yup.number()
    .required("Exchange Rate is required")
    .positive("Exchange Rate must be positive"),
  totalCharge: Yup.number()
    .positive("Total Charge must be positive")
    .required("Total Charge is required"),
  numVatamount: Yup.number()
    .positive("VAT must be positive")
    .required("VAT is required"),
});

export const createInsurancAmendment = async (setDisabled, obj, cb) => {
  setDisabled(true);
  console.log('payload: ', obj)
  try {
    await Axios.post(`/imp/InsuranceAmendment/CreateInsuranceAmendment`, obj);
    setDisabled(false);
    toast.success("Created successfully");
    cb();
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message);
  }
};

export const getInsuranceSingleData = async (
  setDisabled,
  accountId,
  businessUnitId,
  poNumber,
  setter
) => {
  setDisabled(true);
  try {
    let res = await Axios.get(
      `/imp/InsuranceAmendment/GetCNInfoForInsuranceAmendment?accountId=${accountId}&businessUnitId=${businessUnitId}&poNumber=${poNumber}`
    );
    setDisabled(false);

    setter(res?.data);
  } catch (err) {
    setDisabled(false);
    toast.warning(err?.response?.data?.message);
  }
};
export const getTableData = async (
  // setDisabled,
  accountId,
  businessUnitId,
  poNumber,
  setter
) => {
  // setDisabled(true);
  try {
    let res = await Axios.get(
      `/imp/InsuranceAmendment/GetInsuranceAmendment?accountId=${accountId}&businessUnitId=${businessUnitId}&poNumber=${poNumber}`
    );
    // console.log(res, "res")
    let modifyData = res?.data?.map((item) => ({
      ...item,
      dueDate: _dateFormatter(item.dueDate),
      amendmentDate: _dateFormatter(item.amendmentDate),
      totalCharge: numberWithCommas(item?.totalCharge),
      piamountBDT: numberWithCommas(item?.piamountBDT),
    }));
    setter(modifyData);
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

// Get LC Amendment DDL
export const GetLcAmendmentDDL = async (accId, buId, poLcId, setter) => {
  try {
    const res = await Axios.get(
      `/imp/InsuranceAmendment/GetAllLCACodeDDLWithRespectToPO?accountId=${accId}&businessUnitId=${buId}&poId=${poLcId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const GetInsuranceAmendmentById = async (insuranceAmendmentId, setLoading, setter) => {
  setLoading(true);
  try{
    const res = await Axios.get(
      `/imp/InsuranceAmendment/GetInsuranceAmendmentById?insuranceAmendmentId=${insuranceAmendmentId}`
    );
    setter(res?.data);
    setLoading(false);
  }
  catch(error) {
    setter([]);
  }
}
