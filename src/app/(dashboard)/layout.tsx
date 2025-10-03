import { redirectUnauthenticated } from '@/lib/auth-guard';

type DashboardLayoutProps = { children: React.ReactNode };

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  await redirectUnauthenticated();
  return children;
}
