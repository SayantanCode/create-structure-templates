import { z } from "zod";

// Example schema — copy this pattern for your own resources, then wire it
// into a route with: @UsePipes(new ZodValidationPipe(createExampleSchema))
export const createExampleSchema = z.object({
  name: z.string().min(1).max(120),
});
export type CreateExampleDto = z.infer<typeof createExampleSchema>;
