import axios from "axios";
import { getHeader } from "./auth.service";
import { API_URL } from "./const";
const API_MOVIE = API_URL + "/movies";
const header = getHeader();

export const getAllMovies = () => {
  return axios.get(API_MOVIE + "/all", header);
};

export const getMovies = (query) => {
  return axios.get(API_MOVIE, { ...header, params: query });
};

export const getMoviesNowShowing = (query) => {
  return axios.get(API_MOVIE + "/now-showing", { params: query });
};

export const getMovieByValue = (value) => {
  return axios.get(API_MOVIE + `/${value}`);
};

export const createMovie = (movie) => {
  return axios.post(API_MOVIE, movie, header);
};

export const editMovie = (id, movie) => {
  return axios.put(API_MOVIE + `/${id}`, movie, header);
};

export const deleteMovie = (id) => {
  return axios.delete(API_MOVIE + `/${id}`, header);
};
