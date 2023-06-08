import Axios from "axios";
import * as Yup from "yup";

export const initData = {
  refType: "",
  refNo: "",
  transType: "",
  busiPartner: "",
  personnel: "",
  remarks: "",
  item: "",
  isAllItem: false,
  costCenter: "",
  projName: "",
};

// // Validation schema
export const validationSchema = Yup.object().shape({
  refType: Yup.object().shape({
    label: Yup.string().required("Refference Type is required"),
    value: Yup.string().required("Referrence Type is required"),
  }),
  transType: Yup.object().shape({
    label: Yup.string().required("Transaction Type is required"),
    value: Yup.string().required("Transaction Type is required"),
  }),
});

// Get purchase contract item
export const getPurchaseContractItem = async (refTypeId, refNoId, setter) => {
  try {
    const res = await Axios.get(
      `/procurement/PurchaseOrder/GetPOReferenceNoWiseItemDDL?RefTypeId=${refTypeId}&RefNoId=${refNoId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getControllingUnitDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/procurement/PurchaseOrder/GetControllingUnit?AccountId=${accId}&UnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getCostCenterDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/procurement/PurchaseOrder/GetCostCenter?AccountId=${accId}&UnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getCostElementDDL = async (
  accId,
  buId,
  controllUnitId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/procurement/PurchaseOrder/GetCostElement?AccountId=${accId}&UnitId=${buId}&ControllingUnitId=${controllUnitId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
