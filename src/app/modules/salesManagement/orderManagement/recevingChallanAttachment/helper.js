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


export const uploadAttachment = async (attachment, setDisabled) => {
  let formData = new FormData();
  attachment.forEach((file) => {
    formData.append("files", file);
  });
  try {
    setDisabled && setDisabled(true);
    let { data } = await axios.post("/domain/Document/UploadFile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    setDisabled && setDisabled(false);
    toast.success("File Attachment successfully");
    return data;
  } catch (error) {
    setDisabled && setDisabled(false);
    toast.error("Document not upload");
    throw new Error("Document not upload");
  }
};

export const empAttachment_action = async (attachment, cb) => {
  let formData = new FormData();
  attachment.forEach((file) => {
    formData.append("files", file?.file);
  });
  try {
    let { data } = await axios.post("/domain/Document/UploadFile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    // toast.success(res?.data?.message || "Submitted Successfully");
    toast.success(data?.message || "Upload  successfully");
    return data;
  } catch (error) {
    toast.error("Document not upload");
  }
};