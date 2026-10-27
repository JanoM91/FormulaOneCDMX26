import { z } from "zod";
export const emptyDrive = {
  origin: "Xalapa, Veracruz",
  stop: {
    label: "ITAM Santa Teresa · titulación",
    address:
      "Av. Camino a Santa Teresa 930, Héroes de Padierna, Magdalena Contreras, Ciudad de México",
    window: "L–V 10:00–18:00",
    note: "Entregar la documentación de titulación de la maestría en Control Escolar de Posgrados: paquete cerrado y rotulado con clave única y programa. Confirmar oficina y horario por teléfono.",
  },
};
export const driveSchema = z.object({
  origin: z.string().trim().max(120),
  stop: z
    .object({
      label: z.string().trim().min(1).max(80),
      address: z.string().trim().min(1).max(160),
      window: z.string().trim().max(80),
      note: z.string().trim().max(200),
    })
    .nullable(),
});
export const tripSchema = z.object({
  travelers: z
    .array(
      z.object({
        initials: z.string().trim().min(1).max(5),
        name: z.string().trim().min(1).max(100),
        room: z.enum(["solo", "shared"]),
      }),
    )
    .max(6)
    .refine(
      (t) => new Set(t.map((p) => p.initials)).size === t.length,
      "Las iniciales deben ser únicas",
    ),
  rooms: z.object({
    solo: z.string().trim().max(20),
    shared: z.string().trim().max(20),
  }),
  arrival: z.string().max(120),
  football: z.string().max(150),
  luggage: z.boolean(),
  checkedIn: z.boolean(),
  drive: driveSchema.default(emptyDrive),
});
export const tripImportSchema = z.object({ trip: tripSchema });
export const emptyTrip = {
  travelers: [],
  rooms: { solo: "", shared: "" },
  arrival: "Jueves 29 de octubre · por la tarde",
  football: "",
  luggage: false,
  checkedIn: false,
  drive: emptyDrive,
};
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
  trip: tripSchema.default(emptyTrip),
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
