import * as z from "zod"
import { CompleteUser, RelatedUserModel, CompleteCartItem, RelatedCartItemModel } from "./index"

export const CartModel = z.object({
  id: z.number().int(),
  user_id: z.number().int().nullish(),
  session_id: z.string().nullish(),
  created_at: z.date(),
  updated_at: z.date(),
})

export interface CompleteCart extends z.infer<typeof CartModel> {
  user?: CompleteUser | null
  cartItems: CompleteCartItem[]
}

/**
 * RelatedCartModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedCartModel: z.ZodSchema<CompleteCart> = z.lazy(() => CartModel.extend({
  user: RelatedUserModel.nullish(),
  cartItems: RelatedCartItemModel.array(),
}))
