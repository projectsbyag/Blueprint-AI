
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blueprint Editor | AI Design Tool',
  description: 'Create and edit your designs using the Blueprint AI-powered editor.',
};

export default function BlueprintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
