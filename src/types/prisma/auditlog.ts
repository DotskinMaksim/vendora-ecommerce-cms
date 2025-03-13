import * as z from "zod"
import { CompleteUser, RelatedUserModel, CompleteEntity, RelatedEntityModel } from "./index"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const AuditLogModel = z.object({
  id: z.number().int(),
  user_id: z.number().int().nullish(),
  action: z.string(),
  ip_address: z.string().nullish(),
  created_at: z.date(),
  changes: jsonSchema,
  entity_type_id: z.number().int().nullish(),
  entity_id: z.number().int().nullish(),
})

export interface CompleteAuditLog extends z.infer<typeof AuditLogModel> {
  user?: CompleteUser | null
  entity_type?: CompleteEntity | null
}

/**
 * RelatedAuditLogModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedAuditLogModel: z.ZodSchema<CompleteAuditLog> = z.lazy(() => AuditLogModel.extend({
  user: RelatedUserModel.nullish(),
  entity_type: RelatedEntityModel.nullish(),
}))
