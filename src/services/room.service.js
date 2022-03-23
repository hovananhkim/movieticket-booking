import axios from "axios";
import { getHeader } from "./auth.service";
import { API_URL } from "./const";
const API_ROOM = API_URL + "/rooms";
const header = getHeader();
export const getAllRooms = () => {
  return axios.get(API_ROOM + "/all");
};

export const getRoomsByCinema = (cinemaId, pagination) => {
  return axios.get(API_ROOM, {
    ...header,
    params: { ...pagination, cinemaId },
  });
};

export const getAllRoomsByCinema = (cinemaId) => {
  return axios.get(API_ROOM + `/all?cinemaId=${cinemaId}`, header);
};

export const getRoomByValue = (value) => {
  return axios.get(API_ROOM + `/${value}`, header);
};

export const createRoom = (room) => {
  return axios.post(API_ROOM, room, header);
};

export const editRoom = (id, room) => {
  return axios.put(API_ROOM + `/${id}`, room, header);
};

export const deleteRoom = (id) => {
  return axios.delete(API_ROOM + `/${id}`, header);
};
