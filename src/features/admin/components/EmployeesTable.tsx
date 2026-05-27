// features/admin/components/EmployeesTable.tsx
//
// Full employee list for the admin page.
// Uses TanStack Table v8 for sorting and column management.
// Simple Mantine Table renders the output — no virtualization yet
// (needed at 500+ rows; mock has 10).
//
// Columns: Avatar+Name · Email · Department · Role · This week · Joined · Actions

import { useMemo, useState } from "react";
import {
  Table,
  Group,
  Avatar,
  Text,
  Badge,
  Paper,
  ActionIcon,
  TextInput,
  Select,
  Stack,
  Box,
  Tooltip,
  UnstyledButton,
  rem,
} from "@mantine/core";
import {
  IconSearch,
  IconDots,
  IconChevronUp,
  IconChevronDown,
  IconSelector,
  IconMail,
  IconEye,
} from "@tabler/icons-react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";

import { StatusBadge, EmptyState, LoadingRows } from "@/components/ui";
import { formatDate, getInitials } from "@/lib/formatters";
import type { User, UploadStatus } from "@/types";
import { MOCK_DEPT_MAP } from "@/mock";

// ── Row shape ─────────────────────────────────────────────────────
// Flat row combining User + their current-week status.
export interface EmployeeRow {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "EMPLOYEE";
  department: string;
  currentStatus: UploadStatus;
  createdAt: string;
}

// ── Sort indicator icon ───────────────────────────────────────────
function SortIcon({ sorted }: { sorted: false | "asc" | "desc" }) {
  if (sorted === "asc") return <IconChevronUp size={13} stroke={2} />;
  if (sorted === "desc") return <IconChevronDown size={13} stroke={2} />;
  return <IconSelector size={13} stroke={1.5} style={{ opacity: 0.4 }} />;
}

// ── Sortable header cell ──────────────────────────────────────────
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

// ── Column helper ─────────────────────────────────────────────────
const col = createColumnHelper<EmployeeRow>();

// ── Column definitions ────────────────────────────────────────────
const columns = [
  col.accessor("name", {
    header: "Employee",
    cell: (info) => (
      <Group gap="sm" wrap="nowrap">
        <Avatar size={30} radius="xl" color="blue" variant="light">
          {getInitials(info.getValue())}
        </Avatar>
        <Box style={{ minWidth: 0 }}>
          <Text size="sm" fw={500} truncate>
            {info.getValue()}
          </Text>
        </Box>
      </Group>
    ),
  }),

  col.accessor("email", {
    header: "Email",
    cell: (info) => (
      <Text size="xs" c="dimmed" truncate maw={200}>
        {info.getValue()}
      </Text>
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

  col.accessor("role", {
    header: "Role",
    cell: (info) => (
      <Text size="xs" c="dimmed" tt="capitalize">
        {info.getValue().toLowerCase()}
      </Text>
    ),
  }),

  col.accessor("currentStatus", {
    header: "This week",
    cell: (info) => <StatusBadge status={info.getValue()} />,
    sortingFn: (a, b) => {
      const order: Record<UploadStatus, number> = {
        MISSING: 0,
        LATE: 1,
        PENDING: 2,
        UPDATED: 3,
      };
      return order[a.original.currentStatus] - order[b.original.currentStatus];
    },
  }),

  col.accessor("createdAt", {
    header: "Joined",
    cell: (info) => (
      <Text size="xs" c="dimmed">
        {formatDate(info.getValue())}
      </Text>
    ),
  }),

  // Actions column — no accessor, stable ID
  col.display({
    id: "actions",
    header: "",
    cell: () => (
      <Group gap={4} wrap="nowrap" justify="flex-end">
        <Tooltip label="Send email" withArrow position="top">
          <ActionIcon
            variant="subtle"
            color="gray"
            size="sm"
            aria-label="Send email"
          >
            <IconMail size={14} stroke={1.5} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="View profile" withArrow position="top">
          <ActionIcon
            variant="subtle"
            color="gray"
            size="sm"
            aria-label="View profile"
          >
            <IconEye size={14} stroke={1.5} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="More actions" withArrow position="top">
          <ActionIcon
            variant="subtle"
            color="gray"
            size="sm"
            aria-label="More actions"
          >
            <IconDots size={14} stroke={1.5} />
          </ActionIcon>
        </Tooltip>
      </Group>
    ),
  }),
];

// ── Department filter options ─────────────────────────────────────
const DEPT_OPTIONS = [
  { value: "", label: "All departments" },
  { value: "Engineering", label: "Engineering" },
  { value: "Design", label: "Design" },
  { value: "Marketing", label: "Marketing" },
  { value: "Sales", label: "Sales" },
];

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "UPDATED", label: "Updated" },
  { value: "PENDING", label: "Pending" },
  { value: "LATE", label: "Late" },
  { value: "MISSING", label: "Missing" },
];

// ── Props ─────────────────────────────────────────────────────────
interface EmployeesTableProps {
  rows: EmployeeRow[];
  isLoading?: boolean;
}

// ── Main component ────────────────────────────────────────────────
export function EmployeesTable({
  rows,
  isLoading = false,
}: EmployeesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "currentStatus", desc: false }, // Default: problem employees first
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Apply dept + status as column filters
  const activeFilters: ColumnFiltersState = useMemo(() => {
    const filters: ColumnFiltersState = [];
    if (deptFilter) filters.push({ id: "department", value: deptFilter });
    if (statusFilter)
      filters.push({ id: "currentStatus", value: statusFilter });
    return filters;
  }, [deptFilter, statusFilter]);

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting, globalFilter, columnFilters: activeFilters },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const visibleRows = table.getRowModel().rows;

  return (
    <Stack gap="sm">
      {/* ── Toolbar ─────────────────────────────────────────────── */}
      <Group gap="sm" wrap="wrap">
        <TextInput
          placeholder="Search employees…"
          leftSection={<IconSearch size={14} stroke={1.5} />}
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.currentTarget.value)}
          size="sm"
          style={{ flex: 1, minWidth: 200 }}
        />
        <Select
          data={DEPT_OPTIONS}
          value={deptFilter}
          onChange={(v) => setDeptFilter(v ?? "")}
          size="sm"
          w={180}
          placeholder="All departments"
          clearable
        />
        <Select
          data={STATUS_OPTIONS}
          value={statusFilter}
          onChange={(v) => setStatusFilter(v ?? "")}
          size="sm"
          w={150}
          placeholder="All statuses"
          clearable
        />
      </Group>

      {/* ── Table ───────────────────────────────────────────────── */}
      <Paper withBorder radius="sm" style={{ overflow: "hidden" }}>
        <Table highlightOnHover>
          <Table.Thead style={{ background: "var(--mantine-color-gray-0)" }}>
            {table.getHeaderGroups().map((hg) => (
              <Table.Tr key={hg.id}>
                {hg.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  return (
                    <Table.Th
                      key={header.id}
                      style={{ paddingTop: rem(10), paddingBottom: rem(10) }}
                    >
                      {canSort ? (
                        <SortableHeader
                          label={String(header.column.columnDef.header ?? "")}
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
              <LoadingRows cols={7} rows={6} />
            ) : visibleRows.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={7}>
                  <EmptyState
                    icon={IconSearch}
                    title="No employees found"
                    description="Try adjusting your search or filter criteria."
                  />
                </Table.Td>
              </Table.Tr>
            ) : (
              visibleRows.map((row) => (
                <Table.Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Table.Td key={cell.id}>
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

        {/* Footer row count */}
        {!isLoading && (
          <Box
            px="md"
            py="xs"
            style={{
              borderTop: "1px solid var(--mantine-color-default-border)",
              background: "var(--mantine-color-gray-0)",
            }}
          >
            <Text size="xs" c="dimmed">
              Showing {visibleRows.length} of {rows.length} employees
            </Text>
          </Box>
        )}
      </Paper>
    </Stack>
  );
}
