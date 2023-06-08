import axios from "axios";

export const LOGIN_URL = "/domain/LogIn/GetLoginCheck";
export const REGISTER_URL = "api/auth/register";
export const REQUEST_PASSWORD_URL = "api/auth/forgot-password";

export const ME_URL = "api/me";

export function login({ email, password }) {
  // console.log(email, password)
  return axios.get(`${LOGIN_URL}?Email=${email}&Password=${password}`);
}

export function register(email, fullname, username, password) {
  return axios.post(REGISTER_URL, { email, fullname, username, password });
}

export function requestPassword(email) {
  return axios.post(REQUEST_PASSWORD_URL, { email });
}

export function getUserByToken(payload) {
  // Authorization head should be fulfilled in interceptor.
  return { payload }
}
