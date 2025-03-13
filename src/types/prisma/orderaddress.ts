import * as z from "zod"
import { enum_order_addresses_type } from "@prisma/client"
import { CompleteOrder, RelatedOrderModel, CompleteAddress, RelatedAddressModel } from "./index"

export const OrderAddressModel = z.object({
  id: z.number().int(),
  order_id: z.number().int(),
  type: z.nativeEnum(enum_order_addresses_type),
  first_name: z.string(),
  last_name: z.string(),
  address_id: z.number().int(),
})

export interface CompleteOrderAddress extends z.infer<typeof OrderAddressModel> {
  order: CompleteOrder
  address: CompleteAddress
}

/**
 * RelatedOrderAddressModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedOrderAddressModel: z.ZodSchema<CompleteOrderAddress> = z.lazy(() => OrderAddressModel.extend({
  order: RelatedOrderModel,
  address: RelatedAddressModel,
}))
