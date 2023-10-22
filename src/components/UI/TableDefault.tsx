import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Selection,
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  User,
} from "@nextui-org/react";
import { FC, useCallback, useMemo, useState } from "react";

const statusOptions = [
  { name: "Active", uid: "active" },
  { name: "Paused", uid: "paused" },
  { name: "Vacation", uid: "vacation" },
];

import TableStyle from "@/styles/admin/tables/DefaultTable.module.css";
import {
  FaChevronCircleDown,
  FaCommentDots,
  FaPlus,
  FaSearch,
} from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { BiDotsVerticalRounded } from "react-icons/bi";
import Image from "next/image";
import { getNiceDate, limitText } from "@/lib/utils";

interface TableProps {
  data: any[];
  columns: {
    name: string;
    uid: string;
    sortable: boolean | undefined;
  }[];
  methods?: { name: string; func: (itemId: string) => void }[];
  addNew?: () => void;
}

function capitalize(str: any) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const TableComponent: FC<TableProps> = ({ data, columns, methods, addNew }) => {
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(columns.map((column) => column.uid))
  );
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: columns[0].uid,
    direction: "ascending",
  });
  const [page, setPage] = useState(1);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredData = [...data];
    if (filterValue) {
      filteredData = filteredData.filter((item) =>
        item.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredData = filteredData.filter((item) =>
        Array.from(statusFilter).includes(item.status)
      );
    }
    return filteredData;
  }, [data, filterValue, statusFilter]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[
        sortDescriptor.column as keyof (typeof data)[0]
      ] as number;
      const second = b[
        sortDescriptor.column as keyof (typeof data)[0]
      ] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const handleDeleteItem = (itemId: string) => {
    // Wywołaj funkcję DeleteItem z przekazanym itemId
    methods && methods.find((method) => method.name === "delete")?.func(itemId);
  };

  const handleEditItem = (itemId: string) => {
    // Wywołaj funkcję EditItem z przekazanym itemId
    methods && methods.find((method) => method.name === "edit")?.func(itemId);
  };

  const renderCell = useCallback((item: any, columnKey: any) => {
    const cellValue = item[columnKey as keyof typeof item];
    switch (columnKey) {
      case "name":
        return <h4 className="font-semibold">{item.name}</h4>;
      case "role":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
            <p className="text-bold text-tiny capitalize text-default-500">
              {item.team}
            </p>
          </div>
        );
      case "status":
        return (
          <Chip
            className="capitalize border-none gap-1 text-default-600"
            // color={statusColorMap[item.status]}
            size="sm"
            variant="dot"
          >
            {cellValue}
          </Chip>
        );
      case "primaryImageUrl":
        return (
          <div className="w-[4rem] h-[4rem]">
            <Image
              fill
              className="object-contain"
              src={item.primaryImageUrl}
              alt="hello"
            />
          </div>
        );
      case "imageUrl":
        return (
          <div className="w-[4rem] h-[4rem]">
            <Image
              fill
              className="object-contain"
              src={item.imageUrl}
              alt="hello"
            />
          </div>
        );
      case "availableChoices":
        return (
          <div className="flex flex-row">
            {item.availableChoices &&
              item.availableChoices.map((filter: any, it: any) => (
                <div className="flex gap-2" key={it}>
                  {filter.availableChoice}
                </div>
              ))}
            {item.fieldType === "NUMERIC" &&
              item.availableChoices.map((filter: any, it: any) => (
                <div className="flex gap-2" key={it}>
                  <span>from: {filter.choiceFrom}</span>
                  <span>to: {filter.choiceTo}</span>
                </div>
              ))}
          </div>
        );
      case "createdAt":
        return <time>{getNiceDate(item.createdAt)}</time>;
      case "description":
        return <time>{limitText(item.description, 20)}</time>;

      case "category":
        return item.category.name && <p>{item.category.name}</p>;
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown className="bg-background border-1 border-default-200">
              <DropdownTrigger>
                <Button isIconOnly radius="full" size="sm" variant="light">
                  <BiDotsVerticalRounded className="text-lg" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem>View</DropdownItem>
                <DropdownItem onClick={() => handleEditItem(item.id)}>
                  Edit
                </DropdownItem>
                <DropdownItem onClick={() => handleDeleteItem(item.id)}>
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onRowsPerPageChange = useCallback((e: any) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = useCallback((value: any) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            classNames={{
              base: "w-full sm:max-w-[44%]",
              inputWrapper: "border-1",
            }}
            placeholder="Search by name..."
            size="sm"
            startContent={<FaSearch className="text-default-300" />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<IoIosArrowDown className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status: any) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<IoIosArrowDown className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              className="bg-foreground text-background"
              endContent={<FaPlus />}
              size="sm"
              onClick={addNew ? addNew : () => {}}
            >
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {data.length} items
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    data.length,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          showControls
          classNames={{
            cursor: "bg-foreground text-background",
          }}
          color="default"
          isDisabled={filterValue !== ""} // Poprawione tutaj
          page={page}
          total={Math.ceil(filteredItems.length / rowsPerPage)}
          variant="light"
          onChange={setPage}
        />
        <span className="text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${items.length} selected`}
        </span>
      </div>
    );
  }, [selectedKeys, items.length, page, filterValue]);

  const classNames = useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-3xl"],
      th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
      td: [
        "group-data-[first=true]:first:before:rounded-none",
        "group-data-[first=true]:last:before:rounded-none",
        "group-data-[middle=true]:before:rounded-none",
        "group-data-[last=true]:first:before:rounded-none",
        "group-data-[last=true]:last:before:rounded-none",
      ],
    }),
    []
  );

  return (
    <div className={TableStyle.TableDefault}>
      {topContent}
      <Table
        className={TableStyle.TableBody}
        isCompact
        removeWrapper
        aria-label="Example table with custom cells, pagination and sorting"
        bottomContentPlacement="outside"
        checkboxesProps={{
          classNames: {
            wrapper:
              "after:bg-foreground after:text-background text-background",
          },
        }}
        classNames={classNames}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No items found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      {bottomContent}
    </div>
  );
};

export default TableComponent;
