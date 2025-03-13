import * as z from "zod"
import { CompleteProductReview, RelatedProductReviewModel, CompleteTranslation, RelatedTranslationModel } from "./index"

export const LangModel = z.object({
  id: z.number().int(),
  lang_code: z.string(),
  lang_flag_image_url: z.string().nullish(),
})

export interface CompleteLang extends z.infer<typeof LangModel> {
  productReviews: CompleteProductReview[]
  translations: CompleteTranslation[]
}

/**
 * RelatedLangModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedLangModel: z.ZodSchema<CompleteLang> = z.lazy(() => LangModel.extend({
  productReviews: RelatedProductReviewModel.array(),
  translations: RelatedTranslationModel.array(),
}))
