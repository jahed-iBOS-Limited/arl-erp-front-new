import axios from "axios";

export const Employee_URL = "/domain/EmployeeBasicInformation/GetEmployeeInformation";
export const Unit_URL="/domain/BusinessUnitDomain/GetBusinessunitInfo"
export const OrgName_URL="/domain/RoleExtension/GetOrganizationList"
export const OrgType_URL="/domain/RoleExtension/GetOrganizationList?OrganizationTypeId=1&AccountId=1&BussinessUnitId=1"
//?AccountId=1&Status=true

// CREATE =>  POST: add a new product to the server
export function roleExtension(product) {
  return axios.post(Employee_URL, { product });
}

// READ
export function GetEmployeeInformation(id) {
   
    return axios.get(Employee_URL,{
        params: {
            AccountId: id,
            Status: true
        }
      });
}
export function getUnitListByAccountId(id) {
   
    return axios.get(Unit_URL,{
        params: {
            AccountId: id,
            Status: true
        }
      });
}
export function GetOrganizationList(typeid,accid,unitid) {
   
    return axios.get(OrgName_URL,{
        params: {
            OrganizationTypeId: typeid,
            AccountId: accid,
            BussinessUnitId:unitid
        }
      });
}
export function GetOrganizationTypeList() {
   
    return axios.get(OrgType_URL);
}


export function getUserById(productId) {
  return axios.get(`${Employee_URL}/${productId}`);
}

// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
// items => filtered/sorted result
export function findUser(queryParams) {
  return axios.post(`${Employee_URL}/find`, { queryParams });
}

// UPDATE => PUT: update the procuct on the server
export function updateUser(product) {
  return axios.put(`${Employee_URL}/${product.id}`, { product });
}

// UPDATE Status
export function updateStatusForUsers(ids, status) {
  return axios.post(`${Employee_URL}/updateStatusForProducts`, {
    ids,
    status
  });
}

// DELETE => delete the product from the server
export function deleteUser(productId) {
  return axios.delete(`${Employee_URL}/${productId}`);
}

// DELETE Products by ids
export function deleteUsers(ids) {
  return axios.post(`${Employee_URL}/deleteProducts`, { ids });
}
