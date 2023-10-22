import FormContainer from "@/components/Forms/FormContainer";
import FormHeader from "@/components/Forms/FormHeader";
import ProductsList from "@/components/Lists/ProductsList";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

import { RedirectType, redirect } from "next/navigation";

interface pageProps {}

const page = async ({}) => {
  const session = await getAuthSession();

  if (!session || session.user.role !== "ADMIN") return redirect("/");

  const productsData = await db.product.findMany({
    include: {
      category: true,
    },
  });

  console.log(productsData);

  // console.log(productsData);
  return (
    <FormContainer>
      <FormHeader
        title="Products list"
        description="Orders placed across your store"
      />
      <ProductsList products={productsData} />
    </FormContainer>
  );
};

export default page;
