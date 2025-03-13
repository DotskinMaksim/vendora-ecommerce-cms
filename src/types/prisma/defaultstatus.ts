import * as z from "zod"
import { CompleteEntity, RelatedEntityModel, CompleteStatus, RelatedStatusModel } from "./index"

export const DefaultStatusModel = z.object({
  entity_id: z.number().int(),
  status_id: z.number().int(),
})

export interface CompleteDefaultStatus extends z.infer<typeof DefaultStatusModel> {
  entity: CompleteEntity
  status: CompleteStatus
}

/**
 * RelatedDefaultStatusModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedDefaultStatusModel: z.ZodSchema<CompleteDefaultStatus> = z.lazy(() => DefaultStatusModel.extend({
  entity: RelatedEntityModel,
  status: RelatedStatusModel,
}))
