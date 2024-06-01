import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";
import * as Yup from "yup";
// import { _dateFormatter } from "../../_chartinghelper/_dateFormatter";
import { imarineBaseUrl } from "../../../../App";

const getKey = (description) => {
  switch (description) {
    case "HIRE DUE TO OWNR":
      return "hdto";
    case "HIRE ADD COMM":
      return "hac";
    case "HIRE BROK COM":
      return "hbc";
    case "C/V/E":
      return "cve";
    default:
      return "";
  }
};

const descriptionsForEnabledQty = [
  "BOD-LSFO",
  "BOD-LSMGO",
  "BOR-LSFO",
  "BOR-LSMGO",
];
const descriptionsOfEnabledDebitAndCredits = [
  "ON HIRE SURVEY COST",
  "OFF HIRE SURVEY COST",
];

const descriptions = [
  "HIRE DUE TO OWNR",
  "HIRE ADD COMM",
  "HIRE BROK COM",
  "C/V/E",
  "BOD-LSFO",
  "BOD-LSMGO",
  "BOR-LSFO",
  "BOR-LSMGO",
  "ILOHC",
  "OFFHIRE",
];

const getIsCreditOrDebit = (description) => {
  if (descriptionsOfEnabledDebitAndCredits.includes(description)) {
    return true;
  } else if (
    !descriptions.includes(description) &&
    description.substring(0, 7) !== "OFFHIRE"
  ) {
    return true;
  } else {
    return false;
  }
};

// Validation schema
export const validationSchema = Yup.object().shape({
  vesselName: Yup.object().shape({
    label: Yup.string().required("Vessel Name is required"),
    value: Yup.string().required("Vessel Name is required"),
  }),
  voyageNo: Yup.object().shape({
    label: Yup.string().required("Voyage No is required"),
    value: Yup.string().required("Voyage No is required"),
  }),
  redeliveryDate: Yup.string().required("Field is required"),
});

export const getTimeCharterLandingData = async (
  accId,
  buId,
  vesselId,
  voyageId,
  pageNo,
  pageSize,
  searchValue,
  setter,
  setLoading
) => {
  setLoading(true);
  const search = searchValue ? `&search=${searchValue}` : "";
  const voyageNoStr = voyageId ? `&VoyageId=${voyageId}` : "";
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/TimeCharterTransaction/GetTimeCharterLanding?AccountId=${accId}&BusinessUnitId=${buId}&VesselId=${vesselId ||
        0}${voyageNoStr}${search}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (err) {
    setter([]);
    setLoading(false);
  }
};

export const saveTimeCharterTransaction = async (data, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `${imarineBaseUrl}/domain/TimeCharterTransaction/SaveTimeCharterTransaction`,
      data
    );
    cb();
    toast.success(res?.data?.message);
    setLoading(false);
  } catch (err) {
    toast.error(
      err?.response?.data?.message || "Something went wrong, Please try again!"
    );
    setLoading(false);
  }
};

// export const editTimeCharterTransaction = async (data, setLoading) => {
//   setLoading(true);
//   try {
//     const res = await axios.put(
//       `${imarineBaseUrl}/domain/Transaction/EditTransaction`,
//       data
//     );
//     toast.success(res?.data?.message);
//     setLoading(false);
//   } catch (err) {
//     toast.error(
//       err?.response?.data?.message || "Something went wrong, Please try again!"
//     );
//     setLoading(false);
//   }
// };

export const GetTransactionNameList = async (setter) => {
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/Transaction/GetTransactionListDDL`
    );
    setter(res?.data);
  } catch (err) {
    toast.error(err?.response?.data?.message);
    setter({});
  }
};

export const getTransactionById = async (id, setter, setDataForEdit, cb) => {
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/TimeCharterTransaction/GetTimeCharterByTcTransactionId?TcTrasactionId=${id}`
    );

    setter(res?.data);
    cb(res?.data?.objHeader);
    const modifyRows = res?.data?.objRows?.map((item) => {
      return {
        ...item,
        isChecked: true,
        key: getKey(item?.description),
        isCredit: getIsCreditOrDebit(item?.description)
          ? { name: "credit" }
          : null,
        isDebit: getIsCreditOrDebit(item?.description)
          ? { name: "debit" }
          : null,
        isQty: descriptionsForEnabledQty.includes(item?.description)
          ? { name: "quantity" }
          : null,
      };
    });
    setDataForEdit({ ...res?.data, objRows: modifyRows });
  } catch (err) {
    setter({});
  }
};

export const getPreOffHires = async (
  accId,
  buId,
  vesselId,
  voyageId,
  transactionId,
  tcTransactionId,
  setter
) => {
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/TimeCharterTransaction/GetTransactionDetails?AccountId=${accId}&BusinessUnitId=${buId}&VesselId=${vesselId}&VoyageId=${voyageId}&HireTrasaction=${transactionId}&TcTransactionId=${tcTransactionId}`
    );
    const totalOffHireDuration = res?.data?.offHires?.reduce(
      (a, b) => a + b?.offHireDurOnPercentage,
      0
    );
    setter(totalOffHireDuration);
  } catch (e) {}
};

export const getTimeCharterTransaction = async (
  accId,
  buId,
  vesselId,
  voyageId,
  transactionId,
  setter
) => {
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/TimeCharterTransaction/GetTimeCharterById?AccountId=${accId}&BusinessUnitId=${buId}&VesselId=${vesselId}&VoyageId=${voyageId}&HireTrasaction=${transactionId}`
    );
    setter(res?.data);
  } catch (err) {
    toast.error(err?.response?.data?.message);
    setter({});
  }
};

export const GetTransactionDetails = async (
  accId,
  buId,
  vesselId,
  voyageId,
  transactionId,
  rowData,
  setRowData,
  setter,
  setLoading,
  setOffHireDuration,
  cb,
  type,
  hireTypeName
) => {
  setLoading(true);
  try {
    const apiName = type === "create" ? "GetTimeCharterByIdForTimeCharter" : "GetTimeCharterById"; 
    const resInvoiceTransaction = await axios.get(
      `${imarineBaseUrl}/domain/TimeCharterTransaction/${apiName}?AccountId=${accId}&BusinessUnitId=${buId}&VesselId=${vesselId}&VoyageId=${voyageId}&HireTrasaction=${transactionId}`
    );

    const res = await axios.get(
      `${imarineBaseUrl}/domain/TimeCharterTransaction/GetTransactionDetails?AccountId=${accId}&BusinessUnitId=${buId}&VesselId=${vesselId}&VoyageId=${voyageId}&HireTrasaction=${transactionId}`
    );

    cb(resInvoiceTransaction?.data?.objHeader);

    if (resInvoiceTransaction?.data?.objRows?.length > 0) {
      setRowData([...resInvoiceTransaction?.data?.objRows]);
      setter({
        ...resInvoiceTransaction?.data,
        returnMSG: res?.data?.returnMSG,
      });
      setLoading(false);
      return;
    } else {

      const prevHireList = res?.data?.previousTransaciton?.map((item) => {
        return {
          description: `${item?.transactionName} ${
            item?.receiveDate
              ? `[${moment(item?.receiveDate).format("MM-DD-YYYY")}]`
              : ""
          }`,
          tctransactionId: 0,
          duration: 0,
          quantity: 0,
          debit: item?.totalValue > 0 ? item?.totalValue : 0,
          credit: item?.totalValue < 0 ? item?.totalValue : 0,
          active: true,
          notes: "",
          isChecked: true,
          isFixed: true,
        };
      });

      const offHireArr = res?.data?.offHires;
      const finalArr = [];
      const hireIdList = [];
      const totalOffHireDuration = offHireArr?.reduce(
        (a, b) => a + b?.offHireDurOnPercentage,
        0
      );
      setOffHireDuration(totalOffHireDuration);

      if (offHireArr.length > 0) {
        // eslint-disable-next-line no-unused-expressions
        offHireArr?.forEach((item, index) => {
          hireIdList.push(item?.hireId);
          finalArr.push({
            // description: `OFFHIRE${
            //   offHireArr?.length > 1 ? `-${index + 1}` : ""
            // }   [${_dateFormatter(item?.offHireStart)} - ${_dateFormatter(
            //   item?.offHireEnd
            // )}]`,
            description: `OFFHIRE`,
            tctransactionId: 0,
            duration: item?.offHireDurOnPercentage,
            // duration: item?.durationPercentage,
            quantity: 0,
            debit: item?.offHireCostAmount > 0 ? item?.offHireCostAmount : 0,
            credit: item?.offHireCostAmount < 0 ? item?.offHireCostAmount : 0,
            // debit: item?.totalCost > 0 ? item?.totalCost : 0,
            // credit: item?.totalCost < 0 ? item?.totalCost : 0,
            active: true,
            notes: "",
            isChecked: true,
          });
          finalArr.push({
            description: `OFFHIRE${
              offHireArr?.length > 1 ? `-${index + 1}` : ""
            } ADD COM`,
            tctransactionId: 0,
            duration: item?.offHireDurOnPercentage,
            quantity: 0,
            debit: hireTypeName === 1 ? 0 : ( +item?.addressCommision || 0),
            credit: hireTypeName === 1 ? (+item?.addressCommision) :  0,
            active: true,
            notes: "",
            isChecked: true,
          });
          // finalArr.push({
          //   description: `OFFHIRE${
          //     offHireArr?.length > 1 ? `-${index + 1}` : ""
          //   } BROK COM`,
          //   tctransactionId: 0,
          //   duration: item?.offHireDurOnPercentage,
          //   quantity: 0,
          //   debit: item?.brokarageCommision || 0,
          //   credit: 0,
          //   active: true,
          //   notes: "",
          //   isChecked: true,
          // });
          finalArr.push({
            description: `OFFHIRE${
              offHireArr?.length > 1 ? `-${index + 1}` : ""
            } LSFO`,
            tctransactionId: 0,
            duration: 0,
            quantity: item?.offHireLsfoqty,
            debit: item?.offHireLsfovalue > 0 ? item?.offHireLsfovalue : 0,
            credit: item?.offHireLsfovalue < 0 ? item?.offHireLsfovalue : 0,
            active: true,
            notes: "",
            isChecked: true,
            isQty: { name: "quantity" },
          });
          finalArr.push({
            description: `OFFHIRE${
              offHireArr?.length > 1 ? `-${index + 1}` : ""
            } LSMGO`,
            tctransactionId: 0,
            duration: 0,
            quantity: item?.offHireLsmgoqty || 0,
            debit: item?.offHireLsmgovalue > 0 ? item?.offHireLsmgovalue : 0,
            credit: item?.offHireLsmgovalue < 0 ? item?.offHireLsmgovalue : 0,
            active: true,
            notes: "",
            isChecked: true,
            isQty: { name: "quantity" },
          });
          finalArr.push({
            description: `OFFHIRE${
              offHireArr?.length > 1 ? `-${index + 1}` : ""
            } C/V/E`,
            tctransactionId: 0,
            duration: item?.offHireDurOnPercentage,
            quantity: 0,
            debit: item?.offHireCve || 0,
            credit: 0,
            active: true,
            notes: "",
            isChecked: true,
          });
          finalArr.push({
            description: `OFFHIRE${
              offHireArr?.length > 1 ? `-${index + 1}` : ""
            } OTHERS`,
            tctransactionId: 0,
            duration: 0,
            quantity: 0,
            debit: item?.otherCost || 0,
            credit: 0,
            active: true,
            notes: "",
            isChecked: true,
          });
        });
        setLoading(false);
      }

      setter({
        ...resInvoiceTransaction?.data,
        offHireIds: hireIdList,
        returnMSG: res?.data?.returnMSG,
      });
      setRowData([
        ...[
          {
            description: "HIRE DUE TO OWNR",
            key: "hdto",
            tctransactionId: 0,
            duration: 0,
            quantity: 0,
            debit: 0,
            credit: 0,
            active: true,
            notes: "",

            // isDuration: { name: "duration" },
            // isCredit: { name: "credit" },
            isChecked: true,
          },
          {
            description: "HIRE ADD COMM",
            key: "hac",
            tctransactionId: 0,
            duration: 0,
            quantity: 0,
            debit: 0,
            credit: 0,
            active: true,
            notes: "",

            // isDuration: { name: "duration" },
            // isDebit: { name: "debit" },
            isChecked: true,
          },
          {
            description: "HIRE BROK COM",
            tctransactionId: 0,
            key: "hbc",
            duration: 0,
            quantity: 0,
            debit: 0,
            credit: 0,
            active: true,
            notes: "",

            // isDuration: { name: "duration" },
            // isDebit: { name: "debit" },
            isChecked: true,
          },
          {
            description: "C/V/E",
            key: "cve",
            tctransactionId: 0,
            duration: 0,
            quantity: 0,
            debit: 0,
            credit: 0,
            active: true,
            notes: "",

            // isDuration: { name: "duration" },
            isChecked: true,
          },
          {
            description: "ILOHC",

            tctransactionId: 0,
            duration: 0,
            quantity: 0,
            debit: 0,
            credit: resInvoiceTransaction?.data?.ilohc || 0,
            active: true,
            notes: "",

            isChecked: true,
          },
          {
            description: "BOD-LSFO",

            tctransactionId: 0,
            duration: 0,
            quantity: resInvoiceTransaction?.data?.bodLsfo1Qty,
            debit: 0,
            credit:
              resInvoiceTransaction?.data?.bodLsfo1Qty *
              resInvoiceTransaction?.data?.lsfoprice,
            active: true,
            notes: "",

            isQty: { name: "quantity" },
            // isCredit: { name: "credit" },
            isChecked: true,
          },
          {
            description: "BOD-LSMGO",

            tctransactionId: 0,
            duration: 0,
            quantity: resInvoiceTransaction?.data?.bodLsmgoQty,
            debit: 0,
            credit:
              resInvoiceTransaction?.data?.bodLsmgoQty *
              resInvoiceTransaction?.data?.lsmgoprice,
            active: true,
            notes: "",

            isQty: { name: "quantity" },
            // isCredit: { name: "credit" },
            isChecked: true,
          },
          {
            description: "BOR-LSFO",

            tctransactionId: 0,
            duration: 0,
            quantity: resInvoiceTransaction?.data?.borLsfo1Qty,
            debit:
              resInvoiceTransaction?.data?.borLsfo1Qty *
              resInvoiceTransaction?.data?.lsfoprice,
            credit: 0,
            active: true,
            notes: "",

            isQty: { name: "quantity" },
            // isDebit: { name: "debit" },
            isChecked: true,
          },
          {
            description: "BOR-LSMGO",

            tctransactionId: 0,
            duration: 0,
            quantity: resInvoiceTransaction?.data?.borLsmgoQty,
            debit:
              resInvoiceTransaction?.data?.borLsmgoQty *
              resInvoiceTransaction?.data?.lsmgoprice,
            credit: 0,
            active: true,
            notes: "",

            isQty: { name: "quantity" },
            // isDebit: { name: "debit" },
            isChecked: true,
          },
          {
            description: "ON HIRE SURVEY COST",

            tctransactionId: 0,
            duration: 0,
            quantity: 0,
            debit: "",
            credit: "",
            active: true,
            notes: "",

            isDebit: { name: "debit" },
            isCredit: { name: "credit" },
            isChecked: true,
          },
          {
            description: "OFF HIRE SURVEY COST",
            tctransactionId: 0,
            duration: 0,
            quantity: 0,
            debit: "",
            credit: "",
            active: true,
            notes: "",

            isDebit: { name: "debit" },
            isCredit: { name: "credit" },
            isChecked: true,
          },
        ],
        ...finalArr,
        ...prevHireList,
      ]);
      setLoading(false);
    }
    setLoading(false);
  } catch (err) {
    setRowData(rowData);
    setLoading(false);
  }
};

export const getTimeCharterHirePaid = async (vesselId, voyageId, setter) => {
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/Transaction/GetTimeCharterHirePaid?VesselId=${vesselId}&VoyageId=${voyageId}`
    );
    setter(res?.data);
  } catch (err) {
    setter([]);
  }
};

export const getOwnerBankInfoDetailsById = async (ownerId, setter) => {
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/Stakeholder/GetStakeholderViewDetailsById?stakeholderId=${ownerId}`
    );
    setter(res?.data);
  } catch (err) {
    setter([]);
  }
};

export const timeCharterReceiveAmountUpdate = async (
  buId,
  tcTransactionId,
  amount,
  date,
  cb
) => {
  try {
    const res = await axios.put(
      `${imarineBaseUrl}/domain/TimeCharterTransaction/EditTimeCharterTrnsReceiveAmount?BusinessUnitId=${buId}&TctransactionId=${tcTransactionId}&TotalReceivedAmount=${amount}&ReceiveDate=${date}`
    );
    toast.success(res?.data?.message, { toastId: 234 });
    cb();
  } catch (err) {
    toast.warning(err?.response?.data?.message || err?.message, {
      toastId: 232,
    });
  }
};

export const getSalesOrgList = async (
  accId,
  buId,
  sbuId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/oms/SalesOrder/GetSODDLbySBUId?AccountId=${accId}&BusinessUnitId=${buId}&SBUId=${sbuId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const createJournalForTimeCharter = async (
  accId,
  userId,
  buId,
  values,
  tctransactionId,
  rowData,
  setLoading,
  cb
) => {
  setLoading(true);
  const payload = getPayload(
    accId,
    userId,
    buId,
    values,
    tctransactionId,
    rowData
  );
  try {
    const res = await axios.post(
      `${imarineBaseUrl}/domain/TimeCharterTransaction/TimeCharterJournal`,
      payload
    );
    toast.success(res?.data?.message, { toastId: 234 });
    cb();
    setLoading(false);
  } catch (error) {
    toast.warning(error?.response?.data?.message, {
      toastId: 232,
    });
    setLoading(false);
  }
};

const getPayload = (accId, userId, buId, values, tctransactionId, rowData) => {
  const totalCredit = rowData.reduce((acc, curr) => {
    acc += curr?.credit;
    return acc;
  }, 0);

  const totalDebit = rowData.reduce((acc, curr) => {
    acc += curr?.debit;
    return acc;
  }, 0);

  const finalAmount = Number((totalCredit - totalDebit).toFixed(2));

  return {
    accountId: accId,
    businessUnitId: buId,
    sbuId: values?.sbu?.value,
    salesOrgId: values?.salesOrg?.value,
    tcTransactionId: tctransactionId,
    actionby: userId,
    date: values?.journalDate,
    totalAmount: finalAmount,
    narration: values?.narration,
  };
};

export const editTimeCharterTransaction = async (payload, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `${imarineBaseUrl}/domain/TimeCharterTransaction/EditTimeCharterTransaction`,
      payload
    );
    toast.success(res?.data?.message);
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const createTimeCharterBR = async (
  accId,
  buId,
  charterId,
  amount,
  bankAccId,
  setLoading,
  cb
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/fino/BankJournal/TimeCharterBR?businessUnitId=${buId}&accountId=${accId}&charterId=${charterId}&amount=${amount}&bankAccountId=${bankAccId}`
    );
    toast.success(res?.data?.message);
    cb && cb();
    setLoading && setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

export const daysDDL = [];

for (let i = 1; i <= 90; i++) {
  daysDDL.push({ value: i, label: `${i} Day${i > 1 ? "s" : ""}` });
}
