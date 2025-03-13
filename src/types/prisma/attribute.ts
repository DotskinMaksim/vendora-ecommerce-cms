import * as z from "zod"
import { enum_attributes_value_type } from "@prisma/client"
import { CompleteUser, RelatedUserModel, CompleteProductAttribute, RelatedProductAttributeModel } from "./index"

export const AttributeModel = z.object({
  id: z.number().int(),
  name_tx_id: z.number().int(),
  value_type: z.nativeEnum(enum_attributes_value_type),
  created_by: z.number().int().nullish(),
})

export interface CompleteAttribute extends z.infer<typeof AttributeModel> {
  createdByUser?: CompleteUser | null
  productAttributes: CompleteProductAttribute[]
}

/**
 * RelatedAttributeModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedAttributeModel: z.ZodSchema<CompleteAttribute> = z.lazy(() => AttributeModel.extend({
  createdByUser: RelatedUserModel.nullish(),
  productAttributes: RelatedProductAttributeModel.array(),
}))
