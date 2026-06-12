import { useState } from "react";
import {
  Table,
  Group,
  Avatar,
  Text,
  Badge,
  Paper,
  TextInput,
  Stack,
  Box,
  UnstyledButton,
  Tooltip,
  ActionIcon,
  rem,
} from "@mantine/core";
import {
  IconSearch,
  IconChevronUp,
  IconChevronDown,
  IconSelector,
  IconInfoCircle,
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

import { EmptyState, LoadingRows } from "@/components/ui";
import type { TaskStatus } from "@/types";
import { formatDate, getInitials } from "@/lib/formatters";

const TASK_STATUS_META: Record<TaskStatus, { label: string; color: string }> = {
  NO_TASKS: { label: "No tasks", color: "gray" },
  IN_PROGRESS: { label: "In progress", color: "blue" },
  COMPLETED: { label: "Completed", color: "green" },
};

const TASK_STATUS_ORDER: Record<TaskStatus, number> = {
  NO_TASKS: 0,
  IN_PROGRESS: 1,
  COMPLETED: 2,
};

export interface EmployeeRow {
  id: string;
  name: string;
  email: string;
  taskStatus: TaskStatus;
  currentLearning: string;
  learningStatus: string;
  learningDetails: string;
  updatedAt: string;
}

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

const col = createColumnHelper<EmployeeRow>();

const columns = [
  col.accessor("name", {
    header: "Team Member",
    cell: (info) => (
      <Group gap="sm" wrap="nowrap">
        <Avatar size={30} radius="xl" color="blue" variant="light">
          {getInitials(info.getValue())}
        </Avatar>
        <Box style={{ minWidth: 0 }}>
          <Text size="sm" fw={500} truncate>
            {info.getValue()}
          </Text>
          <Text size="xs" c="dimmed" truncate>
            {info.row.original.email}
          </Text>
        </Box>
      </Group>
    ),
  }),

  col.accessor("taskStatus", {
    header: "Status",
    cell: (info) => {
      const meta = TASK_STATUS_META[info.getValue()];
      return (
        <Badge variant="light" color={meta.color} size="sm" radius="sm">
          {meta.label}
        </Badge>
      );
    },
    sortingFn: (a, b) =>
      TASK_STATUS_ORDER[a.original.taskStatus] -
      TASK_STATUS_ORDER[b.original.taskStatus],
  }),

  col.accessor("currentLearning", {
    header: "Currently learning",
    enableSorting: false,

    cell: (info) => {
      const learning = info.getValue();
      const details = info.row.original.learningDetails;
      const learningStatus = info.row.original.learningStatus;

      if (!learning) {
        return (
          <Text size="sm" c="dimmed" fs="italic">
            —
          </Text>
        );
      }

      return (
        <Group gap={4} wrap="nowrap" align="flex-start">
          <Box style={{ minWidth: 0 }}>
            <Text size="sm" truncate maw={200}>
              {learning}
            </Text>

            {learningStatus && (
              <Text size="xs" c="dimmed" truncate maw={220}>
                {learningStatus}
              </Text>
            )}
          </Box>

          {details && (
            <Tooltip multiline withArrow label={details}>
              <ActionIcon variant="subtle" size="sm">
                <IconInfoCircle size={14} />
              </ActionIcon>
            </Tooltip>
          )}
        </Group>
      );
    },
  }),

  col.accessor("updatedAt", {
    header: "Updated",
    cell: (info) => (
      <Text size="xs" c="dimmed" style={{ whiteSpace: "nowrap" }}>
        {formatDate(info.getValue())}
      </Text>
    ),
  }),
];

interface EmployeesTableProps {
  rows: EmployeeRow[];
  isLoading?: boolean;
}

export function EmployeesTable({
  rows,
  isLoading = false,
}: EmployeesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "taskStatus", desc: false },
  ]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const visibleRows = table.getRowModel().rows;

  return (
    <Stack gap="sm">
      <TextInput
        placeholder="Search team members..."
        leftSection={<IconSearch size={14} stroke={1.5} />}
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.currentTarget.value)}
        size="sm"
      />

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
              <LoadingRows cols={4} rows={5} />
            ) : visibleRows.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={4}>
                  <EmptyState
                    icon={IconSearch}
                    title="No employees found"
                    description="Try a different search term."
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

        {!isLoading && visibleRows.length > 0 && (
          <Box
            px="md"
            py="xs"
            style={{
              borderTop: "1px solid var(--mantine-color-default-border)",
              background: "var(--mantine-color-gray-0)",
            }}
          >
            <Text size="xs" c="dimmed">
              {visibleRows.length === rows.length
                ? `${rows.length} team members`
                : `${visibleRows.length} of ${rows.length} team members`}
            </Text>
          </Box>
        )}
      </Paper>
    </Stack>
  );
}
