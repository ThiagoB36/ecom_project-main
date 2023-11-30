"use server";

import { startDb } from "@/app/lib/db";
import { NewProductInfo, Product } from "@/app/types";
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

// generate cloud signature

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

// create product

// {
//   info: {
//     title: 'ttt',
//     description: 'dddddd',
//     bulletPoints: [ 'bbbb01', 'bbbb02' ],
//     mrp: 12,
//     salePrice: 10,
//     category: 'Automotive',
//     quantity: 15,
//     images: [ [Object], [Object] ],
//     thumbnail: {
//       url: 'https://res.cloudinary.com/dhwobxowt/image/upload/v1701343626/q35wievcfcdi59aoplnf.jpg',
//       id: 'q35wievcfcdi59aoplnf'
//     },
//     userId: '655b96241d65c47ec7be860d'
//   }
// }

export const createProduct = async (info: any) => {
  console.log({ info });
  const userId = info.userId;

  const defaultValues = {
    title: info.title,
    description: info.description,
    mrp: info.mrp,
    salePrice: info.salePrice,
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

  const createImg = async (obj: any) => {
    await prisma.image.create({
      data: {
        url: obj.url,
        product: { connect: { id: productId } },
      },
    });
  };

  const imgCreate = () => {
    info.images.map((item: any) => {
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

  // export const createProduct = async (info: Product) => {
  //   try {
  //     await startDb();

  //     // Prepare bullet points data
  //     const bulletPointsData = info.bulletPoints?.map((content) => ({
  //       content,
  //     }));

  //     // Create thumbnails data
  //     const thumbnailData = info.thumbnail ? [{ url: info.thumbnail }] : [];

  //     // Create images data
  //     const imagesData = info.images?.map((image) => ({ url: image }));

  //     await prisma.product.create({
  //       data: {
  //         title: info.title,
  //         description: info.description,
  //         bulletPoints: {
  //           create: bulletPointsData,
  //         },
  //         thumbnails: {
  //           create: thumbnailData as any[],
  //         },
  //         images: {
  //           create: imagesData as any[],
  //         },
  //         mrp: info.mrp,
  //         salePrice: info.salePrice,
  //         quantity: info.quantity,
  //         category: info.category,
  //         user: {
  //           connect: { id: info.userId },
  //         },
  //       },
  //     });
  //   } catch (error) {
  //     console.log((error as any).message);
  //     throw new Error("Something went wrong, can not create product!");
  //   }
};
