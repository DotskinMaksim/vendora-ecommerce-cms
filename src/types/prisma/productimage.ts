import * as z from "zod"
import { enum_product_images_image_type } from "@prisma/client"
import { CompleteProduct, RelatedProductModel } from "./index"

export const ProductImageModel = z.object({
  id: z.number().int(),
  product_id: z.number().int(),
  image_url: z.string(),
  image_type: z.nativeEnum(enum_product_images_image_type),
  sort_order: z.number().int(),
  created_at: z.date(),
})

export interface CompleteProductImage extends z.infer<typeof ProductImageModel> {
  product: CompleteProduct
}

/**
 * RelatedProductImageModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedProductImageModel: z.ZodSchema<CompleteProductImage> = z.lazy(() => ProductImageModel.extend({
  product: RelatedProductModel,
}))
