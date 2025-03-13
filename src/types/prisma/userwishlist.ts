import * as z from "zod"
import { CompleteProduct, RelatedProductModel, CompleteUser, RelatedUserModel } from "./index"

export const UserWishlistModel = z.object({
  product_id: z.number().int(),
  user_id: z.number().int(),
  created_at: z.date(),
})

export interface CompleteUserWishlist extends z.infer<typeof UserWishlistModel> {
  product: CompleteProduct
  user: CompleteUser
}

/**
 * RelatedUserWishlistModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserWishlistModel: z.ZodSchema<CompleteUserWishlist> = z.lazy(() => UserWishlistModel.extend({
  product: RelatedProductModel,
  user: RelatedUserModel,
}))
