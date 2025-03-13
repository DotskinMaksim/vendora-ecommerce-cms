import * as z from "zod"
import { enum_products_unit_type } from "@prisma/client"
import { CompleteStatus, RelatedStatusModel, CompleteUser, RelatedUserModel, CompleteProductImage, RelatedProductImageModel, CompleteProductReview, RelatedProductReviewModel, CompleteProductVariant, RelatedProductVariantModel, CompleteProductTag, RelatedProductTagModel, CompleteProductCategory, RelatedProductCategoryModel, CompletePromotionProduct, RelatedPromotionProductModel, CompleteUserWishlist, RelatedUserWishlistModel } from "./index"

export const ProductModel = z.object({
  id: z.number().int(),
  slug: z.string(),
  price: z.number(),
  unit_type: z.nativeEnum(enum_products_unit_type),
  unit_name_tx_id: z.number().int(),
  status_id: z.number().int(),
  name_tx_id: z.number().int(),
  description_tx_id: z.number().int().nullish(),
  created_at: z.date(),
  updated_at: z.date(),
  created_by: z.number().int().nullish(),
})

export interface CompleteProduct extends z.infer<typeof ProductModel> {
  status: CompleteStatus
  createdByUser?: CompleteUser | null
  productImages: CompleteProductImage[]
  productReviews: CompleteProductReview[]
  productVariants: CompleteProductVariant[]
  productTags: CompleteProductTag[]
  productCategories: CompleteProductCategory[]
  promotionProducts: CompletePromotionProduct[]
  userWishlists: CompleteUserWishlist[]
}

/**
 * RelatedProductModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedProductModel: z.ZodSchema<CompleteProduct> = z.lazy(() => ProductModel.extend({
  status: RelatedStatusModel,
  createdByUser: RelatedUserModel.nullish(),
  productImages: RelatedProductImageModel.array(),
  productReviews: RelatedProductReviewModel.array(),
  productVariants: RelatedProductVariantModel.array(),
  productTags: RelatedProductTagModel.array(),
  productCategories: RelatedProductCategoryModel.array(),
  promotionProducts: RelatedPromotionProductModel.array(),
  userWishlists: RelatedUserWishlistModel.array(),
}))
