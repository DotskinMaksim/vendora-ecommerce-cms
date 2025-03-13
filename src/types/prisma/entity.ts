import * as z from "zod"
import { CompleteStatus, RelatedStatusModel, CompleteDefaultStatus, RelatedDefaultStatusModel, CompleteAuditLog, RelatedAuditLogModel } from "./index"

export const EntityModel = z.object({
  id: z.number().int(),
  name: z.string(),
})

export interface CompleteEntity extends z.infer<typeof EntityModel> {
  statuses: CompleteStatus[]
  defaultStatuses: CompleteDefaultStatus[]
  auditLogs: CompleteAuditLog[]
}

/**
 * RelatedEntityModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedEntityModel: z.ZodSchema<CompleteEntity> = z.lazy(() => EntityModel.extend({
  statuses: RelatedStatusModel.array(),
  defaultStatuses: RelatedDefaultStatusModel.array(),
  auditLogs: RelatedAuditLogModel.array(),
}))
