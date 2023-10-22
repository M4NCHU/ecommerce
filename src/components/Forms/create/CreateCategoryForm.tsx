"use client";

import FormDefaultStyles from "@/styles/forms/FormDefault.module.css";
import { FC, useState } from "react";
import FormCard from "../FormCard";
import { Input, Textarea } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { CategoryPayload } from "@/lib/validators/category";
import toast from "react-hot-toast";
import { UploadButton } from "@/utils/uploadthing";
import { UploadDropzone } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import Link from "next/link";
import Image from "next/image";

interface CreateCategoryFormProps {}

// Create category form values
const initValues = { name: "", desc: "" };

const initState = { values: initValues };

const CreateCategoryForm: FC<CreateCategoryFormProps> = ({}) => {
  const router = useRouter();
  const [state, setState] = useState(initState);
  const [imageUrl, setImageUrl] = useState("");
  const [images, setImages] = useState<
    {
      fileUrl: string;
      fileKey: string;
    }[]
  >([]);

  const { values } = state;

  const handleChange = ({ target }: any) =>
    setState((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        [target.name]: target.value,
      },
    }));

  // Create category
  const { mutate: CreateCategory, isPending } = useMutation({
    mutationKey: ["createCategory"],
    mutationFn: async () => {
      const payload: CategoryPayload = {
        name: values.name,
        desc: values.desc,
        imageUrl: images[0].fileUrl,
      };
      const { data } = await axios.post("/api/categories/create", payload);
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
      toast.success("Successfully created category:", data);
      router.refresh();
    },
  });

  const title = images.length ? (
    <>
      <p>Upload Complete!</p>
      <p className="mt-2">{images.length} files</p>
    </>
  ) : null;

  const imgList = (
    <>
      {title}
      <ul>
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

  return (
    <form className={FormDefaultStyles.FormDefaultContainer}>
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
                console.log(json);
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
      <button
        type="submit"
        onClick={(e) => {
          e.preventDefault();
          CreateCategory();
        }}
      >
        Create
      </button>
    </form>
  );
};

export default CreateCategoryForm;
