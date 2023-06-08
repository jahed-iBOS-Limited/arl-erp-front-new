import Axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { _todayDate } from "../../../_helper/_todayDate";

export const getVehicleNoDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/tms/Vehicle/GetVehicleDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getOwnVehicleNo = async (employeeId, setter) => {
  try {
    const res = await Axios.get(
      `/tms/InternalTransport/GetFuelLogCashAmount?Partid=3&ApplicantEnroll=${employeeId}&VehicleId=0&ExpenseDate=${_todayDate()}`
    );
    if (res.status === 200) {
      const modifyData = res?.data?.map((item) => ({
        ...item,
        value: item?.intVehicleID,
        label: item?.strVehicleName,
      }));
      setter(modifyData);
    }
  } catch (error) {}
};

export const getFuelTypeDDL = async (setter) => {
  try {
    const res = await Axios.get(
      `/tms/Vehicle/GetVehicleFuelTypeDDL?IsActive=true`
    );
    if (res.status === 200) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getSupplierDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/partner/PManagementCommonDDL/GetBusinessPartnerbyIdDDL?AccountId=${accId}&BusinessUnitId=${buId}&PartnerTypeId=1`
    );
    if (res.status === 200) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getFuelStationDDL = async (partnerId, setter) => {
  try {
    const res = await Axios.get(
      `/tms/VehicleLogBook/FuelStationListDDL?PartnerId=${partnerId}`
    );
    if (res.status === 200) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getVehicleLogBookLanding = async (
  fromDate,
  toDate,
  accId,
  buId,
  pageNo,
  pageSize,
  vehicleNo,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/tms/VehicleLogBook/GetVehicleLogBookPagination?FromDate=${fromDate}&ToDate=${toDate}&accountId=${accId}&businessUnitId=${buId}&VehicleId=${vehicleNo}&status=true&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    );
    if (res.status === 200) {
      if (res?.data?.data?.length === 0) {
        toast.warning("No data found", { toastId: "nfd12" });
      } else {
        setter(res?.data);
      }
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const saveVehicleLogBook = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/tms/VehicleLogBook/CreateVehicleLogBook`,
      data
    );
    if (res.status === 200) {
      cb();
      toast.success(res?.data?.message || "Submitted successfully");
      setDisabled(false);
    }
  } catch (error) {
    setDisabled(false);
  }
};

export const empAttachment_action = async (attachment, cb) => {
  let formData = new FormData();
  attachment.forEach((file) => {
    formData.append("files", file?.file);
  });
  try {
    let { data } = await Axios.post("/domain/Document/UploadFile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    toast.error("Document not upload");
  }
};

export const getMailageInformation = async (vehicleId, setter) => {
  try {
    const res = await Axios.get(
      `/tms/VehicleLogBook/GetLastEndMilageById?VehicleId=${vehicleId}`
    );
    if (res.status === 200) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getExpenseForDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/domain/EmployeeBasicInformation/GetEmployeeDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getSbuDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/domain/BusinessUnitDomain/GetBusinessAreaDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getCounteryDDL = async (setter) => {
  try {
    const res = await Axios.get(`/oms/TerritoryInfo/GetCountryDDL`);
    if (res.status === 200) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getCurrencyDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/tms/TransportMgtDDL/GetCurrencyDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getCostCenterDDL = async (accId, buId, sbuId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/CostCenter/GetCostCenterDDL?AccountId=${accId}&BusinessUnitId=${buId}&SBUId=${sbuId}`
    );
    if (res.status === 200) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getProjectNameDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/tms/VehicleLogBook/GetProjectNameDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getDistrubutionCenterDDL = async (accId, buId, sbuId, setter) => {
  try {
    const res = await Axios.get(
      `/tms/VehicleLogBook/GetDisbursementCenterDDL?AccountId=${accId}&BusinessUnitId=${buId}&SBUId=${sbuId}`
    );
    if (res.status === 200) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getExpenseRowData = async (vehileNo, fromDate, toDate, setter) => {
  try {
    const res = await Axios.get(
      `/tms/VehicleExpenseRegister/VehicleUnbilledExpenseInformation?VehicleNo=${vehileNo}&TravelFDate=${fromDate}&TravelTDate=${toDate}`
    );
    if (res.status === 200) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const saveVehicleLExpenseRegister = async (
  data,
  cb,
  history,
  setDisabled
) => {
  try {
    setDisabled(true);
    const res = await Axios.post(
      `/tms/VehicleExpenseRegister/CreateVehicleExpenseRegister`,
      data
    );
    if (res.status === 200) {
      history.push(
        "/transport-management/routecostmanagement/routestandardcost"
      );
      toast.success(res?.data?.message || "Submitted successfully");
      setDisabled(false);
    }
  } catch (error) {
    setDisabled(false);
  }
};

export const getSingleData = async (id, setter, cb) => {
  try {
    const res = await Axios.get(
      `/tms/VehicleLogBook/GetVehicleLogBookById?VehicleLogId=${id}`
    );
    if (res.status === 200) {
      let headerPart = res.data.objHeader;
      let rowPart = res.data.objRow[0];
      let newData = {
        objHeader: {
          ...headerPart,
          travelDate: _dateFormatter(headerPart?.travelDate),
          fromAddress: headerPart?.fromAddress,
          fromTime: headerPart?.startTime?.slice(0, 5),
          toAddress: headerPart?.toAddress,
          toTime: headerPart?.endTime?.slice(0, 5),
          startMileage: headerPart?.vehicleStartMileage,
          endMileage: headerPart?.vehicleEndMileage,
          consumedMileage: headerPart?.vehicleConsumedMileage,
          usageType:
            headerPart?.isPersonalUsage === true
              ? { label: "Personal", value: "Personal" }
              : { label: "Official", value: "Official" },
          fuelPurchased: headerPart?.isFuelPurchased,
          fuelType:
            headerPart?.isFuelPurchased === false
              ? ""
              : { value: rowPart?.fuelTypeId, label: rowPart?.fuelTypeName },
          quantity:
            headerPart?.isFuelPurchased === false ? "" : rowPart?.quantity,
          totalAmount:
            headerPart?.isFuelPurchased === false ? "" : rowPart?.amount,
          paymentMethod:
            headerPart?.isFuelPurchased === false
              ? ""
              : {
                  label: rowPart?.paymentMethod,
                  value: rowPart?.paymentMethod,
                } || "",
          supplier:
            headerPart?.isFuelPurchased === false
              ? ""
              : {
                  value: rowPart?.businessPartnerId,
                  label: rowPart?.businessPartnerName,
                } || "",
          fuelStation:
            headerPart?.isFuelPurchased === false
              ? ""
              : {
                  value: rowPart?.fuelStationId,
                  label: rowPart?.fuelStationName,
                },
          referenceNo: rowPart?.referenceNo,
          comments: headerPart?.comments,
          fuelPurchaseId:
            headerPart?.isFuelPurchased === false ? 0 : rowPart?.fuelPurchaseId,
        },
      };
      setter(newData);
    }
    cb && cb(res.data.objRow);
  } catch (error) {}
};

export const EditVehicleLogBook = async (data, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.put(`/tms/VehicleLogBook/EditVehicleLogBook`, data);
    if (res.status === 200) {
      toast.success(res?.data?.message || "Submitted successfully");
      setDisabled(false);
    }
  } catch (error) {
    setDisabled(false);
  }
};

export const getPaymentType = async (setter) => {
  try {
    const res = await Axios.get(`/tms/VehicleLogBook/GetPaymentTypeDDL`);
    if (res.status === 200) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const updateVehicle = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await Axios.put(
      `/tms/VehicleLogBook/UpdateVehicleLogBookHeader`,
      payload
    );
    toast.success(res?.data?.message);
    cb && cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const deleteTheVehicleLog = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await Axios.put(
      `/tms/VehicleLogBook/DeleteVehicleLogBook`,
      payload
    );
    toast.success(res?.data?.message);
    cb && cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const checkUpdateDeletePermission = async (
  userId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/tms/VehicleLogBook/CheckPermission?UserId=${userId}&PermissionFor=3`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
