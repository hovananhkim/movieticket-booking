import axios from "axios";
import { getHeader } from "./auth.service";
import { API_URL } from "./const";
const API_SEAT = API_URL + "/seats";
const header = getHeader();
export const getAllSeatsByRoom = (id) => {
  return axios.get(API_SEAT + `?roomId=${id}`, header);
};

export const createSeats = (seatsCreate) => {
  return axios.post(API_SEAT, seatsCreate, header);
};

export const deleteSeats = (seatsDelete) => {
  return axios.delete(API_SEAT, { ...header, data: seatsDelete });
};
