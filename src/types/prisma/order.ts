import * as z from "zod"
import { CompleteUser, RelatedUserModel, CompleteStatus, RelatedStatusModel, CompleteShippingMethod, RelatedShippingMethodModel, CompleteOrderItem, RelatedOrderItemModel, CompletePromotionUsage, RelatedPromotionUsageModel, CompleteTransaction, RelatedTransactionModel, CompleteOrderAddress, RelatedOrderAddressModel } from "./index"

export const OrderModel = z.object({
  id: z.number().int(),
  user_id: z.number().int().nullish(),
  total_amount: z.number(),
  status_id: z.number().int(),
  created_at: z.date(),
  shipping_method_id: z.number().int().nullish(),
})

export interface CompleteOrder extends z.infer<typeof OrderModel> {
  user?: CompleteUser | null
  status: CompleteStatus
  shippingMethod?: CompleteShippingMethod | null
  orderItems: CompleteOrderItem[]
  promotionUsages: CompletePromotionUsage[]
  transactions: CompleteTransaction[]
  orderAddresses: CompleteOrderAddress[]
}

/**
 * RelatedOrderModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedOrderModel: z.ZodSchema<CompleteOrder> = z.lazy(() => OrderModel.extend({
  user: RelatedUserModel.nullish(),
  status: RelatedStatusModel,
  shippingMethod: RelatedShippingMethodModel.nullish(),
  orderItems: RelatedOrderItemModel.array(),
  promotionUsages: RelatedPromotionUsageModel.array(),
  transactions: RelatedTransactionModel.array(),
  orderAddresses: RelatedOrderAddressModel.array(),
}))
