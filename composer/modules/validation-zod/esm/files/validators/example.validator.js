import { z } from "zod";

// Example schema — copy this pattern for your own resources, then wire it
// into a route with: router.post("/", validateWith(createExampleSchema), ...)
export const createExampleSchema = z.object({
  name: z.string().min(1).max(120),
});
