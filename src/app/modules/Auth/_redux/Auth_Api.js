import axios from "axios";

//Call Login APi
// export function loginApiCall(email, password) {
//   return axios.get(
//     `/domain/LogIn/GetLoginCheck?Email=${email}&Password=${password}`
//   );
// }

export function passwordExpiredAndForceLogout(email) {
  return axios.get(
    `/domain/Information/Basic?Email=${email}`
  );
}

export function loginApiCall(email, password) {
  return axios.post(`/identity/TokenGenerate/IbosLogin`, {
    userName: email,
    password: password,
  });
}

//Get user Profile Data
export function profileAPiCall(email) {
  return axios.get(
    `/domain/CreateUser/GetUserInformationByUserEmail?Email=${email}`
  );
}

export function getUserRole(userId) {
  return axios.get(
    `/domain/DCOGetUserPermission/GetUserPermission?intUserId=${userId}`
  );
}

//Call get user permission APi
export function getBuPermission(userId, accountId) {
  return axios.get(
    `/domain/OrganizationalUnitUserPermission/GetBusinessUnitPermissionbyUser?UserId=${userId}&ClientId=${accountId}`
  );
}

//Call menu data api
export function getMenu(userId) {
  return axios.get(
    `/domain/MenuInformation/GetMenuListPermissionWise?UserId=${userId}`
  );
}

export function saveChatInfo(email, name, accountId, userId) {
  return axios.post(
    `${process.env.REACT_APP_CHAT_BACKEND_URL}/chatapi/user/create`,
    {
      email,
      name,
      accountId,
      userId,
    }
  );
}
