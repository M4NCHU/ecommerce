import FormContainer from "@/components/Forms/FormContainer";
import FormHeader from "@/components/Forms/FormHeader";
import EditCategoryForm from "@/components/Forms/edit/EditCategoryForm";
import CreateCategoryForm from "@/components/Forms/create/CreateCategoryForm";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { FC } from "react";
import { Prisma } from "@prisma/client";

interface pageProps {
  params: {
    categoryId: string;
  };
}

const categoryex: Prisma.CategoryInclude = {
  customFilters: {
    select: {
      id: true,
      name: true,
      categoryId: true,
      // Dodaj tutaj pola, które chcesz wybrać
      filterOptions: {
        select: {
          id: true,
          option: true,
          // Dodaj tutaj pola dla opcji filtrów, które chcesz wybrać
        },
      },
    },
  },
};

const page = async ({ params }: pageProps) => {
  const session = await getAuthSession();
  if (!session) return redirect("/");

  const { categoryId } = params;

  console.log(categoryId);

  const category = await db.category.findFirst({
    where: {
      id: categoryId,
    },
    include: {
      customFilters: {
        include: {
          filterOptions: true,
        },
      },
    },
  });

  if (!category) return;

  const filters = await db.customFilter.findMany({
    where: {
      categoryId: category.id,
    },
    include: {
      filterOptions: true,
    },
  });

  console.log("category", category);

  return (
    <FormContainer>
      <FormHeader
        title="Edit Category"
        description="Orders placed across your store"
      />
      <EditCategoryForm category={category} filterss={filters} />
    </FormContainer>
  );
};

export default page;
