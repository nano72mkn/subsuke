import type { WebAppManifest } from '@remix-pwa/dev';
import { data } from '@remix-run/node';

export const loader = () => {
  return data(
    {
      name: 'Subsuke - サブスク管理アプリ',
      short_name: 'Subsuke',
      description: "サブスクリプションを管理するアプリ",
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
