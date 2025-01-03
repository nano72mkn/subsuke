import type { LinksFunction } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";

import { ErrorCard } from "./components/ErrorCard/ErrorCard";
import { Header } from "./components/Header";
import { Toaster } from "./components/ui/toaster";
import styles from "./tailwind.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  { rel: "manifest", href: "/manifest.webmanifest" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja-JP">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="google-adsense-account" content="ca-pub-3796518837940513" />
        <Meta />
        <Links />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3796518837940513"
          crossOrigin="anonymous"></script>
      </head>
      <body>
        <Header />
        <div className="container mx-auto p-4 mb-24">
          {children}
        </div>
        <Toaster />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <ErrorCard title={`${error.status}: ${error.statusText}`} description={error.data} />
    );
  } else if (error instanceof Error) {
    return (
      <ErrorCard title="Error" description={error.message} />
    );
  } else {
    return <ErrorCard title="Error" description="予期せぬエラーが発生しました" />;
  }
}
