import * as z from "zod"
import { CompleteAddress, RelatedAddressModel, CompleteWarehouseStock, RelatedWarehouseStockModel } from "./index"

export const WarehouseModel = z.object({
  id: z.number().int(),
  name: z.string(),
  address_id: z.number().int(),
  phone_code: z.string().nullish(),
  phone_number: z.string().nullish(),
  email: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
})

export interface CompleteWarehouse extends z.infer<typeof WarehouseModel> {
  address: CompleteAddress
  warehouseStocks: CompleteWarehouseStock[]
}

/**
 * RelatedWarehouseModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedWarehouseModel: z.ZodSchema<CompleteWarehouse> = z.lazy(() => WarehouseModel.extend({
  address: RelatedAddressModel,
  warehouseStocks: RelatedWarehouseStockModel.array(),
}))
