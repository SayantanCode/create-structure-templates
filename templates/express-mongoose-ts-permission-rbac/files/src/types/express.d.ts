import { AuthTokenPayload } from "./authPayload.js";

declare module "express-serve-static-core" {
  interface Request {
    user?: AuthTokenPayload;
  }
}
