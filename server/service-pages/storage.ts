import { and, asc, eq } from "drizzle-orm";
import {
  serviceGalleries,
  servicePageSettings,
  serviceSections,
  type ServiceSection,
} from "@shared/schema";
import {
  servicePageSeoSchema,
  serviceSectionDataSchema,
  type ServiceSectionType,
} from "@shared/service-page";
import { db } from "../db";
import {
  AUTOCOLANTES_SERVICE_ID,
  autocolantesSectionDefaults,
  autocolantesSeoDefault,
} from "./autocolantes-defaults";

export class ServicePageNotFoundError extends Error {}
export class ServicePageConflictError extends Error {}
export class ServicePageValidationError extends Error {}

export function deepMerge<T>(current: T, patch: unknown): T {
  if (Array.isArray(current) && Array.isArray(patch)) {
    if (patch.length === 0) return patch as T;
    const currentItems = current as unknown[];
    const isIdPatch = patch.every(
      (value) => value !== null && typeof value === "object" &&
        typeof (value as Record<string, unknown>).id === "string",
    );
    if (isIdPatch) {
      const patches = new Map(
        patch.map((value) => [(value as Record<string, unknown>).id, value]),
      );
      const merged = currentItems.map((value) => {
        if (value === null || typeof value !== "object") return value;
        const id = (value as Record<string, unknown>).id;
        return typeof id === "string" && patches.has(id)
          ? deepMerge(value, patches.get(id))
          : value;
      });
      const existingIds = new Set(
        currentItems.map((value) =>
          value !== null && typeof value === "object"
            ? (value as Record<string, unknown>).id
            : undefined),
      );
      for (const value of patch) {
        if (!existingIds.has((value as Record<string, unknown>).id)) merged.push(value);
      }
      return merged as T;
    }
    return patch as T;
  }
  if (
    current !== null &&
    patch !== null &&
    typeof current === "object" &&
    typeof patch === "object" &&
    !Array.isArray(current) &&
    !Array.isArray(patch)
  ) {
    const result: Record<string, unknown> = { ...(current as Record<string, unknown>) };
    for (const [key, value] of Object.entries(patch as Record<string, unknown>)) {
      if (value === undefined) continue;
      result[key] = key in result ? deepMerge(result[key], value) : value;
    }
    return result as T;
  }
  return patch as T;
}

function normalizeSection(section: ServiceSection) {
  const parsed = serviceSectionDataSchema.parse({
    type: section.type,
    content: section.content,
  });
  return { ...section, content: parsed.content };
}

export async function getStoredServicePage(serviceId: string) {
  const [sections, settings, gallery] = await Promise.all([
    db.select().from(serviceSections)
      .where(eq(serviceSections.serviceId, serviceId))
      .orderBy(asc(serviceSections.position), asc(serviceSections.key)),
    db.select().from(servicePageSettings)
      .where(eq(servicePageSettings.serviceId, serviceId))
      .then((rows) => rows[0]),
    db.select().from(serviceGalleries)
      .where(eq(serviceGalleries.serviceId, serviceId))
      .then((rows) => rows[0]),
  ]);
  if (!sections.length && !settings) return undefined;
  return {
    serviceId,
    sections: sections.map(normalizeSection),
    seo: settings ? servicePageSeoSchema.parse({
      title: settings.title,
      description: settings.description,
      ogImage: settings.ogImage,
      version: settings.version,
    }) : null,
    legacyGallery: gallery ?? null,
  };
}

export function getAutocolantesFallbackPage(legacyGallery: unknown = null) {
  const now = new Date(0);
  return {
    serviceId: AUTOCOLANTES_SERVICE_ID,
    sections: autocolantesSectionDefaults.map((section) => normalizeSection({
      ...section,
      type: section.type,
      version: 1,
      createdAt: now,
      updatedAt: now,
    } as ServiceSection)),
    seo: {
      title: autocolantesSeoDefault.title,
      description: autocolantesSeoDefault.description,
      ogImage: autocolantesSeoDefault.ogImage,
      version: 1,
    },
    legacyGallery,
  };
}

export async function getPublicServicePage(serviceId: string) {
  const stored = await getStoredServicePage(serviceId);
  if (serviceId !== AUTOCOLANTES_SERVICE_ID) return stored;
  if (stored) {
    const storedKeys = new Set(stored.sections.map((section) => section.key));
    const fallback = getAutocolantesFallbackPage(stored.legacyGallery);
    return {
      ...stored,
      sections: [
        ...stored.sections,
        ...fallback.sections.filter((section) => !storedKeys.has(section.key)),
      ].sort((a, b) => a.position - b.position || a.key.localeCompare(b.key)),
      seo: stored.seo ?? fallback.seo,
    };
  }
  const [gallery] = await db.select().from(serviceGalleries)
    .where(eq(serviceGalleries.serviceId, serviceId));
  return getAutocolantesFallbackPage(gallery ?? null);
}

export async function patchServiceSection(
  serviceId: string,
  key: string,
  type: ServiceSectionType,
  version: number,
  contentPatch: Record<string, unknown>,
) {
  const [existing] = await db.select().from(serviceSections)
    .where(and(eq(serviceSections.serviceId, serviceId), eq(serviceSections.key, key)));
  if (!existing) throw new ServicePageNotFoundError("Section not found");
  if (existing.type !== type) {
    throw new ServicePageValidationError(`Section type must be ${existing.type}`);
  }
  if (existing.version !== version) throw new ServicePageConflictError("Section version conflict");

  const content = deepMerge(existing.content, contentPatch);
  const validated = serviceSectionDataSchema.parse({ type, content });
  const [updated] = await db.update(serviceSections)
    .set({ content: validated.content, version: version + 1, updatedAt: new Date() })
    .where(and(eq(serviceSections.id, existing.id), eq(serviceSections.version, version)))
    .returning();
  if (!updated) throw new ServicePageConflictError("Section version conflict");
  return normalizeSection(updated);
}

export async function patchServiceSeo(
  serviceId: string,
  patch: {
    version: number;
    title?: string;
    description?: string;
    ogImage?: string | null;
  },
) {
  const [existing] = await db.select().from(servicePageSettings)
    .where(eq(servicePageSettings.serviceId, serviceId));
  if (!existing) throw new ServicePageNotFoundError("Service settings not found");
  if (existing.version !== patch.version) throw new ServicePageConflictError("SEO version conflict");
  const { version, ...fields } = patch;
  const [updated] = await db.update(servicePageSettings)
    .set({ ...fields, version: version + 1, updatedAt: new Date() })
    .where(and(
      eq(servicePageSettings.serviceId, serviceId),
      eq(servicePageSettings.version, version),
    ))
    .returning();
  if (!updated) throw new ServicePageConflictError("SEO version conflict");
  return updated;
}

export async function reorderServiceSections(
  serviceId: string,
  changes: Array<{ key: string; position: number; visible: boolean; version: number }>,
) {
  return db.transaction(async (tx) => {
    const all = await tx.select().from(serviceSections)
      .where(eq(serviceSections.serviceId, serviceId))
      .for("update");
    if (!all.length) throw new ServicePageNotFoundError("Service page not found");

    const byKey = new Map(all.map((section) => [section.key, section]));
    for (const change of changes) {
      const existing = byKey.get(change.key);
      if (!existing) throw new ServicePageNotFoundError(`Section ${change.key} not found`);
      if (existing.version !== change.version) {
        throw new ServicePageConflictError(`Section ${change.key} version conflict`);
      }
    }

    const changedByKey = new Map(changes.map((change) => [change.key, change]));
    const finalPositions = all.map((section) =>
      changedByKey.get(section.key)?.position ?? section.position);
    if (new Set(finalPositions).size !== finalPositions.length) {
      throw new ServicePageValidationError("Duplicate final section positions");
    }

    for (let index = 0; index < changes.length; index += 1) {
      const change = changes[index];
      const existing = byKey.get(change.key)!;
      const [reserved] = await tx.update(serviceSections)
        .set({
          position: -(index + 1),
          updatedAt: new Date(),
        })
        .where(and(
          eq(serviceSections.id, existing.id),
          eq(serviceSections.version, change.version),
        ))
        .returning();
      if (!reserved) throw new ServicePageConflictError(`Section ${change.key} version conflict`);
    }

    for (const change of changes) {
      const existing = byKey.get(change.key)!;
      const [updated] = await tx.update(serviceSections)
        .set({
          position: change.position,
          visible: change.visible,
          version: change.version + 1,
          updatedAt: new Date(),
        })
        .where(and(
          eq(serviceSections.id, existing.id),
          eq(serviceSections.version, change.version),
        ))
        .returning();
      if (!updated) throw new ServicePageConflictError(`Section ${change.key} version conflict`);
    }

    return tx.select().from(serviceSections)
      .where(eq(serviceSections.serviceId, serviceId))
      .orderBy(asc(serviceSections.position), asc(serviceSections.key));
  });
}

export async function seedAutocolantesServicePage() {
  for (const section of autocolantesSectionDefaults) {
    serviceSectionDataSchema.parse({ type: section.type, content: section.content });
  }

  return db.transaction(async (tx) => {
    const insertedSections = await tx.insert(serviceSections)
      .values(autocolantesSectionDefaults)
      .onConflictDoNothing({
        target: [serviceSections.serviceId, serviceSections.key],
      })
      .returning({ id: serviceSections.id });
    const insertedSettings = await tx.insert(servicePageSettings)
      .values(autocolantesSeoDefault)
      .onConflictDoNothing({ target: servicePageSettings.serviceId })
      .returning({ serviceId: servicePageSettings.serviceId });
    return {
      insertedSections: insertedSections.length,
      insertedSettings: insertedSettings.length,
      totalDefaultSections: autocolantesSectionDefaults.length,
    };
  });
}