import React, { FC } from "react";
import FormContainerStyles from "@/styles/forms/Form.module.css";

interface FormContainerProps {
  children: React.ReactNode;
}

const FormContainer: FC<FormContainerProps> = ({ children }) => {
  return <div className={FormContainerStyles.FormContainer}>{children}</div>;
};

export default FormContainer;
