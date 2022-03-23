import axios from "axios";
import { API_URL } from "./const";
const API_AUTH = API_URL + "/auth";

export const login = (userLogin) => {
  return axios.post(API_AUTH + "/login", userLogin);
};

export const register = (userRegister) => {
  return axios.post(API_AUTH + "/register", userRegister);
};

export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

export const getHeader = () => {
  const accessToken = getAccessToken() || null;
  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
};

export const logout = () => {
  return localStorage.removeItem("accessToken");
};

export const getMe = () => {
  const accessToken = getAccessToken() || null;
  return axios.get(API_AUTH + "/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
