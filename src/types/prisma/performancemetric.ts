import * as z from "zod"

export const PerformanceMetricModel = z.object({
  id: z.number().int(),
  metric_name: z.string(),
  metric_value: z.number(),
  measured_at: z.date(),
})
