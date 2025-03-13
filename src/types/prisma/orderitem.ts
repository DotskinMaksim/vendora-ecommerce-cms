import * as z from "zod"
import { CompleteOrder, RelatedOrderModel, CompleteProductVariant, RelatedProductVariantModel } from "./index"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const OrderItemModel = z.object({
  id: z.number().int(),
  order_id: z.number().int(),
  product_variant_id: z.number().int(),
  quantity: z.number(),
  price_each: z.number(),
  subtotal: z.number(),
  product_snapshot: jsonSchema,
})

export interface CompleteOrderItem extends z.infer<typeof OrderItemModel> {
  order: CompleteOrder
  productVariant: CompleteProductVariant
}

/**
 * RelatedOrderItemModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedOrderItemModel: z.ZodSchema<CompleteOrderItem> = z.lazy(() => OrderItemModel.extend({
  order: RelatedOrderModel,
  productVariant: RelatedProductVariantModel,
}))
