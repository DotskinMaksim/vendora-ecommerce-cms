import * as z from "zod"
import { CompleteStatus, RelatedStatusModel, CompleteOrder, RelatedOrderModel } from "./index"

export const ShippingMethodModel = z.object({
  id: z.number().int(),
  name_tx_id: z.number().int(),
  description_tx_id: z.number().int().nullish(),
  price: z.number(),
  delivery_time_days: z.number().int(),
  status_id: z.number().int(),
})

export interface CompleteShippingMethod extends z.infer<typeof ShippingMethodModel> {
  status: CompleteStatus
  orders: CompleteOrder[]
}

/**
 * RelatedShippingMethodModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedShippingMethodModel: z.ZodSchema<CompleteShippingMethod> = z.lazy(() => ShippingMethodModel.extend({
  status: RelatedStatusModel,
  orders: RelatedOrderModel.array(),
}))
