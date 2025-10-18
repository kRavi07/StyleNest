import React from "react";
import ProductDetails from "./components/product-page";

type Params = Promise<{ id: string }>;


const Page = async ({ params }: { params: Params }) => {
  const { id } = await params;

  return <ProductDetails id={id} />;
};

export default Page;
