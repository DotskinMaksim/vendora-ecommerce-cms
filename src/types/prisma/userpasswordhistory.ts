import * as z from "zod"
import { CompleteUser, RelatedUserModel } from "./index"

export const UserPasswordHistoryModel = z.object({
  id: z.number().int(),
  user_id: z.number().int(),
  old_password_hash: z.string(),
  changed_at: z.date(),
  reason: z.string().nullish(),
})

export interface CompleteUserPasswordHistory extends z.infer<typeof UserPasswordHistoryModel> {
  user: CompleteUser
}

/**
 * RelatedUserPasswordHistoryModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserPasswordHistoryModel: z.ZodSchema<CompleteUserPasswordHistory> = z.lazy(() => UserPasswordHistoryModel.extend({
  user: RelatedUserModel,
}))
