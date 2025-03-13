import * as z from "zod"
import { CompleteStatus, RelatedStatusModel, CompleteTransaction, RelatedTransactionModel } from "./index"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const PaymentMethodModel = z.object({
  id: z.number().int(),
  config: jsonSchema,
  status_id: z.number().int(),
  name: z.string(),
  description_tx_id: z.number().int().nullish(),
  created_at: z.date(),
  updated_at: z.date(),
})

export interface CompletePaymentMethod extends z.infer<typeof PaymentMethodModel> {
  status: CompleteStatus
  transactions: CompleteTransaction[]
}

/**
 * RelatedPaymentMethodModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPaymentMethodModel: z.ZodSchema<CompletePaymentMethod> = z.lazy(() => PaymentMethodModel.extend({
  status: RelatedStatusModel,
  transactions: RelatedTransactionModel.array(),
}))
