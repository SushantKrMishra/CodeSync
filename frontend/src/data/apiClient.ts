import axios from "axios";
import { queryClient } from "../domain/queryClient";
import { BASE_URL } from "./constants";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      queryClient.setQueryData(["sessionStatus"], false);
    }
    return Promise.reject(err);
  }
);
