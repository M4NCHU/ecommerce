"use client";

import { OurFileRouter } from "@/app/api/uploadthing/core";
import { CategoryPayload } from "@/lib/validators/category";
import FormDefaultStyles from "@/styles/forms/FormDefault.module.css";
import { CustomFilterWithFilterOptions, ExtendedCategory } from "@/types/db";
import { Input, Textarea } from "@nextui-org/react";
import { FilterFieldType } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { UploadDropzone } from "@uploadthing/react";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineCloseCircle } from "react-icons/ai";
import FormCard from "../FormCard";
import EditFilterForm from "./EditFilterForm";

interface EditCategoryFormProps {
  category: ExtendedCategory;
  filterss: CustomFilterWithFilterOptions[];
}

type FilterProps = Array<{
  name: string;
  fieldType: FilterFieldType;
  availableChoices: string[] | null;
}>;

type FProps = {
  name: string;
  fieldType: FilterFieldType;
  availableChoices: string[] | null;
};

// Edit category form values

const EditCategoryForm: FC<EditCategoryFormProps> = ({
  category,
  filterss,
}) => {
  const initValues = { name: category.name, desc: category.description };

  const initState = { values: initValues };
  const router = useRouter();
  const [state, setState] = useState(initState);
  const [imageUrl, setImageUrl] = useState("");

  const [images, setImages] = useState<
    {
      fileUrl: string;
    }[]
  >([
    {
      fileUrl: category.imageUrl,
    },
  ]);

  const { values } = state;

  const handleChange = ({ target }: any) =>
    setState((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        [target.name]: target.value,
      },
    }));

  // Edit category
  const { mutate: EditCategory, isPending } = useMutation({
    mutationKey: ["editCategory"],
    mutationFn: async () => {
      const payload: CategoryPayload = {
        categoryId: category.id,
        name: values.name,
        desc: values.desc,
        imageUrl: images[0].fileUrl,
      };
      const { data } = await axios.post("/api/categories/edit", payload);
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

    onSuccess: (data) => {
      setState(initState);
      toast.success("Successfully edited category:", data);
      router.refresh();
    },
  });

  const handleRemoveImg = (fileUrl: string) => {
    const updatedImages = images.filter((image) => image.fileUrl !== fileUrl);

    // Uaktualnij stan `images` na podstawie nowej tablicy
    setImages(updatedImages);
  };

  const title = images.length ? (
    <>
      <p>Upload Complete!</p>
      <p className="mt-2">{images.length} files</p>
    </>
  ) : null;

  const imgList = (
    <>
      {title}
      <ul className="flex flex-row">
        {images.map((image) => (
          <li key={image.fileUrl} className="mt-2">
            <div className="w-[6rem] h-[6rem] relative">
              <button
                onClick={() => handleRemoveImg(image.fileUrl)}
                className="absolute text-lg rounded-full bg-danger-500 hover:bg-danger-400 flex items-center justify-center w-[1.5rem] h-[1.5rem] top-0 -right-2 z-10"
              >
                <AiOutlineCloseCircle />
              </button>
              <Link href={image.fileUrl} target="_blank">
                <Image
                  fill
                  className="object-contain"
                  src={image.fileUrl}
                  alt={image.fileUrl}
                />
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </>
  );

  return (
    <form className={FormDefaultStyles.FormDefaultContainer}>
      <div className={FormDefaultStyles.FormContainer}>
        <div className={FormDefaultStyles.FormDefaultLeft}>
          <FormCard title="Category information">
            <Input
              placeholder="Category title"
              label="Category title"
              labelPlacement="outside"
              name="name"
              value={values.name}
              onChange={handleChange}
            />
          </FormCard>
          <FormCard title="Category image">
            <UploadDropzone<OurFileRouter>
              endpoint="messageFile"
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
        </div>
        <div className={FormDefaultStyles.FormDefaultRight}>
          <FormCard title="Category Description">
            <Textarea
              placeholder="Write something about this category..."
              name="desc"
              value={values.desc}
              onChange={handleChange}
            />
          </FormCard>
        </div>
      </div>
      <EditFilterForm category={category} filterss={filterss} />

      <button
        type="submit"
        onClick={(e) => {
          e.preventDefault();
          EditCategory();
        }}
        className={FormDefaultStyles.FormDefaultBtn}
      >
        Edit
      </button>
    </form>
  );
};

export default EditCategoryForm;
