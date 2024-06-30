import axios from "axios";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { _dateFormatter } from "../../_chartinghelper/_dateFormatter";
import { imarineBaseUrl } from "../../../../App";

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
});

export const getVoyageCharterTransactionLandingData = async (
  accId,
  buId,
  vesselId,
  voyageId,
  pageNo,
  pageSize,
  setter,
  setLoading
) => {
  setLoading(true);
  // const voyageNoStr = voyageId ? `` : "";
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/FreightInvoice/GetFreightInvoiceLanding?AccountId=${accId}&BusinessUnitId=${buId}&VesselId=${vesselId}&VoyageId=${voyageId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (err) {
    setter([]);
    setLoading(false);
  }
};

export const saveVoyageCharterTransaction = async (data, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `${imarineBaseUrl}/domain/FreightInvoice/CreateFreightInvoice`,
      data
    );
    cb();
    toast.success(res?.data?.message, { toastId: 123 });
    setLoading(false);
  } catch (err) {
    toast.error(err?.response?.data?.message, { toastId: 132 });
    setLoading(false);
  }
};

export const saveVoyageCharterTransactionIntermidiate = async (
  data,
  setLoading,
  cb
) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `${imarineBaseUrl}/domain/FreightInvoice/CreateFreightInvoiceIntermidiate`,
      data
    );
    cb();
    toast.success(res?.data?.message, { toastId: 123 });
    setLoading(false);
  } catch (err) {
    toast.error(err?.response?.data?.message, { toastId: 132 });
    setLoading(false);
  }
};

export const editVoyageCharterTransaction = async (data, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `${imarineBaseUrl}/domain/VoyageCharter/EditVoyageCharter`,
      data
    );
    toast.success(res?.data?.message);
    setLoading(false);
  } catch (err) {
    toast.error(err?.response?.data?.message);
    setLoading(false);
  }
};

export const getVoyageChartererTransactionById = async (
  id,
  setLoading,
  setRowData,
  setter
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/FreightInvoice/GetFreightInvoiceById?FreightInvoiceId=${id}`
    );

    setter(res?.data?.objHeader);
    setRowData(
      res?.data?.objRow?.map((item) => {
        return {
          ...item,
          isChecked: true,
        };
      })
    );
    setLoading(false);
  } catch (err) {
    setLoading(false);
  }
};

export const getIntermidiateInvoiceData = async (
  accId,
  buId,
  vesselId,
  voyageId,
  statementId,
  charterId,
  setLoading,
  setRowData,
  setter
) => {
  setLoading(true);

  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/FreightInvoice/GetFrightInvIntermidiateInfo?AccountId=${accId}&BusinessUnitId=${buId}&VesselId=${vesselId}&VoyageId=${voyageId}&StatementNo=${statementId}&CharterId=${charterId}`
    );

    const header = res?.data?.objHeaderDTO;
    setter(header);

    const rows =
      res?.data?.objList?.length > 0
        ? res?.data?.objList?.map((item, index) => {
            return {
              ...item,
              sl: index,
              isFixed: true,
              isChecked: true,
            };
          })
        : [];

    const initialRowForCreate =
      rows?.length === 0
        ? []
        : statementId === 3
        ? [
            {
              freightInvoiceId: 0,
              sl: 0,
              particulars: "LOAD PORT DEMURRAGE",
              cargoQty: 0,
              freightRate: 0,
              debit: header?.loadPortDem || 0,
              credit: 0,

              isLocalPortDebit: true,
              isChecked: true,
            },
            {
              freightInvoiceId: 0,
              sl: 0,
              particulars: "DISCHARGE PORT DEMURRAGE",
              cargoQty: 0,
              freightRate: 0,
              debit: header?.disChargePortDem || 0,
              credit: 0,

              isLocalPortDebit: true,
              isChecked: true,
            },
            {
              freightInvoiceId: 0,
              sl: 0,
              particulars: "LOAD PORT DESPATCH",
              cargoQty: 0,
              freightRate: 0,
              debit: 0,
              credit: header?.loadPortDispatch || 0,

              isLocalPortCredit: true,
              isChecked: true,
            },
            {
              freightInvoiceId: 0,
              sl: 0,
              particulars: "DISCHARGE PORT DESPATCH",
              cargoQty: 0,
              freightRate: 0,
              debit: 0,
              credit: header?.dischargePortDispatch || 0,

              isLocalPortCredit: true,
              isChecked: true,
            },
            {
              freightInvoiceId: 0,
              sl: 0,
              particulars: "GRAND TOTAL",
              cargoQty: 0,
              freightRate: 0,
              debit: 0,
              credit: 0,

              isGrandTotal: true,
            },
            {
              freightInvoiceId: 0,
              sl: 0,
              particulars: `Less ${header?.brokerCommission}% BROKERAGE COMMISSION ON 100% FREIGHT`,
              cargoQty: 0,
              freightRate: 0,
              debit: 0,
              credit: 0,

              parcentageValue: header?.brokerCommission,
              isBrokerCom: true,
            },
            {
              freightInvoiceId: 0,
              sl: 0,
              particulars: `Less ${header?.addressCommission}% ADDRESS COMMISSION ON 100% FREIGHT`,
              cargoQty: 0,
              freightRate: 0,
              debit: 0,
              credit: 0,

              parcentageValue: header?.addressCommission,
              isAddCom: true,
            },
            {
              freightInvoiceId: 0,
              sl: 0,
              particulars: `AMOUNT RECEIVED BEFORE (${
                header?.freightPercentage
              }% FREIGHT ON ${_dateFormatter(header?.dteInvoiceDate)})`,
              cargoQty: 0,
              freightRate: 0,
              debit: 0,
              credit: header?.totalNetPayble || 0,

              prevReceive: true,
              isChecked: true,
              isFixed: true,
            },
          ]
        : /* Initial Statement */
          [
            {
              freightInvoiceId: 0,
              sl: 0,
              particulars: `${header?.freightPercentage || 0}% FREIGHT`,
              cargoQty: 0,
              freightRate: 0,
              debit: 0,
              credit: 0,

              parcentageValue: header?.freightPercentage || 0,
              is95Parcentage: true,
            },
            {
              freightInvoiceId: 0,
              sl: 0,
              particulars: `${header?.brokerCommission ||
                0}% BROKER COMMISSION ON 100% FREIGHT`,
              cargoQty: 0,
              freightRate: 0,
              debit: 0,
              credit: 0,

              isBrokerCom: true,
              parcentageValue: header?.brokerCommission || 0,
            },
            {
              freightInvoiceId: 0,
              sl: 0,
              particulars: `${header?.addressCommission ||
                0}% ADDRESS COMMISSION ON 100% FREIGHT`,
              cargoQty: 0,
              freightRate: 0,
              debit: 0,
              credit: 0,

              isAddCom: true,
              parcentageValue: header?.addressCommission || 0,
              isChecked: true,
              isAction: true,
            },
          ];

    header?.freightInvoiceId > 0
      ? setRowData([...rows])
      : setRowData([
          ...rows?.map((item) => {
            if (statementId === 3) {
              return {
                ...item,
                debit: item?.cargoQty * item?.freightRate || 0,
              };
            } else {
              return item;
            }
          }),
          ...initialRowForCreate,
        ]);

    setLoading(false);
  } catch (err) {
    setLoading(false);
  }
};

export const getInvoiceData = async (
  accId,
  buId,
  vesselId,
  voyageId,
  statementId,
  charterId,
  setLoading,
  setRowData,
  setter,
  cargoId
) => {
  setLoading(true);

  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/FreightInvoice/GetFrightInvInfo?AccountId=${accId}&BusinessUnitId=${buId}&VesselId=${vesselId}&VoyageId=${voyageId}&StatementNo=${statementId}&CharterId=${charterId}&CargoRowId=${cargoId}`
    );

    const header = res?.data?.objHeaderDTO;
    setter(header);

    const rows =
      res?.data?.objList?.length > 0
        ? res?.data?.objList?.map((item, index) => {
            return {
              ...item,
              sl: index,
              isFixed: true,
              isChecked: true,
            };
          })
        : [];

    const initialRowForCreate =
      rows?.length === 0
        ? []
        : statementId === 2
        ? [
            {
              freightInvoiceId: 0,
              sl: 0,
              particulars: "LOAD PORT DEMURRAGE",
              cargoQty: 0,
              freightRate: 0,
              debit: header?.loadPortDem || 0,
              credit: 0,

              isLocalPortDebit: true,
              isChecked: true,
            },
            {
              freightInvoiceId: 0,
              sl: 0,
              particulars: "DISCHARGE PORT DEMURRAGE",
              cargoQty: 0,
              freightRate: 0,
              debit: header?.disChargePortDem || 0,
              credit: 0,

              isLocalPortDebit: true,
              isChecked: true,
            },
            {
              freightInvoiceId: 0,
              sl: 0,
              particulars: "LOAD PORT DESPATCH",
              cargoQty: 0,
              freightRate: 0,
              debit: 0,
              credit: header?.loadPortDispatch || 0,

              isLocalPortCredit: true,
              isChecked: true,
            },
            {
              freightInvoiceId: 0,
              sl: 0,
              particulars: "DISCHARGE PORT DESPATCH",
              cargoQty: 0,
              freightRate: 0,
              debit: 0,
              credit: header?.dischargePortDispatch || 0,

              isLocalPortCredit: true,
              isChecked: true,
            },
            {
              freightInvoiceId: 0,
              sl: 0,
              particulars: "GRAND TOTAL",
              cargoQty: 0,
              freightRate: 0,
              debit: 0,
              credit: 0,

              isGrandTotal: true,
            },
            {
              freightInvoiceId: 0,
              sl: 0,
              particulars: `Less ${header?.brokerCommission}% BROKERAGE COMMISSION ON 100% FREIGHT`,
              cargoQty: 0,
              freightRate: 0,
              debit: 0,
              credit: 0,

              parcentageValue: header?.brokerCommission,
              isBrokerCom: true,
            },
            {
              freightInvoiceId: 0,
              sl: 0,
              particulars: `Less ${header?.addressCommission}% ADDRESS COMMISSION ON 100% FREIGHT`,
              cargoQty: 0,
              freightRate: 0,
              debit: 0,
              credit: 0,

              parcentageValue: header?.addressCommission,
              isAddCom: true,
            },
            {
              freightInvoiceId: 0,
              sl: 0,
              particulars: `AMOUNT RECEIVED BEFORE (${
                header?.freightPercentage
              }% FREIGHT ON ${_dateFormatter(header?.dteInvoiceDate)})`,
              cargoQty: 0,
              freightRate: 0,
              debit: 0,
              credit: header?.totalNetPayble || 0,

              prevReceive: true,
              isChecked: true,
              isFixed: true,
            },
          ]
        : /* Initial Statement */
          [
            {
              freightInvoiceId: 0,
              sl: 0,
              particulars: `${header?.freightPercentage || 0}% FREIGHT`,
              cargoQty: 0,
              freightRate: 0,
              debit: 0,
              credit: 0,

              parcentageValue: header?.freightPercentage || 0,
              is95Parcentage: true,
            },
            {
              freightInvoiceId: 0,
              sl: 0,
              particulars: `${header?.brokerCommission ||
                0}% BROKER COMMISSION ON 100% FREIGHT`,
              cargoQty: 0,
              freightRate: 0,
              debit: 0,
              credit: 0,

              isBrokerCom: true,
              parcentageValue: header?.brokerCommission || 0,
            },
            {
              freightInvoiceId: 0,
              sl: 0,
              particulars: `${header?.addressCommission ||
                0}% ADDRESS COMMISSION ON 100% FREIGHT`,
              cargoQty: 0,
              freightRate: 0,
              debit: 0,
              credit: 0,

              isAddCom: true,
              parcentageValue: header?.addressCommission || 0,
              isChecked: true,
              isAction: true,
            },
          ];

    header?.freightInvoiceId > 0
      ? setRowData([...rows])
      : setRowData([
          ...rows?.map((item) => {
            if (statementId === 2) {
              return {
                ...item,
                debit: item?.cargoQty * item?.freightRate || 0,
              };
            } else {
              return item;
            }
          }),
          ...initialRowForCreate,
        ]);

    setLoading(false);
  } catch (err) {
    setLoading(false);
  }
};

export const createJournalForVoyageCharter = async (
  profileData,
  selectedBusinessUnit,
  values,
  freightInvoiceId,
  NetPayable,
  setLoading,
  cb
) => {
  setLoading(true);
  const payload = getPayload(
    profileData,
    selectedBusinessUnit,
    values,
    freightInvoiceId,
    NetPayable
  );
  try {
    const res = await axios.post(
      `${imarineBaseUrl}/domain/VoyageCharter/CreateVoyageCharterJournal`,
      payload
    );
    toast.success(res?.data?.message, { toastId: 234 });
    cb();
    console.log(payload, "payload");
    setLoading(false);
  } catch (error) {
    toast.warning(error?.response?.data?.message, {
      toastId: 232,
    });
    setLoading(false);
  }
};

const getPayload = (
  profileData,
  selectedBusinessUnit,
  values,
  freightInvoiceId,
  NetPayable
) => {
  return {
    accountId: profileData?.accountId,
    businessUnitId: selectedBusinessUnit?.value,
    sbuId: values?.sbu?.value,
    salesOrgId: values?.salesOrg?.value,
    freightInvoiceId: freightInvoiceId,
    actionby: profileData?.userId,
    date: values?.journalDate,
    totalAmount: NetPayable,
    narration: values?.narration,
  };
};
export const getAccDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/costmgmt/BankAccount/GetBankAccountDDL?AccountId=${accId}&BusinssUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

// {
//   transactionId: 1,
//   unitId: 1,
//   accountId: 1,
//   charterId: 1,
//   receiveAmount: 1,
//   bankAccountId: 1,
// }

export const voyageCharterBRApi = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `${imarineBaseUrl}/domain/VoyageCharter/VoyageCharterBRNew?VoyageCharterId=${payload?.voyageCharterId}&businessUnitId=${payload?.unitId}&accountId=${payload?.accountId}&charterId=${payload?.charterId}&receiveAmount=${payload?.receiveAmount}&bankAccountId=${payload?.bankAccountId}&ReceiveDate=${payload?.receiveDate}&HireNo=${payload?.hireNo}`
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
