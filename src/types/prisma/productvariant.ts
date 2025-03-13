import * as z from "zod"
import { CompleteProduct, RelatedProductModel, CompleteProductAttribute, RelatedProductAttributeModel, CompleteWarehouseStock, RelatedWarehouseStockModel, CompleteOrderItem, RelatedOrderItemModel, CompleteCartItem, RelatedCartItemModel } from "./index"

export const ProductVariantModel = z.object({
  id: z.number().int(),
  product_id: z.number().int(),
  available_quantity: z.number().nullish(),
  is_default: z.boolean(),
})

export interface CompleteProductVariant extends z.infer<typeof ProductVariantModel> {
  product: CompleteProduct
  productAttributes: CompleteProductAttribute[]
  warehouseStocks: CompleteWarehouseStock[]
  orderItems: CompleteOrderItem[]
  cartItems: CompleteCartItem[]
}

/**
 * RelatedProductVariantModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedProductVariantModel: z.ZodSchema<CompleteProductVariant> = z.lazy(() => ProductVariantModel.extend({
  product: RelatedProductModel,
  productAttributes: RelatedProductAttributeModel.array(),
  warehouseStocks: RelatedWarehouseStockModel.array(),
  orderItems: RelatedOrderItemModel.array(),
  cartItems: RelatedCartItemModel.array(),
}))
