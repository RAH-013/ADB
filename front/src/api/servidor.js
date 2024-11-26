import apiAxios from "./axios.js";

export const auth = async (form) => await apiAxios.post("/auth", form);
export const logout = async () => await apiAxios.get("/logout");
export const schemas = async () => await apiAxios.get("/schemas");
export const getTable = async (schema, table) => await apiAxios.get(`/tables/${schema}/${table}`);
export const dropTable = async (schema, table) => await apiAxios.delete(`/drop/${schema}/${table}`);
export const dropSchema = async (schema) => await apiAxios.delete(`/drop/${schema}`);
export const executeQuery = async (query) => await apiAxios.post("/query", { query });
export const changeSchema = async (database) => await apiAxios.post(`/schema/use/${database}`);
