"use client";

import React from "react";
import ProductForm from "./ProductForm";
import { ProductResponse } from "../types";

interface Props {
  product: ProductResponse;
}

export default function UpdateProduct({ product }: any) {

  let img: string[] = [];
  let bullp: string[] = [];
  product?.images.map((item: { url: string; id: string }) => {
    const url = item.url;
    img.push(url);
  });

  product.bulletPoints.map(
    (item: { id: string; content: string; productId: string }) => {
      console.log({ item });
      const content = item.content;
      bullp.push(content);
    }
  );
  //----------type
  const initialValue = {
    ...product,
    thumbnail: product.thumbnail[0]?.url,
    images: img,
    bulletPoints: bullp,
  };
  return (
    <ProductForm
      initialValue={initialValue}
      onSubmit={(values) => {
        console.log(values);
      }}
    />
  );
}
