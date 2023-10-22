"use client";

import TableStyle from "@/styles/admin/tables/DefaultTable.module.css";
import { FC } from "react";

import { Product } from "@prisma/client";
import TableComponent from "../UI/TableDefault";
import { ExtendedProduct } from "@/types/db";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface ProductsListProps {
  products: ExtendedProduct[];
}

const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "IMAGE", uid: "primaryImageUrl", sortable: false },
  { name: "PRODUCT", uid: "name", sortable: true },
  { name: "product", uid: "product", sortable: true },
  { name: "STOCK", uid: "stock", sortable: true },
  { name: "SKU", uid: "sku", sortable: true },
  { name: "PRICE", uid: "price", sortable: true },
  { name: "QTY", uid: "qty", sortable: true },
  { name: "STATUS", uid: "status", sortable: false },
  { name: "ACTIONS", uid: "actions", sortable: false },
];

const ProductsList: FC<ProductsListProps> = ({ products }) => {
  const router = useRouter();

  const { mutate: DeleteItem } = useMutation({
    mutationFn: async (itemId: string) => {
      const payload = {
        itemId: itemId,
      };

      const { data } = await axios.post(`/api/products/delete`, payload);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          toast.error("product already exists.");
        }

        if (err.response?.status === 422) {
          toast.error("Invalid product name.");
        }

        if (err.response?.status === 401) {
          toast.error("Unauthorized");
        }
      }

      toast.error("There was an error");
    },

    onSuccess: () => {
      toast.success("Successfully deleted product:");
      router.refresh();
    },
  });

  const methods = [
    {
      name: "delete",
      func: (itemId: string) => DeleteItem(itemId),
    },
  ];

  return (
    <div className={TableStyle.TableDefault}>
      <TableComponent data={products} columns={columns} methods={methods} />
    </div>
  );
};

export default ProductsList;
