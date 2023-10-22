"use client";

import { OurFileRouter } from "@/app/api/uploadthing/core";
import Editor from "@/components/EditorJS/Editor";
import FormDefaultStyles from "@/styles/forms/FormDefault.module.css";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { Category } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { UploadDropzone } from "@uploadthing/react";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import FormCard from "../FormCard";
import { EditorData } from "@/components/EditorJS/Editor"; // Import EditorData type
import toast from "react-hot-toast";
import { ProductCreationRequest } from "@/lib/validators/product";

interface CreateProductFormProps {}

const initValues = {
  title: "",
  category: "",
  price: "",
  stock: "",
  primaryImageUrl: "",
};

const initState = { values: initValues };

const CreateProductForm: FC<CreateProductFormProps> = ({}) => {
  const router = useRouter();
  const [productState, setProductState] = useState(initState);
  const [editorData, setEditorData] = useState<EditorData | null>(null);
  const [ProductPrice, setProductPrice] = useState<number>(0);
  const [ProductStock, setProductStock] = useState<number>(0);

  const handleSaveEditorData = (data: EditorData) => {
    setEditorData(data);
  };

  // const [description, setDescription] = useState<string>("");
  const [images, setImages] = useState<
    {
      fileUrl: string;
      fileKey: string;
    }[]
  >([]);

  // set state
  const { values } = productState;

  console.log(values.price);

  const handleChange = ({ target }: any) =>
    setProductState((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        [target.name]: target.value,
      },
    }));

  const { mutate: CreateProduct } = useMutation({
    mutationKey: ["createProduct"],
    mutationFn: async () => {
      const payload: ProductCreationRequest = {
        name: values.title,
        description: editorData,
        price: parseFloat(values.price),
        stock: parseInt(values.stock),
        categoryId: values.category,
        primaryImageUrl: images[0].fileUrl,
      };

      const { data } = await axios.post(`/api/products/create`, payload);
      return data;
    },
    onError: (err: any) => {
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

      toast.error(err.message);
    },

    onSuccess: () => {
      setImages([]);
      setProductState(initState);
      toast.success("Successfully created Product");
      router.refresh();
    },
  });

  // fetch list of categories
  const {
    data: categoriesResult,
    isFetched: categoryIsFetched,
    isFetching,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/categories/read`);
      return data as Category[];
    },
  });

  // show images
  const title = images.length ? (
    <>
      <p>Upload Complete!</p>
      <p className="mt-2">
        {images.length} files, now You can choose primary product photo
      </p>
    </>
  ) : null;

  const imgList = (
    <>
      {title}
      <ul className="flex flex-row gap-2">
        {images.map((image) => (
          <li key={image.fileUrl} className="mt-2">
            <Link href={image.fileUrl} target="_blank">
              <Image
                src={image.fileUrl}
                width={96}
                height={96}
                alt={image.fileUrl}
              />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );

  // const { ref: titleRef, ...rest } = register("title");

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={() => CreateProduct()} className="bg-success-500/40">
          create
        </Button>
      </div>

      <form className={FormDefaultStyles.FormDefaultContainer}>
        <div className={FormDefaultStyles.FormDefaultLeft}>
          <FormCard title="Product information">
            <Input
              placeholder="Product title"
              label="Product title"
              labelPlacement="outside"
              type="text"
              name="title"
              value={values.title}
              onChange={handleChange}
            />
            <div className={FormDefaultStyles.FormDefaultInputGroup}>
              <Input placeholder="SKU" label="SKU" labelPlacement="outside" />
              <Input
                placeholder="Stock"
                label="Stock"
                labelPlacement="outside"
                type="number"
                name="stock"
                value={values.stock}
                onChange={handleChange}
              />
            </div>
          </FormCard>
          <FormCard title="Media (choose max 5 image photos)">
            <UploadDropzone<OurFileRouter>
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                if (res) {
                  setImages(res);
                  const json = JSON.stringify(res);
                  // Do something with the response
                }
                //alert("Upload Completed");
              }}
              onUploadError={(error: Error) => {
                // Do something with the error.
                alert(`ERROR! ${error.message}`);
              }}
            />
            {imgList}
          </FormCard>
          <FormCard title="Organize">
            <Editor onSaveEditorData={handleSaveEditorData} />
          </FormCard>
        </div>
        <div className={FormDefaultStyles.FormDefaultRight}>
          <FormCard title="Pricing">
            <Input
              placeholder="Price (brutto)"
              label="Price (brutto)"
              labelPlacement="outside"
              type="number"
              name="price"
              value={values.price}
              onChange={handleChange}
            />
          </FormCard>
          <FormCard title="Organize">
            {categoriesResult?.length ?? 0 ? (
              <>
                {isFetching ? (
                  "fetching"
                ) : (
                  <Select
                    items={categoriesResult}
                    label="Category"
                    labelPlacement="outside"
                    placeholder="Select category"
                    className="w-full"
                    name="category"
                    value={values.category}
                    onChange={handleChange}
                  >
                    {(category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    )}
                  </Select>
                )}
              </>
            ) : (
              "Cannot find any categories"
            )}
          </FormCard>
        </div>
      </form>
    </>
  );
};

export default CreateProductForm;
