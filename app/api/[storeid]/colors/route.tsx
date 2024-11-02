
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {

  console.log("Received params:", params);

  try {
    const { userId } = auth();
    const { name, value } = await req.json();
    console.log("Received body:", name, value);

    if (!userId) {
      
      return NextResponse.json(
        { error: "Unathenticated" },
        { status: 401 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    if (!value) {
      return NextResponse.json(
        { error: "Value URL is required" },
        { status: 400 }
      );
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
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const color = await prismadb.color.create({
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    });
   

    return NextResponse.json(color);
  } catch (error) {
    console.log(`[COLOR_POST] ${error}`, error);
    
  
     if (error instanceof Error) {
       return new NextResponse(`Errorxxx: ${error.message}`, { status: 500 });
       
    }

     return NextResponse.json(
      { error: "Unknown Internal Error" },
      { status: 500 }
    );
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

    const colors = await prismadb.color.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(colors);
  } catch (error) {
    console.log("[COLORS_GET]", error);
   return NextResponse.json(
        { error: "Store Id is required" },
        { status: 400 }
      );
  }
}
