import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const API_BASE = "https://upnshare.com";
const API_TOKEN = "f6335d071b5b4ed82bace91d";

export async function GET(request: NextRequest) {
    const { pathname, searchParams } = new URL(request.url);
    const endpoint = pathname.replace("/api/streamix-api", "");

    const params = new URLSearchParams(searchParams);

    try {
        const response = await fetch(`${API_BASE}${endpoint}?${params.toString()}`, {
            headers: {
                "api-token": API_TOKEN,
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const text = await response.text();
            return NextResponse.json(
                { error: "Invalid response from upstream API", details: text },
                { status: response.status }
            );
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return NextResponse.json(
                { error: `API Error: ${response.statusText}`, ...errorData },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch from upstream API", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    const { pathname, searchParams } = new URL(request.url);
    const endpoint = pathname.replace("/api/streamix-api", "");

    const params = new URLSearchParams(searchParams);

    try {
        const body = await request.json();

        const response = await fetch(`${API_BASE}${endpoint}?${params.toString()}`, {
            method: "POST",
            headers: {
                "api-token": API_TOKEN,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const text = await response.text();
            return NextResponse.json(
                { error: "Invalid response from upstream API", details: text },
                { status: response.status }
            );
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return NextResponse.json(
                { error: `API Error: ${response.statusText}`, ...errorData },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch from upstream API", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}
