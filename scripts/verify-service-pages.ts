import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { servicePageSettings, serviceSections } from "../shared/schema";
import {
  serviceSectionOrderPatchSchema,
  serviceSectionPatchSchema,
} from "../shared/service-page";
import { db } from "../server/db";
import { autocolantesSectionDefaults } from "../server/service-pages/autocolantes-defaults";
import { servicePageErrorStatus } from "../server/service-pages/routes";
import {
  getPublicServicePage,
  patchServiceSection,
  reorderServiceSections,
  seedAutocolantesServicePage,
  ServicePageConflictError,
  ServicePageValidationError,
} from "../server/service-pages/storage";

async function verify() {
  const serviceId = `service-page-verification-${randomUUID()}`;
  const hero = autocolantesSectionDefaults.find((section) => section.type === "hero")!;
  const trust = autocolantesSectionDefaults.find((section) => section.type === "trust")!;

  try {
    await db.insert(servicePageSettings).values({
      serviceId,
      title: "Verification",
      description: "Verification",
    });
    await db.insert(serviceSections).values([
      { ...hero, id: randomUUID(), serviceId, key: "hero", position: 0 },
      { ...trust, id: randomUUID(), serviceId, key: "trust", position: 1 },
    ]);

    const publicPage = await getPublicServicePage(serviceId);
    assert.equal(publicPage?.serviceId, serviceId);
    assert.equal(publicPage?.sections.length, 2);
    assert.ok(publicPage?.seo);
    assert.ok("legacyGallery" in publicPage!);

    const nestedPatch = serviceSectionPatchSchema.parse({
      type: "hero",
      version: 1,
      content: { primaryCta: { text: "Novo texto" } },
    });
    const nested = await patchServiceSection(
      serviceId,
      "hero",
      nestedPatch.type,
      nestedPatch.version,
      nestedPatch.content,
    );
    const nestedContent = nested.content as typeof hero.content;
    assert.equal((nestedContent.primaryCta as Record<string, unknown>).text, "Novo texto");
    assert.equal(
      (nestedContent.primaryCta as Record<string, unknown>).href,
      (hero.content.primaryCta as Record<string, unknown>).href,
    );

    const originalPoints = trust.content.points as Array<Record<string, unknown>>;
    const reversedPoints = [...originalPoints]
      .reverse()
      .map((point, position) => ({ ...point, position }));
    const reorderedPointsPatch = serviceSectionPatchSchema.parse({
      type: "trust",
      version: 1,
      content: { points: reversedPoints },
    });
    const reorderedPoints = await patchServiceSection(
      serviceId,
      "trust",
      reorderedPointsPatch.type,
      reorderedPointsPatch.version,
      reorderedPointsPatch.content,
    );
    assert.deepEqual(
      (reorderedPoints.content as Record<string, unknown>).points,
      reversedPoints,
    );

    const emptyPatch = serviceSectionPatchSchema.parse({
      type: "hero",
      version: 2,
      content: { subtitle: "" },
    });
    const emptied = await patchServiceSection(
      serviceId,
      "hero",
      emptyPatch.type,
      emptyPatch.version,
      emptyPatch.content,
    );
    assert.equal((emptied.content as Record<string, unknown>).subtitle, "");

    const emptyArrayPatch = serviceSectionPatchSchema.parse({
      type: "trust",
      version: 2,
      content: { points: [] },
    });
    const emptiedArray = await patchServiceSection(
      serviceId,
      "trust",
      emptyArrayPatch.type,
      emptyArrayPatch.version,
      emptyArrayPatch.content,
    );
    assert.deepEqual((emptiedArray.content as Record<string, unknown>).points, []);

    const staleError = await patchServiceSection(
      serviceId,
      "hero",
      "hero",
      1,
      { title: "stale" },
    ).then(() => null, (error) => error);
    assert.ok(staleError instanceof ServicePageConflictError);
    assert.equal(servicePageErrorStatus(staleError), 409);

    assert.throws(() => serviceSectionPatchSchema.parse({
      type: "gallery",
      version: 1,
      content: { columns: 0 },
    }));

    const reorder = serviceSectionOrderPatchSchema.parse({
      sections: [
        { key: "hero", position: 1, visible: false, version: 3 },
        { key: "trust", position: 0, visible: true, version: 3 },
      ],
    });
    const reordered = await reorderServiceSections(serviceId, reorder.sections);
    assert.deepEqual(reordered.map(({ key, position, visible }) => ({ key, position, visible })), [
      { key: "trust", position: 0, visible: true },
      { key: "hero", position: 1, visible: false },
    ]);

    await assert.rejects(
      () => reorderServiceSections(serviceId, [
        { key: "hero", position: 0, visible: true, version: 4 },
      ]),
      ServicePageValidationError,
    );
    const afterRejected = await getPublicServicePage(serviceId);
    assert.equal(afterRejected?.sections.find((section) => section.key === "hero")?.position, 1);
    assert.equal(afterRejected?.sections.find((section) => section.key === "hero")?.visible, false);

    const concurrent = await Promise.allSettled([
      reorderServiceSections(serviceId, [
        { key: "hero", position: 0, visible: true, version: 4 },
        { key: "trust", position: 1, visible: true, version: 4 },
      ]),
      reorderServiceSections(serviceId, [
        { key: "hero", position: 0, visible: false, version: 4 },
        { key: "trust", position: 1, visible: false, version: 4 },
      ]),
    ]);
    assert.equal(concurrent.filter((result) => result.status === "fulfilled").length, 1);
    assert.equal(concurrent.filter((result) => result.status === "rejected").length, 1);

    await seedAutocolantesServicePage();
    const secondSeed = await seedAutocolantesServicePage();
    assert.equal(secondSeed.insertedSections, 0);
    assert.equal(secondSeed.insertedSettings, 0);
    assert.equal(secondSeed.totalDefaultSections, 10);
  } finally {
    await db.delete(serviceSections).where(eq(serviceSections.serviceId, serviceId));
    await db.delete(servicePageSettings).where(eq(servicePageSettings.serviceId, serviceId));
  }
}

verify()
  .then(() => {
    console.log("Service page verification passed");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });