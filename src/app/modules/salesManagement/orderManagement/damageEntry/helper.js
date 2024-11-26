import axios from "axios";
import { toast } from "react-toastify";

// export const getSalesReturnGridData = async (
//   unitId,
//   deliveryCode,
//   updateBy,
//   customerId,
//   setter,
//   setLoading
// ) => {
//   setLoading(true);
//   try {
//     const res = await axios.get(
//       `/oms/SalesInformation/GetDeliveryChallanNSalesOrderCancel?Challan=${deliveryCode}&Unitid=${unitId}&Partid=5&Narration=test&InactiveBy=${updateBy}&Customerid=${customerId}`
//     );
//     setter(res?.data?.map((item) => ({ ...item, isSelected: false })));
//     setLoading(false);
//   } catch (error) {
//     setter([]);
//     setLoading(false);
//   }
// };

export const getSalesReturnPreData = async (url, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.get(url);
    cb(res?.data);
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const salesReturnEntry = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(`/fino/ReturnSales/ReturnSalesEntry`, payload);
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getSalesReturns = async (
  accId,
  buId,
  fromDate,
  toDate,
  status,
  pageNo,
  pageSize,
  setter,
  setTotalCount,
  setLoading
) => {
  setLoading(true);
  const Status = status ? "&status=" + status : "";
  try {
    const res = await axios.get(
      `/oms/SalesReturnAndCancelProcess/GetSalesReturnLandingPagination?accId=${accId}&busuinessUnitId=${buId}&FromDate=${fromDate}&ToDate=${toDate}&pageNo=${pageNo}&pageSize=${pageSize}&viewOrder=desc${Status}`
    );
    setter(
      res?.data?.data?.map((item) => ({
        ...item,
        isSelected: false,
        editMode: false,
        tempQty: item?.quantity,
      }))
    );
    setTotalCount(res?.data?.totalCount);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const salesReturnApprove_api = async (url, payload, cb, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.put(
      url,
      // `/oms/SalesReturnAndCancelProcess/SalesReturnApproval`,
      payload
    );
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message || "Something went wrong");
    setLoading(false);
  }
};

export const editSalesReturn = async (payload, cb, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `/oms/SalesReturnAndCancelProcess/EditSalesReturn`,
      payload
    );
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const salesReturnCancel = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `/oms/SalesReturnAndCancelProcess/CancelEntry`,
      payload
    );
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

// damage entry
// damange entry or challan vs damage report view btn disable handler
export const viewReportBtnValidationHandler = (values) => {
  // console.log(values);

  // destrcuture
  const { viewAs, sbu, customer, channel, reportType } = values;

  switch (reportType?.label) {
    case "Damage Entry Landing":
      return !viewAs || (viewAs?.value === 2 && !sbu);

    case "Challan Vs Damage Report":
      return !customer || !channel;
    default:
      return true;
  }
};

// choose challan vs damage filter data select
export const isChallanVSDamageFilterSelectShow = (values, data) => {
  // destructure
  const { reportType } = values;
  // if report is challan vs damage has data show select ddl
  if (reportType?.value === 2 && data?.length > 0) {
    return true;
  }
  return false;
};

// handle challan vs damage filter data
export const handleChallanVSDamageDataFilter = (obj) => {
  // destrcuture
  const { status, copiedData, setGridData } = obj;

  // filter data (filter method create a new array)
  if (status === "All") {
    setGridData(copiedData);
  } else {
    const filteredData = copiedData?.data?.filter((item) => {
      return extractDamageEntryStatusText(item?.damageStatus) === status;
    });
    setGridData({ ...copiedData, data: filteredData });
  }
};

// get only status from string of full damage status (Damage Entry (Pending) => Pending)
const extractDamageEntryStatusText = (status) => {
  if (status) {
    const match = status?.match(/\((.*?)\)/);
    return match ? match[1] : null;
  }
};

// options
export const challanVSDamageReportStatusOptions = [
  { value: 0, label: "All" },
  { value: 1, label: "Pending" },
  { value: 2, label: "Done" },
];
