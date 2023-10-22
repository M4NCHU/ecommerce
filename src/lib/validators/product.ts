import { z } from "zod";

export const ProductValidator = z.object({
  name: z
    .string()
    .min(1, {
      message: "Title must be at least 1 characters long",
    })
    .max(128, {
      message: "Title must be max 128 characters long",
    }),
  categoryId: z.string(),
  primaryImageUrl: z.string(),
  stock: z.number(),
  price: z.number(),
  description: z.any(),
});

export type ProductCreationRequest = z.infer<typeof ProductValidator>;
