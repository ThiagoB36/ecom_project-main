import ProductTable from "@/app/components/ProductTable";
import React from "react";

export default async function Products() {
  return (
    <div>
      <ProductTable currentPageNo={0} />
    </div>
  );
}
