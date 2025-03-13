import * as z from "zod"
import { CompleteProductVariant, RelatedProductVariantModel, CompleteAttribute, RelatedAttributeModel } from "./index"

export const ProductAttributeModel = z.object({
  id: z.number().int(),
  product_variant_id: z.number().int(),
  attribute_id: z.number().int(),
  attribute_value: z.string(),
  attribute_label_tx_id: z.number().int().nullish(),
  attribute_unit_type_tx_id: z.number().int().nullish(),
  is_variant: z.boolean(),
  price_modifier: z.number().nullish(),
})

export interface CompleteProductAttribute extends z.infer<typeof ProductAttributeModel> {
  productVariant: CompleteProductVariant
  attribute: CompleteAttribute
}

/**
 * RelatedProductAttributeModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedProductAttributeModel: z.ZodSchema<CompleteProductAttribute> = z.lazy(() => ProductAttributeModel.extend({
  productVariant: RelatedProductVariantModel,
  attribute: RelatedAttributeModel,
}))
