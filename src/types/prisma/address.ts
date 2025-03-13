import * as z from "zod"
import { CompleteWarehouse, RelatedWarehouseModel, CompleteOrderAddress, RelatedOrderAddressModel } from "./index"

export const AddressModel = z.object({
  id: z.number().int(),
  country: z.string(),
  city: z.string(),
  state: z.string(),
  address_line1: z.string(),
  address_line2: z.string().nullish(),
  postal_code: z.string(),
})

export interface CompleteAddress extends z.infer<typeof AddressModel> {
  warehouses: CompleteWarehouse[]
  orderAddresses: CompleteOrderAddress[]
}

/**
 * RelatedAddressModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedAddressModel: z.ZodSchema<CompleteAddress> = z.lazy(() => AddressModel.extend({
  warehouses: RelatedWarehouseModel.array(),
  orderAddresses: RelatedOrderAddressModel.array(),
}))
