import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title') || 'Kenya’s School News & Learning, Made Clear';
    const tag = searchParams.get('tag') || 'CBC & 8-4-4 Education Desk';
    const desc = searchParams.get('desc') || 'Exam timelines, free schemes of work, revision notes & AI tutoring for Kenyan families.';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #132e14 0%, #1a3d1b 45%, #2c5f2d 100%)',
            padding: '55px 65px',
            fontFamily: 'sans-serif',
            position: 'relative',
          }}
        >
          {/* Kenya Flag strip along top border */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '8px',
              display: 'flex',
            }}
          >
            <div style={{ flex: 1, background: '#111111' }} />
            <div style={{ width: '8px', background: '#ffffff' }} />
            <div style={{ flex: 1, background: '#bb0000' }} />
            <div style={{ width: '8px', background: '#ffffff' }} />
            <div style={{ flex: 1, background: '#2c5f2d' }} />
          </div>

          {/* Header row: Brand & Tag badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  fontSize: '34px',
                  background: 'rgba(255, 255, 255, 0.16)',
                  padding: '6px 14px',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                🏡
              </div>
              <span
                style={{
                  fontSize: '32px',
                  fontWeight: 800,
                  color: '#ffffff',
                  letterSpacing: '-0.5px',
                }}
              >
                Mwalimu Family
              </span>
            </div>

            <div
              style={{
                background: '#f4a261',
                color: '#1a1a1a',
                padding: '8px 20px',
                borderRadius: '50px',
                fontWeight: 800,
                fontSize: '17px',
                display: 'flex',
                alignItems: 'center',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
              }}
            >
              {tag}
            </div>
          </div>

          {/* Dynamic Headline Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', margin: '20px 0' }}>
            <h1
              style={{
                fontSize: title.length > 55 ? '50px' : '62px',
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1.15,
                margin: 0,
                letterSpacing: '-1.5px',
                maxWidth: '960px',
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: '23px',
                color: 'rgba(255, 255, 255, 0.88)',
                lineHeight: 1.4,
                margin: 0,
                maxWidth: '900px',
              }}
            >
              {desc}
            </p>
          </div>

          {/* Footer Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '22px',
              borderTop: '1px solid rgba(255, 255, 255, 0.22)',
              width: '100%',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '19px',
              }}
            >
              <span>🇰🇪 Kenya&apos;s Education Portal</span>
              <span>•</span>
              <span>CBC &amp; 8-4-4 Materials</span>
              <span>•</span>
              <span>mwalimufamily.co.ke</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#25D366',
                color: '#07240f',
                padding: '8px 18px',
                borderRadius: '50px',
                fontWeight: 700,
                fontSize: '17px',
              }}
            >
              <span>Mwalimu News Desk</span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate OG image: ${e.message}`, { status: 500 });
  }
}
