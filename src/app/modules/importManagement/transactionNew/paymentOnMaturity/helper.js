import Axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { _todayDate } from "../../../_helper/_todayDate";
// import { _formatMoney } from './../../../_helper/_formatMoney';

const createPayloadChange = (accountId, businessUnitId, values, userId) => {
  const payload = {
    ...values,
    accountId: accountId,
    businessUnitId: businessUnitId,
    paymentScheduleId: values?.paymentScheduleDDL?.value,
    numAcceptanceCommission: 0,
    numPaymentOfBeneficiary: 0,
    numPgadjustment: 0,
    numVatamount: 0,
    openingLcdocumentId: "",
    intLastActionBy: userId,
    isActive: true,
    dtePgdueDate: new Date(values.dtePgdueDate),
    dteDiscountingStartDate: new Date(),
    dteMaturityDate: new Date(values.dteMaturityDate),
    dtePaymentDate: new Date(values.dtePaymentDate),
  };
  return payload;
};

export const getPaymentOnMaturity = async (
  accountId,
  businessUnitId,
  setter,
  setLoading,
  poNo,
  shipmentId
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/imp/DocumentRelease/GetMPayByShipmentId?accountId=${accountId}&businessUnitId=${businessUnitId}&poNumber=${poNo}&shipmentId=${shipmentId}`
    );
    // console.log("res", res);
    setLoading(false);
    const newData = res.data?.map((item) => ({
      ...item,
      liborRate: item?.liborRate ? item?.liborRate : "",
      bankRate: item?.bankRate ? item?.bankRate : "",
      paymentDate: _todayDate(),
      totalAmount:item?.exchangeRate * item?.netPayAmount,
    }));
    setter(newData);
  } catch (error) {
    setLoading(false);
    toast.error(error?.response?.data?.message);
  }
};

// https://localhost:44396/imp/PaymentSchedule/GetListPOLCShipmentId?accountId=2&businessUnitId=164&shipmentId=2&pageSize=111&pageNo=1&viewOrder=asc
export const getLandingData = async (
  accountId,
  businessUnitId,
  shipmentId,
  pageSize,
  pageNo,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/imp/PaymentSchedule/GetListPOLCShipmentId?accountId=${accountId}&businessUnitId=${businessUnitId}&shipmentId=${shipmentId}&pageSize=${pageSize}&pageNo=${pageNo}&viewOrder=asc`
    );
    if (res.status === 200 && res?.data) {
      res.data.data.forEach((item) => {
        item["sentDate"] = _dateFormatter(
          item["sentDate"] ? new Date(item["sentDate"]) : new Date()
        );
      });
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
    toast.error(error?.response?.data?.message);
  }
};

// https://localhost:44396/imp/BeneficiaryPayment/GetInformation?accountId=2&businessUnitId=164&PONo=PO-420096&LCNo=LC-420096&shipmentId=3
export const GetShipmentDetailsByShipmentId = async (
  accountId,
  businessUnitId,
  poNO,
  lcNo,
  shipmentId,
  prevData,
  setter
) => {
  try {
    const res = await Axios.get(
      `/imp/BeneficiaryPayment/GetInformation?accountId=${accountId}&businessUnitId=${businessUnitId}&PONo=${poNO}&LCNo=${lcNo}&shipmentId=${shipmentId}`
    );
    if (res.status === 200 && res?.data) {
      setter({
        ...prevData,
        ...res?.data,
        numInvoiceAmount: res?.data?.invoiceAmount,
        currencyName: res?.data?.currencyName,
        numAmountOfPg: res?.data?.pgAmount,
        dtePgdueDate: _dateFormatter(res?.data?.pgDueDate),
      });
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const createMaturityPayment = async (
  values,
  userId,
  accountId,
  businessUnitId,
  setDisabled
) => {
  setDisabled(true);
  const obj = createPayloadChange(accountId, businessUnitId, values, userId);
  try {
    // https://localhost:44396/imp/BeneficiaryPayment/CreateBeneficiaryPayment
    await Axios.post(`/imp/BeneficiaryPayment/CreateBeneficiaryPayment`, obj);
    setDisabled(false);
    toast.success("Create successfully");
    // cb();
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message);
  }
};

// https://localhost:44396/imp/BeneficiaryPayment/EditBeneficiaryPayment

export const editBeneficiaryPayment = async (
  values,
  userId,
  accountId,
  businessUnitId,
  setDisabled
) => {
  setDisabled(true);
  const obj = createPayloadChange(accountId, businessUnitId, values, userId);

  try {
    await Axios.put(`/imp/BeneficiaryPayment/EditBeneficiaryPayment`, obj);
    setDisabled(false);
    toast.success("Update successfully");
  } catch (error) {
    setDisabled(false);
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
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
// https://localhost:44396/imp/ImportCommonDDL/PaymentScheduleDDL?accountId=2&businessUnitId=164&PONo=PO-420096&LCNO=LC-420096&shipmentId=2
export const getPaymentScheduleList = async (
  accountId,
  businessUnitId,
  poNo,
  lcNo,
  shipmentId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/imp/ImportCommonDDL/PaymentScheduleDDL?accountId=${accountId}&businessUnitId=${businessUnitId}&PONo=${poNo}&LCNO=${lcNo}&shipmentId=${shipmentId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

// https://localhost:44396/imp/PaymentSchedule/CreatePaymentSchedule
const createPaymentSchedule = async (
  item,
  values,
  setDisabled,
  accountId,
  businessUnitId,
  singleItem,
  cb
) => {
  try {
    const payload = {
      accountId: accountId,
      businessUnitId: businessUnitId,
      poid: singleItem?.poId,
      ponumber: item?.poNumber,
      lcid: singleItem?.lcId,
      lcnumber: item?.lcNumber,
      shipmentId: item?.shipmentId,
      exchangeRate: +item?.exchangeRate,
      totalPayable: +item?.totalAmount,
      totalInterest: +item?.vatAmount,
      isFinalPayment: true,
      sbuid: singleItem?.sbuId,
      plantId: singleItem?.plantId,
      lctypeId: singleItem?.lcTypeId,
      netAmountFc: +item?.totalPayable,
      pgandOtherAdjustment:
        Number(item?.othersAdjustment) + Number(item?.numPgamount),
      // amountLocalC: +item?.totalPayable * +item?.exchangeRate,
      startDate: item?.dteStartDate,
      matureDate: item?.dteMatureDate,
      tenorDay: +item?.tenorDay,
      bankRate: +item?.bankRate,
      liborRate: +item?.liborRate,
      transactionDate: item?.paymentDate,
      paymentScheduleCode: item?.paymentScheduleCode,
      invoicePayAmount: item?.invoicePayAmount || 0,
      otherCharge: item?.otherCharge || 0,
      netActualPayAmount: item?.netPayAmount || 0,
      payDate: _dateFormatter(item?.paymentDate),
      amountLocalC:item?.totalAmount
    };
    setDisabled(true);
    const res = await Axios.post(
      `/imp/PaymentSchedule/CreatePaymentSchedule`,
      payload
    );
    setDisabled(false);
    toast.success(res?.data?.message || "Submitted successfully", {
      toastId: "Created Successfully",
    });
    cb && cb();
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message);
  }
};

export function cleckSent(
  item,
  values,
  setDisabled,
  accountId,
  businessUnitId,
  singleItem,
  cb
) {
  if (!item?.exchangeRate || !item?.totalAmount) {
    return toast.warn("Please fill all field");
  } else {
    return createPaymentSchedule(
      item,
      values,
      setDisabled,
      accountId,
      businessUnitId,
      singleItem,
      cb
    );
    // setIsShowModal(false);
  }
}
