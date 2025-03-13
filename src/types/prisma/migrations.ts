import * as z from "zod"

export const migrationsModel = z.object({
  id: z.number().int(),
  timestamp: z.bigint(),
  name: z.string(),
})
