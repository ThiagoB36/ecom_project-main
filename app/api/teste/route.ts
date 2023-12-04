import { startDb } from "@/app/lib/db";
import prisma from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  await startDb();

  const user = await prisma.user.findUnique({
    where: { email: body.email },
  });
  return NextResponse.json(user);
};
