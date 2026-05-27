import { useMemo, useState } from "react";
import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Group,
  Paper,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Tooltip,
  UnstyledButton,
  rem,
} from "@mantine/core";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
  IconDots,
  IconDownload,
  IconEye,
  IconFileSpreadsheet,
  IconSearch,
  IconSelector,
} from "@tabler/icons-react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";

import { EmptyState, LoadingRows, StatusBadge } from "@/components/ui";
import { formatDateTime, formatFileSize, getInitials } from "@/lib/formatters";
import type { UploadRow, UploadStatus } from "@/types";

const col = createColumnHelper<UploadRow>();

const STATUS_ORDER: Record<UploadStatus, number> = {
  MISSING: 0,
  LATE: 1,
  PENDING: 2,
  UPDATED: 3,
};

function SortIcon({ sorted }: { sorted: false | "asc" | "desc" }) {
  if (sorted === "asc") return <IconChevronUp size={13} stroke={2} />;
  if (sorted === "desc") return <IconChevronDown size={13} stroke={2} />;
  return <IconSelector size={13} stroke={1.5} style={{ opacity: 0.4 }} />;
}

function SortableHeader({
  label,
  sorted,
  onSort,
}: {
  label: string;
  sorted: false | "asc" | "desc";
  onSort: () => void;
}) {
  return (
    <UnstyledButton
      onClick={onSort}
      style={{
        display: "flex",
        alignItems: "center",
        gap: rem(4),
        fontSize: rem(12),
        fontWeight: 600,
        color: "var(--mantine-color-dimmed)",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        userSelect: "none",
        whiteSpace: "nowrap",
      }}
    >
      {label}
      <SortIcon sorted={sorted} />
    </UnstyledButton>
  );
}

function hasFile(upload: UploadRow) {
  return Boolean(upload.fileName && upload.uploadedAt);
}

const columns = [
  col.accessor("user.name", {
    id: "employee",
    header: "Employee",
    cell: (info) => (
      <Group gap="sm" wrap="nowrap">
        <Avatar size={30} radius="xl" color="blue" variant="light">
          {getInitials(info.getValue())}
        </Avatar>
        <Box style={{ minWidth: 0 }}>
          <Text size="sm" fw={500} truncate maw={150}>
            {info.getValue()}
          </Text>
          <Text size="xs" c="dimmed" truncate maw={180}>
            {info.row.original.user.email}
          </Text>
        </Box>
      </Group>
    ),
  }),

  col.accessor("department", {
    header: "Department",
    cell: (info) => (
      <Badge variant="outline" color="gray" size="sm" radius="sm">
        {info.getValue()}
      </Badge>
    ),
    filterFn: "equals",
  }),

  col.accessor("weekLabel", {
    id: "week",
    header: "Week",
    cell: (info) => (
      <Text size="xs" c="dimmed" truncate maw={110}>
        {info.getValue()}
      </Text>
    ),
    filterFn: "equals",
  }),

  col.accessor("status", {
    header: "Status",
    cell: (info) => <StatusBadge status={info.getValue()} />,
    sortingFn: (a, b) =>
      STATUS_ORDER[a.original.status] - STATUS_ORDER[b.original.status],
    filterFn: "equals",
  }),

  col.accessor("fileName", {
    header: "File",
    cell: (info) =>
      hasFile(info.row.original) ? (
        <Group gap={6} wrap="nowrap">
          <IconFileSpreadsheet
            size={14}
            stroke={1.5}
            style={{ color: "var(--mantine-color-green-6)", flexShrink: 0 }}
          />
          <Text size="xs" c="dimmed" truncate maw={220}>
            {info.getValue()}
          </Text>
        </Group>
      ) : (
        <Text size="xs" c="dimmed">
          —
        </Text>
      ),
  }),

  col.accessor("uploadedAt", {
    id: "uploaded",
    header: "Uploaded",
    cell: (info) => (
      <Text size="xs" c="dimmed" miw={116}>
        {hasFile(info.row.original) ? formatDateTime(info.getValue()) : "—"}
      </Text>
    ),
    sortingFn: (a, b) => {
      const aTime = a.original.uploadedAt
        ? new Date(a.original.uploadedAt).getTime()
        : 0;
      const bTime = b.original.uploadedAt
        ? new Date(b.original.uploadedAt).getTime()
        : 0;
      return aTime - bTime;
    },
  }),

  col.accessor("fileSizeBytes", {
    id: "size",
    header: "Size",
    cell: (info) => (
      <Text size="xs" c="dimmed" ta="right">
        {formatFileSize(info.getValue())}
      </Text>
    ),
    sortUndefined: "last",
  }),

  col.display({
    id: "actions",
    header: "",
    cell: () => (
      <Group gap={4} wrap="nowrap" justify="flex-end">
        <Tooltip label="View details" withArrow position="top">
          <ActionIcon
            variant="subtle"
            color="gray"
            size="sm"
            aria-label="View upload details"
          >
            <IconEye size={14} stroke={1.5} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Download file" withArrow position="top">
          <ActionIcon
            variant="subtle"
            color="gray"
            size="sm"
            aria-label="Download upload"
          >
            <IconDownload size={14} stroke={1.5} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="More actions" withArrow position="top">
          <ActionIcon
            variant="subtle"
            color="gray"
            size="sm"
            aria-label="More upload actions"
          >
            <IconDots size={14} stroke={1.5} />
          </ActionIcon>
        </Tooltip>
      </Group>
    ),
    enableSorting: false,
  }),
];

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "UPDATED", label: "Updated" },
  { value: "PENDING", label: "Pending" },
  { value: "LATE", label: "Late" },
  { value: "MISSING", label: "Missing" },
];

function uniqueOptions(values: string[], allLabel: string) {
  return [
    { value: "", label: allLabel },
    ...Array.from(new Set(values))
      .filter(Boolean)
      .sort()
      .map((value) => ({ value, label: value })),
  ];
}

function columnVisibleFrom(columnId: string): "sm" | "md" | undefined {
  if (columnId === "department") return "sm";
  if (columnId === "week" || columnId === "size") return "md";
  return undefined;
}

export interface UploadsTableProps {
  rows: UploadRow[];
  isLoading?: boolean;
}

export function UploadsTable({ rows, isLoading = false }: UploadsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "uploaded", desc: true },
  ]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [weekFilter, setWeekFilter] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const deptOptions = useMemo(
    () =>
      uniqueOptions(
        rows.map((row) => row.department),
        "All departments",
      ),
    [rows],
  );
  const weekOptions = useMemo(
    () =>
      uniqueOptions(
        rows.map((row) => row.weekLabel),
        "All weeks",
      ),
    [rows],
  );

  const activeFilters: ColumnFiltersState = useMemo(() => {
    const filters: ColumnFiltersState = [];
    if (deptFilter) filters.push({ id: "department", value: deptFilter });
    if (statusFilter) filters.push({ id: "status", value: statusFilter });
    if (weekFilter) filters.push({ id: "week", value: weekFilter });
    return filters;
  }, [deptFilter, statusFilter, weekFilter]);

  const table = useReactTable({
    data: rows,
    columns,
    state: {
      sorting,
      globalFilter,
      columnFilters: activeFilters,
      pagination,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, _columnId, filterValue) => {
      const search = String(filterValue).trim().toLowerCase();
      if (!search) return true;

      const upload = row.original;
      return [
        upload.user.name,
        upload.user.email,
        upload.fileName,
        upload.department,
        upload.weekLabel,
        upload.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search);
    },
  });

  const filteredRows = table.getFilteredRowModel().rows;
  const pageRows = table.getRowModel().rows;
  const pageCount = Math.max(table.getPageCount(), 1);
  const currentPage = table.getState().pagination.pageIndex + 1;

  return (
    <Stack gap="sm">
      <Group gap="sm" wrap="wrap">
        <TextInput
          placeholder="Search uploads..."
          leftSection={<IconSearch size={14} stroke={1.5} />}
          value={globalFilter}
          onChange={(event) => {
            setGlobalFilter(event.currentTarget.value);
            table.setPageIndex(0);
          }}
          size="sm"
          style={{ flex: 1, minWidth: 220 }}
        />
        <Select
          data={deptOptions}
          value={deptFilter}
          onChange={(value) => {
            setDeptFilter(value ?? "");
            table.setPageIndex(0);
          }}
          size="sm"
          w={180}
          placeholder="All departments"
          clearable
        />
        <Select
          data={STATUS_OPTIONS}
          value={statusFilter}
          onChange={(value) => {
            setStatusFilter(value ?? "");
            table.setPageIndex(0);
          }}
          size="sm"
          w={150}
          placeholder="All statuses"
          clearable
        />
        <Select
          data={weekOptions}
          value={weekFilter}
          onChange={(value) => {
            setWeekFilter(value ?? "");
            table.setPageIndex(0);
          }}
          size="sm"
          w={150}
          placeholder="All weeks"
          clearable
        />
      </Group>

      <Paper withBorder radius="sm" style={{ overflow: "hidden" }}>
        <Box style={{ overflowX: "auto" }}>
          <Table highlightOnHover style={{ minWidth: 860 }}>
            <Table.Thead style={{ background: "var(--mantine-color-gray-0)" }}>
              {table.getHeaderGroups().map((headerGroup) => (
                <Table.Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const canSort = header.column.getCanSort();
                    const label = String(header.column.columnDef.header ?? "");

                    return (
                      <Table.Th
                        key={header.id}
                        visibleFrom={columnVisibleFrom(header.column.id)}
                        style={{
                          paddingTop: rem(10),
                          paddingBottom: rem(10),
                          textAlign:
                            header.column.id === "size" ? "right" : "left",
                        }}
                      >
                        {canSort ? (
                          <SortableHeader
                            label={label}
                            sorted={header.column.getIsSorted()}
                            onSort={
                              header.column.getToggleSortingHandler() as () => void
                            }
                          />
                        ) : (
                          <Text
                            size="xs"
                            fw={600}
                            c="dimmed"
                            tt="uppercase"
                            style={{ letterSpacing: "0.05em" }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                          </Text>
                        )}
                      </Table.Th>
                    );
                  })}
                </Table.Tr>
              ))}
            </Table.Thead>

            <Table.Tbody>
              {isLoading ? (
                <LoadingRows cols={8} rows={8} />
              ) : pageRows.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={8}>
                    <EmptyState
                      icon={IconFileSpreadsheet}
                      title="No uploads found"
                      description="Try adjusting your search or filter criteria."
                    />
                  </Table.Td>
                </Table.Tr>
              ) : (
                pageRows.map((row) => (
                  <Table.Tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <Table.Td
                        key={cell.id}
                        visibleFrom={columnVisibleFrom(cell.column.id)}
                        style={{
                          textAlign:
                            cell.column.id === "size" ? "right" : "left",
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </Table.Td>
                    ))}
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        </Box>

        <Group
          justify="space-between"
          px="md"
          py="xs"
          gap="sm"
          wrap="wrap"
          style={{
            borderTop: "1px solid var(--mantine-color-default-border)",
            background: "var(--mantine-color-gray-0)",
          }}
        >
          <Text size="xs" c="dimmed">
            Showing {isLoading ? 0 : pageRows.length} of {filteredRows.length}{" "}
            uploads ({rows.length} total)
          </Text>

          <Group gap="xs" wrap="nowrap">
            <ActionIcon
              variant="subtle"
              color="gray"
              size="sm"
              aria-label="Previous page"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage() || isLoading}
            >
              <IconChevronLeft size={14} stroke={1.5} />
            </ActionIcon>
            <Text size="xs" c="dimmed" miw={72} ta="center">
              Page {currentPage} of {pageCount}
            </Text>
            <ActionIcon
              variant="subtle"
              color="gray"
              size="sm"
              aria-label="Next page"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage() || isLoading}
            >
              <IconChevronRight size={14} stroke={1.5} />
            </ActionIcon>
          </Group>
        </Group>
      </Paper>
    </Stack>
  );
}
