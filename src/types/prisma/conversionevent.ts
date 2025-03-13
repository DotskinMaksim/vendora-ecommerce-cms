import * as z from "zod"
import { CompleteUser, RelatedUserModel } from "./index"

export const ConversionEventModel = z.object({
  id: z.number().int(),
  event_name_tx_id: z.number().int(),
  user_id: z.number().int().nullish(),
  details_tx_id: z.number().int().nullish(),
  created_at: z.date(),
})

export interface CompleteConversionEvent extends z.infer<typeof ConversionEventModel> {
  user?: CompleteUser | null
}

/**
 * RelatedConversionEventModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedConversionEventModel: z.ZodSchema<CompleteConversionEvent> = z.lazy(() => ConversionEventModel.extend({
  user: RelatedUserModel.nullish(),
}))
