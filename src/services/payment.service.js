import axios from "axios";
import { getAccessToken, getHeader } from "./auth.service";
import { API_URL } from "./const";
const API_PAYMENT = API_URL + "/payments";
const header = getHeader();

export const payment = (orderId, payerId, price) => {
  const ticket = JSON.parse(getTicket());
  return axios.post(
    API_PAYMENT,
    { ...ticket, orderId, payerId, price },
    header
  );
};

export const getPayments = (query) => {
  return axios.get(API_PAYMENT, { ...header, params: query });
};

export const getPaymentsByUser = (query) => {
  return axios.get(API_PAYMENT + "/user", { ...header, params: query });
};

export const setTicket = (ticket) => {
  localStorage.setItem("ticket", ticket);
};

export const getTicket = (ticket) => {
  return localStorage.getItem("ticket", ticket);
};

export const removeTicket = (ticket) => {
  localStorage.removeItem("ticket", ticket);
};
