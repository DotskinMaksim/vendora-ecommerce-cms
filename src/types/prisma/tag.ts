import * as z from "zod"
import { CompleteProductTag, RelatedProductTagModel } from "./index"

export const TagModel = z.object({
  id: z.number().int(),
  name_tx_id: z.number().int(),
  slug: z.string(),
})

export interface CompleteTag extends z.infer<typeof TagModel> {
  productTags: CompleteProductTag[]
}

/**
 * RelatedTagModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedTagModel: z.ZodSchema<CompleteTag> = z.lazy(() => TagModel.extend({
  productTags: RelatedProductTagModel.array(),
}))
