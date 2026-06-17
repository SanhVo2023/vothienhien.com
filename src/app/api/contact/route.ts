import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 5; // max 5 submissions per window

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) {
    return true;
  }

  return false;
}

export async function POST(request: Request) {
  try {
    // Rate limiting
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() || 'unknown';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate matterType if provided
    const validMatterTypes = ['civil', 'land', 'family', 'corporate', 'criminal', 'labor', 'other'];
    if (body.matterType && !validMatterTypes.includes(body.matterType)) {
      return NextResponse.json(
        { error: 'Invalid matter type' },
        { status: 400 }
      );
    }

    // Bound input sizes — a public endpoint must not let anyone store oversized
    // payloads in the DB (abuse / storage exhaustion).
    if (
      typeof body.name !== 'string' || body.name.length > 200 ||
      typeof body.email !== 'string' || body.email.length > 200 ||
      (body.phone && (typeof body.phone !== 'string' || body.phone.length > 40)) ||
      typeof body.message !== 'string' || body.message.length > 5000
    ) {
      return NextResponse.json(
        { error: 'One or more fields exceed the allowed length' },
        { status: 400 }
      );
    }

    const payload = await getPayload({ config });

    await payload.create({
      collection: 'contact-submissions',
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone || '',
        matterType: body.matterType || 'other',
        message: body.message,
        language: body.language || 'vi',
        submittedAt: new Date().toISOString(),
        status: 'new',
      },
    });

    // Mirror to centralized Apolo Contact Form Hub (fire-and-forget).
    // Local Payload write is the source of truth; hub failure must NOT block the user.
    if (process.env.CONTACT_HUB_URL) {
      void fetch(process.env.CONTACT_HUB_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          site: 'vothienhien.com',
          name: body.name,
          email: body.email,
          phone: body.phone || '',
          matter_type: body.matterType || 'other',
          message: body.message,
          language: body.language || 'vi',
          locale: request.headers.get('accept-language') || '',
          user_agent: request.headers.get('user-agent') || '',
          source_url: request.headers.get('referer') || '',
        }),
      }).catch((err) => console.error('Contact hub mirror failed:', err));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to submit' },
      { status: 500 }
    );
  }
}
