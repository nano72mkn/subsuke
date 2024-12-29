import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

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
