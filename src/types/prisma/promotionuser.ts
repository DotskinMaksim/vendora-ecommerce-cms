import * as z from "zod"
import { CompletePromotion, RelatedPromotionModel, CompleteUser, RelatedUserModel } from "./index"

export const PromotionUserModel = z.object({
  promotion_id: z.number().int(),
  user_id: z.number().int(),
})

export interface CompletePromotionUser extends z.infer<typeof PromotionUserModel> {
  promotion: CompletePromotion
  user: CompleteUser
}

/**
 * RelatedPromotionUserModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPromotionUserModel: z.ZodSchema<CompletePromotionUser> = z.lazy(() => PromotionUserModel.extend({
  promotion: RelatedPromotionModel,
  user: RelatedUserModel,
}))
