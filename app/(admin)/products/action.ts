"use server";

import { startDb } from "@/app/lib/db";
import { image, info } from "@/app/types";
import prisma from "@/prisma";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});

export const getCloudConfig = async () => {
  return {
    name: process.env.CLOUD_NAME!,
    key: process.env.CLOUD_API_KEY!,
  };
};

export const getCloudSigature = async () => {
  const secret = cloudinary.config().api_secret as string;
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
    },
    secret
  );

  return { timestamp, signature };
};

export const createProduct = async (info: info) => {
  const userId = info.userId;

  const sale = (info.mrp - info.salePrice) / info.mrp;

  const defaultValues = {
    title: info.title,
    description: info.description,
    price: {
      base: info.mrp,
      discounted: info.salePrice,
    },
    sale,
    category: info.category,
    quantity: info.quantity,
  };

  const product = await prisma.product.create({
    data: {
      ...defaultValues,
      user: { connect: { id: userId } },
    },
  });

  const productId = product.id;

  function bulletPointsCreate() {
    info.bulletPoints.map((item: string) => {
      createBullet(item);
    });
  }
  bulletPointsCreate();

  async function createBullet(str: string) {
    await prisma.bulletPoint.create({
      data: {
        content: str,
        product: { connect: { id: productId } },
      },
    });
  }

  const createImg = async (obj: image) => {
    await prisma.image.create({
      data: {
        url: obj.url,
        product: { connect: { id: productId } },
      },
    });
  };

  const imgCreate = () => {
    info.images.map((item: image) => {
      createImg(item);
    });
  };
  imgCreate();

  await prisma.thumbnail.create({
    data: {
      url: info.thumbnail.url,
      product: { connect: { id: productId } },
    },
  });
};

export const fetchProducts = async (userId: string | undefined) => {
  await startDb();

  const allProds = await prisma.product.findMany({
    where: {
      userId: userId,
      price: { not: null as any },
    },
    select: {
      thumbnails: true,
      price: true,
      quantity: true,
      category: true,
      title: true,
      id: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return allProds;
};
