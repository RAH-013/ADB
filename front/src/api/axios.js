import axios from "axios";

const apiAxios = axios.create({
  baseURL: "http://localhost:4000",
});

apiAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.data.message === "No se ha establecido una conexión con el servidor.") {
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default apiAxios;
