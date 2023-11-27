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

async function uploadProductImages(images: any) {
  const arrImg = images.map(async (item: any) => {
    const createImg = await uploadImage(item);
    console.log({ createImg });
  });
}

const uploadImage = async (image: File) => {
  console.log({ image });
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
  console.log({ data });

  return { url: data.secure_url, id: data.public_id };
};

export default function Create() {
  const handleCreateProduct = async (values: any) => {
    const { thumbnail, images } = values;

    const thumbnailRes = await uploadImage(thumbnail);

    let productImages: { url: string; id: string }[] = [];

    if (images && images.length > 0) {
      let teste = await uploadProductImages(images);
      console.log({ teste });
    }
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
      {/* <ProductForm
        onSubmit={(form) => {
          console.log({ form });
        }}
      /> */}
    </div>
  );
}
