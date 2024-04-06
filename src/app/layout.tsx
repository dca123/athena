import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/themeProvider';
import { QueryClientWrapper } from './QueryClientWrapper';
import {
  ClerkProvider,
  OrganizationSwitcher,
  UserButton,
  auth,
} from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { PropsWithChildren } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Athena',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <main className="flex min-h-screen flex-col items-center p-24 space-y-4 h-screen">
              <RequiredActiveOrgLayout>
                <Header />
                <QueryClientWrapper>{children}</QueryClientWrapper>
              </RequiredActiveOrgLayout>
            </main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

const Header = () => {
  return (
    <div className="flex flex-row justify-between w-full items-center">
      <div>
        <h1 className="text-lg self-start font-mono leading-4 tracking-wider">
          Athena
        </h1>
      </div>
      <div className=" flex flex-row space-x-2">
        <OrganizationSwitcher hidePersonal={true} />
        <UserButton />
      </div>
    </div>
  );
};

function RequiredActiveOrgLayout(props: PropsWithChildren) {
  const { orgId } = auth();
  if (orgId) {
    return props.children;
  }

  return (
    <section>
      <h1>Welcome to the Organization Selection page.</h1>
      <p>
        This part of the application requires the user to select an organization
        in order to proceed. If you are not part of an organization, you can
        accept an invitation or create your own organization.
      </p>
      <OrganizationSwitcher hidePersonal={true} />
    </section>
  );
}
