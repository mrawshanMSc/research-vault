import { NextResponse } from "next/server";
import { createLink, listLinks } from "@/lib/links";
import { validateLinkInput } from "@/lib/validation";
import type { LinkFilters } from "@/lib/types";

export const dynamic = "force-dynamic";

function getFilterValue(value: string | string[] | undefined) {
  return typeof value === "string" ? value : "";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filters: LinkFilters = {
    search: getFilterValue(searchParams.get("search") ?? undefined),
    category: getFilterValue(searchParams.get("category") ?? undefined),
    tag: getFilterValue(searchParams.get("tag") ?? undefined),
  };

  try {
    const links = await listLinks(filters);
    return Response.json({ links, filters });
  } catch (error) {
    console.error("Failed to load research links", error);

    return Response.json(
      { message: "Unable to load links right now." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { data, errors } = validateLinkInput(body);

    if (!data) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const newLink = await createLink(data);

    return NextResponse.json(newLink, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create link" },
      { status: 500 }
    );
  }
}
