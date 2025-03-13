import * as z from "zod"
import { CompletePromotion, RelatedPromotionModel, CompleteProduct, RelatedProductModel } from "./index"

export const PromotionProductModel = z.object({
  promotion_id: z.number().int(),
  product_id: z.number().int(),
})

export interface CompletePromotionProduct extends z.infer<typeof PromotionProductModel> {
  promotion: CompletePromotion
  product: CompleteProduct
}

/**
 * RelatedPromotionProductModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPromotionProductModel: z.ZodSchema<CompletePromotionProduct> = z.lazy(() => PromotionProductModel.extend({
  promotion: RelatedPromotionModel,
  product: RelatedProductModel,
}))
