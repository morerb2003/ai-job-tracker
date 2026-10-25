import axiosClient from "./axiosClient";

export const getAdminUsers = async () => {
  const response = await axiosClient.get("/admin/users");
  return response.data;
};
