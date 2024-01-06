import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { Provider } from "react-redux";
import { store } from "@/store";
import ThemeLayout from "@/components/layout/ThemeLayout";
import ErrorBoundary from "@/components/errorboundary";
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <ErrorBoundary>
      <SessionProvider session={session}>
        <Provider store={store}>
          <ThemeLayout>
            <Component {...pageProps} />
          </ThemeLayout>
          <Toaster />
        </Provider>
      </SessionProvider>
    </ErrorBoundary>
  );
}
