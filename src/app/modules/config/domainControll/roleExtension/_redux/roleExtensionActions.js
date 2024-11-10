import * as requestFromServer from "./roleExtensionApi";
import {roleextantionsSlice, callTypes} from "./roleExtensionSlice";

const {actions} = roleextantionsSlice;

// export const fetchUsers = queryParams => dispatch => {
//   dispatch(actions.startCall({ callType: callTypes.list }));
//   return requestFromServer
//     .fetchProducts(queryParams)
//     .then(response => {
//       const { totalCount, entities } = response.data;
//       dispatch(actions.productsFetched({ totalCount, entities }));
//     })
//     .catch(error => {
//       error.clientMessage = "Can't find products";
//       dispatch(actions.catchError({ error, callType: callTypes.list }));
//     });
// };

export const fetchUsers = id => dispatch => {
  if (!id) {
    return dispatch(actions.productFetched({ productForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));

  return requestFromServer
    .getUnitListByAccountId(1)
    .then(response => {
      const roleextantion = response.data;
      
      dispatch(actions.userFetched({ entities: roleextantion }));
    })
    .catch(error => {
      error.clientMessage = "Can't find Organization Type";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const UnitList = id => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getUnitListByAccountId(id)
    .then(response => {
        console.log(response.data)
      dispatch(actions.UnitListFetched({ unitList:response.data }));
    })
    .catch(error => {
      error.clientMessage = "Can't get Unit List";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
export const OrganizationList = (typeid,accid,unitid) => dispatch => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
      .GetOrganizationList(2,1,1)
      .then(response => {
        console.log(response.data)
        dispatch(actions.orgnameFetched({ orgnamelist:response.data }));
      })
      .catch(error => {
        error.clientMessage = "Can't get orgname List";
        dispatch(actions.catchError({ error, callType: callTypes.action }));
      });
  };
  export const OrganizationTypeList = () => dispatch => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
      .GetOrganizationTypeList()
      .then(response => {
        dispatch(actions.orgtypeFetched({ orgtypelist:response.data }));
      })
      .catch(error => {
        error.clientMessage = "Can't get orgname List";
        dispatch(actions.catchError({ error, callType: callTypes.action }));
      });
  };
  export const EmployeeList = (id) => dispatch => {
    dispatch(actions.startCall({ callType: callTypes.action }));
    return requestFromServer
      .GetEmployeeInformation(id)
      .then(response => {
        
        dispatch(actions.employeeFetched({ employeeList:response.data }));
      })
      .catch(error => {
        error.clientMessage = "Can't get Employee List";
        dispatch(actions.catchError({ error, callType: callTypes.action }));
      });
  };
  