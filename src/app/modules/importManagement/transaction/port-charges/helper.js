import Axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { _todayDate } from "../../../_helper/_todayDate";

export const getPortChargeLanding = async (
  accountId,
  businessUnitId,
  poLcCode,
  shipmentmentCode,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/imp/ImportCommonDDL/ChargeTypeDDL?accountId=${accountId}&businessUnitId=${businessUnitId}&poNo=${poLcCode}&shipmentNo=${shipmentmentCode}`
    );
    setLoading(false);
    // console.log("res", res);
    // if (res?.data[2]?.row?.length <= 0) {
    //   toast.warn("Please Create Customs Duty For This Shipment", {
    //     toastId: "FirstCreateCustomDuity",
    //   });
    //   return setter([]);
    // }
    const newData = res?.data?.map((data) => ({
      ...data,
      totalAmount: data?.totalAmount === 0 ? "" : data?.totalAmount,
      vatAmount: data?.vatAmount === 0 ? "" : data?.vatAmount,
      dueDate: _dateFormatter(data?.dueDate) || _todayDate(),
      serviceReceiveDate:
        _dateFormatter(data?.serviceReceiveDate) || _todayDate(),
      vendor: data?.label === "CnF Payment" ? data?.row[0] : "",
    }));
    setter(newData);
  } catch (error) {
    setLoading(false);
    toast.error(error?.response?.data?.message);
  }
};

export const getShipmentDDL = async (
  accountId,
  businessUnitId,
  searchValue,
  setter
) => {
  try {
    const res = await Axios.get(
      `/imp/ImportCommonDDL/GetShipmentListForAllCharge?accountId=${accountId}&businessUnitId=${businessUnitId}&search=${searchValue}`
    );

    setter(res?.data);
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const createShipmentCharge = async (
  setDisabled,
  values,
  accountId,
  businessUnitId,
  item,
  cb
) => {
  let obj = {
    accountId: accountId,
    businessUnitId: businessUnitId,
    poId: +values?.poLcDDL?.poId,
    poNumber: values?.poLcDDL?.poNumber,
    lcId: +values?.poLcDDL?.lcId,
    lcNumber: values?.poLcDDL?.lcNumber,
    shipmentId: values?.shipmentDDL?.value,
    shipmentCode: values?.shipmentDDL?.label,
    chargeTypeId: item?.value,
    providerId: +item?.vendor?.value || 0,
    numTotalAmount: +item?.totalAmount,
    numVatAmount: +item?.vatAmount,
    dtePaymentDate: item?.paymentDate || _todayDate(),
    dueDate: item?.dueDate,
    serviceReceiveDate: item?.serviceReceiveDate,
    sbuId: values?.poLcDDL?.sbuId,
    plantId: values?.poLcDDL?.plantId,
  };
  setDisabled(true);
  try {
    let res = await Axios.post(`/imp/AllChargeNew/AllChargeCreate`, obj);
    setDisabled(false);
    toast.success(res?.data?.message || "Create successfully");
    cb && cb();
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message);
  }
};

export const getPortCharge = async (
  accountId,
  businessUnitId,
  poId,
  shipmentId,
  setter,
  setReferenceId,
  value
) => {
  console.log(value);
  try {
    const res = await Axios.get(
      `/imp/AllChargeNew/GetPoInfoForAllCharge?accountId=${accountId}&businessUnitId=${businessUnitId}&poId=${poId}&shipmentId=${shipmentId}`
    );
    setter(res?.data);
    if (value === 4) {
      setReferenceId(res?.data?.transportReferenceId);
    } else if (value === 9) {
      setReferenceId(res?.data?.hatchReferenceId);
    } else if (value === 10) {
      setReferenceId(res?.data?.scavatoryReferenceId);
    } else if (value === 5) {
      setReferenceId(res?.data?.surveyReferenceId);
    } else if (value === 6) {
      setReferenceId(res?.data?.unloadingReferenceId);
    } else if (value === 7) {
      setReferenceId(res?.data?.cleaningReferenceId);
    } else if (value === 8) {
      setReferenceId(res?.data?.othersReferenceId);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
export const getCNFPaymentPortCharge = async (
  accountId,
  businessUnitId,
  partnerId,
  invoiceAmount,
  gridData,
  setGridData,
  index,
  key,
  label
) => {
  try {
    if (partnerId) {
      const res = await Axios.get(
        `/imp/FormulaForCalculation/GetTotalAmountForCnFCharge?accountId=${accountId}&businessUnitId=${businessUnitId}&businessPartnerId=${partnerId}&invoiceAmount=${invoiceAmount}`
      );
      if (label && key) {
        let newGridData = [...gridData];
        newGridData[index]["totalAmount"] = res?.data;
        setGridData([...newGridData]);
      }
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const saveServicezbreakdown = async (
  payload,
  setIsLoading,
  cb,
  setReferenceId
) => {
  try {
    setIsLoading(true);
    const res = await Axios.post(
      "/imp/AllChargeNew/CreateCommercialCostingServiceBreakdown",
      payload
    );
    if (res.status === 200 && res?.data) {
      toast.success(res?.data?.message);
      setIsLoading(false);
      setReferenceId(0);
      cb();
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setIsLoading(false);
  }
};

export const getCommercialCostingServiceBreakdown = async (
  referenceId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/imp/AllChargeNew/GetCommercialCostingServiceBreakdown?referenceId=${referenceId}`
    );
    setter(res?.data);
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const getClosingInfoForBillAndAdvance = async (
  referenceId,
  setLoading,
  setter
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/imp/AllCharge/GetClosingInfoForBillAndAdvance?referenceId=${referenceId}`
    );
    setLoading(false);
    setter(res?.data);
  } catch (error) {
    setLoading(false);
  }
};

export const createCommercialMultiSupplierBillClose = async (accId, buId, plantId, sbuId, transactionDate, referenceId, billWithVat, userId, vat, setLoading) => {
  setLoading(true);
  try {
    const res = await Axios.post(
      `/imp/AllCharge/CreateCommercialMultiSupplierBillClose?accountId=2&businessUnitId=164&plantId=68&sbuId=57&transactionDate=2021-12-07&referenceId=20996&numAmountWithVat=1000&actionById=1205&numVatAmount=100`
    );
    setLoading(false);

    toast.success(res?.data?.message);
  } catch (error) {
    setLoading(false);
    toast.success(error?.response?.data?.message);
  }
};
