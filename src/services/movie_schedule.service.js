import axios from "axios";
import { getHeader } from "./auth.service";
import { API_URL } from "./const";
const API_MOVIE_SCHEDULE = API_URL + "/movie-schedules";

const header = getHeader();
export const getMovieSchedules = (query) => {
  return axios.get(API_MOVIE_SCHEDULE, { ...header, params: query });
};

export const getMovieSchedule = (id) => {
  return axios.get(API_MOVIE_SCHEDULE + `/${id}`, header);
};

export const getShowTimes = (query) => {
  return axios.get(API_MOVIE_SCHEDULE + "/show-times", { params: query });
};

export const createMovieSchedule = (movieSchedule) => {
  return axios.post(API_MOVIE_SCHEDULE, movieSchedule, header);
};

export const closeMovieSchedule = (id) => {
  return axios.post(API_MOVIE_SCHEDULE + `/${id}/close`, {}, header);
};

export const openMovieSchedule = (id) => {
  return axios.post(API_MOVIE_SCHEDULE + `/${id}/open`, {}, header);
};
