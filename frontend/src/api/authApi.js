import axiosClient from "./axiosClient";

export const registerUser = async (payload) => {
  const response = await axiosClient.post("/auth/register", payload);
  return response.data;
};
