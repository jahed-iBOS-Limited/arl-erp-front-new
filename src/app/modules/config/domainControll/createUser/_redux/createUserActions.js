import * as requestFromServer from './createUserApi'
import { usersSlice, callTypes } from './createUserSlice'

const { actions } = usersSlice

export const fetchUsers = (id) => (dispatch) => {
  if (!id) {
    return dispatch(actions.productFetched({ productForEdit: undefined }))
  }

  dispatch(actions.startCall({ callType: callTypes.action }))

  return requestFromServer
    .getUserListByAccountId(id)
    .then((response) => {
      const user = response.data.data
      const totalc = response.data.totalCount
      // console.log(user);
      // console.log(response.data)
      dispatch(actions.userFetched({ entities: user, total: totalc }))
    })
    .catch((error) => {
      error.clientMessage = "Can't find users"
      dispatch(actions.catchError({ error, callType: callTypes.action }))
    })
}
export const UserPageData = (id, setLoading, pageNo, pageSize, searchV) => (
  dispatch
) => {
  setLoading(true)
  dispatch(actions.startCall({ callType: callTypes.action }))
  //console.log(qryparms.pageNumber,qryparms.pageSize);
  return requestFromServer
    .getUserListByAccountId(id, pageNo, pageSize, searchV)
    .then((response) => {
      const user = response.data.data
      const totalc = response.data.totalCount
      dispatch(actions.userFetched({ entities: user, total: totalc }))
      setLoading(false)
    })
    .catch((error) => {
      error.clientMessage = "Can't find users"
      dispatch(actions.catchError({ error, callType: callTypes.action }))
      setLoading(false)
    })
}

//UserInfoByUserId
export const UserInfoByUserId = (id, v, accId, buId) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }))
  return requestFromServer
    .getUserInfoById(id)
    .then((response) => {
      dispatch(actions.userInfoByIdFetched({ userforedit: {} }))
      var userslist = {}
      if (v) {
        dispatch(actions.CountryFetched({ countrylist: [] }))
        dispatch(actions.UserTypeFetched({ usertype: [] }))
        dispatch(actions.UserReferenceFetched({ referencelist: [] }))

        let user = response.data.map((usr) => {
          console.log(response.data, id)

          return {
            businessunit: {
              label: usr.businessUnitName,
              value: usr.defaultBusinessUnit,
            },
            //businessunitid: usr.defaultBusinessUnit,
            name: usr.userName,
            email: usr.emailAddress,
            country: {
              label: usr.countryName,
              value: usr.countryId,
            },
            contactnumber: usr.contact,
            type: {
              label: usr.userTypeName,
              value: usr.userTypeId,
            },

            reference: {
              label: usr.userReferenceNo,
              value: usr.userReferenceId,
            },
          }
        })
        console.log('actins', user)

        dispatch(actions.userInfoByIdFetched({ userforedit: user }))
      }
      {
        const user = response.data.map((usr) => {
          if (usr.userTypeId === 'Employee') {
            requestFromServer
              .getEmployeeByAccountId(accId, buId)
              .then((response) => {
                //console.log(response.data);
                dispatch(
                  actions.UserReferenceFetched({ referencelist: response.data })
                )
              })
              .catch((error) => {
                error.clientMessage = "Can't get User Type List"
                dispatch(
                  actions.catchError({ error, callType: callTypes.action })
                )
              })
          } else if (usr.userTypeId === 'Customer') {
            requestFromServer
              .getCustomerByAccountId(1, 1)
              .then((response) => {
                dispatch(
                  actions.UserReferenceFetched({ referencelist: response.data })
                )
              })
              .catch((error) => {
                error.clientMessage = "Can't get User Type List"
                dispatch(
                  actions.catchError({ error, callType: callTypes.action })
                )
              })
            //dispatch(actions.CustomerList(1,1));
          } else if (usr.userTypeId === 'Supplier') {
            requestFromServer
              .getSupplierByAccountId(1, 1)
              .then((response) => {
                dispatch(
                  actions.UserReferenceFetched({ referencelist: response.data })
                )
              })
              .catch((error) => {
                error.clientMessage = "Can't get User Type List"
                dispatch(
                  actions.catchError({ error, callType: callTypes.action })
                )
              })
          } else if (usr.userTypeId === 'Others') {
            let data = [
              {
                id: 1,
                name: 'Others',
              },
            ]
            dispatch(actions.UserReferenceFetched({ referencelist: data }))
          }
          userslist = {
            businessunit: {
              label: usr.businessUnitName,
              value: usr.defaultBusinessUnit,
            },
            //businessunitid: usr.defaultBusinessUnit,
            name: usr.userName,
            email: usr.emailAddress,
            country: {
              label: usr.countryName,
              value: usr.countryId,
            },
            contactnumber: usr.contact,
            type: {
              label: usr.userTypeName,
              value: usr.userTypeId,
            },

            reference: {
              label: usr.userReferenceNo,
              value: usr.userReferenceId,
            },
          }
          // return {
          //     businessunit:usr.businessUnitName,
          //     businessunitid: usr.defaultBusinessUnit,
          //     name:  usr.userName,
          //     email:  usr.emailAddress,
          //     country: usr.countryName ,
          //     countryid: usr.countryId ,
          //     contactnumber:  usr.contact ,
          //     type: usr.userTypeName,
          //     typeid:usr.userTypeId,
          //     reference: usr.userReferenceNo,
          //     referenceid: usr.userReferenceId
          //     }
          return userslist
        })

        dispatch(actions.userInfoByIdFetched({ userforedit: user }))
      }
    })
    .catch((error) => {
      error.clientMessage = "Can't find users"
      console.log(error)
      dispatch(actions.catchError({ error, callType: callTypes.action }))
    })
}

export const UnitList = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }))
  return requestFromServer
    .getUnitListByAccountId(id)
    .then((response) => {
      dispatch(actions.UnitListFetched({ unitList: response.data }))
    })
    .catch((error) => {
      error.clientMessage = "Can't get Unit List"
      dispatch(actions.catchError({ error, callType: callTypes.action }))
    })
}
export const CountryList = () => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }))
  return requestFromServer
    .getCountryList()
    .then((response) => {
      dispatch(actions.CountryFetched({ countrylist: response.data }))
    })
    .catch((error) => {
      error.clientMessage = "Can't get Language List"
      dispatch(actions.catchError({ error, callType: callTypes.action }))
    })
}

export const UserTypeList = () => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }))
  return requestFromServer
    .getUserTypeList()
    .then((response) => {
      dispatch(actions.UserTypeFetched({ usertype: response.data }))
    })
    .catch((error) => {
      error.clientMessage = "Can't get User Type List"
      dispatch(actions.catchError({ error, callType: callTypes.action }))
    })
}

export const SupplierList = (accountid, unitid) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }))
  return requestFromServer
    .getSupplierByAccountId(accountid, unitid)
    .then((response) => {
      dispatch(actions.UserReferenceFetched({ referencelist: response.data }))
    })
    .catch((error) => {
      error.clientMessage = "Can't get User Type List"
      dispatch(actions.catchError({ error, callType: callTypes.action }))
    })
}
export const CustomerList = (accountid, unitid) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }))
  return requestFromServer
    .getCustomerByAccountId(accountid, unitid)
    .then((response) => {
      dispatch(actions.UserReferenceFetched({ referencelist: response.data }))
    })
    .catch((error) => {
      error.clientMessage = "Can't get User Type List"
      dispatch(actions.catchError({ error, callType: callTypes.action }))
    })
}
export const EmployeeList = (accountid, unitid) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }))
  return requestFromServer
    .getEmployeeByAccountId(accountid, unitid)
    .then((response) => {
      //console.log(response.data);
      dispatch(actions.UserReferenceFetched({ referencelist: response.data }))
    })
    .catch((error) => {
      error.clientMessage = "Can't get User Type List"
      dispatch(actions.catchError({ error, callType: callTypes.action }))
    })
}

export const OthersList = () => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }))
  var data = [
    {
      id: 1,
      name: 'Others',
    },
  ]
  dispatch(actions.UserReferenceFetched({ referencelist: data }))
}

export const UserEdit = (userdata) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }))
  return requestFromServer
    .putCreateUser(userdata)
    .then((response) => {
      //console.log(response.data.message)
      dispatch(actions.UserCreated({ usermsg: response }))
    })
    .catch((error) => {
      // console.log(error)
      // console.log(error.response.data.message)
      //error.clientMessage = error?.response?.data?.message

      dispatch(actions.catchError({ error, callType: callTypes.action }))
    })
}

export const resetController = () => (dispatch) => {
  dispatch(actions.resetControllerFetched())
}

export const UserCreate = (userdata) => async (dispatch) => {
  userdata.setLoading(true)
  dispatch(actions.startCall({ callType: callTypes.action }))
  try {
    const response = await requestFromServer.postCreateUser(userdata)
    console.log(response)
    // console.log(response.data.message)
    dispatch(
      actions.UserCreated({
        msg: response.data.message,
        statuscode: response.data.statuscode,
      })
    )
    userdata.setLoading(false)
  } catch (error) {
    const msg = error.response.data.message
    dispatch(actions.catchError({ msg, callType: callTypes.action }))
    userdata.setLoading(false)
  }
}
