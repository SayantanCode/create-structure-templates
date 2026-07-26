import routes from "../routes/index.js";

export default (app) => {
  app.use("/api/v1", routes);
};
