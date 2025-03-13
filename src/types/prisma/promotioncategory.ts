import * as z from "zod"
import { CompletePromotion, RelatedPromotionModel, CompleteCategory, RelatedCategoryModel } from "./index"

export const PromotionCategoryModel = z.object({
  promotion_id: z.number().int(),
  category_id: z.number().int(),
})

export interface CompletePromotionCategory extends z.infer<typeof PromotionCategoryModel> {
  promotion: CompletePromotion
  category: CompleteCategory
}

/**
 * RelatedPromotionCategoryModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPromotionCategoryModel: z.ZodSchema<CompletePromotionCategory> = z.lazy(() => PromotionCategoryModel.extend({
  promotion: RelatedPromotionModel,
  category: RelatedCategoryModel,
}))
