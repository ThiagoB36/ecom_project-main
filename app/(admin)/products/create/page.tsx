"use client";

import ProductForm from "@/app/components/ProductForm";
import { NewProductInfo, Product } from "@/app/types";
import { newProductInfoSchema } from "@/app/utils/validationProductSchema";
import React from "react";
import { ValidationError } from "yup";
import { toast } from "react-toastify";
// import { uploadImage } from "@/app/utils/helper";
import { createProduct, getCloudConfig, getCloudSigature } from "../action";

/* export default function Create() {
  const handleCreateProduct = async (values: NewProductInfo) => {
    const {thumbnail, images} = values
    try {
     await newProductInfoSchema.validate(values, { abortEarly: false});
     const thumbnailRes = uploadImage(thumbnail!);
     
     let productImages : {url: string, id:string}[] = []
     if(images){
       const uploadPromise = images.map(async (imageFile) => {
       const {url, id} = await uploadImage(imageFile)
       return {url, id}
      })      
      productImages = await Promise.all(uploadPromise)
     }

     createProduct({
      ...values,   
      thumbnail: thumbnailRes,
      images: productImages,
     }) */

// async function uploadProductImages(
//   images: File[]
// ): Promise<{ url: string; id: string }[]> {
//   const uploadPromise = images.map(async (imageFile) => {
//     const { url, id } = await uploadImage(imageFile);
//     return { url, id };
//   });
//   return Promise.all(uploadPromise);
// }

function uploadProductImages(images: any) {
  let arrPromises: any = [];
  images.map((item: any) => {
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
  console.log("handle");
  const handleCreateProduct = async (values: any) => {
    const { thumbnail, images } = values;
    let objProduct = { ...values };

    const thumbnailRes = await uploadImage(thumbnail);
    objProduct.thumbnail = thumbnailRes;

    let productImages: { url: string; id: string }[] = [];

    if (images && images.length > 0) {
      let resImgPromises = await uploadProductImages(images);
      objProduct.images = resImgPromises;
    }

    createProduct(objProduct);
  };
  // const handleCreateProduct = async (values: NewProductInfo) => {
  //   const { thumbnail, images } = values;

  //   try {
  //     await newProductInfoSchema.validate(values, { abortEarly: false });

  //     if (!thumbnail) {
  //       throw new Error("Thumbnail is required."); // Assuming thumbnail is mandatory
  //     }

  //     const thumbnailRes = await uploadImage(thumbnail);

  //     let productImages: { url: string; id: string }[] = [];
  //     if (images && images.length > 0) {
  //       productImages = await uploadProductImages(images);
  //     }

  //     const product: Product = {
  //       ...values,
  //       thumbnail: thumbnailRes,
  //       images: productImages,
  //     };

  //     createProduct(product);
  //   } catch (error) {
  //     if (error instanceof ValidationError) {
  //       error.inner.map((err) => {
  //         toast.error(err.message);
  //       });
  //     }
  //   }
  // };

  return (
    <div>
      <ProductForm onSubmit={handleCreateProduct} />
    </div>
  );
}
