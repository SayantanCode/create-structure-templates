export interface AuthTokenPayload {
  sub: string;
  role: "user" | "admin";
}
