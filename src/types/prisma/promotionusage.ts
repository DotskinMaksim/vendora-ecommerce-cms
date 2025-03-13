import * as z from "zod"
import { CompleteOrder, RelatedOrderModel, CompletePromotion, RelatedPromotionModel } from "./index"

export const PromotionUsageModel = z.object({
  order_id: z.number().int(),
  promotion_id: z.number().int(),
})

export interface CompletePromotionUsage extends z.infer<typeof PromotionUsageModel> {
  order: CompleteOrder
  promotion: CompletePromotion
}

/**
 * RelatedPromotionUsageModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPromotionUsageModel: z.ZodSchema<CompletePromotionUsage> = z.lazy(() => PromotionUsageModel.extend({
  order: RelatedOrderModel,
  promotion: RelatedPromotionModel,
}))
