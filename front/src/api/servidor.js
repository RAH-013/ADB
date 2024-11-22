import axios from "axios";

export const auth = async (form) => await axios.post("http://localhost:4000/auth", form);
