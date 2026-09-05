---
name: Drizzle schema application
description: Safe handling of this project's legacy schema drift when adding new Drizzle tables.
---

The development database already has a unique index on the service gallery identifier under a different generated name. A full Drizzle push therefore prompts to add a redundant constraint and offers truncation.

**Why:** Accepting the destructive option would erase existing service galleries, while this drift is unrelated to new additive tables.

**How to apply:** Never approve gallery truncation. Keep `shared/schema.ts` authoritative, apply only the required additive development DDL when the full push is blocked, and rely on Replit Publish for the production schema diff.