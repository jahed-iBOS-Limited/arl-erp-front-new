import axios from 'axios'

export const User_URL = '/domain/CreateUser/GetUserInformationSearch'
export const Unit_URL = '/domain/BusinessUnitDomain/GetBusinessunitInfo'
export const Country_URL = '/domain/CreateSignUp/GetCountryList'
export const UserType_URL = '/domain/CreateUser/GetUserTypeList'
export const UserCreate_URL = '/domain/CreateUser/CreateUserinfo'
export const Supplier_URL = '/domain/CreateUser/GetSupplierReferenceNumberList'
export const Customer_URL = '/domain/CreateUser/GetCustomerReferenceNumberList'
export const Employee_URL = '/domain/CreateUser/GetEmployeeReferenceNumberList'
export const UserInfoById_URL = '/domain/CreateUser/GetUserInformationByUserId'
export const UserEdit_Url = '/domain/CreateUser/EditUserInformation'

//Update

export function putCreateUser(userdata) {
  console.log(userdata)
  return axios
    .put(UserEdit_Url, userdata)
    .then(function(response) {
      console.log(response)
    })
    .catch(function(error) {
      console.log(error)
    })
}

// CREATE =>  POST: add a new product to the server
export const postCreateUser = async (payload) => {
  console.log('payload', payload)
  const res = await axios.post(UserCreate_URL, payload.userdata)

  return new Promise(function(resolve, reject) {
    if (res.status === 200) {
      resolve(res)
      payload.cb()
    } else {
      reject(res)
    }
  })
}

//   .then(function (response) {
//       return response.data.message;

//   })
//   .catch( (error) =>{
//      return error.response.data.message;
//   });;

//read User

export function getUserInfoById(id) {
  return axios.get(UserInfoById_URL, {
    params: {
      UserId: id,
    },
  })
}

// READ
export function getUserListByAccountId(id, pageNo, pageSize, searchV) {
  return axios.get(User_URL, {
    params: {
      searchTerm: searchV ? searchV : '',
      AccountId: id,
      Status: true,
      viewOrder: 'desc',
      PageNo: pageNo,
      PageSize: pageSize,
    },
  })
}
export function getUnitListByAccountId(id) {
  return axios.get(Unit_URL, {
    params: {
      AccountId: id,
      Status: true,
    },
  })
}
export function getSupplierByAccountId(accountid, unitid) {
  return axios.get(Supplier_URL, {
    params: {
      AccountId: accountid,
      BusinessUnitId: unitid,
    },
  })
}
export function getCustomerByAccountId(accountid, unitid) {
  return axios.get(Customer_URL, {
    params: {
      AccountId: accountid,
      BusinessUnitId: unitid,
    },
  })
}
export function getEmployeeByAccountId(accountid, unitid) {
  return axios.get(Employee_URL, {
    params: {
      AccountId: accountid,
      BusinessUnitId: unitid,
    },
  })
}

export function getCountryList() {
  return axios.get(Country_URL)
}

export function getUserTypeList() {
  return axios.get(UserType_URL)
}

export function getUserById(productId) {
  return axios.get(`${User_URL}/${productId}`)
}

// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
// items => filtered/sorted result
export function findUser(queryParams) {
  return axios.post(`${User_URL}/find`, { queryParams })
}

// UPDATE => PUT: update the procuct on the server
export function updateUser(product) {
  return axios.put(`${User_URL}/${product.id}`, { product })
}

// UPDATE Status
export function updateStatusForUsers(ids, status) {
  return axios.post(`${User_URL}/updateStatusForProducts`, {
    ids,
    status,
  })
}

// DELETE => delete the product from the server
export function deleteUser(productId) {
  return axios.delete(`${User_URL}/${productId}`)
}

// DELETE Products by ids
export function deleteUsers(ids) {
  return axios.post(`${User_URL}/deleteProducts`, { ids })
}
