import * as z from "zod"
import { CompleteUser, RelatedUserModel } from "./index"

export const PageViewModel = z.object({
  id: z.number().int(),
  page_url: z.string(),
  user_id: z.number().int().nullish(),
  visitor_ip: z.string(),
  referrer: z.string().nullish(),
  user_agent: z.string().nullish(),
  created_at: z.date(),
})

export interface CompletePageView extends z.infer<typeof PageViewModel> {
  user?: CompleteUser | null
}

/**
 * RelatedPageViewModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPageViewModel: z.ZodSchema<CompletePageView> = z.lazy(() => PageViewModel.extend({
  user: RelatedUserModel.nullish(),
}))
