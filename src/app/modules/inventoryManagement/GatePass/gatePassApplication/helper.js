import Axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import * as Yup from "yup";

//plant ddl
export const getPlantDDL = async (setter, accountId, businessUnitId) => {
  try {
    const res = await Axios.get(
      `/wms/Plant/GetPlantDDL?AccountId=${accountId}&BusinessUnitId=${businessUnitId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
//warehouse ddl
export const getWarehouseDDL = async (
  setter,
  accountId,
  businessUnitId,
  plantId
) => {
  try {
    const res = await Axios.get(
      `/wms/PlantWarehouse/GetPlantWarehouseDDL?AccountId=${accountId}&BusinessUnit=${businessUnitId}&PlantId=${plantId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

//create data;
export const createGetPaseData = async (
  values,
  rowDto,
  userId,
  accountId,
  businessUnitId,
  setDisabled,
  cb
) => {
  setDisabled(true);
  const obj = createPayloadChange(
    values,
    rowDto,
    userId,
    accountId,
    businessUnitId
  );
  try {
    await Axios.post(`/wms/GatePass/CreateGetPass`, obj);
    setDisabled(false);
    toast.success("Create successfully");
    cb && cb();
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message);
  }
};

const createPayloadChange = (
  values,
  rowDto,
  userId,
  accountId,
  businessUnitId
) => {
  const payload = {
    objHeader: {
      dteTransactionDate: values?.date,
      strFromAddress: values?.warehouse?.address,
      strToAddress: values?.others
        ? values?.toAddress
        : values?.toAddress?.label,
      intToEmployeeId: values?.toAddress?.value,
      intWareHouseId: values?.warehouse?.value,
      intAccountId: accountId,
      intBusinessUnitId: businessUnitId,
      intPlantId: values.plant?.value,
      strRemarks: values?.remarks,
      strDriverName: values?.receiversName,
      strContact: values?.contactNo,
      strVehicleNumber: values?.fromGateEntry ? values?.vehicle?.label : values?.vehicle,
      strReason: values?.reason?.value,
      intActionBy: userId,
      isOthers: values?.others ? true : false,
      fromGateEntry: values?.fromGateEntry,
      intVehicleEntryId: values?.fromGateEntry ? values?.vehicle?.intVehicleEntryId : 0,
    },
    objRowList: rowDto?.map((item) => ({
      numQuantity: item?.quantity,
      strItemName: item?.item,
      strUom: item?.uom,
      isReturnable: item?.returnable,
      strRemarks: item?.strRemarks || ""
    })),
  };
  return payload;
};

export const updateGetPassData = async (
  values,
  rowDto,
  userId,
  accountId,
  businessUnitId,
  setDisabled,
  id,
  cb
) => {
  setDisabled(true);
  const obj = updatePayloadChange(
    values,
    rowDto,
    userId,
    accountId,
    businessUnitId,
    id
  );

  try {
    await Axios.put(`/wms/GatePass/EditGatePass`, obj);
    setDisabled(false);
    toast.success("Update successfully");
    cb && cb();
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message);
  }
};

const updatePayloadChange = (
  values,
  rowDto,
  userId,
  accountId,
  businessUnitId,
  id
) => {
  const payload = {
    objHeader: {
      intGatePassId: values?.gatePassId,
      dteTransactionDate: values?.date,
      strFromAddress: values?.fromAddress,
      strToAddress: values?.others
        ? values?.toAddress
        : values?.toAddress?.label,
      intToEmployeeId: values?.toAddress?.value,
      strRemarks: values?.remarks,
      strDriverName: values?.receiversName,
      strContact: values?.contactNo,
      strVehicleNumber: values?.vehicle?.intVehicleEntryId > 0 ? values?.vehicle?.strVehicleNumber : values?.vehicle?.label || values?.vehicle,
      strReason: values?.reason?.label,
      isOthers: values?.others,
    },
    objRow: rowDto?.map((item) => ({
      intRowId: item?.intRowId || 0,
      numQuantity: item?.quantity,
      strItemName: item?.item,
      strUom: item?.uom,
      isReturnable: item?.returnable || item?.isReturnable,
      strRemarks: item?.strRemarks || ""
    })),
  };
  return payload;
};

//landing api;
export const getGridData = async (
  accountId,
  businessUnitId,
  warehouseId,
  setter,
  setLoading,
  pageNo,
  pageSize,
  fromDate,
  toDate,
  plantId,
  searchValue
) => {
  try {
    setLoading(true);
    // console.log("plantId", plantId);
    const res = await Axios.get(
      searchValue
        ? `/wms/GatePass/GetGatePassLandingPasignation?accountId=${accountId}&businessUnitId=${businessUnitId}&plantId=${plantId}&warehouseId=${warehouseId}&search=${searchValue}&fromDate=${fromDate}&toDate=${toDate}&pageNo=${pageNo}&pageSize=${pageSize}&viewOrder=desc`
        : `/wms/GatePass/GetGatePassLandingPasignation?accountId=${accountId}&businessUnitId=${businessUnitId}&plantId=${plantId}&warehouseId=${warehouseId}&fromDate=${fromDate}&toDate=${toDate}&pageNo=${pageNo}&pageSize=${pageSize}&viewOrder=desc`
    );
    // console.log(res);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
    toast.error(error?.response?.data?.message);
  }
};

export const getSingleData = async (
  id,
  setter,
  setInitDataForEdit,
  setDisabled
) => {
  setDisabled(true);
  try {
    const res = await Axios.get(
      `/wms/GatePass/GetGatePassById?GatePassId=${id}`
    );
    if (res.status === 200) {
      setInitDataForEdit({
        date: _dateFormatter(res?.data?.objHeader?.dteTransactionDate),
        fromAddress: res?.data?.objHeader?.strFromAddress,
        toAddress: res?.data?.objHeader?.isOthers
          ? res?.data?.objHeader?.strToAddress
          : {
            label: res?.data?.objHeader?.strToAddress,
            value: res?.data?.objHeader?.intToEmployeeId,
          },
        receiversName: res?.data?.objHeader?.strDriverName,
        contactNo: res?.data?.objHeader?.strContact,
        remarks: res?.data?.objHeader?.strRemarks,
        reason: {
          value: res?.data?.objHeader?.strReason,
          label: res?.data?.objHeader?.strReason,
        },
        // vehicle: res?.data?.objHeader?.strVehicleNumber,
        vehicle: res?.data?.objHeader?.intVehicleEntryId > 0 ?
          {
            label: res?.data?.objHeader?.strVehicleNumber,
            value: 0
          } :
          res?.data?.objHeader?.strVehicleNumber,
        intVehicleEntryId: res?.data?.objHeader?.intVehicleEntryId || 0,
        others: res?.data?.objHeader?.isOthers,
        actionByName: res?.data?.objHeader?.actionByName,
        // dteApproved: res?.data?.objHeader?.dteApprovedm,
        plant: {
          value: res?.data?.objHeader?.intPlantId,
          label: res?.data?.objHeader?.plantName,
        },
        warehouse: {
          value: res?.data?.objHeader?.intWareHouseId,
          label: res?.data?.objHeader?.warehouseName,
        },
        isPrint: res?.data?.objHeader?.isPrint,
        strGatePassCode: res?.data?.objHeader?.strGatePassCode,
        strApprovedBy: res?.data?.objHeader?.strApprovedBy,
        gatePassId: res?.data?.objHeader?.intGatePassId,
        intAccountId: res?.data?.objHeader?.intAccountId,
        intBusinessUnitId: res?.data?.objHeader?.intBusinessUnitId,
        intActionBy: res?.data?.objHeader?.intActionBy,
        businessUnitAddress: res?.data?.objHeader?.businessUnitAddress,
        businessUnitName: res?.data?.objHeader?.businessUnitName,
        isApproved: res?.data?.objHeader?.isApprove,
        intApprovedBy: res?.data?.objHeader?.intApprovedBy,
        status: res?.data?.objHeader?.status,
        isActive: res?.data?.objHeader?.isActive,
        dteApproved: res?.data?.objHeader?.dteApproved,
        actionDate: res?.data?.objHeader?.actionDate
      });
      setter(
        res?.data?.objRow?.map((item) => ({
          ...item,
          item: item?.strItemName,
          uom: item?.strUom,
          quantity: item?.numQuantity,
          isReturnable: item?.isReturnable,
          intRowId: item?.intRowId,
        }))
      );
      setDisabled(false);
    }
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message);
  }
};

export const getRerurnedData = async (
  id,
  setter,
  setInitDataForEdit,
  setDisabled
) => {
  setDisabled(true);
  try {
    const res = await Axios.get(
      `/wms/GatePass/GetReturnableGatePassById?GatePassId=${id}`
    );
    if (res.status === 200) {
      setInitDataForEdit({
        date: _dateFormatter(res?.data?.objHeader?.dteTransactionDate),
        fromAddress: res?.data?.objHeader?.strFromAddress,
        toAddress: res?.data?.objHeader?.isOthers
          ? res?.data?.objHeader?.strToAddress
          : {
            label: res?.data?.objHeader?.strToAddress,
            value: res?.data?.objHeader?.intToEmployeeId,
          },
        receiversName: res?.data?.objHeader?.strDriverName,
        contactNo: res?.data?.objHeader?.strContact,
        remarks: res?.data?.objHeader?.strRemarks,
        reason: {
          value: res?.data?.objHeader?.strReason,
          label: res?.data?.objHeader?.strReason,
        },
        vehicle: res?.data?.objHeader?.strVehicleNumber,
        others: res?.data?.objHeader?.isOthers,
        actionByName: res?.data?.objHeader?.actionByName,
        // dteApproved: res?.data?.objHeader?.dteApprovedm,
        plant: {
          value: res?.data?.objHeader?.intPlantId,
          label: res?.data?.objHeader?.plantName,
        },
        warehouse: {
          value: res?.data?.objHeader?.intWareHouseId,
          label: res?.data?.objHeader?.warehouseName,
        },
        isPrint: res?.data?.objHeader?.isPrint,
        strGatePassCode: res?.data?.objHeader?.strGatePassCode,
        strApprovedBy: res?.data?.objHeader?.strApprovedBy,
        gatePassId: res?.data?.objHeader?.intGatePassId,
        intAccountId: res?.data?.objHeader?.intAccountId,
        intBusinessUnitId: res?.data?.objHeader?.intBusinessUnitId,
        intActionBy: res?.data?.objHeader?.intActionBy,
        businessUnitAddress: res?.data?.objHeader?.businessUnitAddress,
        businessUnitName: res?.data?.objHeader?.businessUnitName,
        isApproved: res?.data?.objHeader?.isApprove,
        intApprovedBy: res?.data?.objHeader?.intApprovedBy,
        status: res?.data?.objHeader?.status,
        isActive: res?.data?.objHeader?.isActive,
        dteApproved: res?.data?.objHeader?.dteApproved
      });
      setter(
        res?.data?.objRow?.map((item) => ({
          ...item,
          item: item?.strItemName,
          uom: item?.strUom,
          quantity: item?.numQuantity,
          isReturnable: item?.isReturnable,
          intRowId: item?.intRowId,
          isReturned: item?.isReturned,
          returnStatus: item?.returnStatus,
          remarks: item?.strRemarks,
          intGatePassId: item?.intGatePassId,
          calculationgNumReturnQuantity: 0,
        }))
      );
      setDisabled(false);
    }
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message);
  }
};
export const approveGatePass = async (id, setDisabled, userId, cb) => {
  setDisabled(true);
  try {
    let obj = {
      actionBy: userId,
    };
    const res = await Axios.put(
      `/domain/GatePass/ApproveGatePass?gatePassId=${id}`,
      obj
    );
    toast.success(res?.data?.message);
    setDisabled(false);
    cb();
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message);
  }
};

export const reason = [
  { value: "Sample", label: "Sample" },
  { value: "Material Return", label: "Material Return" },
  { value: "Repair & Maintenance", label: "Repair & Maintenance" },
  { value: "Transfer", label: "Transfer" },
  { value: "Others", label: "Others" },
];

//validation schema;
export const validationSchema = Yup.object().shape({
  receiversName: Yup.string().required("Driver/Receive Name is required"),
  contactNo: Yup.string()
    .required("Contact no is required")
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(11, "Must be exactly 11 digits")
    .max(11, "Must be exactly 11 digits"),
  remarks: Yup.string().required("Remarks is required"),
});

//send to email api;
export const sendEmailPostApi = async (dataObj) => {
  let formData = new FormData();
  formData.append("to", dataObj?.toMail);
  formData.append("cc", dataObj?.toCC);
  formData.append("bcc", dataObj?.toBCC);
  formData.append("subject", dataObj?.subject);
  formData.append("body", dataObj?.message);
  formData.append("file", dataObj?.attachment);
  try {
    let { data } = await Axios.post("/domain/MailSender/SendMail", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    toast.success("Mail Send Successfully");
    return data;
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "Mail cant not send successfully"
    );
  }
};
