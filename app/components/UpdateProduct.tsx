"use client";

import React from "react";
import ProductForm from "./ProductForm";
import { ProductResponse } from "../types";

interface Props {
  product: ProductResponse;
}

export default function UpdateProduct({ product }: any) {
  console.log('prod updt', product)
  //----------type
  const mrp= product.price.base
  const salePrice= product.price.discounted

  const initialValue = {
    ...product,
    thumbnail: product.thumbnail?.url,
    images: product.images?.map(({ url }) => url),
mrp,
 salePrice,
    bulletPoints: product.bulletPoints || [],
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
