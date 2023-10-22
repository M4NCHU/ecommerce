"use client";

import { CustomFilterWithFilterOptions, ExtendedCategory } from "@/types/db";
import { FilterFieldType } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import toast from "react-hot-toast";
import FormCard from "../FormCard";

// styles

import FiltersFormStyles from "@/styles/forms/FiltersForm.module.css";
import TableComponent from "@/components/UI/TableDefault";

interface EditFilterFormProps {
  category: ExtendedCategory;
  filterss: CustomFilterWithFilterOptions[];
}

interface SelectFilterChoice {
  id: string;
  option: string;
  availableChoice: string;
}

interface NumericFilterChoice {
  id: string;
  option: string;
  choiceFrom: number;
  choiceTo: number;
}

type FilterChoice = SelectFilterChoice | NumericFilterChoice;

interface FilterProps {
  id: string;
  name: string;
  fieldType: FilterFieldType;
  availableChoices: availableChoicesTypes[] | null;
}

type availableChoicesTypes = {
  id: string;
  option: string;
  availableChoice: string;
  choiceFrom: number;
  choiceTo: number;
};

interface AddFilterFormProps {
  onSubmit: (newFilter: FilterProps) => void;
}

const EditFilterForm: FC<EditFilterFormProps> = ({ filterss, category }) => {
  const router = useRouter();

  const [filters, setFilters] = useState<FilterProps[]>(
    filterss.map((filter) => {
      const availableChoices = filter.filterOptions.map((it) => ({
        id: it.id,
        option: it.option,
        availableChoice: it.availableChoices || "", // Dostosowano typ
        choiceFrom: it.choiceFrom || 0, // Dostosowano typ
        choiceTo: it.choiceTo || 0, // Dostosowano typ
      }));

      return {
        id: filter.id,
        name: filter.name,
        fieldType: filter.fieldType,
        availableChoices,
      };
    })
  );
  const [newFilter, setNewFilter] = useState<FilterProps | null>(null);
  const [isAddingFilter, setIsAddingFilter] = useState<boolean>(false);

  console.log("newFilter", newFilter);
  console.log("filters", filters);

  const handleAddFilter = () => {
    setIsAddingFilter(true);
    setNewFilter({
      id: "",
      name: "",
      fieldType: FilterFieldType.SELECT, // Domyślny typ
      availableChoices: null,
    });
  };

  const handleSaveFilter = () => {
    if (newFilter) {
      setFilters([...filters, newFilter]);
      setNewFilter(null);
      setIsAddingFilter(false);
    }
  };

  const handleCancelAddFilter = () => {
    setNewFilter(null);
    setIsAddingFilter(false);
  };

  const { mutate: CreateFilter } = useMutation({
    mutationKey: ["createFilter"],
    mutationFn: async (filter: FilterProps) => {
      const payload = {
        categoryId: category.id,
        filter: filter,
      };

      const { data } = await axios.post("/api/filters/create", payload);
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
      toast.success("Successfully created filter", data);
      router.refresh();
    },
  });

  function getDefaultChoice() {
    return {
      id: "",
      option: "",
      availableChoice: "",
      choiceFrom: 0,
      choiceTo: 0,
    };
  }

  function updateCurrentChoice(updatedChoice: availableChoicesTypes[]) {
    setNewFilter({
      ...newFilter,
      availableChoices: [updatedChoice],
    });
  }

  const columns = [
    { name: "ID", uid: "id", sortable: true },
    { name: "FILTER", uid: "name", sortable: true },
    { name: "OPTION", uid: "FilterOption", sortable: true },
    { name: "FIELD TYPE", uid: "fieldType", sortable: true },
    { name: "AVAILABLE CHOICES", uid: "availableChoices", sortable: false },
    { name: "ACTIONS", uid: "actions", sortable: false },
  ];

  return (
    <FormCard title="Category Filters">
      <TableComponent
        data={filters}
        columns={columns}
        addNew={handleAddFilter}
      />

      {isAddingFilter ? (
        <div className={FiltersFormStyles.FilterMain}>
          <h2>Add Filter</h2>
          <label>Name: </label>
          <input
            className={FiltersFormStyles.FilterInput}
            type="text"
            value={newFilter!.name} // Non-null assertion operator
            onChange={(e) =>
              setNewFilter({ ...newFilter!, name: e.target.value })
            }
          />
          <label>Type: </label>
          <select
            className={FiltersFormStyles.FilterInput}
            value={newFilter!.fieldType} // Non-null assertion operator
            onChange={(e) =>
              setNewFilter({
                ...newFilter!,
                fieldType: e.target.value as FilterFieldType,
              })
            }
          >
            <option
              className={FiltersFormStyles.FilterInput}
              value={FilterFieldType.SELECT}
            >
              SELECT
            </option>
            <option
              className={FiltersFormStyles.FilterInput}
              value={FilterFieldType.NUMERIC}
            >
              NUMERIC
            </option>
          </select>
          {newFilter!.fieldType === FilterFieldType.SELECT ? ( // Non-null assertion operator
            <div className={FiltersFormStyles.FilterCreateContainer}>
              <label>Options (comma-separated): </label>
              <input
                className={FiltersFormStyles.FilterInput}
                type="text"
                value={
                  newFilter!.availableChoices
                    ?.map((choice) => choice.option)
                    .join(",") || ""
                } // Non-null assertion operator
                onChange={(e) => {
                  const options = e.target.value.split(",").map((option) => ({
                    id: "",
                    option,
                    availableChoice: option,
                    choiceFrom: 0,
                    choiceTo: 0,
                  }));
                  setNewFilter({ ...newFilter!, availableChoices: options }); // Non-null assertion operator
                }}
              />
            </div>
          ) : (
            <div className={FiltersFormStyles.FilterCreateContainer}>
              <label>Choice From: </label>
              <input
                className={FiltersFormStyles.FilterInput}
                type="number"
                value={newFilter!.availableChoices?.[0]?.choiceFrom ?? 0} // Użyj nullish coalescing (??) do obsługi przypadku null
                onChange={(e) => {
                  const currentChoice =
                    newFilter?.availableChoices?.[0] || getDefaultChoice();
                  currentChoice.choiceFrom = parseFloat(e.target.value);
                  updateCurrentChoice(currentChoice);
                }}
              />
              <label>Choice To: </label>
              <input
                className={FiltersFormStyles.FilterInput}
                type="number"
                value={newFilter!.availableChoices?.[0]?.choiceTo ?? 0} // Użyj nullish coalescing (??) do obsługi przypadku null
                onChange={(e) => {
                  const currentChoice = newFilter?.availableChoices?.[0] || {
                    id: "",
                    option: "",
                    availableChoice: "",
                    choiceFrom: 0,
                    choiceTo: 0,
                  };
                  setNewFilter({
                    ...newFilter!,
                    availableChoices: [
                      {
                        ...currentChoice,
                        choiceTo: parseFloat(e.target.value),
                      },
                    ],
                  });
                }}
              />
            </div>
          )}
          <div className={FiltersFormStyles.ButtonContainer}>
            <button
              className={
                FiltersFormStyles.FilterButton +
                " " +
                FiltersFormStyles.FilterButtonCreate
              }
              onClick={(e: any) => {
                e.preventDefault();
                if (newFilter) {
                  CreateFilter(newFilter);
                  handleSaveFilter();
                }
              }}
            >
              Save Filter
            </button>
            <button
              onClick={handleCancelAddFilter}
              className={
                FiltersFormStyles.FilterButton +
                " " +
                FiltersFormStyles.FilterButtonDanger
              }
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className={``}>
          <button
            className={
              FiltersFormStyles.FilterButton +
              " " +
              FiltersFormStyles.FilterButtonCreate
            }
            onClick={handleAddFilter}
          >
            Add Filter
          </button>
        </div>
      )}
    </FormCard>
  );
};

export default EditFilterForm;
