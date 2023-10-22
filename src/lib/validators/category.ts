import { z } from "zod";

export const CategoryValidator = z.object({
  categoryId: z.string().optional(),
  name: z.string().min(1).max(21),
  desc: z.string().max(128),
  imageUrl: z.string(),
});

export const CategorySubscriptionValidator = z.object({
  categoryId: z.string(),
});

export type CategoryPayload = z.infer<typeof CategoryValidator>;
export type SubscribeToCategoryPayload = z.infer<
  typeof CategorySubscriptionValidator
>;
