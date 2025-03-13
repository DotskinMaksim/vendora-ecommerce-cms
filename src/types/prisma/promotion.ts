import * as z from "zod"
import { enum_promotions_discount_type } from "@prisma/client"
import { CompleteStatus, RelatedStatusModel, CompletePromotionProduct, RelatedPromotionProductModel, CompletePromotionCategory, RelatedPromotionCategoryModel, CompletePromotionUser, RelatedPromotionUserModel, CompletePromotionUsage, RelatedPromotionUsageModel } from "./index"

export const PromotionModel = z.object({
  id: z.number().int(),
  name_tx_id: z.number().int(),
  description_tx_id: z.number().int().nullish(),
  promo_code: z.string().nullish(),
  discount_type: z.nativeEnum(enum_promotions_discount_type),
  discount_value: z.number(),
  min_order_amount: z.number().nullish(),
  start_date: z.date().nullish(),
  end_date: z.date().nullish(),
  usage_limit: z.number().int().nullish(),
  times_used: z.number().int(),
  status_id: z.number().int(),
  created_at: z.date(),
  updated_at: z.date(),
})

export interface CompletePromotion extends z.infer<typeof PromotionModel> {
  status: CompleteStatus
  promotionProducts: CompletePromotionProduct[]
  promotionCategories: CompletePromotionCategory[]
  promotionUsers: CompletePromotionUser[]
  promotionUsages: CompletePromotionUsage[]
}

/**
 * RelatedPromotionModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPromotionModel: z.ZodSchema<CompletePromotion> = z.lazy(() => PromotionModel.extend({
  status: RelatedStatusModel,
  promotionProducts: RelatedPromotionProductModel.array(),
  promotionCategories: RelatedPromotionCategoryModel.array(),
  promotionUsers: RelatedPromotionUserModel.array(),
  promotionUsages: RelatedPromotionUsageModel.array(),
}))
