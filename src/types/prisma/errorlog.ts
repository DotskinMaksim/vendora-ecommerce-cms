import * as z from "zod"
import { CompleteUser, RelatedUserModel } from "./index"

export const ErrorLogModel = z.object({
  id: z.number().int(),
  error_message: z.string(),
  error_code: z.string(),
  file: z.string().nullish(),
  line: z.number().int().nullish(),
  stacktrace: z.string().nullish(),
  user_id: z.number().int().nullish(),
  created_at: z.date(),
})

export interface CompleteErrorLog extends z.infer<typeof ErrorLogModel> {
  user?: CompleteUser | null
}

/**
 * RelatedErrorLogModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedErrorLogModel: z.ZodSchema<CompleteErrorLog> = z.lazy(() => ErrorLogModel.extend({
  user: RelatedUserModel.nullish(),
}))
