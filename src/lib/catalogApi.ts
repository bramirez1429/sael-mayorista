import { NextResponse } from "next/server";

const adminDashboardOrigin = process.env.ADMIN_DASHBOARD_ORIGIN?.trim();

export function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": adminDashboardOrigin || "",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
    Vary: "Origin",
  };
}

export function jsonResponse(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: corsHeaders() });
}

export function unauthorizedResponse(request: Request) {
  const expectedToken = process.env.CATALOG_ADMIN_TOKEN;
  const authorization = request.headers.get("authorization");
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : "";
  const sameOrigin = request.headers.get("origin") === new URL(request.url).origin;

  if ((expectedToken && token === expectedToken) || sameOrigin) return null;
  return jsonResponse({ error: "No autorizado." }, 401);
}

export function optionsResponse(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== adminDashboardOrigin && origin !== new URL(request.url).origin) {
    return jsonResponse({ error: "Origin no autorizado." }, 403);
  }
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}
