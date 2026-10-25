import axiosClient from "./axiosClient";
import { refreshAccessToken } from "./authSession";

export const registerUser = async (payload) => {
  const response = await axiosClient.post("/auth/register", payload);
  return response.data;
};

export const loginUser = async (payload) => {
  const response = await axiosClient.post("/auth/login", payload);
  return response.data;
};

export const refreshTokenApi = () => refreshAccessToken();

export const logoutUser = async () => {
  const response = await axiosClient.post("/auth/logout");
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await axiosClient.get("/users/me");
  return response.data;
};
