"use client";

import ProductForm from "@/app/components/ProductForm";
import { NewProductInfo, image } from "@/app/types";
import React from "react";
import { createProduct, getCloudConfig, getCloudSigature } from "../action";

function uploadProductImages(images: File[]) {
  let arrPromises: Promise<image>[] = [];

  images.map((item: File) => {
    const createImg = uploadImage(item);
    arrPromises.push(createImg);
  });
  const arrProdsImg = Promise.all(arrPromises);
  return arrProdsImg;
}

const uploadImage = async (image: File) => {
  const { timestamp, signature } = await getCloudSigature();
  const cloudConfig = await getCloudConfig();

  const formData = new FormData();
  formData.append("file", image);
  formData.append("api_key", cloudConfig.key);
  formData.append("signature", signature);
  formData.append("timestamp", timestamp.toString());

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudConfig.name}/image/upload`;

  const res = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  return { url: data.secure_url, id: data.public_id };
};

export default function Create() {
  let thumbnailObj: image;
  let imagesObj: image[];

  const handleCreateProduct = async (values: NewProductInfo) => {
    const {
      thumbnail,
      images,
      userId,
      bulletPoints,
      category,
      description,
      mrp,
      quantity,
      salePrice,
      title,
    } = values;

    if (thumbnail) {
      const thumbnailRes = await uploadImage(thumbnail);
      thumbnailObj = thumbnailRes;
    }

    if (images && images.length > 0) {
      let resImgPromises = await uploadProductImages(images);
      imagesObj = resImgPromises;
    }

    const newObj = {
      userId,
      bulletPoints,
      category,
      description,
      mrp,
      quantity,
      salePrice,
      title,
      thumbnail: thumbnailObj,
      images: imagesObj,
    };

    createProduct(newObj);
  };
  function teste() {
    console.log("teste");
  }
  return (
    <div>
      <ProductForm onSubmit={teste} />
      {/* <ProductForm onSubmit={handleCreateProduct} /> */}
    </div>
  );
}
