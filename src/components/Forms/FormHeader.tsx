import { FC } from "react";
import FormHeaderStyle from "@/styles/forms/FormHeader.module.css";
import { Button } from "@nextui-org/react";

interface FormHeaderProps {
  title: string;
  description: string;
}

const FormHeader: FC<FormHeaderProps> = ({ title, description }) => {
  return (
    <div className={FormHeaderStyle.FormHeader}>
      <div>
        <h2>{title}</h2>
        <span>{description}</span>
      </div>
      <div>{/* <Button>Publish</Button> */}</div>
    </div>
  );
};

export default FormHeader;
