import FormContainer from "@/components/Forms/FormContainer";
import FormHeader from "@/components/Forms/FormHeader";
import CreateCategoryForm from "@/components/Forms/create/CreateCategoryForm";

interface pageProps {}

const page = ({}) => {
  return (
    <FormContainer>
      <FormHeader
        title="Add a new Category"
        description="Orders placed across your store"
      />
      <CreateCategoryForm />
    </FormContainer>
  );
};

export default page;
