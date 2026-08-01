import { NextResponse } from "next/server";
import { incrementCountryView } from "@/lib/countryViews";
import { getCountry } from "@/lib/countries";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (!getCountry(slug)) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  await incrementCountryView(slug);
  return NextResponse.json({ ok: true });
}
