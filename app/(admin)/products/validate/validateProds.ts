import * as yup from "yup";

const validateProds = yup.object().shape({
  title: yup.string().required("its required"),
  description: yup.string().required("its required"),
  mrp: yup.number().required("its required"),
  salePrice: yup.number().required("its required"),
  category: yup.string().required("its required"),
  thumbnail: yup.string().required("its required"),
  images: yup.string().required("its required"),
});
export default validateProds;

// {
//     title: "teste 003",
//     description: "teste 003",
//     mrp: 10,
//     salePrice: 20,
//     category: "teste",
//     quantity: 12,
//     thumbnail: "teste",
//     images: "teste",
//   }
