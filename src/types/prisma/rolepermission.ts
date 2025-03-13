import * as z from "zod"
import { CompleteRole, RelatedRoleModel, CompletePermission, RelatedPermissionModel } from "./index"

export const RolePermissionModel = z.object({
  role_id: z.number().int(),
  permission_id: z.number().int(),
})

export interface CompleteRolePermission extends z.infer<typeof RolePermissionModel> {
  role: CompleteRole
  permission: CompletePermission
}

/**
 * RelatedRolePermissionModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedRolePermissionModel: z.ZodSchema<CompleteRolePermission> = z.lazy(() => RolePermissionModel.extend({
  role: RelatedRoleModel,
  permission: RelatedPermissionModel,
}))
