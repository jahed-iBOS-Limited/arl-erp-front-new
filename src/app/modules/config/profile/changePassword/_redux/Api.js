import axios from "axios";

// Save PasswordUpdate data
export function savePasswordUpdate(loginId, oldPassword, newPassword) {
  return axios.put(`/domain/Information/Basic`, {
    userId: loginId,
    oldPassword: oldPassword,
    newPassword: newPassword,
  });
}
