import axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { _todayDate } from "../../../_helper/_todayDate";
import moment from "moment";

export const getDays = (fromDate, toDate) => {
  let start = moment(fromDate);
  let end = moment(toDate);
  return end.diff(start, "days");
};
export const getCnfDDL = async (accId, businessUnit, setter) => {
  try {
    let query = `/imp/DocumentRelease/GetCnFDDLForDocumentRelease?accountId=${accId}&businessUnitId=${businessUnit}`;
    let res = await axios.get(query);
    setter(res?.data);
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};
export const getLandingData = async (
  accId,
  businessUnit,
  setter,
  setDisabled,
  pageNo,
  pageSize,
  poNumber,
  fromDate,
  toDate
) => {
  setDisabled(true);
  try {
    let query = `/imp/DocumentRelease/GetDocumentReleaseLanding?accountId=${accId}&businessUnit=${businessUnit}`;
    if (poNumber) {
      query += `&search=${poNumber}`;
    }
    if (fromDate) {
      query += `&fromDate=${fromDate}`;
    }
    if (toDate) {
      query += `&toDate=${toDate}`;
    }
    query += `&PageNo=${pageNo}&PageSize=${pageSize}&ViewOrder=desc`;
    let res = await axios.get(query);
    setDisabled(false);
    setter(res?.data);
  } catch (err) {
    toast.warning(err?.response?.data?.message);
    setDisabled(false);
  }
};
export const documentReleaseGetByShipmentId = async (
  shipmentId,
  setShipmentData,
  setDisabled,
  values
) => {
  setDisabled(true);
  try {
    let res = await axios.get(
      `/imp/DocumentRelease/GetDocumentReleaseByShipmentId?shipmentId=${shipmentId}`
    );
    if (res?.status === 200) {
      const {
        lcTypeId,
        lcTypeName,
        shipByNumber,
        shippingDate,
        invoiceNumber,
        invoiceDate,
        poNumber,
        lcNumber,
        shipById,
        shipByName,
        currencyId,
        currencyName,
        invoiceAmount,
        // docReleaseByBankDate,
        paymentDate,
        startDate,
        dueDate,
        pgAmount,
        documentForwardDate,
        cnfPartnerName,
        cnfPartnerId,
        tenorDays,
        isLtr,
      } = res?.data;

      const newPayload = {
        isLtr: isLtr,
        currencyId: currencyId,
        currencyName: currencyName,
        shipById: shipById,
        shipByName: shipByName,
        lcNumber: lcNumber,
        poNumber: poNumber,
        lcType: { value: lcTypeId, label: lcTypeName },
        BlAwbTRNumber: shipByNumber,
        BlAwbTrDate: _dateFormatter(shippingDate),
        invoiceNo: invoiceNumber,
        invoiceDate: _dateFormatter(invoiceDate),
        invoiceAmount: invoiceAmount,
        docReleaseByBankDate: "",
        paymentDate: _dateFormatter(paymentDate) || _todayDate(),
        startDate: _dateFormatter(startDate) || _todayDate(),
        dueDate: _dateFormatter(dueDate) || _todayDate(),
        vatOnDocRelease: "",
        docReleaseCharge: "",
        pgAmount: pgAmount,
        tenorDays: getDays(
          _dateFormatter(startDate) || _todayDate(),
          _dateFormatter(dueDate) || _todayDate()
        ),
        vatOnDocReleaseAtSight: "",
        docReleaseChargeAtSight: "",
        documentForwardDate: documentForwardDate || _todayDate(),
        // totalAmount: "",
        cnfDDL: { label: cnfPartnerName, value: cnfPartnerId },
        tenorDaysForRowDto: tenorDays
      };
      setShipmentData({
        ...newPayload,
        exchangeRate: currencyId === 141 ? 1 : "",
        totalCharge: currencyId === 141 ? invoiceAmount * 1 : "",
      });
      setDisabled(false);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
    setDisabled(false);
  }
};
export const getDocumentReleaseById = async (
  accountId,
  businessUnitId,
  shipmentId,
  prevData,
  setter,
  setRowDto,
  setDisabled
) => {
  // console.log(prevData);
  setDisabled(true);
  try {
    let res = await axios.get(
      `/imp/DocumentRelease/GetDocumentReleaseById?accountId=${accountId}&businessUnitId=${businessUnitId}&shipmentId=${shipmentId}`
    );
    if (res?.status === 200) {
      const {
        lcTypeId,
        lcTypeName,
        shipByNumber,
        dteShipByDate,
        invoiceNumber,
        dteInvoiceDate,
        poNumber,
        lcNumber,
        shipById,
        shipByName,
        currencyId,
        currencyName,
        numInvoiceAmount,
        dteDocReceiveDateByBank,
        numDocReleaseCharge,
        paymentDate,
        startDate,
        dueDate,
        numVatamount,
        numTotalAmount,
        numExchangeRate,
        numTotalBdt,
        pgAmount,
        tenorDays,
        numOtherCharge,
        numTotalCharge,
        cnFLCPartnerId,
        cnFLCPartnerName,
        documentForwardDate,
      } = res?.data?.header;

      const newPayload = {
        currencyId: currencyId,
        currencyName: currencyName,
        shipById: shipById,
        shipByName: shipByName,
        lcNumber: lcNumber,
        poNumber: poNumber,
        lcType: { value: lcTypeId, label: lcTypeName },
        BlAwbTRNumber: shipByNumber,
        BlAwbTrDate: _dateFormatter(dteShipByDate),
        invoiceNo: invoiceNumber,
        invoiceDate: _dateFormatter(dteInvoiceDate),
        invoiceAmount: numInvoiceAmount,
        docReleaseByBankDate: _dateFormatter(dteDocReceiveDateByBank),
        paymentDate: _dateFormatter(paymentDate) || _todayDate(),
        startDate: _dateFormatter(startDate) || _todayDate(),
        dueDate: _dateFormatter(dueDate) || _todayDate(),
        vatOnDocRelease: numVatamount,
        docReleaseCharge: numDocReleaseCharge,
        // totalCharge: numTotalAmount,
        exchangeRate: numExchangeRate,
        totalPayment: numTotalBdt,
        pgAmount: pgAmount,
        tenorDays: tenorDays,

        docReleaseChargeAtSight: numDocReleaseCharge,
        vatOnDocReleaseAtSight: numVatamount,
        grandTotalInfoAtSight: numTotalAmount,

        otherChanges: numOtherCharge,
        total: numTotalCharge,
        totalCharge: numTotalBdt,
        cnfDDL: {
          label: cnFLCPartnerName,
          value: cnFLCPartnerId,
        },
        documentForwardDate: _dateFormatter(documentForwardDate),
      };
      setter({
        ...prevData,
        ...newPayload,
      });
      if (res?.data?.row?.length > 0) {
        const data = res?.data?.row?.map((item) => {
          return {
            ...item,
            paymentAmount: item?.numInvoiceAmount,
            pgAmount: item?.numPGAmount,
            startDate: _dateFormatter(item?.startDate),
            dueDate: _dateFormatter(item?.matureDate),
            tenorDays: item?.tenorDay,
            pgOtherAmount: item?.pgandOtherAdjustment,
            otherAmount:item?.otherCharge,
            netAmountFc:item?.netPayAmount,
            pgStatus:item?.isPG ? "Yes" : "No"
          };
        });
        setRowDto(data);
      }

      setDisabled(false);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
    setDisabled(false);
  }
};

//At Sight Document Release Create;
export const documentReleaseCreate = async (
  values,
  userId,
  accountId,
  businessUnitId,
  setDisabled,
  shipmentId,
  rowDto,
  poID,
  lcID,
  cb
) => {
  setDisabled(true);
  const obj = atSightDocumentReleaseCreatePayloadChange(
    values,
    userId,
    accountId,
    businessUnitId,
    shipmentId,
    poID,
    lcID
  );
  // console.log("values", values);
  const withoutAtSightpayload = {
    header: {
      accountId: accountId,
      businessUnitId: businessUnitId,
      ponumber: values?.poNumber,
      lcnumber: values?.lcNumber,
      lcTypeId: values?.lcType?.value,
      subPonumber: "",
      shipmentId: shipmentId,
      shipByNumber: values?.BlAwbTRNumber,
      dteShipByDate: values?.BlAwbTrDate,
      invoiceNumber: values?.invoiceNo,
      dteInvoiceDate: values?.invoiceDate,
      numInvoiceAmount: values?.invoiceAmount,
      currencyId: values?.currencyId,
      numExchangeRate: values?.exchangeRate,
      numDocReleaseAmount: +values?.docReleaseCharge,
      // numTotalBdt: values?.totalPayment,
      dteDocReceiveDateByBank: values?.docReleaseByBankDate ? values?.docReleaseByBankDate : null,
      dtePaymentDate: values?.paymentDate,
      numVatamount: values?.vatOnDocRelease,
      numTotalAmount: values?.totalCharge,
      strDocReleaseDocumentId: "",
      actionBy: userId,
      poId: poID,
      lcId: lcID,
      sbuId: values?.sbuId,
      plantId: values?.plantId,
      cnFLCPartnerId: values?.cnfDDL.value,
      cnFLCPartnerName: values?.cnfDDL.label,
      documentForwardDate: _dateFormatter(values?.documentForwardDate),
    },
    row: rowDto?.map((item) => ({
      accountId: accountId,
      businessUnitId: businessUnitId,
      poNumber: values?.poNumber,
      lcNumber: values?.lcNumber,
      shipmentId: shipmentId,
      lcTypeId: values?.lcType?.value,
      pGandOtherAdjustment: +item?.pgOtherAmount,
      tenorDay: +item?.tenorDays,
      dteMatureDate: values?.dueDate,
      dteStartDate: values?.startDate,
      // numOthersAdjustment: +item?.otherAdjustment || 0,
      numTotalPayable: +item?.paymentAmount,
      netAmountFc: +item?.netAmountFc,
      numBankRate: +item?.numBankRate || 0,
      numLiborRate: +item?.numLiborRate || 0,
      sbuId: +item?.sbuId,
      plantId: +item?.plantId,
      poId: poID,
      lcId: lcID,
      invoicePayAmount:+item?.paymentAmount,
      netPayAmount: +(item?.netPayAmount).toFixed(6),
      otherCharge:+item?.otherAmount,
      isPG:item?.isPG
    })),
  };
  // console.log('withoutAtSightpayload', withoutAtSightpayload)
  // console.log("values", values);
  try {
    if (values?.lcType?.label === "At Sight") {
      let res = await axios.post(
        `/imp/DocumentRelease/CreateDocumentRelease`,
        obj
      );
      // console.log("res", res)
      toast.success(res?.data?.message || "create successfully");
    } else {
      if (rowDto?.length > 0) {
        let response = await axios.post(
          `/imp/DocumentRelease/CreateDocumentReleaseSchedule`,
          withoutAtSightpayload
        );
        toast.success(response?.data?.message || "create successfully");
      } else {
        toast.warn("Please add at least add one row");
      }
    }

    setDisabled(false);

    cb();
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message);
  }
};

const atSightDocumentReleaseCreatePayloadChange = (
  values,
  userId,
  accountId,
  businessUnitId,
  shipmentId,
  poID,
  lcID
) => {
  // console.log("values", values);
  const payload = {
    accountId: accountId,
    businessUnitId: businessUnitId,
    poId: poID,
    lcId: lcID,
    sbuId: values?.sbuId,
    plantId: values?.plantId,
    ponumber: values?.poNumber,
    lcnumber: values?.lcNumber,
    lcTypeId: values?.lcType?.value,
    subPonumber: "",
    shipmentId: shipmentId,
    shipByNumber: values?.BlAwbTRNumber,
    dteShipByDate: values?.BlAwbTrDate,
    invoiceNumber: values?.invoiceNo,
    dteInvoiceDate: values?.invoiceDate,
    currencyId: values?.currencyId,
    numExchangeRate: values?.exchangeRate,
    // numOtherCharge: +values?.otherCharges || 0,
    strDocReleaseDocumentId: "",
    dteDocReceiveDateByBank: values?.docReleaseByBankDate ? values?.docReleaseByBankDate : null,
    dtePaymentDate: values?.paymentDate,
    actionBy: userId,
    numInvoiceAmountFC: values?.invoiceAmount,
    numInvoiceAmountBDT: values?.totalCharge,
    // numTotalAmount: values?.totalAmount,
    numDocReleaseAmount: values?.docReleaseChargeAtSight,
    vatOnDocReleaseAmount: values?.vatOnDocReleaseAtSight,
    cnFLCPartnerId: values?.cnfDDL.value,
    cnFLCPartnerName: values?.cnfDDL.label,
    documentForwardDate: _dateFormatter(values?.documentForwardDate),
    isLtr: values?.isLtr
  };
  return payload;
};

export const paymentSchedulegetApi = async (
  poNo,
  lcNo,
  shipmentId,
  setter,
  setDisabled
) => {
  try {
    setDisabled(true);
    let res = await axios.get(
      `/imp/DocumentRelease/GetDocumentReleaseById?PONo=${poNo}&LCNo=${lcNo}&shipmentId=${shipmentId}`
    );
    setDisabled(false);
    if (res?.status === 200) {
      const {
        accountId,
        businessUnitId,
        ponumber,
        lcnumber,
        lcTypeId,
        lcTypeName,
        subPonumber,
        shipmentId,
        shipByNumber,
        dteShipByDate,
        invoiceNumber,
        dteInvoiceDate,
        numInvoiceAmount,
        currencyId,
        currencyName,
        numExchangeRate,
        numTotalBdt,
        dteDocReceiveDateByBank,
        dtePaymentDate,
        strDocReleaseDocumentId,
        actionBy,
      } = res?.data;
      const newData = {
        header: {
          accountId: accountId,
          businessUnitId: businessUnitId,
          ponumber: ponumber,
          lcnumber: lcnumber,
          lcTypeId: lcTypeId,
          lcTypeName: lcTypeName,
          subPonumber: subPonumber,
          shipmentId: shipmentId,
          shipByNumber: shipByNumber,
          dteShipByDate: _dateFormatter(dteShipByDate),
          invoiceNumber: invoiceNumber,
          dteInvoiceDate: _dateFormatter(dteInvoiceDate),

          numInvoiceAmount: numInvoiceAmount,
          currencyId: currencyId,
          currencyName: currencyName,
          numExchangeRate: numExchangeRate,
          numTotalBdt: numTotalBdt,
          dteDocReceiveDateByBank: _dateFormatter(dteDocReceiveDateByBank),
          dtePaymentDate: _dateFormatter(dtePaymentDate),
          strDocReleaseDocumentId: strDocReleaseDocumentId,
          actionBy: actionBy,
        },
        row: res?.data?.row?.map((item) => item),
      };
      setDisabled(false);
      setter(newData);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

export const initData = {
  lcType: "",
  BlAwbTRNumber: "",
  BlAwbTrDate: "",
  invoiceNo: "",
  invoiceDate: "",
  invoiceAmount: "",
  // otherCharges: "",
  total: "",
  exchangeRate: "",
  docReleaseCharge: "",
  vatOnDocRelease: "",
  docReleaseByBankDate: "",
  paymentDate: _todayDate(),
  paymentAmount: "",
  pgAmount: "",
  otherAdjustment: "",
  startDate: _todayDate(),
  dueDate: _todayDate(),
  tenorDays: "",
  // grandTotalInfoAtSight: "",
  vatOnDocReleaseAtSight: "",
  docReleaseChargeAtSight: "",
  cnfDDL: "",
  documentForwardDate: _todayDate(),
  //for at sight
  // totalAmount: "",
  isLtr: false,
};
