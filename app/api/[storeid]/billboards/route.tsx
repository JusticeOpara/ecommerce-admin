import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  console.log("Received params:", params);

  try {
    const { userId } = auth();
    const { label, imageUrl } = await req.json();
    console.log("Received body:", label, imageUrl);

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!label) {
      return new NextResponse("Label is required", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("Image URL is required", { status: 400 });
    }

    if (!params.storeId) {
      return NextResponse.json({ error: "Store Id is required" },{ status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const billboard = await prismadb.billBoard.create({
      data: {
        label,
        imageUrl,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log(`[BILLBOARDS_POST] ${error}`, error);

    if (error instanceof Error) {
      return new NextResponse(`Errorxxx: ${error.message}`, { status: 500 });
    }
    return new NextResponse("Unknown Internal Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return NextResponse.json(
        { error: "Store Id is required" },
        { status: 400 }
      );
    }

    const billboard = await prismadb.billBoard.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[STORE_GET]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
    // return new NextResponse("Internal error", { status: 500 });
  }
}
