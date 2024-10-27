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
    const {
      name,
      price,
      colorId,
      categoryId,
      sizeId,
      images,
      isArchived,
      isFeatured,
    } = await req.json();
    console.log(
      "Received body:",
      name,
      price,
      colorId,
      categoryId,
      sizeId,
      images,
      isArchived,
      isFeatured
    );

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("price is required", { status: 400 });
    }

    if (!colorId) {
      return new NextResponse("colorId is required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("categoryId is required", { status: 400 });
    }

    if (!sizeId) {
      return new NextResponse("sizeId is required", { status: 400 });
    }
    if (!images || !images.length) {
      return new NextResponse("images is required", { status: 400 });
    }

    if (!params.storeId) {
      
      return NextResponse.json(
      { error: "Store Id is required" },
      { status: 400 }
    );
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

    const product = await prismadb.product.create({
      data: {
        name,
        price,
        isArchived,
        isFeatured,
        colorId,
        sizeId,
        categoryId,
        storeId: params.storeId,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      }
    });

   
    return NextResponse.json(product);
  } catch (error) {
    console.log(`[PRODUCTS_POST] ${error}`, error);

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
    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get("categoryId") || undefined
    const colorId = searchParams.get("colorId") || undefined
    const sizeId = searchParams.get("sizeId") || undefined
    const isFeatured = searchParams.get("isFeatured") 
    

    if (!params.storeId) {
      return NextResponse.json(
        { error: "Store Id is required" },
        { status: 400 }
      );
  
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false
      },
      include: {
        images: true,
        category: true,
        color: true,
        size:true
   
      },
      orderBy:{
        createdAt: 'desc'
      }
     
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log("[PRODUCTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
