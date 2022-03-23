import axios from "axios";
import { getHeader } from "./auth.service";
import { API_URL } from "./const";
const API_CINEMA = API_URL + "/cinemas";

const header = getHeader();
export const getAllCinemas = () => {
  return axios.get(API_CINEMA + "/all", header);
};

export const getCinemas = (pagination) => {
  return axios.get(API_CINEMA, { ...header, params: pagination });
};

export const getCinemasNowShowing = (query) => {
  return axios.get(API_CINEMA + "/now-showing", { ...header, params: query });
};

export const getCinemaByValue = (value) => {
  return axios.get(API_CINEMA + `/${value}`, header);
};

export const createCinema = (cinema) => {
  return axios.post(API_CINEMA, cinema, header);
};
export const editCinema = (id, cinema) => {
  return axios.put(API_CINEMA + `/${id}`, cinema, header);
};

export const deleteCinema = (id) => {
  return axios.delete(API_CINEMA + `/${id}`, header);
};
