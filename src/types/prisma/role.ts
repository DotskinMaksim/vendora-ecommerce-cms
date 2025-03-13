import * as z from "zod"
import { CompleteUserRole, RelatedUserRoleModel, CompleteRolePermission, RelatedRolePermissionModel } from "./index"

export const RoleModel = z.object({
  id: z.number().int(),
  name_tx_id: z.number().int(),
  description_tx_id: z.number().int().nullish(),
})

export interface CompleteRole extends z.infer<typeof RoleModel> {
  userRoles: CompleteUserRole[]
  rolePermissions: CompleteRolePermission[]
}

/**
 * RelatedRoleModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedRoleModel: z.ZodSchema<CompleteRole> = z.lazy(() => RoleModel.extend({
  userRoles: RelatedUserRoleModel.array(),
  rolePermissions: RelatedRolePermissionModel.array(),
}))
