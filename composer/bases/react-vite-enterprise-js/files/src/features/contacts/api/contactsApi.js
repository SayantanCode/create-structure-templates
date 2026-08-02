import { apiClient } from "@/services/api/client";

// JSONPlaceholder's /users — a real, stable public demo API. Its writes
// (POST/PUT/DELETE) return a successful-looking response but don't
// actually persist anything server-side, so a page refresh reverts them.
// See this base's README ("Demo API") — repoint VITE_API_URL at your real
// backend when you have one; nothing else here needs to change.
export const contactsApi = {
  async list() {
    const { data } = await apiClient.get("/users");
    return data;
  },
  async create(payload) {
    const { data } = await apiClient.post("/users", payload);
    return data;
  },
  async update(id, payload) {
    const { data } = await apiClient.put(`/users/${id}`, payload);
    return data;
  },
  async remove(id) {
    await apiClient.delete(`/users/${id}`);
    return id;
  },
};
