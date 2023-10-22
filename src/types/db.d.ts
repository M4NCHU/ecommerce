import { Category, CustomFilter, FilterOption, Product } from "@prisma/client";

export type ExtendedProduct = Product & {
  category: Category;
};

export type ExtendedCategory = Category & {
  customFilters: CustomFilterWithFilterOptions[];
};

export type CustomFilterWithFilterOptions = CustomFilter & {
  filterOptions: FilterOption[];
};
