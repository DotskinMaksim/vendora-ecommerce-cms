import * as z from "zod"
import { CompleteProduct, RelatedProductModel, CompleteCategory, RelatedCategoryModel } from "./index"

export const ProductCategoryModel = z.object({
  product_id: z.number().int(),
  category_id: z.number().int(),
})

export interface CompleteProductCategory extends z.infer<typeof ProductCategoryModel> {
  product: CompleteProduct
  category: CompleteCategory
}

/**
 * RelatedProductCategoryModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedProductCategoryModel: z.ZodSchema<CompleteProductCategory> = z.lazy(() => ProductCategoryModel.extend({
  product: RelatedProductModel,
  category: RelatedCategoryModel,
}))
