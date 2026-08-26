import axiosClient from "./axiosClient";

export const registerUser = async (payload) => {
  const response = await axiosClient.post("/auth/register", payload);
  return response.data;
};

export const loginUser = async (payload) => {
  const response = await axiosClient.post("/auth/login", payload);
  return response.data;
};

export const refreshTokenApi = async (refreshToken) => {
  const response = await axiosClient.post("/auth/refresh", { refreshToken });
  return response.data;
};

export const logoutUser = async (refreshToken) => {
  const response = await axiosClient.post("/auth/logout", { refreshToken });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await axiosClient.get("/users/me");
  return response.data;
};
