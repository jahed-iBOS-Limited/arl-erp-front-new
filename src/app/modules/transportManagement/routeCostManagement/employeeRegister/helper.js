import Axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";

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

export const getEmployeeRegisterLanding = async (
  fromDate,
  toDate,
  accId,
  buId,
  pageNo,
  pageSize,
  driverId,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/tms/VehicleExpenseRegister/InternalTripCostTransferLandingPagination?accountId=${accId}&businessUnitId=${buId}&driverId=${driverId}&fromDate=${fromDate}&toDate=${toDate}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
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

export const CreateInternalTripCostTransferToExpRegister = async (
  data,
  cb,
  history,
  setDisabled
) => {
  try {
    setDisabled(true);
    const res = await Axios.post(
      `/tms/VehicleExpenseRegister/CreateInternalTripCostTransferToExpenseRegister`,
      data
    );
    if (res.status === 200) {
      history.push(
        "/transport-management/routecostmanagement/employeeRegister"
      );
      toast.success(res?.data?.message || "Submitted successfully");
      setDisabled(false);
    }
  } catch (error) {
    setDisabled(false);
  }
};

export const getSingleData = async (id, setter) => {
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

export const getDriverNameDDL_api = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/domain/EmployeeBasicInformation/GetEmployeeDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    )
    if (res.status === 200 && res?.data) {
      setter(res?.data)
    }
  } catch (error) {
    
  }
}
