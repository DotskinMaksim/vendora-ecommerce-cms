import * as z from "zod"
import { CompleteOrder, RelatedOrderModel, CompletePaymentMethod, RelatedPaymentMethodModel, CompleteStatus, RelatedStatusModel } from "./index"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const TransactionModel = z.object({
  id: z.number().int(),
  order_id: z.number().int(),
  payment_method_id: z.number().int().nullish(),
  gateway_txn_id: z.string().nullish(),
  payment_reference: z.string().nullish(),
  amount: z.number(),
  currency: z.string(),
  status_id: z.number().int(),
  created_at: z.date(),
  updated_at: z.date(),
  ip_address: z.string().nullish(),
  error_message: z.string().nullish(),
  gateway_response: z.string().nullish(),
  config: jsonSchema,
})

export interface CompleteTransaction extends z.infer<typeof TransactionModel> {
  order: CompleteOrder
  paymentMethod?: CompletePaymentMethod | null
  status: CompleteStatus
}

/**
 * RelatedTransactionModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedTransactionModel: z.ZodSchema<CompleteTransaction> = z.lazy(() => TransactionModel.extend({
  order: RelatedOrderModel,
  paymentMethod: RelatedPaymentMethodModel.nullish(),
  status: RelatedStatusModel,
}))
