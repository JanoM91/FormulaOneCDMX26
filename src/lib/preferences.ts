import { z } from "zod";
export const ticketSchema = z.object({
  day: z.enum(["friday", "saturday", "sunday"]),
  section: z.string().trim().min(1).max(24),
  row: z.string().trim().min(1).max(12),
  seats: z.string().trim().min(1).max(60),
});
export const ticketImportSchema = z.object({
  tickets: z
    .array(ticketSchema)
    .max(3)
    .refine(
      (t) => new Set(t.map((x) => x.day)).size === t.length,
      "Un boleto por día",
    ),
});
export const preferencesSchema = z.object({
  tickets: z.array(ticketSchema).max(3),
  notes: z.object({
    friday: z.string().max(3000),
    saturday: z.string().max(3000),
    sunday: z.string().max(3000),
  }),
  checklist: z.record(z.string(), z.boolean()),
  favorite: z.string().max(80),
  meeting: z.string().max(300),
  contrast: z.boolean(),
  easy: z.boolean(),
  theme: z.enum(["paddock", "fiesta", "telemetry"]),
});
