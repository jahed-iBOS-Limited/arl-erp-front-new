import axios from "axios";

//Call Empddl APi
export function getEmpDDL(accId, buId) {
  return axios.get(
    `/domain/EmployeeBasicInformation/GetEmployeeDDL?AccountId=${accId}&BusinessUnitId=${buId}`
  );
}

//Call sold to party APi
export function getSoldToPartyDDL(accId, buId) {
  return axios.get(
    `/partner/BusinessPartnerBasicInfo/GetSoldToPartyForBPartSalesDDL?accountId=${accId}&businessUnitId=${buId}`
  );
}

// Save created data
export function saveCreateData(data) {
  return axios.post(`/costmgmt/ControllingUnit/CreateControllingUnit`, data);
}

// Save Edit data
export function saveEditData(data) {
  return axios.put(`/costmgmt/ControllingUnit/EditControllingUnit`, data);
}

//Call get grid data api
export function getGridData(accId, buId) {
  return axios.get(
    `/costmgmt/ControllingUnit/GetControllingUnitInformationPasignation?accountId=${accId}&businessUnitId=${buId}&Status=true&PageNo=1&PageSize=1000&viewOrder=desc`
  );
}

//Call get grid data api
export function getPartnerLedgerGridData(
  accId,
  buId,
  partnerId,
  fromDate,
  toDate
) {
  return axios.get(
    // `/oms/SalesOrder/GetBusinessPartnerLedger?AccountId=${accId}&BusinessUnitId=${buId}&BPartnerId=${partnerId}&TransDateFrom=${fromDate}&TransDateTo=${toDate}`
    `/oms/SalesOrder/GetBusinessPartnerLedger?AccountId=${accId}&BusinessUnitId=${buId}&BPartnerId=${partnerId}&TransDateFrom=${fromDate}&TransDateTo=${toDate}&PageNo=1&PageSize=1000&viewOrder=desc`
  );
}

export function getBusinessPartnerDetailsById(accId, buId, partnerId) {
  return axios.get(
    `/partner/BusinessPartnerBasicInfo/GetBusinessPartnerDetailsByID?accountId=${accId}&businessUnitId=${buId}&partnerId=${partnerId}`
  );
}

//Call single data api
export function getDataById(id) {
  return axios.get(
    `/costmgmt/ControllingUnit/GetControllingUnitByControllId?ControllingUnitId=${id}`
  );
}
export function getSbuDDL(accId, buId) {
  return axios.get(
    `/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${buId}&Status=true`
  );
}
