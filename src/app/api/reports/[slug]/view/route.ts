import { NextResponse } from "next/server";
import { incrementReportView } from "@/lib/reportViews";
import { getReport } from "@/lib/reports";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (!getReport(slug)) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  await incrementReportView(slug);
  return NextResponse.json({ ok: true });
}
