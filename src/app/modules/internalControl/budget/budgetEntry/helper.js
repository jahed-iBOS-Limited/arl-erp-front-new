import axios from "axios";
import { toast } from "react-toastify";

export const getRowTotal = (arr, property) => {
  return arr.reduce((sum, item) => sum + item[property], 0);
};

export const monthDDL = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

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

export const getBudgetTypeDDLAction = async (setter) => {
  try {
    const res = await axios.get(`/fino/BudgetFinancial/BudgetTypeDDL`);
    const modifyResData = res?.data?.map((itm) => {
      return {
        ...itm,
        value: itm?.budgetTypeId,
        label: itm?.budgetTypeName,
      };
    });
    setter(modifyResData);
  } catch (error) {
    setter([]);
  }
};

export const getBudgetEntryLanding = async (
  fiscalYear,
  budgetTypeId,
  buId,
  setLoading,
  setter
) => {
  try {
    setLoading && setLoading(true);
    const res = await axios.get(
      `/fino/BudgetFinancial/AllBudgetLanding?FiscalYear=${fiscalYear}&BudgetTypeId=${budgetTypeId}&BusinessUnitId=${buId}`
    );
    setLoading && setLoading(false);
    setter(res?.data);
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const getBudgetCreateLanding = async (
  monthId,
  yearId,
  budgetTypeId,
  buId,
  setLoading,
  setter,
  costRevid
) => {
  setLoading && setLoading(true);
  try {
    // let costRevQuery = costRevid !== null ? `&CostRevCenterId=${costRevid}` : `&CostRevCenterId=0`;
    const res = await axios.get(
      `/fino/BudgetFinancial/BudgetCreateLanding?MonthId=${monthId}&YearId=${yearId}&BusinessUnitId=${buId}&BudgetTypeId=${budgetTypeId}&CostRevCenterId=${costRevid || 0}`
    );
    const modifyData = res?.data?.map((itm) => {
      return {
        ...itm,
        // quantity
        levelVariableQty: `${itm?.strElementName
          .toLowerCase()
          .split(" ")
          .join("")}Qty`,
        [`${itm?.strElementName
          .toLowerCase()
          .split(" ")
          .join("")}Qty`]: itm?.numBudgetQty,
        numBudgetQty: itm?.numBudgetQty,

        // amount
        levelVariableAmount: `${itm?.strElementName
          .toLowerCase()
          .split(" ")
          .join("")}Amount`,
        [`${itm?.strElementName
          .toLowerCase()
          .split(" ")
          .join("")}Amount`]: itm?.numBudgetQty,
        numBudgetValue: itm?.numBudgetValue,
      };
    });
    setLoading && setLoading(false);
    setter(modifyData);
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const saveBudgetCreate = async (data, setDisabled, cb) => {
  setDisabled && setDisabled(true);
  try {
    const res = await axios.post(`/fino/BudgetFinancial/BudgetCreate`, data);
    setDisabled && setDisabled(false);
    cb();
    toast.success(res?.data?.message || "Submitted successfully");
  } catch (error) {
    setDisabled && setDisabled(false);
    toast.warn(error?.response?.data?.message || "Something went wrong");
  }
};

export const getBudgetEntryGetById = async (id, setLoading, setter) => {
  try {
    setLoading && setLoading(true);
    const res = await axios.get(
      `/fino/BudgetFinancial/BudgetGetById?IntBudgetid=${id}`
    );
    setLoading && setLoading(false);
    const modifyData = res?.data?.budgetRowDTO?.map((itm) => {
      return {
        ...itm,
        // quantity
        levelVariableQty: `${itm?.strElementName
          .toLowerCase()
          .split(" ")
          .join("")}Qty`,
        [`${itm?.strElementName
          .toLowerCase()
          .split(" ")
          .join("")}Qty`]: itm?.numBudgetQty,
        numBudgetQty: itm?.numBudgetQty,

        // amount
        levelVariableAmount: `${itm?.strElementName
          .toLowerCase()
          .split(" ")
          .join("")}Amount`,
        [`${itm?.strElementName
          .toLowerCase()
          .split(" ")
          .join("")}Amount`]: itm?.numBudgetValue,
        numBudgetValue: itm?.numBudgetValue,
      };
    });
    setter(modifyData);
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const saveBudgetUpdated = async (data, setDisabled, cb) => {
  setDisabled && setDisabled(true);
  try {
    const res = await axios.post(`/fino/BudgetFinancial/BudgetUpdated`, data);
    setDisabled && setDisabled(false);
    cb();
    toast.success(res?.data?.message || "Submitted successfully");
  } catch (error) {
    setDisabled && setDisabled(false);
    toast.warn(error?.response?.data?.message || "Something went wrong");
  }
};
