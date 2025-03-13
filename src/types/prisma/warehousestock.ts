import * as z from "zod"
import { CompleteWarehouse, RelatedWarehouseModel, CompleteProductVariant, RelatedProductVariantModel } from "./index"

export const WarehouseStockModel = z.object({
  id: z.number().int(),
  warehouse_id: z.number().int(),
  product_variant_id: z.number().int(),
  quantity_on_hand: z.number(),
  reserved_quantity: z.number(),
  updated_at: z.date(),
})

export interface CompleteWarehouseStock extends z.infer<typeof WarehouseStockModel> {
  warehouse: CompleteWarehouse
  productVariant: CompleteProductVariant
}

/**
 * RelatedWarehouseStockModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedWarehouseStockModel: z.ZodSchema<CompleteWarehouseStock> = z.lazy(() => WarehouseStockModel.extend({
  warehouse: RelatedWarehouseModel,
  productVariant: RelatedProductVariantModel,
}))
