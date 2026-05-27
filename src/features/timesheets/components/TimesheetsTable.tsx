// features/timesheets/components/TimesheetsTable.tsx
//
// Per-employee weekly timesheet grid.
// Columns: Employee · Dept · Mon · Tue · Wed · Thu · Fri · Total · Status
//
// Uses TanStack Table for column sorting.
// Cell coloring: hours > 9h → amber warning, 0h → muted dash.
// Total: colour-coded green (≥40h), orange (35–39h), red (<35h).

import { useState } from "react";
import {
  Table,
  Group,
  Avatar,
  Text,
  Badge,
  Paper,
  Box,
  Tooltip,
  UnstyledButton,
  rem,
  Stack,
  Select,
} from "@mantine/core";
import {
  IconChevronUp,
  IconChevronDown,
  IconSelector,
  IconCalendar,
} from "@tabler/icons-react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";

import { StatusBadge, EmptyState, LoadingRows } from "@/components/ui";
import { getInitials } from "@/lib/formatters";
import type { TimesheetRow } from "@/types";

// ── Day abbreviations ─────────────────────────────────────────────
const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const;

// ── Cell helpers ──────────────────────────────────────────────────
function HoursCell({ hours }: { hours: number | null }) {
  if (hours === null) {
    return (
      <Text size="xs" c="dimmed" ta="center">
        —
      </Text>
    );
  }
  const isOver = hours > 9;
  const isZero = hours === 0;
  const color = isOver ? "orange" : isZero ? "dimmed" : undefined;

  return (
    <Tooltip
      label={isOver ? "Overtime flagged" : `${hours}h`}
      withArrow
      disabled={!isOver}
    >
      <Text
        size="xs"
        ta="center"
        c={color}
        fw={isOver ? 600 : 400}
        style={{ cursor: isOver ? "help" : "default" }}
      >
        {hours}h
      </Text>
    </Tooltip>
  );
}

function TotalCell({ total }: { total: number | null }) {
  if (total === null) {
    return (
      <Text size="xs" c="dimmed" ta="center" fw={500}>
        —
      </Text>
    );
  }
  const color = total >= 40 ? "green" : total >= 35 ? "orange" : "red";
  return (
    <Badge color={color} variant="light" size="sm" radius="sm">
      {total}h
    </Badge>
  );
}

// ── Sort icon ─────────────────────────────────────────────────────
function SortIcon({ sorted }: { sorted: false | "asc" | "desc" }) {
  if (sorted === "asc") return <IconChevronUp size={12} stroke={2} />;
  if (sorted === "desc") return <IconChevronDown size={12} stroke={2} />;
  return <IconSelector size={12} stroke={1.5} style={{ opacity: 0.4 }} />;
}

function SortableHeader({
  label,
  sorted,
  onSort,
  align = "left",
}: {
  label: string;
  sorted: false | "asc" | "desc";
  onSort: () => void;
  align?: "left" | "center";
}) {
  return (
    <UnstyledButton
      onClick={onSort}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: align === "center" ? "center" : "flex-start",
        gap: rem(3),
        fontSize: rem(11),
        fontWeight: 600,
        color: "var(--mantine-color-dimmed)",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        userSelect: "none",
        width: "100%",
      }}
    >
      {label}
      <SortIcon sorted={sorted} />
    </UnstyledButton>
  );
}

// ── Column helper ─────────────────────────────────────────────────
const col = createColumnHelper<TimesheetRow>();

const columns = [
  col.accessor("user.name", {
    id: "name",
    header: "Employee",
    cell: (info) => (
      <Group gap="sm" wrap="nowrap">
        <Avatar size={28} radius="xl" color="blue" variant="light">
          {getInitials(info.getValue())}
        </Avatar>
        <Text size="sm" fw={500} truncate maw={110}>
          {info.getValue()}
        </Text>
      </Group>
    ),
  }),

  col.accessor("department", {
    header: "Dept",
    cell: (info) => (
      <Text size="xs" c="dimmed" truncate maw={90}>
        {info.getValue()}
      </Text>
    ),
    filterFn: "equals",
  }),

  // Mon–Fri day columns (index 0–4 into the days array)
  ...([0, 1, 2, 3, 4] as const).map((dayIdx) =>
    col.display({
      id: DAY_LABELS[dayIdx],
      header: DAY_LABELS[dayIdx],
      cell: ({ row }) => (
        <HoursCell hours={row.original.days[dayIdx]?.hours ?? null} />
      ),
      enableSorting: false,
    }),
  ),

  col.accessor("totalHours", {
    header: "Total",
    cell: (info) => <TotalCell total={info.getValue()} />,
    sortUndefined: "last",
  }),

  col.accessor("status", {
    header: "Status",
    cell: (info) => <StatusBadge status={info.getValue()} />,
    sortingFn: (a, b) => {
      const order = { MISSING: 0, LATE: 1, PENDING: 2, UPDATED: 3 };
      return order[a.original.status] - order[b.original.status];
    },
  }),
];

// ── Filter options ────────────────────────────────────────────────
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
interface TimesheetsTableProps {
  rows: TimesheetRow[];
  isLoading?: boolean;
}

// ── Main component ────────────────────────────────────────────────
export function TimesheetsTable({
  rows,
  isLoading = false,
}: TimesheetsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "status", desc: false },
  ]);
  const [deptFilter, setDeptFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const activeFilters = [
    ...(deptFilter ? [{ id: "department", value: deptFilter }] : []),
    ...(statusFilter ? [{ id: "status", value: statusFilter }] : []),
  ];

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting, columnFilters: activeFilters },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const visibleRows = table.getRowModel().rows;

  return (
    <Stack gap="sm">
      {/* Filters toolbar */}
      <Group gap="sm">
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
        <Text size="xs" c="dimmed" ml="auto">
          {visibleRows.length} employee{visibleRows.length !== 1 ? "s" : ""}
        </Text>
      </Group>

      <Paper withBorder radius="sm" style={{ overflow: "hidden" }}>
        <Box style={{ overflowX: "auto" }}>
          <Table highlightOnHover style={{ minWidth: 700 }}>
            <Table.Thead style={{ background: "var(--mantine-color-gray-0)" }}>
              {table.getHeaderGroups().map((hg) => (
                <Table.Tr key={hg.id}>
                  {hg.headers.map((header) => {
                    const canSort = header.column.getCanSort();
                    const label = String(header.column.columnDef.header ?? "");
                    const isDayCol = DAY_LABELS.includes(
                      label as (typeof DAY_LABELS)[number],
                    );
                    return (
                      <Table.Th
                        key={header.id}
                        style={{
                          paddingTop: rem(10),
                          paddingBottom: rem(10),
                          textAlign: isDayCol ? "center" : "left",
                          minWidth: isDayCol ? 48 : undefined,
                        }}
                      >
                        {canSort ? (
                          <SortableHeader
                            label={label}
                            sorted={header.column.getIsSorted()}
                            onSort={
                              header.column.getToggleSortingHandler() as () => void
                            }
                            align={isDayCol ? "center" : "left"}
                          />
                        ) : (
                          <Text
                            size="xs"
                            fw={600}
                            c="dimmed"
                            tt="uppercase"
                            ta={isDayCol ? "center" : "left"}
                            style={{ letterSpacing: "0.05em" }}
                          >
                            {label}
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
                <LoadingRows cols={9} rows={6} />
              ) : visibleRows.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={9}>
                    <EmptyState
                      icon={IconCalendar}
                      title="No timesheets found"
                      description="No records match your current filters."
                    />
                  </Table.Td>
                </Table.Tr>
              ) : (
                visibleRows.map((row) => (
                  <Table.Tr key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      const isDayCol = DAY_LABELS.includes(
                        String(
                          cell.column.columnDef.header,
                        ) as (typeof DAY_LABELS)[number],
                      );
                      return (
                        <Table.Td
                          key={cell.id}
                          style={{ textAlign: isDayCol ? "center" : "left" }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </Table.Td>
                      );
                    })}
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        </Box>
      </Paper>
    </Stack>
  );
}
