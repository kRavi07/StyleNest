import { AddProductProps } from "../../query.type";
import { getSellerToken, handleError } from "../../util";
import axiosInstance, { setAuthToken } from "../axiosInstace";

export const sellerUpdateProduct = async ({
  Product_ID,
  product_name,
  discription,
  price,
  category,
  sku,
  files,
  attributes,
  priceRange,
}: AddProductProps) => {
  try {
    const token = getSellerToken();

    setAuthToken(token);

    const attributesList = JSON.stringify(attributes);
    const priceRangeJson = JSON.stringify(priceRange);

    const formData = new FormData();

    formData.append("product_name", product_name);
    formData.append("discription", discription);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("sku", sku);
    if (files !== null) {
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
    }
    formData.append("attributes", attributesList);
    formData.append("priceRange", priceRangeJson);

    const res = await axiosInstance.put(
      `seller/update-product/${Product_ID}`,
      formData,

      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.log(error);
    handleError(error);
  }
};
