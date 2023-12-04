import prisma from "@/prisma";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const body = await req.json();
  const userId = body.user.id;

  const defaultValue = {
    title: "teste 003",
    description: "teste 003",
    // bulletPoints: ["teste01", "teste02", "teste03"],
    mrp: 10,
    salePrice: 20,
    category: "teste",
    quantity: 12,
    thumbnail: "teste",
    images: "teste",
  };

  const product = await prisma.product.create({
    data: {
      ...defaultValue,
      user: { connect: { id: userId } },
    },
  });

  // function teste() {
  //     body.bulletPoints.map((i) => {
  //         const bulletPoint = await prisma.bulletPoints.create({
  //             data:{}
  //         })
  //     })
  // }

  return NextResponse.json(product);
};
