import FormContainer from "@/components/Forms/FormContainer";
import FormHeader from "@/components/Forms/FormHeader";
import CreateProductForm from "@/components/Forms/create/CreateProductForm";
import { FC } from "react";

interface pageProps {}

const page = ({}) => {
  return (
    <FormContainer>
      <FormHeader
        title="Add a new Product"
        description="Orders placed across your store"
      />
      <CreateProductForm />
    </FormContainer>
  );
};

export default page;
