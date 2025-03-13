import * as z from "zod"
import { CompleteLang, RelatedLangModel } from "./index"

export const TranslationModel = z.object({
  id: z.number().int(),
  lang_id: z.number().int(),
  value: z.string(),
})

export interface CompleteTranslation extends z.infer<typeof TranslationModel> {
  lang: CompleteLang
}

/**
 * RelatedTranslationModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedTranslationModel: z.ZodSchema<CompleteTranslation> = z.lazy(() => TranslationModel.extend({
  lang: RelatedLangModel,
}))
