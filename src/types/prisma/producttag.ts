import * as z from "zod"
import { CompleteProduct, RelatedProductModel, CompleteTag, RelatedTagModel } from "./index"

export const ProductTagModel = z.object({
  product_id: z.number().int(),
  tag_id: z.number().int(),
})

export interface CompleteProductTag extends z.infer<typeof ProductTagModel> {
  product: CompleteProduct
  tag: CompleteTag
}

/**
 * RelatedProductTagModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedProductTagModel: z.ZodSchema<CompleteProductTag> = z.lazy(() => ProductTagModel.extend({
  product: RelatedProductModel,
  tag: RelatedTagModel,
}))
