import axios from "axios";

//Call Empddl APi
export function getEmpDDL(accId, buId) {
  return axios.get(
    `/domain/EmployeeBasicInformation/GetEmployeeDDL?AccountId=${accId}&BusinessUnitId=${buId}`
  );
}

//Call ordertype ddl APi
export function getOrderTypeListDDL(accId, buId) {
  return axios.get(`/procurement/PurchaseOrder/GetOrderTypeListDDL`);
}

//Call payment terms list ddl APi
export function getPaymentTermsListDDL() {
  return axios.get(`/procurement/PurchaseOrder/GetPaymentTermsListDDL`);
}

//Call incoterms list ddl APi
export function getIncotermListDDL() {
  return axios.get(`/procurement/PurchaseOrder/GetIncotermListDDL`);
}

//Call po reference ddl APi
export function getPOReferenceTypeDDL(orderTypeId) {
  return axios.get(
    `/procurement/PurchaseOrder/getPOReferenceType?OrderTypeId=${orderTypeId}`
  );
}

//Call GetPOReferenceNoDDL  APi
export function getPOReferenceNoDDL(RefTypeId) {
  return axios.get(
    `/procurement/PurchaseOrder/GetPOReferenceNoDDL?RefTypeId=${RefTypeId}`
  );
}

//Call getPOItemDDL  APi
export function getPOItemDDL(refId, refNo) {
  console.log("Calling");
  return axios.get(
    `/procurement/PurchaseOrder/GetPOReferenceNoWiseItemDDL?RefTypeId=${refId}&RefNoId=${refNo}`
  );
}

// Save created data
export function saveCreateData(data, typeId) {
  return axios.post(
    `/oms/BillPosting/SaveBillPosting?ProcessType=${typeId}`,
    data
  );
}

// Save Edit data
export function saveEditData(data) {
  return axios.put(`/costmgmt/ControllingUnit/EditControllingUnit`, data);
}

//Call get grid data api
export function getGridData(
  accId,
  buId,
  sbuId,
  Billtypeid,
  fromDate,
  toDate,
  search,
  // customerId,
  pageNo,
  pageSize
) {
  const searchPath = search ? `search=${search}&` : "";
  return axios.get(
    `/oms/Invoiceing/GetDeliverHeaderNotBillPostedInDateRage?${searchPath}AccountId=${accId}&BusinessUnitId=${buId}&BAId=${sbuId}&Billtypeid=${Billtypeid}&FromDeliveryDte=${fromDate}&ToDeliveryDte=${toDate}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
  );
}

//Call single data api
export function getDataById(id) {
  return axios.get(
    `/costmgmt/ControllingUnit/GetControllingUnitByControllId?ControllingUnitId=${id}`
  );
}
