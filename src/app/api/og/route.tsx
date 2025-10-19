import { ImageResponse } from 'next/og';
import SiteOgImage from '@/components/og/SiteOgImage';

export const runtime = 'edge';

export async function GET() {
  const name = 'Jason Su';
  const role = 'Software Engineer';
  return new ImageResponse(
    <SiteOgImage name={name} role={role} />,
    {
      width: 1200,
      height: 630,
    },
  );
}