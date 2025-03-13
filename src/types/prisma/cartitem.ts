import * as z from "zod"
import { CompleteCart, RelatedCartModel, CompleteProductVariant, RelatedProductVariantModel } from "./index"

export const CartItemModel = z.object({
  id: z.number().int(),
  cart_id: z.number().int(),
  product_variant_id: z.number().int(),
  quantity: z.number(),
  created_at: z.date(),
  updated_at: z.date(),
})

export interface CompleteCartItem extends z.infer<typeof CartItemModel> {
  cart: CompleteCart
  productVariant: CompleteProductVariant
}

/**
 * RelatedCartItemModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedCartItemModel: z.ZodSchema<CompleteCartItem> = z.lazy(() => CartItemModel.extend({
  cart: RelatedCartModel,
  productVariant: RelatedProductVariantModel,
}))
