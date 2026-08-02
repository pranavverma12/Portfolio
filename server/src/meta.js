// Visitor metadata capture.
// We pull what we can server-side from headers and the browser, then ask an
// IP-to-geo service for country/city (when configured).

import { UAParser } from 'ua-parser-js';
import { config } from './config.js';

const parser = new UAParser();

export function parseReqMeta(req, body = {}) {
  // 1. IP — Render sets x-forwarded-for; trust-proxy=1 means we can use it.
  const xff = req.headers['x-forwarded-for'];
  const ip =
    (typeof xff === 'string' && xff.split(',')[0].trim()) ||
    req.socket?.remoteAddress ||
    '0.0.0.0';

  // 2. UA-derived browser + OS
  parser.setUA(req.headers['user-agent'] || '');
  const ua = parser.getResult();

  // 3. Anything else the browser client volunteers
  const client = body.client || {};

  return {
    ip,
    user_agent: req.headers['user-agent'] || '',
    browser: ua?.browser ? `${ua.browser.name} ${ua.browser.version || ''}`.trim() : null,
    os: ua?.os ? `${ua.os.name} ${ua.os.version || ''}`.trim() : null,
    device_type: ua?.device?.type || 'desktop',
    language: req.headers['accept-language']?.split(',')[0] || client.lang || null,
    timezone: client.tz || null,
    screen: client.screen || null,
    viewport: client.viewport || null,
    referer: req.headers['referer'] || null,
    // Geo derived once cached — see lookupGeo()
    country: null,
    city: null,
    region: null,
    asn: null,
  };
}

// Cached geo so we don't hammer the geo provider per request.
const geoCache = new Map(); // ip -> { country, city, region, asn, ts }
const GEO_TTL_MS = 1000 * 60 * 60 * 24; // 24h

// Optional: resolve geo via ipapi.co (free tier, IP-based only).
// Configure GEO_PROVIDER_URL if you want it enabled; otherwise it stays null.
export async function lookupGeo(ip) {
  if (!process.env.GEO_PROVIDER_URL || ip === '0.0.0.0') return null;
  const cached = geoCache.get(ip);
  if (cached && Date.now() - cached.ts < GEO_TTL_MS) return cached;

  try {
    const url = `${process.env.GEO_PROVIDER_URL.replace(/\/$/, '')}/${encodeURIComponent(ip)}`;
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) return null;
    const data = await res.json();
    const out = {
      country: data.country || data.country_code || null,
      city: data.city || null,
      region: data.region || data.region_code || null,
      asn: data.asn || data.org || null,
      ts: Date.now(),
    };
    geoCache.set(ip, out);
    return out;
  } catch {
    return null;
  }
}

export async function applyGeo(meta) {
  const g = await lookupGeo(meta.ip);
  if (!g) return meta;
  return { ...meta, country: g.country, city: g.city, region: g.region, asn: g.asn };
}
