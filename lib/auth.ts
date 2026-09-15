import { cache } from "react";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db/client";
import { users, type User } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * Lazy get-or-create user in Neon Postgres based on active Clerk session.
 * Wrapped in React cache() so multiple DAL calls in one request trigger only one DB lookup.
 */
export const requireUser = cache(async (): Promise<User> => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Check if user exists in database
  const existingUsers = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (existingUsers.length > 0) {
    return existingUsers[0];
  }

  // Lazy create user if missing
  const clerkUser = await currentUser();

  const email =
    clerkUser?.emailAddresses.find(
      (e) => e.id === clerkUser.primaryEmailAddressId
    )?.emailAddress ??
    clerkUser?.emailAddresses[0]?.emailAddress ??
    "user@example.com";

  const name =
    [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") ||
    clerkUser?.username ||
    "Learner";

  const imageUrl = clerkUser?.imageUrl;

  const [newUser] = await db
    .insert(users)
    .values({
      id: userId,
      email,
      name,
      imageUrl,
      isOnboarded: false,
    })
    .returning();

  return newUser;
});

/**
 * Get current user if authenticated, without forcing redirect.
 */
export const getOptionalUser = cache(async (): Promise<User | null> => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const existingUsers = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (existingUsers.length > 0) {
    return existingUsers[0];
  }

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email =
    clerkUser.emailAddresses.find(
      (e) => e.id === clerkUser.primaryEmailAddressId
    )?.emailAddress ??
    clerkUser.emailAddresses[0]?.emailAddress ??
    "user@example.com";

  const name =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
    clerkUser.username ||
    "Learner";

  const imageUrl = clerkUser.imageUrl;

  const [newUser] = await db
    .insert(users)
    .values({
      id: userId,
      email,
      name,
      imageUrl,
      isOnboarded: false,
    })
    .returning();

  return newUser;
});
