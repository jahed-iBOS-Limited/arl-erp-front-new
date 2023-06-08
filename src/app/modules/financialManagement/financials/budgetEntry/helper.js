import axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";

export const getSBUDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${buId}&Status=true`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getFinYearDDLAction = async (buId, setter) => {
  try {
    const res = await axios.get(
      `/fino/CommonFino/GetYearByBusinessUnit?BusinessUnitId=${buId}`
    );
    const newData = res?.data?.map((item) => ({
      ...item,
      value: item?.intYearId,
      label: item?.strYearName,
    }));
    setter(newData);
  } catch (error) {
    setter([]);
  }
};

export const getMonthlyDataAction = async (valueOption, setter) => {
  try {
    const res = await axios.get(
      `/fino/CommonFino/GetYearById?YearId=${valueOption?.value}`
    );

    let splittedYear = valueOption?.label?.split("-");
    let startYear = splittedYear?.[0];
    let endYear = splittedYear?.[1];

    var lastday = function(y, m) {
      return new Date(y, m + 1, 0).getDate();
    };
    const newData = res?.data?.map((item) => ({
      ...item,
      fromDate: _dateFormatter(
        new Date(
          item?.intCalenderMonthId < 7 ? endYear : startYear,
          item?.intCalenderMonthId - 1,
          1
        )
      ),
      toDate: `${item?.intCalenderMonthId < 7 ? endYear : startYear}-${
        item?.intCalenderMonthId < 10 ? 0 : ""
      }${item?.intCalenderMonthId}-${lastday(
        item?.intCalenderMonthId < 7 ? endYear : startYear,
        item?.intCalenderMonthId - 1
      )}`,
      month: item?.strMonthName,
      amount: 0,
    }));
    setter(newData);
  } catch (error) {
    setter([]);
  }
};

export const getGLDDL = async (buId, setter) => {
  try {
    const res = await axios.get(
      `/fino/SubLedger/GetSubLedgerDDL?BusinessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getBudgetEntryLanding = async (
  sbuId,
  finYearId,
  setLoading,
  setter,
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/fino/FinancialStatement/BudgetSummaryView?sbuId=${sbuId}&fiscalYearId=${finYearId}`
    );
    setLoading(false);
    setter(res?.data);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};

export const saveBudgetEntry = async (
  data,
  setDisabled,
  cb,
  isFileUpload = false
) => {
  try {
    setDisabled(true);
    const res = await axios.post(
      `/fino/BudgetFinancial/CreateBudgetFinancial`,
      data
    );
    setDisabled(false);
    cb();
    toast.success(res?.data?.message || "Submitted successfully");
  } catch (error) {
    isFileUpload && cb();
    setDisabled(false);
    toast.warn(error?.response?.data?.message || "Something went wrong");
  }
};
