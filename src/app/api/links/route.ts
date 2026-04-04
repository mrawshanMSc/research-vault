import { NextResponse } from "next/server";
import { createLink, listLinks } from "@/lib/links";
import { validateCreateLinkInput } from "@/lib/validation";

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

    return NextResponse.json(links);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch links" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { data, errors } = validateCreateLinkInput(body);

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
