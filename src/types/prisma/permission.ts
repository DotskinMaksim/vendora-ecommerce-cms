import * as z from "zod"
import { CompleteRolePermission, RelatedRolePermissionModel } from "./index"

export const PermissionModel = z.object({
  id: z.number().int(),
  name_tx_id: z.number().int(),
  description_tx_id: z.number().int().nullish(),
})

export interface CompletePermission extends z.infer<typeof PermissionModel> {
  rolePermissions: CompleteRolePermission[]
}

/**
 * RelatedPermissionModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPermissionModel: z.ZodSchema<CompletePermission> = z.lazy(() => PermissionModel.extend({
  rolePermissions: RelatedRolePermissionModel.array(),
}))
