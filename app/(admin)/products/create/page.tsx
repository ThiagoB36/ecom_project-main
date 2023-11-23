"use client";

import ProductForm from "@/app/components/ProductForm";
import React from "react";

async function createProd(values: any) {
  const response = await fetch("/api/products/create", {
    method: "POST",
    body: JSON.stringify(values),
  });
  const newCall = await response.json();
  console.log({ newCall });
}

export default function Create() {
  return (
    <div>
      <ProductForm
        onSubmit={(values) => {
          console.log(values);
          createProd(values);
        }}
      />
    </div>
  );
}
