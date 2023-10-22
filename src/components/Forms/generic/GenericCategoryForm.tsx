import { FC, useState } from "react";
import { Input, Textarea } from "@nextui-org/react";

interface GenericCategoryFormProps {
  title: string;
  initialValues: { name: string; desc: string };
  onSubmit: (values: { name: string; desc: string }) => void;
}

const GenericCategoryForm: FC<GenericCategoryFormProps> = ({
  title,
  initialValues,
  onSubmit,
}) => {
  const [values, setValues] = useState(initialValues);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form>
      <h2>{title}</h2>
      <Input
        placeholder="Category title"
        label="Category title"
        labelPlacement="outside"
        name="name"
        value={values.name}
        onChange={handleChange}
      />
      <Textarea
        placeholder="Write something about this category..."
        name="desc"
        value={values.desc}
        onChange={handleChange}
      />
      <button type="submit" onClick={handleSubmit}>
        Submit
      </button>
    </form>
  );
};

export default GenericCategoryForm;
