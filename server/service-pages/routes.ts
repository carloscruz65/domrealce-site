import type { Express, Request, Response } from "express";
import { ZodError } from "zod";
import {
  serviceSectionOrderPatchSchema,
  serviceSectionPatchSchema,
  serviceSeoPatchSchema,
} from "@shared/service-page";
import { protegerAdmin } from "../middleware";
import {
  getPublicServicePage,
  getStoredServicePage,
  patchServiceSection,
  patchServiceSeo,
  reorderServiceSections,
  ServicePageConflictError,
  ServicePageNotFoundError,
  ServicePageValidationError,
} from "./storage";

export function servicePageErrorStatus(error: unknown) {
  if (error instanceof ZodError || error instanceof ServicePageValidationError) return 400;
  if (error instanceof ServicePageNotFoundError) return 404;
  if (error instanceof ServicePageConflictError) return 409;
  return 500;
}

function sendServicePageError(res: Response, error: unknown) {
  const status = servicePageErrorStatus(error);
  if (error instanceof ZodError) {
    return res.status(400).json({ error: "Invalid service page data", issues: error.issues });
  }
  if (error instanceof ServicePageValidationError) {
    return res.status(status).json({ error: error.message });
  }
  if (error instanceof ServicePageNotFoundError) {
    return res.status(status).json({ error: error.message });
  }
  if (error instanceof ServicePageConflictError) {
    return res.status(status).json({ error: error.message });
  }
  console.error("Service page endpoint failed", error);
  return res.status(status).json({ error: "Internal server error" });
}

export function registerServicePageRoutes(app: Express) {
  app.get("/api/service-pages/:serviceId", async (req: Request, res: Response) => {
    try {
      const page = await getPublicServicePage(req.params.serviceId);
      if (!page) return res.status(404).json({ error: "Service page not found" });
      return res.json(page);
    } catch (error) {
      return sendServicePageError(res, error);
    }
  });

  app.get(
    "/api/admin/service-pages/:serviceId",
    protegerAdmin,
    async (req: Request, res: Response) => {
      try {
        const page = await getStoredServicePage(req.params.serviceId);
        if (!page) return res.status(404).json({ error: "Service page not found" });
        return res.json(page);
      } catch (error) {
        return sendServicePageError(res, error);
      }
    },
  );

  app.patch(
    "/api/admin/service-pages/:serviceId/sections/:key",
    protegerAdmin,
    async (req: Request, res: Response) => {
      try {
        const patch = serviceSectionPatchSchema.parse(req.body);
        const section = await patchServiceSection(
          req.params.serviceId,
          req.params.key,
          patch.type,
          patch.version,
          patch.content,
        );
        return res.json(section);
      } catch (error) {
        return sendServicePageError(res, error);
      }
    },
  );

  app.patch(
    "/api/admin/service-pages/:serviceId/seo",
    protegerAdmin,
    async (req: Request, res: Response) => {
      try {
        const patch = serviceSeoPatchSchema.parse(req.body);
        const settings = await patchServiceSeo(req.params.serviceId, patch);
        return res.json(settings);
      } catch (error) {
        return sendServicePageError(res, error);
      }
    },
  );

  app.patch(
    "/api/admin/service-pages/:serviceId/order",
    protegerAdmin,
    async (req: Request, res: Response) => {
      try {
        const patch = serviceSectionOrderPatchSchema.parse(req.body);
        const sections = await reorderServiceSections(req.params.serviceId, patch.sections);
        return res.json({ serviceId: req.params.serviceId, sections });
      } catch (error) {
        return sendServicePageError(res, error);
      }
    },
  );
}