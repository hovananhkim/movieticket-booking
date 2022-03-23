import axios from "axios";
import { getHeader } from "./auth.service";
import { API_URL } from "./const";
const API_USER = API_URL + "/users";
const header = getHeader();

export const getUsers = (pagination) => {
  return axios.get(API_USER, { ...header, params: pagination });
};

export const updateProfile = (user) => {
  return axios.put(API_USER + "/update", user, header);
};

export const changePassword = (user) => {
  return axios.put(API_USER + "/change-password", user, header);
};

export const forgetPasswordService = (user) => {
  return axios.post(API_USER + "/forget-password", user);
};

export const resetPasswordService = (user) => {
  return axios.post(API_USER + "/reset-password", user);
};
