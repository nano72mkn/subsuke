import type { WebAppManifest } from '@remix-pwa/dev';
import { type LoaderFunction } from '@remix-run/node';
import { siteConfig } from '~/config/site';

export const loader: LoaderFunction = async () => {
  return Response.json(
    {
      name: siteConfig.title,
      short_name: 'Subsuke',
      description: siteConfig.description,
      start_url: '/',
      display: 'standalone',
      background_color: '#fff',
      theme_color: '#000',
      icons: [
        {
          src: "/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: "/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png"
        }
      ],
    } as WebAppManifest,
    {
      headers: {
        'Cache-Control': 'public, max-age=600',
        'Content-Type': 'application/manifest+json',
      },
    }
  );
};
