import axios from "axios";
import { toast } from "react-toastify";
import shortid from "shortid";

export const getTaxPayerInformationReport = async (
  accid,
  buid,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/vat/Mushak91/GetTaxPayerInformation?AccountId=${accid}&BusinessUnitId=${buid}`
    );
    if (res.status === 200) {
      setter(res?.data);
      setLoading(false);
    } else {
      setLoading(false);
      setter("");
    }
  } catch (error) {}
};

export const getSupplyOutputTaxReport = async (
  accId,
  buId,
  mushakDate,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/vat/Mushak91/GetSupplyOutputTAX?accountId=${accId}&businessUnitId=${buId}&reportDate=${mushakDate}`
    );
    if (res.status === 200 && res?.data) {
      if (res?.data?.length > 0) {
        setter(res?.data);
        setLoading(false);
      } else {
        setLoading(false);
        setter([]);
      }
    }
  } catch (error) {}
};

export const getSupplyOutputTax = async (
  accId,
  buId,
  supplyTypeId,
  tradeTypeId,
  setter,
  date,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/vat/Mushak91/GetSupplyOutputTaxDetails?AccountId=${accId}&BusinessUnitId=${buId}&SupplyId=${supplyTypeId}&TradeTypeId=${tradeTypeId}&reportdate=${date}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
    setLoading && setLoading(false);
  } catch (error) {
    setLoading && setLoading(false);
    setter("");
    // toast.warning(error.response.data.message || "error occured");
  }
};

export const getSupplyOutputTaxDetails = async (
  accId,
  buId,
  supplyTypeId,
  tradeTypeId,
  setter,
  date,
  itemId
) => {
  try {
    const res = await axios.get(
      `/vat/Mushak91/GetSupplyOutputTaxDetailsByItem?AccountId=${accId}&BusinessUnitId=${buId}&SupplyId=${supplyTypeId}&TradeTypeId=${tradeTypeId}&reportdate=${date}&ItemId=${itemId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter("");
    // toast.warning(error.response.data.message || "error occured");
  }
};

export const getSupplyInputTaxDetails = async (
  accId,
  buId,
  supplyTypeId,
  tradeTypeId,
  setter,
  date,
  itemId
) => {
  try {
    const res = await axios.get(
      `/vat/Mushak91/GetSupplyInputTaxDetailsByItem?AccountId=${accId}&BusinessUnitId=${buId}&SupplyId=${supplyTypeId}&TradeTypeId=${tradeTypeId}&reportdate=${date}&ItemId=${itemId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter("");
    // toast.warning(error.response.data.message || "error occured");
  }
};

export const getSupplyInputputTaxReport = async (
  mushakDate,
  accid,
  buid,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/vat/Mushak91/GetSupplyInputTAX?reportDate=${mushakDate}&AccountId=${accid}&BusinessUnitId=${buid}`
    );
    if (res.status === 200 && res?.data) {
      if (res?.data?.length > 0) {
        setter(res?.data);
        setLoading(false);
      } else {
        setLoading(false);
        setter([]);
      }
    }
  } catch (error) {}
};

export const getSupplyinputTax = async (
  accId,
  buId,
  supplyTypeId,
  tradeTypeId,
  setter,
  date
) => {
  try {
    const res = await axios.get(
      `/vat/Mushak91/GetSupplyinputTaxDetails?AccountId=${accId}&BusinessUnitId=${buId}&SupplyId=${supplyTypeId}&TradeTypeId=${tradeTypeId}&reportdate=${date}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter("");
    // toast.warning(error.response.data.message || "error occured");
  }
};

export const getOutputTaxDetailsFor4_api = async (
  accId,
  buId,
  tradeTypeId,
  date,
  setter
) => {
  try {
    const res = await axios.get(
      `/vat/Mushak91/GetOutputTaxDetailsFor4?AccountId=${accId}&BusinessUnitId=${buId}&TradeTypeId=${tradeTypeId}&reportdate=${date}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter("");
    // toast.warning(error.response.data.message || "error occured");
  }
};
export const getGoodsOrServiceNotAdmissible_api = async (
  accId,
  buId,
  date,
  setter
) => {
  try {
    const res = await axios.get(
      `/vat/Mushak91/GetGoodsOrServiceNotAdmissible?AccountId=${accId}&BusinessUnitId=${buId}&SupplyId=${1}&TradeTypeId=${1}&reportdate=${date}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter("");
    // toast.warning(error.response.data.message || "error occured");
  }
};

export const getTaxAdjustmentIncrInfoReport = async (
  accid,
  buid,
  mushakDate,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/vat/Mushak91/GetTaxAdjustmentIncrInfo?AccountId=${accid}&BusinessUnitId=${buid}&reportDate=${mushakDate}`
    );
    if (res.status === 200 && res?.data) {
      if (res?.data?.length > 0) {
        setter(res?.data);
        setLoading(false);
      } else {
        setLoading(false);
        setter([]);
      }
    }
  } catch (error) {}
};

export const getTaxAdjustmentDecreInfoReport = async (
  accid,
  buid,
  mushakDate,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/vat/Mushak91/GetTaxAdjustmentDecrInfo?AccountId=${accid}&BusinessUnitId=${buid}&reportDate=${mushakDate}`
    );
    if (res.status === 200 && res?.data) {
      if (res?.data?.length > 0) {
        setter(res?.data);
        setLoading(false);
      } else {
        setLoading(false);
        setter([]);
      }
    }
  } catch (error) {}
};

export const getAdvanceTaxPaidDetails = async (
  accId,
  buId,
  date,
  adjustmentTypeId,
  setter
) => {
  try {
    const res = await axios.get(
      `/vat/Mushak91/GetAdvanceTaxPaidDetails?AccountId=${accId}&BusinessUnitId=${buId}&reportDate=${date}&AdjustmentTypeId=${adjustmentTypeId}`
    );
    if (res.status === 200 && res?.data) {
      if (res?.data?.length > 0) {
        setter(res?.data);
      } else {
        // toast.warning("Data Not Found");
        setter("");
      }
    }
  } catch (error) {
    setter("");
  }
};


export const GetDetailsForNote24AndNote29_api = async (
  accId,
  buId,
  date,
  type,
  setter
) => {
  try {
    const res = await axios.get(
      `/vat/Mushak91/GetDetailsForNote24AndNote29?AccountId=${accId}&BusinessUnitId=${buId}&ReportDate=${date}&Type=${type}`
    );
    if (res.status === 200 && res?.data) {
      if (res?.data?.length > 0) {
        setter(res?.data);
      } else {
        toast.warning("Data Not Found")
        setter("");
      }
    }
  } catch (error) {
    setter("");
  }
};

export const GetDetailsForNote30_api = async (
  accId,
  buId,
  date,
  setter
) => {
  try {
    const res = await axios.get(
      `/vat/Mushak91/GetDetailsForNote30?AccountId=${accId}&BusinessUnitId=${buId}&ReportDate=${date}`
    );
    if (res.status === 200 && res?.data) {
      if (res?.data?.length > 0) {
        setter(res?.data);
      } else {
        toast.warning("Data Not Found")
        setter("");
      }
    }
  } catch (error) {
    setter("");
  }
};


export const getNoteInfoReport = async (
  accid,
  buid,
  mushakDate,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/vat/Mushak91/GetNoteInfo?AccountId=${accid}&BusinessUnitId=${buid}&reportDate=${mushakDate}`
    );
    if (res.status === 200 && res?.data) {
      if (res?.data?.length > 0) {
        setter(res?.data);
        setLoading(false);
      } else {
        setLoading(false);
        setter([]);
      }
    }
  } catch (error) {}
};

export const getEmployeeBasicInfoById_Api = async (empId, setter) => {
  try {
    const res = await axios.get(
      `/hcm/EmployeeBasicInformation/GetEmployeeBasicInfoById?EmployeeId=${empId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data[0]);
    }
  } catch (error) {
    setter("");
  }
};

export const getTreasuryDepositInfo_api = async (accId, buId, date, setter) => {
  try {
    const res = await axios.get(
      `/vat/Mushak91/GetTreasuryDepositInfo?AccountId=${accId}&BusinessUnitId=${buId}&reportDate=${date}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter("");
  }
};

export const createTaxLedgerDeduction = async (payload, cb) => {
  try {
    const res = await axios.post(
      `/vat/TaxLedgerOpenning/CreateTaxLedgerDeduction`,
      payload
    );
    if (res.status === 200 && res?.data) {
      cb();
      toast.success("Submitted Successfully", {
        toastId: shortid(),
      });
      // setter(res?.data);
    }
  } catch (error) {
    toast.error(error.response.data.message || "error occured");
  }
};

export const getTaxBranchDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/vat/TaxDDL/GetTaxBranchDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getTaxLedgerSdVat = async (
  accId,
  buId,
  taxBranchId,
  monthId,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/vat/TaxLedgerOpenning/GetTaxLedgerSdVat?accountId=${accId}&businessUnitId=${buId}&taxBranchId=${taxBranchId ||
        0}&monthId=${monthId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setter("");
  }
};

export const getEmployeeBasicInfoById = async (userId, setter) => {
  try {
    const res = await axios.get(
      `/domain/CreateUser/GetUserInformationByUserId?UserId=${userId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data[0]);
    }
  } catch (error) {
    setter("");
  }
};

export const getPayableSurcharge = async (accId, buId, date, setter) => {
  try {
    const res = await axios.get(
      `/vat/Mushak91/GetPayableSurcharge?AccountId=${accId}&BusinessUnitId=${buId}&reportDate=${date}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter("");
  }
};

export const getTreasuryDepositDetailsById = async (
  accId,
  buId,
  date,
  tDTypeId,
  setter
) => {
  try {
    const res = await axios.get(
      `/vat/Mushak91/GetTreasuryDepositDetailsById?AccountId=${accId}&BusinessUnitId=${buId}&reportDate=${date}&TreasuryDepositTypeId=${tDTypeId}`
    );
    if (res.status === 200 && res?.data) {
      if (res?.data?.length > 0) {
        setter(res?.data);
      } else {
        // toast.warning("Data Not Found");
        setter("");
      }
    }
  } catch (error) {
    setter("");
  }
};

export const getTaxLedgerSdVatForNote54 = async (
  accId,
  buId,
  taxBrachId,
  date,
  setter
) => {
  try {
    const res = await axios.get(
      `/vat/TaxLedgerOpenning/GetTaxLedgerSdVatForNote54?accountId=${accId}&businessUnitId=${buId}&taxbranchId=${taxBrachId ||
        0}&date=${date}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter("");
  }
};

export const getTaxLedgerSdVatForNote52 = async (
  accId,
  buId,
  taxBrachId,
  monthId,
  yearId,
  setter
) => {
  try {
    const res = await axios.get(
      `/vat/TaxLedgerOpenning/GetTaxLedgerSdVatForNote52?accountId=${accId}&businessUnitId=${buId}&taxbranchId=${taxBrachId ||
        0}&monthId=${monthId}&yearId=${yearId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter("");
  }
};
export const getPenaltyMonth_api = async (date, setter) => {
  try {
    const res = await axios.get(
      `/vat/SummaryReport/PenaltyMonth?SubmissionDate=${date}`
    );
    setter(res?.data);
  } catch (error) {
    setter("");
  }
};

export const CreateMonthlyReturn_api = async (payload, setDisabled, cb) => {
  setDisabled && setDisabled(true);
  try {
    await axios.post(`/vat/Mushak91/CreateMonthlyReturn`, payload);
    toast.success("Submitted Successfully", {
      toastId: shortid(),
    });
    cb();
    setDisabled && setDisabled(false);
  } catch (error) {
    setDisabled && setDisabled(false);
    toast.error(error.response.data.message || "error occured");
  }
};
export const savePostTaxMonthEndNineNineJvApi = async (payload, setDisabled, cb) => {
  setDisabled && setDisabled(true);
  try {
    await axios.post(`/vat/VATSP/PostTaxMonthEndNineNineJv`, payload);
    // toast.success("Submitted Successfully", {
    //   toastId: shortid(),
    // });
    cb();
    setDisabled && setDisabled(false);
  } catch (error) {
    setDisabled && setDisabled(false);
    toast.error(error.response.data.message || "error occured");
  }
};

export const GetMonthlyReturn_api = async (
  accId,
  buId,
  monthId,
  yearId,
  setter
) => {
  try {
    const res = await axios.get(
      `/vat/Mushak91/GetMonthlyReturn?AccountId=${accId}&BusinessUnitId=${buId}&MonthId=${monthId}&YearId=${yearId}`
    );
    setter(res?.data);
  } catch (error) {
    setter("");
  }
};
