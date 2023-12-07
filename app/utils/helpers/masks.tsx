interface Prods {
  title: string;
  description: string;
  bulletPoints: string[];
  mrp: number;
  salePrice: number;
  category: string;
  quantity: number;
}

export const showReaisMask = (
  info: string,
  productInfo: Prods,
  setProductInfo: (i: Prods) => void
) => {
  const dataInfo = info ?? "";
  let chars = String(dataInfo) ?? "";

  const onlyNumbers: any = chars.replace(/\D/g, "");
  const stringWithMask = (onlyNumbers / 100)
    .toFixed(2)
    .replace(".", ",")
    .replace(/\d(?=(\d{3})+,)/g, "$&.");

  const mrpDot = stringWithMask.replace(".", "");
  const mrpRep = mrpDot.replace(",", ".");
  const mrp = Number(mrpRep);

  //------------------
  const cond = productInfo.mrp !== mrp;
  if (cond) setProductInfo({ ...productInfo, mrp });

  return { mask: stringWithMask };
  //------------------
};
