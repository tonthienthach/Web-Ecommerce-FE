import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.token;
  config.headers.Authorization = `Bearer ${token}`;
  config.headers.post["Access-Control-Allow-Origin"] = "*";
  config.headers.post["Access-Control-Allow-Credentials"] = "true";
  // config.headers.post["Access-Control-Allow-Methods"] =
  //   "PUT, POST, GET, DELETE, PATCH, OPTIONS";
  return config;
});

export const instanceApiGHN = axios.create({
  baseURL: "https://dev-online-gateway.ghn.vn/shiip/public-api/",
});

instanceApiGHN.interceptors.request.use((config) => {
  const token = "03fbbe34-dbb4-11ed-ab31-3eeb4194879e";
  config.headers.Token = token;
  config.headers["Content-Type"] = "application/json";
  return config;
});

export default instance;
