import Axios from "axios";
import { downloadFile } from "../../../_helper/downloadFile";
import { createFile } from "../../../_helper/excel";
import { _dateFormatter } from "../../../_helper/_dateFormate";

export const getPurchaseOrgList = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/procurement/BUPurchaseOrganization/GetBUPurchaseOrganizationDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) { }
};

export const getissuerList = async (buId, orId, setter) => {
  try {
    const res = await Axios.get(
      `/procurement/PurchaseOrder/GetPoIssuer?BusinessUnitId=${buId}&OrganizationId=${orId}`
    );
    setter(res?.data);
  } catch (error) { }
};

export const getsupplierList = async (userId, accId, buId, plantId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&OrgUnitTypeId=8`
    );
    setter(res?.data);
  } catch (error) { }
};
export const getPlantList = async (userId, accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`
    );
    setter(res?.data);
  } catch (error) { }
};
export const getWarehouseList = async (
  userId,
  accId,
  buId,
  plantId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&OrgUnitTypeId=8`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};
export const getProcureToPayReport = async (
  businessUnitId,
  fromDate,
  toDate,
  purchaseOrganizationId,
  plantId,
  warehouseId,
  search,
  pageNo,
  pageSize,
  setLoading,
  setter,
  cb
) => {
  setter([])
  setLoading(true);
  try {
    let api = `/procurement/Report/GetProcureToPayReport?fromDate=${_dateFormatter(
      fromDate
    )}&toDate=${_dateFormatter(
      toDate
    )}&businessUnitId=${businessUnitId}&purchaseOrganizationId=${purchaseOrganizationId}`;
    if (plantId) {
      api += `&plantId=${plantId}`;
    }
    if (warehouseId) {
      api += `&warehouseId=${warehouseId}`;
    }
    if (search) {
      api += `&searchText=${search}`;
    }
    api += `&pageNo=${pageNo}&pageSize=${pageSize}`;
    const res = await Axios.get(api);
    setLoading(false);
    setter(res?.data);
    cb && cb(res?.data)
  } catch (error) {
    setLoading(false);
  }
};
export const getProcureToPayExcelReport = async (
  businessUnitId,
  fromDate,
  toDate,
  purchaseOrganizationId,
  plantId,
  warehouseId,
  search,
  pageNo,
  pageSize,
  setLoading,
  setter
) => {
  setter([])
  setLoading(true);
  try {
    let api = `/procurement/Report/GetProcureToPayReport?fromDate=${_dateFormatter(
      fromDate
    )}&toDate=${_dateFormatter(
      toDate
    )}&businessUnitId=${businessUnitId}&purchaseOrganizationId=${purchaseOrganizationId}`;
    if (plantId) {
      api += `&plantId=${plantId}`;
    }
    if (warehouseId) {
      api += `&warehouseId=${warehouseId}`;
    }
    if (search) {
      api += `&searchText=${search}`;
    }
    api += `&pageNo=${pageNo}&pageSize=${pageSize}`;
    const res = await Axios.get(api);
    setLoading(false);
    setter(res?.data);
  } catch (error) {
    setLoading(false);
  }
};

export const getProcureToPayReportXMLDownload = (
  businessUnitId,
  fromDate,
  toDate,
  purchaseOrganizationId,
  plantId,
  warehouseId,
  pageNo,
  pageSize,
  setLoading
) => {
  try {
    let api = `/procurement/Report/GetProcureToPayReportXMLDownload?fromDate=${_dateFormatter(
      fromDate
    )}&toDate=${_dateFormatter(
      toDate
    )}&businessUnitId=${businessUnitId}&purchaseOrganizationId=${purchaseOrganizationId}`;
    if (plantId) {
      api += `&plantId=${plantId}`;
    }
    if (warehouseId) {
      api += `&warehouseId=${warehouseId}`;
    }
    api += `&pageNo=${pageNo}&pageSize=${pageSize}`;
    downloadFile(api, "Procure To Pay", "xlsx", setLoading);
  } catch (error) {
    setLoading(false);
  }
};

export const getSBUList = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${buId}&Status=true`
    );
    setter(res?.data);
  } catch (error) { }
};

class Cell {
  constructor(label, align, format) {
    this.text = label;
    this.alignment = `${align}:middle`;
    this.format = format
  }
  getCell() {
    return {
      text: this.text,
      fontSize: 7,
      border: "all 000000 thin",
      alignment: this.alignment || "",
      textFormat: this.format
    }
  }
}
const getTableData = (row) => {
  const data = row?.map((item, index) => {
    return [
      new Cell(index + 1, "center", "text").getCell(),
      new Cell(item?.strWarehouseName, "left", "text").getCell(),
      new Cell(item?.strPurchaseRequestCode, "left", "text").getCell(),
      new Cell(item?.dtePRDate, "center", "date").getCell(),
      new Cell(item?.dteApproveDatetime, "center", "date").getCell(),
      new Cell(item?.dteDueDate, "center", "date").getCell(),
      new Cell(item?.strPurchaseOrderNo, "left", "text").getCell(),
      new Cell(item?.strPaymentTermsName, "left", "text").getCell(),
      new Cell(item?.dtePurchaseOrderDate, "center", "date").getCell(),
      new Cell(item?.numTotalPOAmount, "right", "money").getCell(),
      new Cell(item?.strInventoryTransactionCode, "left", "text").getCell(),
      new Cell(item?.dteMrrDate, "center", "date").getCell(),
      new Cell(item?.numInvAmount, "right", "money").getCell(),
      new Cell(item?.dtePaymentRequestDate, "center", "date").getCell(),
      new Cell(item?.strBusinessPartnerName, "left", "text").getCell(),
      new Cell(item?.poPreparedBy, "left", "text").getCell(),
      new Cell(item?.strBillRegisterCode, "left", "text").getCell(),
      new Cell(item?.strJournalCode, "left", "text").getCell(),
      new Cell(item?.strbillType, "left", "text").getCell(),
      new Cell(item?.numBillAmount, "right", "money").getCell(),
      new Cell(item?.payDate, "center", "date").getCell(),
      new Cell(item?.monReqestAmount, "right", "money").getCell(),
      new Cell(item?.dteBillRegisterDate, "center", "date").getCell(),
      new Cell(item?.dteBillRegisterApprovedDate, "center", "date").getCell(),
      new Cell(item?.monTotalAdjustment, "right", "money").getCell(),
      new Cell(item?.monTotalAdvance, "right", "money").getCell(),
    ];
  });
  return data
};

export const generateExcel = (header, row, setLoading) => {
  setLoading(true)
  const excel = {
    name: "Procure To Pay",
    sheets: [
      {
        name: "Procure To Pay",
        gridLine: false,
        rows: [header, ...getTableData(row)],
      },
    ],
  };
  createFile(excel);
  setLoading(false)
};
