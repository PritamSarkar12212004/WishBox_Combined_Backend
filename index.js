import express from "express";
import dotenv from "dotenv";
import DataBase from "./src/services/database/DataBase.js";
import morgan from "morgan";
import ProductRoute from "./src/routes/client/ProductRoute.js";

import cors from "cors";
dotenv.config();
const app = express();
const port = process.env.port || 3000;

app.use(express.json());
app.use(
  cors({
    origin: "*",
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api/client", ProductRoute);

DataBase()
  .then(() => {
    app.listen(port, () => {
      console.log(`server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(`Error in connecting to database: ${err}`);
  });
