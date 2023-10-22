"use client";

import TableStyle from "@/styles/admin/tables/DefaultTable.module.css";
import { FC } from "react";

import { Category } from "@prisma/client";
import TableComponent from "../UI/TableDefault";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { redirect, useRouter } from "next/navigation";

interface CategoriesListProps {
  categories: Category[];
}

const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "IMAGE", uid: "imageUrl", sortable: false },
  { name: "CATEGORY", uid: "name", sortable: true },
  { name: "DESCRIPTION", uid: "description", sortable: false },
  { name: "CREATED AT", uid: "createdAt", sortable: true },
  { name: "ACTIONS", uid: "actions", sortable: false },
];

const CategoriesList: FC<CategoriesListProps> = ({ categories }) => {
  const router = useRouter();

  const { mutate: DeleteItem } = useMutation({
    mutationFn: async (itemId: string) => {
      const payload = {
        itemId: itemId,
      };

      const { data } = await axios.post(`/api/categories/delete`, payload);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          toast.error("Category already exists.");
        }

        if (err.response?.status === 422) {
          toast.error("Invalid category name.");
        }

        if (err.response?.status === 401) {
          toast.error("Unauthorized");
        }
      }

      toast.error("There was an error");
    },

    onSuccess: () => {
      toast.success("Successfully deleted category:");
    },
  });

  const redirectToEdit = (itemId: string) => {
    console.log("redirect");
    router.push(`/admin/categories/edit/${itemId}`);
  };

  const methods = [
    {
      name: "delete",
      func: (itemId: string) => DeleteItem(itemId),
    },
    {
      name: "edit",
      func: (itemId: string) => redirectToEdit(itemId),
    },
  ];

  return (
    <div className={TableStyle.TableDefault}>
      <TableComponent data={categories} columns={columns} methods={methods} />
    </div>
  );
};

export default CategoriesList;
