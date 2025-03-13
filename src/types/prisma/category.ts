import * as z from "zod"
import { CompleteUser, RelatedUserModel, CompleteProductCategory, RelatedProductCategoryModel, CompletePromotionCategory, RelatedPromotionCategoryModel } from "./index"

export const CategoryModel = z.object({
  id: z.number().int(),
  slug: z.string(),
  parent_id: z.number().int().nullish(),
  name_tx_id: z.number().int(),
  sort_order: z.number().int().nullish(),
  for_adults_only: z.boolean(),
  created_by: z.number().int().nullish(),
})

export interface CompleteCategory extends z.infer<typeof CategoryModel> {
  parent?: CompleteCategory | null
  children: CompleteCategory[]
  createdByUser?: CompleteUser | null
  productCategories: CompleteProductCategory[]
  promotionCategories: CompletePromotionCategory[]
}

/**
 * RelatedCategoryModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedCategoryModel: z.ZodSchema<CompleteCategory> = z.lazy(() => CategoryModel.extend({
  parent: RelatedCategoryModel.nullish(),
  children: RelatedCategoryModel.array(),
  createdByUser: RelatedUserModel.nullish(),
  productCategories: RelatedProductCategoryModel.array(),
  promotionCategories: RelatedPromotionCategoryModel.array(),
}))
