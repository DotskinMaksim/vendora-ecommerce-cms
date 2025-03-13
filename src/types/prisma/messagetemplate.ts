import * as z from "zod"
import { enum_message_templates_type } from "@prisma/client"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const MessageTemplateModel = z.object({
  id: z.number().int(),
  type: z.nativeEnum(enum_message_templates_type),
  name: z.string(),
  subject: z.string(),
  body: z.string(),
  variables: jsonSchema,
  created_at: z.date(),
  updated_at: z.date(),
})
