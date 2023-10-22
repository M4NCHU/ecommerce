import FormContainer from "@/components/Forms/FormContainer";
import FormHeader from "@/components/Forms/FormHeader";
import CategoriesList from "@/components/Lists/CategoriesList";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

import { redirect } from "next/navigation";

interface pageProps {}

const page = async ({}) => {
  const session = await getAuthSession();

  if (!session || session.user.role !== "ADMIN") return redirect("/");

  const categoriesData = await db.category.findMany();

  return (
    <FormContainer>
      <FormHeader
        title="Add a new Product"
        description="Orders placed across your store"
      />
      <CategoriesList categories={categoriesData} />
    </FormContainer>
  );
};

export default page;
