"use client";
import { Children, FC } from "react";
import FormCardStyles from "@/styles/forms/FormCard.module.css";

interface FormCardProps {
  children: React.ReactNode;
  title: string;
}

const FormCard: FC<FormCardProps> = ({ children, title }) => {
  return (
    <div className={FormCardStyles.FormCard}>
      <h3 className={FormCardStyles.FormCardTitle}>{title}</h3>
      {children}
    </div>
  );
};

export default FormCard;
