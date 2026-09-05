import { z } from "zod";

export const serviceSectionTypes = [
  "hero",
  "ordering_steps",
  "application_examples",
  "feature_accordions",
  "gallery",
  "materials_applications_production",
  "audiences",
  "trust",
  "video",
  "final_cta",
] as const;

export const serviceSectionTypeSchema = z.enum(serviceSectionTypes);

const linkSchema = z.object({
  text: z.string(),
  href: z.string(),
});

const positionedItem = {
  id: z.string().min(1),
  position: z.number().int().nonnegative(),
  visible: z.boolean(),
};

const heroContentSchema = z.object({
  badge: z.string(),
  title: z.string(),
  subtitle: z.string(),
  description: z.string(),
  imageSrc: z.string(),
  imageAlt: z.string(),
  primaryCta: linkSchema,
  highlights: z.string(),
});

const orderingStepsContentSchema = z.object({
  titleTop: z.string(),
  titleHighlight: z.string(),
  description: z.string(),
  steps: z.array(z.object({
    ...positionedItem,
    step: z.string(),
    title: z.string(),
    description: z.string(),
    linkText: z.string(),
  })),
  assurances: z.array(z.object({ ...positionedItem, text: z.string() })),
  cta: linkSchema,
});

const applicationExamplesContentSchema = z.object({
  titleTop: z.string(),
  titleHighlight: z.string(),
  description: z.string(),
  items: z.array(z.object({ ...positionedItem, text: z.string() })),
});

const featureAccordionsContentSchema = z.object({
  titleTop: z.string(),
  titleBottom: z.string(),
  subtitle: z.string(),
  defaultOpenKey: z.string().nullable(),
  items: z.array(z.object({
    ...positionedItem,
    key: z.string().min(1),
    icon: z.enum(["scissors", "sticker", "palette", "settings", "zap", "check-circle"]),
    title: z.string(),
    intro: z.string(),
    content: z.array(z.string()),
  })),
});

const galleryContentSchema = z.object({
  title: z.string(),
  description: z.string(),
  columns: z.number().int().min(1).max(6),
  legacyServiceGalleryKey: z.string().min(1),
  fallbackImages: z.array(z.object({
    ...positionedItem,
    src: z.string(),
    alt: z.string(),
    title: z.string(),
  })),
});

const namedDescriptionSchema = z.object({
  ...positionedItem,
  name: z.string(),
  description: z.string(),
});

const materialsContentSchema = z.object({
  titleTop: z.string(),
  titleHighlight: z.string(),
  description: z.string(),
  materialsTitle: z.string(),
  materials: z.array(namedDescriptionSchema),
  applicationsTitle: z.string(),
  applications: z.array(z.object({
    ...positionedItem,
    category: z.string(),
    items: z.array(z.string()),
  })),
  productionTitle: z.string(),
  production: z.array(z.object({
    ...positionedItem,
    step: z.string(),
    title: z.string(),
    description: z.string(),
  })),
});

const audiencesContentSchema = z.object({
  titleTop: z.string(),
  titleHighlight: z.string(),
  description: z.string(),
  items: z.array(z.object({ ...positionedItem, text: z.string() })),
});

const trustContentSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  points: z.array(z.object({ ...positionedItem, text: z.string() })),
});

const videoContentSchema = z.object({
  title: z.string(),
  description: z.string(),
  url: z.string().nullable(),
  poster: z.string().nullable(),
});

const finalCtaContentSchema = z.object({
  titleTop: z.string(),
  titleHighlight: z.string(),
  description: z.string(),
  primaryCta: linkSchema,
  secondaryCta: linkSchema,
  footnote: z.string(),
});

export const serviceSectionContentSchemas = {
  hero: heroContentSchema,
  ordering_steps: orderingStepsContentSchema,
  application_examples: applicationExamplesContentSchema,
  feature_accordions: featureAccordionsContentSchema,
  gallery: galleryContentSchema,
  materials_applications_production: materialsContentSchema,
  audiences: audiencesContentSchema,
  trust: trustContentSchema,
  video: videoContentSchema,
  final_cta: finalCtaContentSchema,
} satisfies Record<typeof serviceSectionTypes[number], z.ZodTypeAny>;

export const serviceSectionDataSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("hero"), content: heroContentSchema }),
  z.object({ type: z.literal("ordering_steps"), content: orderingStepsContentSchema }),
  z.object({ type: z.literal("application_examples"), content: applicationExamplesContentSchema }),
  z.object({ type: z.literal("feature_accordions"), content: featureAccordionsContentSchema }),
  z.object({ type: z.literal("gallery"), content: galleryContentSchema }),
  z.object({ type: z.literal("materials_applications_production"), content: materialsContentSchema }),
  z.object({ type: z.literal("audiences"), content: audiencesContentSchema }),
  z.object({ type: z.literal("trust"), content: trustContentSchema }),
  z.object({ type: z.literal("video"), content: videoContentSchema }),
  z.object({ type: z.literal("final_cta"), content: finalCtaContentSchema }),
]);

const versionSchema = z.number().int().positive();
export const serviceSectionPatchSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("hero"), version: versionSchema, content: heroContentSchema.deepPartial() }).strict(),
  z.object({ type: z.literal("ordering_steps"), version: versionSchema, content: orderingStepsContentSchema.deepPartial() }).strict(),
  z.object({ type: z.literal("application_examples"), version: versionSchema, content: applicationExamplesContentSchema.deepPartial() }).strict(),
  z.object({ type: z.literal("feature_accordions"), version: versionSchema, content: featureAccordionsContentSchema.deepPartial() }).strict(),
  z.object({ type: z.literal("gallery"), version: versionSchema, content: galleryContentSchema.deepPartial() }).strict(),
  z.object({ type: z.literal("materials_applications_production"), version: versionSchema, content: materialsContentSchema.deepPartial() }).strict(),
  z.object({ type: z.literal("audiences"), version: versionSchema, content: audiencesContentSchema.deepPartial() }).strict(),
  z.object({ type: z.literal("trust"), version: versionSchema, content: trustContentSchema.deepPartial() }).strict(),
  z.object({ type: z.literal("video"), version: versionSchema, content: videoContentSchema.deepPartial() }).strict(),
  z.object({ type: z.literal("final_cta"), version: versionSchema, content: finalCtaContentSchema.deepPartial() }).strict(),
]);

export const serviceSeoPatchSchema = z.object({
  version: z.number().int().positive(),
  title: z.string().optional(),
  description: z.string().optional(),
  ogImage: z.string().nullable().optional(),
}).strict();

export const serviceSectionOrderPatchSchema = z.object({
  sections: z.array(z.object({
    key: z.string().min(1),
    position: z.number().int().nonnegative(),
    visible: z.boolean(),
    version: z.number().int().positive(),
  }).strict()).min(1),
}).strict().superRefine(({ sections }, ctx) => {
  for (const field of ["key", "position"] as const) {
    const values = sections.map((section) => section[field]);
    if (new Set(values).size !== values.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Duplicate section ${field}`,
        path: ["sections"],
      });
    }
  }
});

export const servicePageSeoSchema = z.object({
  title: z.string(),
  description: z.string(),
  ogImage: z.string().nullable(),
  version: z.number().int().positive(),
});

export type ServiceSectionType = z.infer<typeof serviceSectionTypeSchema>;
export type ServiceSectionData = z.infer<typeof serviceSectionDataSchema>;
export type ServiceSectionPatch = z.infer<typeof serviceSectionPatchSchema>;