import { Application } from "express";
import routes from "../routes/index.js";

export default (app: Application) => {
  app.use("/api/v1", routes);
};
