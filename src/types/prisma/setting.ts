import * as z from "zod"
import { CompleteUser, RelatedUserModel } from "./index"

export const SettingModel = z.object({
  setting_key: z.string(),
  setting_value: z.string().nullish(),
  description: z.string().nullish(),
  label: z.string(),
  last_set_by: z.number().int().nullish(),
})

export interface CompleteSetting extends z.infer<typeof SettingModel> {
  lastSetByUser?: CompleteUser | null
}

/**
 * RelatedSettingModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedSettingModel: z.ZodSchema<CompleteSetting> = z.lazy(() => SettingModel.extend({
  lastSetByUser: RelatedUserModel.nullish(),
}))
