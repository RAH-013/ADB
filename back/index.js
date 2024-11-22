import express from "express";
import cors from "cors";
import { PORT } from "./config.js";
import { router } from "./routes/routes.js";

const app = express();

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

app.listen(PORT);

console.log("Server on: " + PORT);
