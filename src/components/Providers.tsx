"use client";

import { SidebarContextProvider } from "@/context/SidebarContext";
import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { FC } from "react";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: FC<ProvidersProps> = ({ children }) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <NextUIProvider>
          <NextThemesProvider attribute="class" defaultTheme="dark">
            <SidebarContextProvider>{children}</SidebarContextProvider>
          </NextThemesProvider>
        </NextUIProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
};

export default Providers;
