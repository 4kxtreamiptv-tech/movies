import { NextResponse } from "next/server";
import {
  REFERENCE_HOME_SOURCE_URL,
  buildReferenceHomePayloadFromHtml,
  isSnapshotEmpty,
  readReferenceHomeSnapshot,
  writeReferenceHomeSnapshot,
  type RefHomeDiskPayload,
} from "@/lib/referenceHomeSnapshot";

/** Short in-memory cache so repeated API hits don't re-read disk every time. */
let mem: { at: number; data: RefHomeDiskPayload } | null = null;
const MEM_TTL_MS = 60 * 1000;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const refresh = searchParams.get("refresh") === "1" || searchParams.get("force") === "1";

    if (!refresh && mem && Date.now() - mem.at < MEM_TTL_MS) {
      return NextResponse.json(mem.data, {
        headers: { "Cache-Control": "public, max-age=60" },
      });
    }

    const disk = readReferenceHomeSnapshot();

    if (!refresh && disk && !isSnapshotEmpty(disk)) {
      mem = { at: Date.now(), data: disk };
      return NextResponse.json(disk, {
        headers: { "Cache-Control": "public, max-age=300" },
      });
    }

    const res = await fetch(REFERENCE_HOME_SOURCE_URL, {
      cache: "no-store",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; movies-site-bot/1.0; +https://example.invalid)",
        Accept: "text/html",
      },
    });
    if (!res.ok) {
      if (disk && !isSnapshotEmpty(disk)) {
        return NextResponse.json(disk, { status: 200 });
      }
      return NextResponse.json(
        { error: `Failed to fetch source: ${res.status}` },
        { status: 502 }
      );
    }

    const html = await res.text();
    const data = buildReferenceHomePayloadFromHtml(html);

    writeReferenceHomeSnapshot(data);
    mem = { at: Date.now(), data };

    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, max-age=300" },
    });
  } catch (e) {
    console.error("Error in /api/reference/home:", e);
    const disk = readReferenceHomeSnapshot();
    if (disk && !isSnapshotEmpty(disk)) {
      return NextResponse.json(disk);
    }
    return NextResponse.json({ error: "Failed to load reference home" }, { status: 500 });
  }
}
