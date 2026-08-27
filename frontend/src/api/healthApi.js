import axiosClient from "./axiosClient";

export const getApiHealth = async () => {
  const response = await axiosClient.get("/health");
  return response.data;
};
