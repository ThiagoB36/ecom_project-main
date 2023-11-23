import prisma from "@/prisma";
import { NextResponse } from "next/server";

export const POST = async () => {
  const idToDelete = "655f39cbf647db70f91b6278";

  const product = await prisma.product.delete({
    where: { id: idToDelete },
  });
  return NextResponse.json(product);
};
