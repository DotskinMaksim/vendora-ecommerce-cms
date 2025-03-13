import * as z from "zod"
import { CompleteEntity, RelatedEntityModel, CompleteUser, RelatedUserModel, CompleteProduct, RelatedProductModel, CompleteOrder, RelatedOrderModel, CompleteTransaction, RelatedTransactionModel, CompletePaymentMethod, RelatedPaymentMethodModel, CompleteShippingMethod, RelatedShippingMethodModel, CompletePromotion, RelatedPromotionModel, CompleteDefaultStatus, RelatedDefaultStatusModel } from "./index"

export const StatusModel = z.object({
  id: z.number().int(),
  entity_id: z.number().int(),
  name: z.string(),
  color: z.string(),
  description: z.string().nullish(),
})

export interface CompleteStatus extends z.infer<typeof StatusModel> {
  entity: CompleteEntity
  users: CompleteUser[]
  products: CompleteProduct[]
  orders: CompleteOrder[]
  transactions: CompleteTransaction[]
  paymentMethods: CompletePaymentMethod[]
  shippingMethods: CompleteShippingMethod[]
  promotions: CompletePromotion[]
  defaultStatuses: CompleteDefaultStatus[]
}

/**
 * RelatedStatusModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedStatusModel: z.ZodSchema<CompleteStatus> = z.lazy(() => StatusModel.extend({
  entity: RelatedEntityModel,
  users: RelatedUserModel.array(),
  products: RelatedProductModel.array(),
  orders: RelatedOrderModel.array(),
  transactions: RelatedTransactionModel.array(),
  paymentMethods: RelatedPaymentMethodModel.array(),
  shippingMethods: RelatedShippingMethodModel.array(),
  promotions: RelatedPromotionModel.array(),
  defaultStatuses: RelatedDefaultStatusModel.array(),
}))
