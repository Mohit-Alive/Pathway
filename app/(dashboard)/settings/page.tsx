import { auth } from '@clerk/nextjs/server';
import { UserProfile } from '@clerk/nextjs';
import { PageHeader } from '@/components/shell/PageHeader';

export default async function SettingsPage() {
  const { userId } = await auth();

  return (
    <>
      <PageHeader title="Settings" />
      <div className="flex-1 overflow-auto p-4 sm:p-8">
        <div className="mx-auto max-w-3xl">
          {userId ? (
            <UserProfile
              routing="hash"
              appearance={{ elements: { rootBox: 'w-full', card: 'w-full shadow-none border border-slate-200' } }}
            />
          ) : (
            <p className="text-sm font-medium text-slate-500">Sign in to manage your account settings.</p>
          )}
        </div>
      </div>
    </>
  );
}
