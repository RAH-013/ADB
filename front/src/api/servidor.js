import axios from "axios";

const URI = "http://localhost:4000";

export const auth = async (form) => await axios.post(`${URI}/auth`, form);
export const schemas = async () => await axios.get(`${URI}/schemas`);
