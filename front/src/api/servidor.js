import apiAxios from "./axios.js";

export const auth = async (form) => await apiAxios.post("/auth", form);
export const logout = async () => await apiAxios.get("/logout");
export const schemas = async () => await apiAxios.get("/schemas");
export const getTable = async (schema, table) => await apiAxios.get(`/tables/${schema}/${table}`);
export const dropTable = async (schema, table) => await apiAxios.delete(`/drop/${schema}/${table}`);
export const dropSchema = async (schema) => await apiAxios.delete(`/drop/${schema}`);
export const executeQuery = async (query) => await apiAxios.post("/query", { query });
export const changeSchema = async (database) => await apiAxios.post(`/schema/use/${database}`);
export const getStructureTable = async (schema, table) => await apiAxios.get(`/table/structure/${schema}/${table}`);
export const createRow = async (schema, table) => await apiAxios.post(`add/${schema}/${table}`);
export const deleteRow = async (schema, table) => await apiAxios.delete(`drop/${schema}/${table}`);
export const updateRow = async (schema, table) => await apiAxios.put(`update/${schema}/${table}`);
