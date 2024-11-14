import axios from "axios";
import { toast } from "react-toastify";
import * as Yup from "yup";
import {
  _todaysEndTime,
  _todaysStartTime,
} from "../../../_helper/_currentTime";
import { _todayDate } from "../../../_helper/_todayDate";
import numberWithCommas from "../../../_helper/_numberWithCommas";
import { _dateFormatter } from "../../../_helper/_dateFormate";

// track traller lb create init // !OK
export const trackTrallerLBInitData = {
  supplier: "",
  billNo: "",
  shippoint: "",
  billDate: _todayDate(),
  paymentDueDate: new Date(new Date().setDate(new Date().getDate() + 15)),
  narration: "",
  billAmount: "",
  warehouse: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
  fromTime: _todaysStartTime(),
  toTime: _todaysEndTime(),
};

// validation schema
export const trackTrallerLBIValidationSchema = Yup.object().shape({
  supplier: Yup.object()
    .nullable()
    .required("Supplier is required"),
  billNo: Yup.string().required("Bill no is required"),
  billDate: Yup.date().required("Bill date is required"),
  paymentDueDate: Yup.date().required("Payment date is required"),
});

// get supplier ddl data // !OK
export const getSupplierDDL = (obj) => {
  // destructure
  const { value, profileData, selectedBusinessUnit } = obj;

  if (value.length < 3) return [];

  // fetch data
  return axios
    .get(
      `/procurement/PurchaseOrder/GetSupplierListDDL?Search=${value}&AccountId=${
        profileData?.accountId
      }&UnitId=${selectedBusinessUnit?.value}&SBUId=${0}`
    )
    .then((res) => {
      return res?.data;
    })
    .catch((e) => {
      toast.warn("Supplier not found");
    });
};

// validate date range not more than 1 month
export const validateDateRange = (_fromDate, _toDate) => {
  const fromDate = new Date(_fromDate);
  const toDate = new Date(_toDate);

  // Calculate the difference in years and months
  const monthDifference =
    (toDate.getFullYear() - fromDate.getFullYear()) * 12 +
    (toDate.getMonth() - fromDate.getMonth());

  // Calculate the difference in days
  const differenceInMs = toDate - fromDate;
  const differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);

  // Check if the difference is more than 1 month or more than 31 days
  if (monthDifference > 1 || differenceInDays > 31) {
    return true; // More than 1 month or more than 31 days
  }

  // Additional check to ensure the range is valid (less than or equal to 1 month)
  if (
    monthDifference === 1 ||
    (monthDifference === 0 && differenceInDays <= 31)
  ) {
    return false;
  }

  // default return true
  return true;
};

// get track traller loading bill data
export const getTrackTrallerLoadingBillData = async (obj) => {
  // destrcuture parameter
  const {
    profileData,
    selectedBusinessUnit,
    values,
    getTrackTrallerLBData,
    setTrackTrallerLBData,
  } = obj;

  // destrcuture values
  const { supplier, shippoint, fromDate, toDate } = values;

  const isMoreThanOneMonth = validateDateRange(fromDate, toDate);

  if (isMoreThanOneMonth)
    return toast.warn("From & To date must be within 1 month");

  // set previous data empty
  setTrackTrallerLBData([]);

  // get data
  getTrackTrallerLBData(
    `/tms/LabourBillInfo/GetDeliveryLoadBill?accountid=${
      profileData?.accountId
    }&businessunitid=${
      selectedBusinessUnit?.value
    }&labourSupplierId=${supplier?.value || 0}&shipPointId=${shippoint?.value ||
      0}&fromdate=${fromDate}&todate=${toDate}`,
    (res) => {
      if (res?.length < 1) return toast.warn("No Data Found");
      if (res?.length > 0) {
        const updatedData = res?.map((item) => {
          return {
            ...item,
            approvedAmount: item?.labourBillAmount || 0,
            checked: false,
          };
        });

        setTrackTrallerLBData(updatedData);
      }
    }
  );
};

// total approve amount
export const totalApproveAmount = (data, filtered = false) => {
  if (filtered) {
    return data
      ?.filter((item) => item?.checked)
      ?.reduce((acc, item) => acc + +item?.approvedAmount, 0);
  }
  return numberWithCommas(
    data?.reduce(
      (acc, item) => acc + (item.checked ? +item.approvedAmount : 0),
      0
    )
  );
};

// save handler track traller loading bill
export const handleTTLBSaveData = (obj, cb) => {
  // destrcuture
  const {
    saveTrackTrallerLBData,
    values,
    profileData,
    selectedBusinessUnit,
    trackTrallerLBData,
    headerData,
    attachmentList,
  } = obj;

  const { supplier, billNo, paymentDueDate, narration, billDate } = values;

  // update track traller loading bill data
  const updatedTTLoadingBillData = trackTrallerLBData
    ?.filter((item) => item?.checked)
    ?.map((item) => {
      return {
        shipmentCode: item?.shipmentCode,
        challanNo: item?.challanNo,
        tripId: item?.tripId,
        ammount: +item?.labourBillAmount,
        billAmount: +item?.approvedAmount,
      };
    });

  // validations
  if (attachmentList?.length < 1) {
    return toast.warn("Please add an attachment");
  }

  const isBillAmountLessFromNetAmount = trackTrallerLBData
    ?.filter((item) => item?.checked)
    ?.some((item) => item?.labourBillAmount < item?.approvedAmount);

  if (isBillAmountLessFromNetAmount) {
    return toast.warn("Bill Amount must be below from Net Amount");
  }
  if (updatedTTLoadingBillData?.length < 1) {
    return toast.warning("Please select at least one row");
  }

  // updated image list
  const updatedImageList = attachmentList?.map((item) => {
    return {
      imageId: item?.id,
    };
  });

  // head payload
  const headPayload = {
    accountId: profileData?.accountId,
    actionBy: profileData?.userId,
    unitId: selectedBusinessUnit?.value,
    unitName: selectedBusinessUnit?.label,
    billTypeId: 34, // track traller loading bill id
    sbuId: headerData?.sbu?.value,
    plantId: headerData?.plant?.value,
    supplierId: supplier?.value,
    supplierName: supplier?.label,
    billNo: billNo,
    billDate: _dateFormatter(billDate),
    paymentDueDate: _dateFormatter(paymentDueDate),
    narration: narration,
    billAmount: totalApproveAmount(trackTrallerLBData, true),
  };

  // final payload
  const payload = {
    head: headPayload,
    row: updatedTTLoadingBillData,
    image: updatedImageList,
  };

  // console.log(payload);

  // save track traller billing data
  saveTrackTrallerLBData(
    `/wms/LabourBill/PostLabourBillEntry`,
    payload,
    () => {
      cb();
    },
    true
  );
};
