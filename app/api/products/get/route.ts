import prisma from "@/prisma";
import { NextResponse } from "next/server";

export const POST = async () => {
  const allUser = await prisma.user.findMany({
    select: {
      name: true,
      email: true,
      products: true,
    },
  });
  return NextResponse.json(allUser);
};
