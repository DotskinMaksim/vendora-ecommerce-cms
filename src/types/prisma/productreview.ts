import * as z from "zod"
import { CompleteProduct, RelatedProductModel, CompleteUser, RelatedUserModel, CompleteLang, RelatedLangModel } from "./index"

export const ProductReviewModel = z.object({
  id: z.number().int(),
  product_id: z.number().int(),
  user_id: z.number().int(),
  rating: z.number().int(),
  comment: z.string().nullish(),
  lang_id: z.number().int(),
  created_at: z.date(),
  likes: z.number().int(),
  dislikes: z.number().int(),
})

export interface CompleteProductReview extends z.infer<typeof ProductReviewModel> {
  product: CompleteProduct
  user: CompleteUser
  lang: CompleteLang
}

/**
 * RelatedProductReviewModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedProductReviewModel: z.ZodSchema<CompleteProductReview> = z.lazy(() => ProductReviewModel.extend({
  product: RelatedProductModel,
  user: RelatedUserModel,
  lang: RelatedLangModel,
}))
