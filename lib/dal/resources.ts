import { getOptionalUser, requireUser } from "@/lib/auth";
import { db } from "@/lib/db/client";
import {
  curatedResources,
  userSavedResources,
  type CuratedResource,
} from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { withDbRetry } from "@/lib/db/retry";

export interface ResourceWithSavedStatus extends CuratedResource {
  isSaved: boolean;
}

export async function getCuratedResourcesList(): Promise<ResourceWithSavedStatus[]> {
  const user = await getOptionalUser();

  const allResources = await withDbRetry(() => db.select().from(curatedResources));

  const savedIds = new Set<string>();
  if (user) {
    const userSaved = await withDbRetry(() =>
      db
        .select({ resourceId: userSavedResources.resourceId })
        .from(userSavedResources)
        .where(eq(userSavedResources.userId, user.id))
    );

    for (const s of userSaved) {
      savedIds.add(s.resourceId);
    }
  }

  return allResources.map((r) => ({
    ...r,
    isSaved: savedIds.has(r.id),
  }));
}

export async function toggleSaveResource(resourceId: string): Promise<{ isSaved: boolean }> {
  const user = await requireUser();

  const existing = await db
    .select()
    .from(userSavedResources)
    .where(
      and(
        eq(userSavedResources.userId, user.id),
        eq(userSavedResources.resourceId, resourceId)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    await db
      .delete(userSavedResources)
      .where(eq(userSavedResources.id, existing[0].id));
    return { isSaved: false };
  } else {
    await db.insert(userSavedResources).values({
      userId: user.id,
      resourceId,
    });
    return { isSaved: true };
  }
}
