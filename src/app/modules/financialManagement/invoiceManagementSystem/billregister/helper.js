import { default as Axios, default as axios } from "axios";
import moment from "moment";
import { toast } from "react-toastify";
import { _fixedPoint } from "./../../../_helper/_fixedPoint";
import { _todayDate } from "./../../../_helper/_todayDate";
// Plant DDL Call
export const getPlantDDL = async (userId, accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const GetBillTypeDDL = async (setter) => {
  try {
    const res = await Axios.get(`/fino/FinanceCommonDDL/GetBillTypeDDL`);
    if (res.status === 200 && res?.data) {
      setter([{ value: 0, label: "All" }].concat(res?.data));
    }
  } catch (error) {}
};

export const GetApproveExpensesGroupApi = async (
  accId,
  buId,
  plantId,
  sbuId,
  setter,
  setDisabled,
  type,
  fromDate,
  toDate,
  expenseForId,
  costCenterId
) => {
  setDisabled && setDisabled(true);
  try {
    const Fdate = fromDate ? `&fromDate=${fromDate}` : "";
    const Tdate = toDate ? `&toDate=${toDate}` : "";
    const expForId = expenseForId ? `&employeeId=${expenseForId}` : "";
    const url =
      type === 4
        ? `/fino/PaymentRequest/GetApproveExpensesGroupByEmployeeId?PlantId=${plantId}&AccountId=${accId}&BusinessUnitId=${buId}&SbuId=${sbuId}${Fdate}${Tdate}${expForId}&CostCenterId=${costCenterId ||
            0}`
        : `/fino/PaymentRequest/GetApproveExpensesForTaDaGroupByEmployeeId?PlantId=${plantId}&AccountId=${accId}&BusinessUnitId=${buId}&SbuId=${sbuId}${Fdate}${Tdate}${expForId}&CostCenterId=${costCenterId ||
            0}`;

    const res = await Axios.get(url);
    if (res.status === 200 && res?.data) {
      setDisabled && setDisabled(false);
      setter(
        res?.data?.map((itm) => {
          return {
            ...itm,
            itemCheck: false,
            netAmount: itm?.totalApprovedAmount || 0,
            subItem: itm?.primaryKeyId?.map((itm) => ({
              ...itm,
              netAmount: itm?.approveAmount || 0,
            })),
            adjustAmount: 0,
          };
        })
      );
    }
  } catch (error) {
    setDisabled && setDisabled(false);
    setter([]);
  }
};

export const GetApproveExpensesForTaDaByEmpId_api = async (
  accId,
  buId,
  plantId,
  sbuId,
  setter,
  setDisabled,
  fromDate,
  toDate,
  empId,
  disCId
) => {
  setDisabled && setDisabled(true);
  try {
    const Fdate = fromDate ? `&fromDate=${fromDate}` : "";
    const Tdate = toDate ? `&toDate=${toDate}` : "";
    const expEmpId = empId ? `&employeeId=${empId}` : "";
    const res = await Axios.get(
      `/fino/PaymentRequest/GetApproveExpensesForTaDaByEmployeeId?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&SbuId=${sbuId}${Fdate}${Tdate}${expEmpId}&disbursementCenterId=${disCId}`
    );
    if (res.status === 200 && res?.data) {
      setDisabled && setDisabled(false);
      setter(
        res?.data?.map((itm) => ({
          ...itm,
          itemCheck: false,
          netAmount: itm?.totalApprovedAmount,
          adjustAmount: 0,
        }))
      );
    }
  } catch (error) {
    setDisabled && setDisabled(false);
    setter([]);
  }
};

export const GetApproveExpensesByEmployeeId_api = async (
  accId,
  buId,
  plantId,
  sbuId,
  setter,
  setDisabled,
  fromDate,
  toDate,
  empId,
  disCId
) => {
  setDisabled && setDisabled(true);
  try {
    const Fdate = fromDate ? `&fromDate=${fromDate}` : "";
    const Tdate = toDate ? `&toDate=${toDate}` : "";
    const expEmpId = empId ? `&employeeId=${empId}` : "";
    const res = await Axios.get(
      `/fino/PaymentRequest/GetApproveExpensesByEmployeeId?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&SbuId=${sbuId}${Fdate}${Tdate}${expEmpId}&disbursementCenterId=${disCId}`
    );
    if (res.status === 200 && res?.data) {
      setDisabled && setDisabled(false);
      setter(
        res?.data?.map((itm) => ({
          ...itm,
          itemCheck: false,
          netAmount: itm?.totalApprovedAmount,
          adjustAmount: 0,
        }))
      );
    }
  } catch (error) {
    setDisabled && setDisabled(false);
    setter([]);
  }
};

export const GetApproveAdvancesApi = async (
  accId,
  buId,
  plantId,
  sbuId,
  setter,
  setDisabled
) => {
  try {
    setDisabled && setDisabled(true);
    const res = await Axios.get(
      `/fino/PaymentRequest/GetApproveAdvances?PlantId=${plantId}&AccountId=${accId}&BusinessUnitId=${buId}&SbuId=${sbuId}`
    );
    if (res.status === 200 && res?.data) {
      setDisabled && setDisabled(false);
      //res?.data?.length === 0 && toast.warning("Data not found");
      setter(
        res?.data?.map((itm) => ({
          ...itm,
          itemCheck: false,
          netAmount: itm?.totalApprovedAmount,
          adjustAmount: 0,
          // advancedAmount:50
        }))
      );
    }
  } catch (error) {
    setDisabled && setDisabled(false);
    setter([]);
  }
};

export const paymentRequestSearchLandingApi = async (
  accId,
  buId,
  plantId,
  setter,
  setDisabled
) => {
  try {
    setDisabled && setDisabled(true);
    const res = await Axios.get(
      `/procurement/PaymentRequest/PaymentRequestSearchLanding?BusinessUnitId=${buId}&PlantId=${plantId}&AccountId=${accId}&viewOrder=desc&PageNo=1&PageSize=100000`
    );
    if (res.status === 200 && res?.data) {
      setDisabled && setDisabled(false);
      res?.data?.data?.length === 0 && toast.warning("Data not found");
      setter(res?.data?.data?.map((itm) => ({ ...itm, itemCheck: false })));
    }
  } catch (error) {
    setDisabled && setDisabled(false);
    setter([]);
  }
};

//single data api
export const getExpenseById = async (expId, setter, setRowDto) => {
  try {
    const res = await Axios.get(
      `/fino/Expense/GetExpenseById?ExpenseId=${expId}`
    );
    if (res.status === 200 && res?.data[0]) {
      const data = res?.data[0];

      const newData = {
        objHeader: {
          ...data?.objHeader,
          expenseFrom: data?.objHeader?.fromDate,
          expenseTo: data?.objHeader?.toDate,
          reference: data?.objHeader?.vehicleId,
          comments1: data?.objHeader?.comments,
          expenseDate: _todayDate(),
          expenseCategory: {
            value: data?.objHeader?.advExpCategoryId,
            label: data?.objHeader?.advExpCategoryName,
          },
          projectName: {
            value: data?.objHeader?.projectId,
            label: data?.objHeader?.projectName,
          },
          costCenter: {
            value: data?.objHeader?.costCenterId,
            label: data?.objHeader?.costCenterName,
          },
          paymentType: {
            value: data?.objHeader?.instrumentId,
            label: data?.objHeader?.instrumentName,
          },
          disbursmentCenter: {
            value: data?.objHeader?.disbursementCenterId,
            label: data?.objHeader?.disbursementCenterName,
          },
          expenseGroup:
            data?.objHeader?.expenseGroup === "TaDa"
              ? {
                  value: "TaDa",
                  label: "Ta/Da",
                }
              : {
                  value: "Other",
                  label: "Other",
                },
        },
        objRow: [...data?.objRow],
      };

      const newRowDto = newData?.objRow.map((item) => ({
        expenseRowId: item.expenseRowId,
        expenseDate: item.expenseDate,
        transaction: {
          value: item.businessTransactionId,
          label: item.businessTransactionName,
        },
        quantity: item.quantity,
        totalAmount: item.amount,
        location: item.expenseLocation,
        comments2: item.comments,
        attachmentLink: item.attachmentLink,
        driverName: item?.driverName,
        driverId: item?.driverId,
        expenseGroupName:
          data?.objHeader?.expenseGroup === "TaDa" ? "Ta/Da" : "Other",
      }));
      setRowDto(newRowDto);
      setter(newData);
    }
  } catch (error) {}
};

export const CreateBillRegister_api = async (
  data,
  setDisabled,
  girdDataFunc,
  values,
  setFileObjects,
  modalView
) => {
  setDisabled(true);
  try {
    const res = await Axios.post(`/fino/BillRegister/CreateBillRegister`, data);
    if (res.status === 200) {
      setDisabled(false);
      toast.success(res?.data?.message || "Submitted successfully", {
        toastId: "CreatePaymentRequest",
      });
      girdDataFunc(values);
      setFileObjects && setFileObjects([]);
      modalView && modalView(res?.data?.code);
    }
  } catch (error) {
    setDisabled(false);
    setFileObjects && setFileObjects([]);
    toast.error(error?.response?.data?.message, {
      toastId: "CreatePaymentRequest",
    });
  }
};

export const SaveBillRegister_api = async (
  accId,
  buId,
  userId,
  advanceAmount,
  data,
  setDisabled,
  girdDataFunc,
  values,
  setFileObjects,
  modalView
) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/fino/BillRegister/ExpanceBill?accountId=${accId}&businessUnitId=${buId}&actionById=${userId}&advanceAmount=${advanceAmount}`,
      data
    );
    if (res.status === 200) {
      setDisabled(false);
      toast.success(res?.data?.message || "Submitted successfully", {
        toastId: "ExpanceBill",
      });
      girdDataFunc(values);
      setFileObjects && setFileObjects([]);
      modalView && modalView(res?.data?.code);
    }
  } catch (error) {
    setDisabled(false);
    setFileObjects && setFileObjects([]);
    toast.error(error?.response?.data?.message, {
      toastId: "ExpanceBill",
    });
  }
};

export const getSbuDDL = async (accId, buId, setter) => {
  try {
    let res = await Axios.get(
      `/hcm/HCMDDL/GetSBUDDL?AccountId=${accId}&BusineessUnitId=${buId}`
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

export const getSingleDataForEdit = async (id, setter) => {
  try {
    const res = await Axios.get(
      `/procurement/SupplierInvoice/GetSupplierInvoiceById?SupplierInvoiceId=${id}`
    );
    if (res.status === 200 && res?.data) {
      let setDtoValue = res?.data?.objHeaderDTO;
      let newData = {
        objHeaderDTO: {
          ...res?.data?.objHeaderDTO,
          SBU: {
            label: setDtoValue.sbuname,
            value: setDtoValue.sbuid,
          },
          purchaseOrg: {
            label: setDtoValue.purchaseOrganizationName,
            value: setDtoValue.purchaseOrganizationId,
          },
          plant: {
            label: setDtoValue.plantName,
            value: setDtoValue.plantId,
          },
          warehouse: {
            label: setDtoValue.warehouseName,
            value: setDtoValue.warehouseId,
          },
          supplierName: {
            label: setDtoValue.businessPartnerName,
            value: setDtoValue.businessPartnerId,
          },
          purchaseOrder: {
            label: setDtoValue.purchaseOrderNo,
            value: setDtoValue.purchaseOrderId,
            purchaseOrganizationName: setDtoValue.purchaseOrganizationName,
            plant: setDtoValue.plantName,
            warehouseName: setDtoValue.warehouseName,
            supplierName: setDtoValue.supplierName,
            advanceAdjustmentAmount: setDtoValue.advanceAdjustmentAmount,
            totalPOAmount: setDtoValue.totalPOAmount,
          },
          checked: false,
          attachmentId: setDtoValue?.attachmentId,
        },
        objRowListDTO: [...res?.data?.objRowListDTO],
      };
      setter(newData);
    }
  } catch (error) {}
};

export const savePurchaseInvoice = async (
  data,
  cb,
  setgrnGridData,
  setDisabled,
  setFileObjects,
  modalView
) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/procurement/SupplierInvoice/CreateSupplierInvoice`,
      data
    );
    // if (res.status === 200) {
    if (res?.data?.statuscode === 200) {
      setFileObjects([]);
      setgrnGridData([]);
      modalView(res?.data?.code);
      toast.success(res.data?.message || "Submitted successfully");
      cb();
      setDisabled(false);
    } else {
      toast.error(res.data?.message || "Invoice Already Exists");
      setDisabled(false);
    }
    // }
  } catch (error) {
    toast.error(error?.res?.data?.message);
    setDisabled(false);
  }
};

export const getSBUDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${buId}&Status=true`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getWarehouseDDL = async (userId, accId, buId, plantId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&OrgUnitTypeId=8`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getWarehouseDDLFuelBill_api = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/Warehouse/GetWarehouseDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getPurchaseOrgDDL = async (accId, buId, sbuId, setter) => {
  try {
    const res = await Axios.get(
      // `/partner/BusinessPartnerPurchaseInfo/GetPartnerPurchaseDDL?AccountId=${accId}&BusniessUnitId=${buId}`
      `/partner/BusinessPartnerPurchaseInfo/GetPartnerPurchaseDDL?AccountId=${accId}&BusniessUnitId=${buId}&SbuId=${sbuId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getSupplierDDL = async (accId, buId, SBUId, setter) => {
  try {
    const res = await Axios.get(
      `/procurement/PurchaseOrder/GetSupplierListDDL?AccountId=${accId}&UnitId=${buId}&SBUId=${SBUId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const savePurchaseEditInvoice = async (
  data,
  cb,
  setDisabled,
  singleDataCB
) => {
  setDisabled(true);
  try {
    const res = await Axios.put(
      `/procurement/SupplierInvoice/EditSupplierInvoice`,
      data
    );
    if (res.status === 200) {
      toast.success(res?.message || "Update successfully");
      setDisabled(false);
      singleDataCB();
      //cb()
    }
  } catch (error) {
    setDisabled(false);
  }
};

export const billregisterAttachment_action = async (
  attachment,
  setDisabled
) => {
  let formData = new FormData();
  attachment.forEach((file) => {
    formData.append("files", file?.file);
  });
  try {
    setDisabled && setDisabled(true);
    let { data } = await Axios.post("/domain/Document/UploadFile", formData, {
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

export const GetAdvanceForSupplierById = async (poId, setter) => {
  try {
    const res = await Axios.get(
      `/fino/SupplierInvoiceInfo/GetAdvanceForSupplierById?PoId=${poId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const GetSupplierAmountInfo = async (poId, setter, setFieldValue) => {
  try {
    const res = await Axios.get(
      `/fino/SupplierInvoiceInfo/GetSupplierAmountInfo?PoId=${poId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setFieldValue &&
        setFieldValue("totalAdjustedBalance", res?.data?.totalAdjustedBalance);
      setFieldValue("poAdvanceAmount", res?.data?.poAdvanceAmount);
      setFieldValue(
        "curentAdjustmentBalance",
        res?.data?.poAdvanceAmount // - res?.data?.totalAdjustedBalance
      );
    }
  } catch (error) {}
};

export const getGrnAttachmentAction = async (refId, setter, setLoading) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/wms/InventoryDocument/GetInventoryDocumentAttachment?ReferenceId=${refId}`
    );
    setLoading(false);
    setter(res?.data);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};

export const getGRNDDL = async (
  accId,
  buId,
  SBUId,
  plantId,
  wareId,
  refId,
  refCode,
  setter
) => {
  try {
    const res = await Axios.get(
      `/wms/InventoryTransaction/GetGrnDDL?AccountId=${accId}&BusinessUnitId=${buId}&SBUId=${SBUId}&PlantId=${plantId}&WarehouseId=${wareId}&ReferenceId=${refId}&ReferenceCode=${refCode}`
    );
    const newData = res?.data?.map((item) => ({
      ...item,
      label: `${item?.label}(${item?.challanNo})`,
    }));
    setter(newData);
  } catch (error) {
    setter([]);
  }
};

export const getBillRegisterPagination_api = async (
  accId,
  buId,
  plantId,
  sbu,
  costCenterId,
  typeId,
  pageNo,
  pageSize,
  setter,
  setDisabled,
  values,
  searchValue
) => {
  try {
    setDisabled(true);

    const isTopsheet = typeId === 18 ? "&isTopSheet=true" : "";

    const res = await Axios.get(
      `/fino/BillRegister/BillRegisterPagination?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&ViewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}&SBUId=${sbu}&TypeId=${typeId}&fromDate=${
        values?.fromDate
      }&toDate=${values?.toDate}&CostCenterId=${costCenterId ||
        0}&Search=${searchValue}${isTopsheet}`
    );
    setDisabled(false);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setDisabled(false);
  }
};

export const CreateAdvanceForSupplier = async (
  data,
  cb,
  setDisabled,
  setAdvanceForSupplierById,
  setFileObjects,
  IWarningModal
) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/fino/SupplierInvoiceInfo/CreateAdvanceForSupplier`,
      data
    );
    setFileObjects([]);
    setAdvanceForSupplierById([]);
    toast.success("Submitted successfully");
    cb();
    setDisabled(false);
    IWarningModal({
      title: `${res?.data?.message}`,
      okAlertFunc: async () => {},
    });
  } catch (error) {
    toast.error(error?.response?.data?.message, {
      toastId: "CreateAdvanceForSupplier",
    });
    setDisabled(false);
  }
};

export const rejectBillRegister_api = async (
  data,
  setDisabled,
  cb,
  values,
  setIsReject
) => {
  setDisabled(true);
  try {
    const res = await Axios.post(`/fino/BillRegister/RejectBillRegister`, data);
    if (res.status === 200) {
      setDisabled(false);
      toast.success(res?.data?.message || "Submitted successfully", {
        toastId: "RejectBillRegister",
      });
      cb();
      setIsReject(false);
    }
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message, {
      toastId: "RejectBillRegister",
    });
  }
};

export const getChallanDDL = async (
  accountid,
  businessunitid,
  VehicleSupplierId,
  warehouseId,
  fromDate,
  toDate,
  setter,
  setDisabled
) => {
  try {
    setDisabled(true);
    const res = await Axios.get(
      `/tms/RentalVehicleCost/GetPendingRentalVehicleCost?accountid=${accountid}&businessunitid=${businessunitid}&VehicleSupplierId=${VehicleSupplierId}&WarehouseId=${warehouseId}&FromDate=${fromDate}&ToDate=${toDate}`
    );
    setter(
      res?.data?.map((item) => ({
        ...item,
        label: item?.challanNo,
        value: item?.tripId,
        approvedAmount: item?.totalCost,
        checked: false,
      }))
    );
    setDisabled(false);
  } catch (error) {
    setDisabled(false);
    setter([]);
  }
};
export const getG2GBillData = async (
  accId,
  buId,
  supplierID,
  fromDate,
  toDate,
  typeId,
  setter,
  setDisabled,
  searchTerm
) => {
  // const search = searchTerm ? `&SearchTerm=${searchTerm}` : "";
  try {
    setDisabled(true);
    const res = await Axios.get(
      `/tms/LigterLoadUnload/GetTruckAndGodownLabourBill?typeId=${typeId}&accountId=${accId}&businessUnitId=${buId}&supplierId=${supplierID}&fromDate=${fromDate}&toDate=${toDate}`
    );
    setter(
      res?.data?.map((item) => ({
        ...item,
        transportAmount:
          item?.soldToPartnerId === 73245
            ? item?.transportAmount
            : item?.transportAmount +
              +item?.quantity * +item?.godownUnloadLabourRate,
        label: item?.challanNo,
        value: item?.tripId,
        approvedAmount: item?.totalCost,
        checked: false,
      }))
    );
    setDisabled(false);
  } catch (error) {
    setDisabled(false);
    setter([]);
  }
};

export const getG2GCarrierData = async (
  accountid,
  businessunitid,
  supplierID,
  fromDate,
  toDate,
  setter,
  setDisabled,
  searchTerm
) => {
  const search = searchTerm ? `&SearchTerm=${searchTerm}` : "";
  try {
    setDisabled(true);
    const res = await Axios.get(
      `/tms/LigterLoadUnload/PreDataForCarrierBillG2G?AccountId=${accountid}&BusinessUnitId=${businessunitid}&CarrierAgentId=${supplierID}&FromDate=${fromDate}&ToDate=${toDate}${search}`
    );
    setter(
      res?.data?.map((item) => ({
        ...item,
        label: item?.challanNo,
        value: item?.tripId,
        approvedAmount: item?.totalCost,
        checked: false,
      }))
    );
    setDisabled(false);
  } catch (error) {
    setDisabled(false);
    setter([]);
  }
};

export const InternalTransport_api = async (
  accountid,
  businessunitid,
  VehicleSupplierId,
  warehouseId,
  fromDate,
  toDate,
  setter,
  setDisabled
) => {
  try {
    setDisabled(true);
    const res = await Axios.get(
      `/tms/InternalTransport/getInternalTransportBillInfo?Accountid=${accountid}&Businessunitid=${businessunitid}&VehicleSupplierId=${VehicleSupplierId}&Whid=${warehouseId}&FromDate=${fromDate}&ToDate=${toDate}&Partid=2&Shipmencostid=0&BillRegisterid=0`
    );
    setDisabled(false);
    if (res?.data?.length === 0) return toast.warn("Data not found");
    setter(
      res?.data?.map((item) => ({
        ...item,
        approvedAmount: _fixedPoint(item?.numNetPayable || 0),
        checked: false,
      }))
    );
    setDisabled(false);
  } catch (error) {
    setDisabled(false);
    setter([]);
  }
};

export const getTripCost = async (
  accId,
  buId,
  shipPointId,
  fromDate,
  toDate,
  setter,
  setDisabled
) => {
  try {
    setDisabled(true);
    const res = await Axios.get(
      `/tms/ShipmentExpReport/GetTripCostNetAmountForBillRegister?AccountId=${accId}&BusinessUnitId=${buId}&shipPointId=${shipPointId}&fromDate=${fromDate}&toDate=${toDate}`
    );
    setDisabled(false);
    if (res?.data?.length === 0) return toast.warn("Data not found");
    setter(res?.data);
    setDisabled(false);
  } catch (error) {
    setDisabled(false);
    setter([]);
  }
};

export const getSupplierDDlForTransportBill = async (
  AccountId,
  BusinessUnitId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/tms/TMSReport/GetSupplierDDl?AccountId=${AccountId}&BusinessUnitId=${BusinessUnitId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getSupplierDDlForFuelBill_api = async (
  AccountId,
  BusinessUnitId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/procurement/PurchaseOrder/GetSupplierListDDL?AccountId=${AccountId}&UnitId=${BusinessUnitId}&SBUId=0`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
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
    // toast.success(res?.data?.message || "Submitted Successfully");
    toast.success("Upload  successfully");
    return data;
  } catch (error) {
    toast.error("Document not upload");
  }
};

export const createTransportBill = async (
  data,
  cb,
  IWarningModal,
  setDisabled
) => {
  setDisabled && setDisabled(true);
  try {
    const res = await Axios.post(
      `/wms/InventoryTransaction/PostTransportBillEntry`,
      data
    );
    setDisabled && setDisabled(false);
    toast.success("Save successfully", {
      toastId: "CreatePaymentRequest",
    });
    // const res={data:{message:"test"}}
    IWarningModal({
      title: res?.data?.message,
      okAlertFunc: async () => {},
    });
    cb();
  } catch (error) {
    setDisabled && setDisabled(false);
    toast.error(error?.response?.data?.message || "Something went wrong", {
      toastId: "CreatePaymentRequest",
    });
  }
};
export const createG2GCustomizeBill = async (
  data,
  cb,
  IWarningModal,
  setDisabled
) => {
  setDisabled && setDisabled(true);
  try {
    const res = await Axios.post(
      `/wms/GTOGTransport/PostGTOGTransportBillEntry`,
      data
    );
    setDisabled && setDisabled(false);
    toast.success("Save successfully", {
      toastId: "CreatePaymentRequest",
    });
    // const res={data:{message:"test"}}
    IWarningModal({
      title: res?.data?.message,
      okAlertFunc: async () => {},
    });
    cb();
  } catch (error) {
    setDisabled && setDisabled(false);
    toast.error(error?.response?.data?.message || "Something went wrong", {
      toastId: "CreatePaymentRequest",
    });
  }
};

export const postInternalTransportBillEntry_api = async (
  data,
  cb,
  IWarningModal,
  setDisabled
) => {
  setDisabled && setDisabled(true);
  try {
    const res = await Axios.post(
      `/wms/InternalTransport/PostInternalTransportBillEntry`,
      data
    );
    setDisabled && setDisabled(false);
    toast.success("Save successfully", {
      toastId: "CreatePaymentRequest",
    });
    // const res={data:{message:"test"}}
    IWarningModal({
      title: res?.data?.message,
      okAlertFunc: async () => {},
    });
    cb();
  } catch (error) {
    setDisabled && setDisabled(false);
    toast.error(error?.response?.data?.message || "Something went wrong", {
      toastId: "CreatePaymentRequest",
    });
  }
};

export const PostLabourBillEntry_api = async (
  data,
  cb,
  IWarningModal,
  setDisabled
) => {
  setDisabled && setDisabled(true);
  try {
    const res = await Axios.post(`/wms/LabourBill/PostLabourBillEntry`, data);
    setDisabled && setDisabled(false);
    toast.success("Save successfully", {
      toastId: "CreatePaymentRequest",
    });
    // const res={data:{message:"test"}}
    IWarningModal({
      title: res?.data?.message,
      okAlertFunc: async () => {},
    });
    cb();
  } catch (error) {
    setDisabled && setDisabled(false);
    toast.error(error?.response?.data?.message || "Something went wrong", {
      toastId: "CreatePaymentRequest",
    });
  }
};

export const uploadAttachment = async (attachment, setDisabled) => {
  let formData = new FormData();
  attachment.forEach((file) => {
    formData.append("files", file);
  });
  try {
    setDisabled && setDisabled(true);
    let { data } = await Axios.post("/domain/Document/UploadFile", formData, {
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

export const uploadAtt = async (attachment, setDisabled) => {
  let formData = new FormData();
  attachment.forEach((file) => {
    formData.append("files", file);
  });
  return Axios.post("/domain/Document/UploadFile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getTransportBillById = async (
  accId,
  buId,
  billId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/wms/WmsReport/GetRentalCostByBillId?AccountId=${accId}&BusinessUnitId=${buId}&BillRegisterId=${billId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    toast.error(error.message);
    setter([]);
    setLoading(false);
  }
};
export const getG2GBillById = async (
  accId,
  buId,
  billId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/tms/LigterLoadUnload/GetCustomizeBillG2G?AccountId=${accId}&BusinessUnitId=${buId}&BillRegisterId=${billId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    toast.error(error.message);
    setter([]);
    setLoading(false);
  }
};

export const getG2GCarrierBillById = async (
  accId,
  buId,
  billId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/tms/LigterLoadUnload/GetCarrierBillByBillRegisterIdId?accountId=${accId}&buisinessUnitId=${buId}&billRegisterId=${billId}`
      // `/tms/LigterLoadUnload/GetCarrierBillG2G?AccountId=${accId}&BusinessUnitId=${buId}&BillRegisterId=${billId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    toast.error(error.message);
    setter([]);
    setLoading(false);
  }
};

export const getInternalTransportBillInfo_api = async (
  accId,
  buId,
  billId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/tms/InternalTransport/getInternalTransportBillInfo?Accountid=${accId}&Businessunitid=${buId}&VehicleSupplierId=0&Whid=0&FromDate=${_todayDate()}&ToDate=${_todayDate()}&Partid=3&Shipmencostid=0&BillRegisterid=${billId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    toast.error(error.message);
    setter([]);
    setLoading(false);
  }
};

export const GetFuelCostByBillId_api = async (
  accId,
  buId,
  billId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/tms/FuelCostInfo/GetFuelCostByBillId?AccountId=${accId}&BusinessUnitId=${buId}&BillRegisterId=${billId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    toast.error(error.message);
    setter([]);
    setLoading(false);
  }
};

export const GetUnloadLabourBillByBillId_api = async (
  accId,
  buId,
  billId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/tms/LabourBillInfo/GetUnloadLabourBillAmountByBillId?accountid=${accId}&businessunitid=${buId}&BillRegisterId=${billId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    toast.error(error.message);
    setter([]);
    setLoading(false);
  }
};

export const GetPendingFuelVehicleCost_api = async (
  accountid,
  businessunitid,
  VehicleSupplierId,
  warehouseId,
  fromDate,
  toDate,
  setter,
  setDisabled
) => {
  try {
    setDisabled(true);
    const res = await Axios.get(
      `/tms/FuelCostInfo/GetPendingFuelVehicleCost?accountid=${accountid}&businessunitid=${businessunitid}&FuelSupplierId=${VehicleSupplierId}&WarehouseId=${warehouseId}&FromDate=${fromDate}&ToDate=${toDate}`
    );
    setter(
      res?.data?.map((item) => ({
        ...item,
        label: item?.challanNo,
        value: item?.tripId,
        approvedAmount: item?.totalCost,
        checked: false,
      }))
    );
    setDisabled(false);
  } catch (error) {
    setDisabled(false);
    setter([]);
  }
};

export const GetPendingUnloadLabourBillAmount = async (
  accountid,
  businessunitid,
  VehicleSupplierId,
  shipPointId,
  fromDate,
  toDate,
  fromTime,
  toTime,
  setter,
  setDisabled
) => {
  const fromDateTime = moment(`${fromDate} ${fromTime}`).format(
    "YYYY-MM-DDTHH:mm:ss"
  );
  const toDateTime = moment(`${toDate} ${toTime}`).format(
    "YYYY-MM-DDTHH:mm:ss"
  );
  try {
    setDisabled(true);
    const res = await Axios.get(
      `/tms/LabourBillInfo/GetPendingUnloadLabourBillAmount?accountid=${accountid}&businessunitid=${businessunitid}&LabourSupplierId=${VehicleSupplierId}&ShipPointId=${shipPointId}&fromdate=${fromDateTime}&todate=${toDateTime}`
    );
    setDisabled(false);
    if (res?.data?.length === 0) toast.warning("Data not found");
    setter(
      res?.data?.map((item) => ({
        ...item,
        approvedAmount: item?.labourBillAmount || 0,
        checked: false,
      }))
    );
  } catch (error) {
    setDisabled(false);
    setter([]);
  }
};

export const getShippointDDL = async (userId, clientId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/domain/OrganizationalUnitUserPermission/GetOrganizationalUnitUserPermissionByUnitId?UserId=${userId}&ClientId=${clientId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      const newData = res?.data.map((data) => {
        return {
          label: data?.organizationUnitReffName,
          value: data?.organizationUnitReffId,
          address: data?.address,
        };
      });
      setter(newData);
    }
  } catch (error) {}
};
// expense for api
export const getExpenseFor = async (accId, BuId, setter) => {
  try {
    const res = await Axios.get(
      `/domain/EmployeeBasicInformation/GetEmployeeDDL?AccountId=${accId}&BusinessUnitId=${BuId}`
    );
    if (res.status === 200 && res?.data) {
      const ddlWithNameID = res?.data.map((item) => {
        return {
          label: `${item.label} (${item.value}) `,
          value: item.value,
        };
      });
      setter(ddlWithNameID);
    }
  } catch (error) {
    setter([]);
  }
};

export const GetApproveExpensesApi = async (
  accId,
  buId,
  plantId,
  sbuId,
  setter,
  setDisabled,
  type,
  fromDate,
  toDate,
  expenseForId,
  costCenterId
) => {
  setDisabled && setDisabled(true);
  try {
    const Fdate = fromDate ? `&fromDate=${fromDate}` : "";
    const Tdate = toDate ? `&toDate=${toDate}` : "";
    const expForId = expenseForId ? `&employeeId=${expenseForId}` : "";
    const url =
      type === 4
        ? `/fino/PaymentRequest/GetApproveExpenses?PlantId=${plantId}&AccountId=${accId}&BusinessUnitId=${buId}&SbuId=${sbuId}${Fdate}${Tdate}${expForId}&CostCenterId=${costCenterId ||
            0}`
        : `/fino/PaymentRequest/GetApproveExpensesForTaDa?PlantId=${plantId}&AccountId=${accId}&BusinessUnitId=${buId}&SbuId=${sbuId}${Fdate}${Tdate}${expForId}&CostCenterId=${costCenterId ||
            0}`;

    const res = await Axios.get(url);
    if (res.status === 200 && res?.data) {
      setDisabled && setDisabled(false);
      setter(
        res?.data?.map((itm) => {
          return {
            ...itm,
            itemCheck: false,
            netAmount: itm?.totalApprovedAmount || 0,
            adjustAmount: 0,
          };
        })
      );
    }
  } catch (error) {
    setDisabled && setDisabled(false);
    setter([]);
  }
};

export const getPONumberDDL = async (setter) => {
  try {
    const res = await axios.get(`/fino/Odoo/GetPOInfo?warehouseId=1`);
    if (res.status === 200) {
      const response = res?.data?.map((data) => {
        return {
          value: data?.purchaseOrderId,
          label: data?.purchaseOrderCode,
          ...data,
        };
      });
      setter(response);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const getPurchaseOrganizationDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/procurement/BUPurchaseOrganization/GetBUPurchaseOrganizationDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200) {
      setter(res?.data);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const saveFairPriceShopInvoice = async (
  data,
  cb,
  setgrnGridData,
  setDisabled,
  setFileObjects,
  modalView
) => {
  setDisabled(true);
  try {
    const res = await Axios.post(`/fino/Odoo/CreateFairPriceShopInvoice`, data);
    // if (res.status === 200) {
    if (res?.data?.statuscode === 200) {
      setFileObjects([]);
      setgrnGridData([]);
      modalView(res?.data?.code);
      toast.success(res.data?.message || "Submitted successfully");
      cb();
      setDisabled(false);
    } else {
      toast.error(res.data?.message || "Invoice Already Exists");
      setDisabled(false);
    }
    // }
  } catch (error) {
    toast.error(error?.res?.data?.message);
    setDisabled(false);
  }
};

export const getCostCenterDDL = async (accId, buId, sbuId, setter) => {
  try {
    const res = await axios.get(
      `/costmgmt/CostCenter/GetCostCenterDDL?AccountId=${accId}&BusinessUnitId=${buId}&SBUId=${sbuId}`
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const common_api_for_4_types_of_bill = (
  accId,
  buId,
  billId,
  billTypeId
) => {
  return `/tms/LigterLoadUnload/GetGTOGProgramInfoBybillRegisterId?accountId=${accId}&buisinessUnitId=${buId}&billRegisterId=${billId}&billTypeId=${billTypeId}`;
};

export const getTdsVdsAmount = async (
  accId,
  partnerId,
  poId,
  reqAmount,
  setter
) => {
  setter({});
  try {
    const res = await Axios.get(
      `/fino/Report/GetTdsVdsAmount?businessUnitId=${accId}&partnerId=${partnerId}&poId=${poId}&reqAmount=${reqAmount}`
    );
    setter(res?.data?.[0]);
  } catch (error) {}
};
