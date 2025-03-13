import * as z from "zod"
import { CompleteUser, RelatedUserModel, CompleteRole, RelatedRoleModel } from "./index"

export const UserRoleModel = z.object({
  user_id: z.number().int(),
  role_id: z.number().int(),
})

export interface CompleteUserRole extends z.infer<typeof UserRoleModel> {
  user: CompleteUser
  role: CompleteRole
}

/**
 * RelatedUserRoleModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserRoleModel: z.ZodSchema<CompleteUserRole> = z.lazy(() => UserRoleModel.extend({
  user: RelatedUserModel,
  role: RelatedRoleModel,
}))
