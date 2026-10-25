import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api/v1";

let accessToken = null;
let refreshPromise = null;

const notify = (name, detail) => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(name, { detail }));
  }
};

export const getAccessToken = () => accessToken;

export const setAccessToken = (token) => {
  accessToken = token || null;
  notify("auth:token-changed", accessToken);
};

export const clearAccessToken = () => setAccessToken(null);

export const refreshAccessToken = () => {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(
        `${baseURL}/auth/refresh`,
        {},
        { withCredentials: true }
      )
      .then(({ data }) => {
        if (!data.accessToken) {
          throw new Error("Refresh response did not include an access token.");
        }
        setAccessToken(data.accessToken);
        return data;
      })
      .catch((error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          clearAccessToken();
          notify("auth:session-expired");
        }
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};
