import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

// Structural (not imported from "zod") so this file has no dependency on
// the zod package itself — only whichever module actually uses this pipe
// needs to depend on zod, same as the Express/Fastify targets' validate.js
// middleware duck-types against `.safeParse()` rather than importing zod.
interface ZodLikeSchema<T> {
  safeParse(value: unknown):
    | { success: true; data: T }
    | { success: false; error: { issues: { path: (string | number)[]; message: string }[] } };
}

@Injectable()
export class ZodValidationPipe<T> implements PipeTransform {
  constructor(private readonly schema: ZodLikeSchema<T>) {}

  transform(value: unknown): T {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      const message = result.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(", ");
      throw new BadRequestException(message);
    }
    return result.data;
  }
}
