import axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from './../../../_helper/_dateFormate';


export const GetPurchaseLogSummary_api = async (
  accId,
  buid,
  fromDate,
  toDate,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/vat/AuditLog/GetPurchaseLogSummary?AccountId=${accId}&BusinessUnitId=${buid}&FromDate=${fromDate}&ToDate=${toDate}`
    );
    if (res.status === 200 && res?.data) {
      if (res?.data?.length === 0) toast.warning("Data Not Found");
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};
export const GetDebitNoteLogSummary_api = async (
  accId,
  buid,
  fromDate,
  toDate,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/vat/AuditLog/GetDebitNoteLogSummary?AccountId=${accId}&BusinessUnitId=${buid}&FromDate=${fromDate}&ToDate=${toDate}`
    );
    if (res.status === 200 && res?.data) {
      if (res?.data?.length === 0) toast.warning("Data Not Found");
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const GetAuditType_api = async (setter) => {
  try {
    const res = await axios.get(`/vat/AuditLog/GetAuditType`);
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const GetPurchaseLog_api = async (
  accId,
  buid,
  taxPurchaseId,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/vat/AuditLog/GetPurchaseLog?AccountId=${accId}&BusinessUnitId=${buid}&TaxPurchaseId=${taxPurchaseId}`
    );
    if (res.status === 200 && res?.data) {
      if (res?.data?.length === 0) toast.warning("Data Not Found");
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const rowDtoCalculationFunc = (arr) => {
  // obj row
  let objRow = arr?.map((item) => {
    //rate
    const rate = +item.amount / +item.quantity;

    //Amount
    const amount = +item.amount;
    //cdtotal
    const cdtotal = (+item.cd / 100) * +amount || 0;
    //rdtotal
    const rdtotal = (+item.rd / 100) * +amount || 0;
    //sdtotal
    const sdtotal = (+item.sd / 100) * (+amount + +cdtotal + +rdtotal) || 0;
    //vatTotal
    const vatTotal =
      (+item.vat / 100) * (+amount + +cdtotal + +rdtotal + +sdtotal) || 0;
    //atTotal
    const atTotal =
      (+item.at / 100) * (+amount + +cdtotal + +rdtotal + +sdtotal) || 0;
    //aitTotal
    const aitTotal = (+item.ait / 100) * +amount || 0;
    const totalAmount =
      +amount +
      +cdtotal +
      +rdtotal +
      +sdtotal +
      +vatTotal +
      +atTotal +
      +aitTotal;
    //rebateAmount
    const rebateAmount = vatTotal;
    return {
      ...item,
      rate: +rate,
      rebateAmount: +rebateAmount,
      cal_cdtotal: +cdtotal,
      cal_rdtotal: +rdtotal,
      cal_sdtotal: +sdtotal,
      cal_vatTotal: +vatTotal,
      cal_atTotal: +atTotal,
      cal_aitTotal: +aitTotal,
      totalAmount: +totalAmount,
    };
  });
  return objRow;
};

export const GetDebitNoteLog_api = async (
  accId,
  buid,
  taxPurchaseId,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/vat/AuditLog/GetDebitNoteLog?AccountId=${accId}&BusinessUnitId=${buid}&TaxPurchaseId=${taxPurchaseId}`
    );
    if (res.status === 200 && res?.data) {
      if (res?.data?.length === 0) toast.warning("Data Not Found");
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const GetSalesLog_api = async (
  accId,
  buid,
  taxPurchaseId,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/vat/AuditLog/GetSalesLog?AccountId=${accId}&BusinessUnitId=${buid}&TaxSalesId=${taxPurchaseId}`
    );
    if (res.status === 200 && res?.data) {
      if (res?.data?.length === 0) toast.warning("Data Not Found");
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const GetCreditNoteLog_api = async (
  accId,
  buid,
  taxPurchaseId,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/vat/AuditLog/GetCreditNoteLog?AccountId=${accId}&BusinessUnitId=${buid}&TaxSalesId=${taxPurchaseId}`
    );
    if (res.status === 200 && res?.data) {
      if (res?.data?.length === 0) toast.warning("Data Not Found");
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const GetTreasuryDepositLog_api = async (
  taxPurchaseId,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/vat/AuditLog/GetTreasuryDepositLog?TreasuryId=${taxPurchaseId}`
    );
    if (res.status === 200 && res?.data) {
      if (res?.data?.length === 0) toast.warning("Data Not Found");
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};
export const GetPurchaseLogAllDetails_api = async (
  taxPurchaseId,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/vat/AuditLog/GetPurchaseLogAllDetails?TaxPurchaseId=${taxPurchaseId}`
    );
    if (res.status === 200 && res?.data) {
      if (res?.data?.length === 0) toast.warning("Data Not Found");

      const data = res?.data?.map((singeleItem) => {
        const taxPurchase = singeleItem?.objHeaderDTO;
        const objRow = singeleItem?.objListRowDTO.map((item) => {
          const amount = item.invoiceTotal;
          const cdtotal = (+item?.cdtotal / +amount) * 100 || 0;
          const rdtotal = (+item.rdtotal / +amount) * 100 || 0;
          const aittotal = (+item.aittotal / +amount) * 100 || 0;
          const sdtotal =
            (item?.sdtotal / (amount + item?.cdtotal + item?.rdtotal)) * 100 ||
            0;
          const vatTotal =
            (item.vatTotal /
              (amount + item?.cdtotal + item?.rdtotal + item?.sdtotal)) *
              100 || 0;
          const atTotal =
            (item.attotal /
              (amount + item?.cdtotal + item?.rdtotal + item?.sdtotal)) *
              100 || 0;
          const totalAmount =
            amount +
            item?.cdtotal +
            item?.rdtotal +
            item?.sdtotal +
            item?.attotal;
          const refund =
            (item?.rebateTotal / (item?.quantity * item?.invoicePrice)) * 100;
          return {
            ...item,
            value: item?.taxItemGroupId,
            label: item?.taxItemGroupName,
            uom: {
              value: item?.uomid,
              label: item?.uomname,
            },
            quantity: item.quantity,
            rate: item?.invoicePrice,
            cd: cdtotal,
            rd: rdtotal,
            sd: sdtotal,
            vat: vatTotal,
            ait: aittotal || 0,
            atv: 0,
            // get percentage
            refund: refund,
            rebateAmount: item?.rebateTotal,
            at: atTotal,
            totalAmount: totalAmount,
            amount: +amount,
            supplyTypeName: item.supplyTypeName || "",
            supplyTypeId: item?.supplyTypeId || 0,
          };
        });

        return {
          objHeaderDTO: {
            ...taxPurchase,
            supplier: taxPurchase?.supplierId
              ? {
                  value: taxPurchase?.supplierId,
                  label: `${taxPurchase?.supplierName}(${taxPurchase?.supplierBin})`,
                }
              : "",
            address: taxPurchase?.supplierAddress || "",
            transactionDate: taxPurchase?.purchaseDateTime
              ? _dateFormatter(taxPurchase?.purchaseDateTime)
              : "",
            tradeType: taxPurchase?.tradeTypeId
              ? {
                  value: taxPurchase?.tradeTypeId,
                  label: taxPurchase?.tradeTypeName,
                }
              : "",
            port: taxPurchase?.portId
              ? {
                  value: taxPurchase?.portId,
                  label: taxPurchase?.portName,
                }
              : "",
            paymentTerm: taxPurchase?.paymentTerms
              ? {
                  value: taxPurchase?.paymentTerms,
                  label: taxPurchase?.paymentTermsName,
                }
              : "",
            vehicalInfo: { value: 1, label: taxPurchase?.vehicleNo || "" },
            refferenceNo: taxPurchase?.referanceNo || "",
            refferenceDate: taxPurchase?.referanceDate
              ? _dateFormatter(taxPurchase?.referanceDate)
              : "",
            totalTdsAmount: taxPurchase?.tdstotal || 0,
            totalVdsAmount: taxPurchase?.vdstotal || 0,
            totalAtv: taxPurchase?.atvtotal || 0,
            totalAit: taxPurchase?.aittotal || 0,
            selectedItem: "",
            selectedUom: "",
            quantity: "",
            rate: "",
            purchaseType: taxPurchase?.purchaseType
              ? { value: 10, label: taxPurchase?.purchaseType }
              : "",
            lcDate: taxPurchase?.lcdate
              ? _dateFormatter(taxPurchase?.lcdate)
              : "",
            customsHouse: taxPurchase?.customHouseId
              ? {
                  value: taxPurchase?.customHouseId,
                  label: taxPurchase?.customHouseName,
                  code: taxPurchase?.customHouseCode,
                }
              : "",
            CustomsHouseCode: taxPurchase?.customHouseCode || "",
            country: taxPurchase?.orginCountryId
              ? {
                  value: taxPurchase?.orginCountryId,
                  label: taxPurchase?.orginCountryName,
                }
              : "",
            CPCCode: taxPurchase?.cpcID
              ? {
                  value: taxPurchase?.cpcID,
                  label: taxPurchase?.cpcCode,
                  details: taxPurchase?.cpcDetails,
                }
              : "",
            numberOfItem: taxPurchase?.noItem || "",
          },
          objListRowDTO: rowDtoCalculationFunc(objRow),
          auditLog: singeleItem?.auditLog,
        };
      });
      setLoading(false);
      setter(data);
    }
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};

export const GetDebitNoteLogAllDetails_api = async (
  taxPurchaseId,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/vat/AuditLog/GetDebitNoteLogAllDetails?TaxPurchaseId=${taxPurchaseId}`
    );
    if (res.status === 200 && res?.data) {
      if (res?.data?.length === 0) toast.warning("Data Not Found");
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const GetSalesLogSummary_api = async (
  accId,
  buid,
  fromDate,
  toDate,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/vat/AuditLog/GetSalesLogSummary?AccountId=${accId}&BusinessUnitId=${buid}&FromDate=${fromDate}&ToDate=${toDate}`
    );
    if (res.status === 200 && res?.data) {
      if (res?.data?.length === 0) toast.warning("Data Not Found");
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const GetCreditNoteLogSummary_api = async (
  accId,
  buid,
  fromDate,
  toDate,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/vat/AuditLog/GetCreditNoteLogSummary?AccountId=${accId}&BusinessUnitId=${buid}&FromDate=${fromDate}&ToDate=${toDate}`
    );
    if (res.status === 200 && res?.data) {
      if (res?.data?.length === 0) toast.warning("Data Not Found");
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const GetTreasuryDepositSummary_api = async (
  accId,
  buid,
  fromDate,
  toDate,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/vat/AuditLog/GetTreasuryDepositSummary?AccountId=${accId}&BusinessUnitId=${buid}&FromDate=${fromDate}&ToDate=${toDate}`
    );
    if (res.status === 200 && res?.data) {
      if (res?.data?.length === 0) toast.warning("Data Not Found");
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const GetTreasuryDepositLogDetails_api = async (LogId, setter, setLoading) => {
  setLoading(true)
  try {
    const res = await axios.get(
      `/vat/AuditLog/GetTreasuryDepositLogDetails?LogId=${LogId}`
    );
    if (res.status === 200 && res?.data) {
      const data = res?.data[0];

      const newData = {
        ...data,
        branchName: {
          value: data.taxBranchId,
          label: data.taxBranchName,
        },
        branchAddress: data.taxBranchAddress,
        depositeType: {
          value: data.treasuryDepositTypeId,
          label: data.treasuryDepositTypeName,
        },
        depositAmount: data.depositAmount,
        depositDate: _dateFormatter(data.depositDate),
        challanNo: data.trChallanNo,
        challanDate: _dateFormatter(data.trChallanDate),
        instrumentNo: data.instumentNo,
        instrumentDate: _dateFormatter(data.instrumentDate),
        bankName: {
          value: data.bankId,
          label: data.bankName,
        },
        bankBranch: {
          value: data.bankBranchId,
          label: data.bankBranchName,
        },
        divisionName: {
          value: data.divisionId,
          label: data.divisionName,
        },
        districtName: {
          value: data.districtId,
          label: data.district,
        },
        depositorName: {
          value: data.depositorId,
          label: data.depositorName,
        },
        description: data?.naraation,
      };
      setter(newData);
      setLoading(false)
    }
  } catch (error) {
    setLoading(false)
  }
};



export const GetTreasuryDepositLogAllDetails_api = async (
  treasuryId,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/vat/AuditLog/GetTreasuryDepositLogAllDetails?TreasuryId=${treasuryId}`
    );
    if (res.status === 200 && res?.data) {
      if (res?.data?.length === 0) toast.warning("Data Not Found");

      setLoading(false);

      setter(res?.data?.map(itm => {
        return {
          ...itm,
          branchName: {
            value: itm.taxBranchId,
            label: itm.taxBranchName,
          },
          branchAddress: itm.taxBranchAddress,
          depositeType: {
            value: itm.treasuryDepositTypeId,
            label: itm.treasuryDepositTypeName,
          },
          depositAmount: itm.depositAmount,
          depositDate: _dateFormatter(itm.depositDate),
          challanNo: itm.trChallanNo,
          challanDate: _dateFormatter(itm.trChallanDate),
          instrumentNo: itm.instumentNo,
          instrumentDate: _dateFormatter(itm.instrumentDate),
          bankName: {
            value: itm.bankId,
            label: itm.bankName,
          },
          bankBranch: {
            value: itm.bankBranchId,
            label: itm.bankBranchName,
          },
          divisionName: {
            value: itm.divisionId,
            label: itm.divisionName,
          },
          districtName: {
            value: itm.districtId,
            label: itm.district,
          },
          depositorName: {
            value: itm.depositorId,
            label: itm.depositorName,
          },
          description: itm?.naraation,
        }
      }))

    }
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};

