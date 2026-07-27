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
  IconSpy,
  IconForbid2,
  IconHourglass,
  IconCheck,
  IconHistory,
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
import { DateView } from "@/components/DateView";
import type { LeaveType } from "@prisma/client";
import { LeaveHistoryModal } from "./LeaveHistoryModal";

const TASK_STATUS_META: Record<
  TaskStatus,
  { label: string; color: string; icon: "hourglass" | "check" | "blocked" }
> = {
  BLOCKED: {
    label: "blocked",
    color: "red",
    icon: "blocked",
  },

  IN_PROGRESS: {
    label: "In progress",
    color: "blue",
    icon: "hourglass",
  },

  COMPLETED: {
    label: "Completed",
    color: "green",
    icon: "check",
  },
};
const STATUS_ICON_MAP = {
  blocked: <IconForbid2 size={20} color="red" />,
  hourglass: <IconHourglass size={20} color="orange" />,
  check: <IconCheck size={20} color="green" />,
};
const TASK_STATUS_ORDER: Record<TaskStatus, number> = {
  BLOCKED: 0,
  IN_PROGRESS: 1,
  COMPLETED: 2,
};

const LEAVE_META: Record<
  LeaveType,
  {
    label: string;
    color: string;
  }
> = {
  SICK: {
    label: "Sick Leave",
    color: "red",
  },
  CASUAL: {
    label: "Casual Leave",
    color: "yellow",
  },
  VACATION: {
    label: "Vacation",
    color: "blue",
  },
  OPTIONAL: {
    label: "Optional Leave",
    color: "grape",
  },
};

export interface EmployeeRow {
  id: string;
  name: string;
  email: string;
  taskStatus: TaskStatus;
  currentLearning: string;
  learningStatus: string;
  learningDetails: string;
  currentTask?: string | null;
  timesheetUrl: string | null;
  timesheetUpdatedAt: string | null;
  lastSeenAt: string | null;
  updatedAt: string;

  leave: {
    leaveType: LeaveType;
    fromDate: string;
    toDate: string;
    reason: string | null;
  } | null;
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

  const [selectedEmployee, setSelectedEmployee] = useState<{
    id: string;
    name: string;
  } | null>(null);

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
        const currentTask = info.row.original.currentTask;
        const statusElement = STATUS_ICON_MAP[meta.icon];

        return (
          <Group gap={8} wrap="nowrap" align="center">
            {info.getValue() !== "BLOCKED" && currentTask ? (
              <Tooltip multiline withArrow label={currentTask}>
                <Box style={{ cursor: "help", display: "flex" }}>
                  {statusElement}
                </Box>
              </Tooltip>
            ) : (
              statusElement
            )}
          </Group>
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
              <Tooltip
                label={learning}
                multiline
                withArrow
                withinPortal
                zIndex={10000}
              >
                <Text
                  size="sm"
                  truncate
                  maw={120}
                  style={{ cursor: "pointer" }}
                >
                  {learning}
                </Text>
              </Tooltip>

              {learningStatus && (
                <Tooltip multiline withArrow label={learningStatus}>
                  <Text size="xs" c="dimmed" truncate maw={140}>
                    {learningStatus}
                  </Text>
                </Tooltip>
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

    col.accessor("lastSeenAt", {
      header: "Last Seen",

      cell: (info) => {
        const lastSeenAt = info.getValue();

        if (!lastSeenAt) {
          return (
            <Group gap={4}>
              <IconSpy size={14} />
              <Text size="sm">Never seen</Text>
            </Group>
          );
        }

        const days = Math.floor(
          (Date.now() - new Date(lastSeenAt).getTime()) / (1000 * 60 * 60 * 24),
        );

        const color = days > 7 ? "red" : days > 3 ? "yellow" : "green";

        return (
          <Badge
            color={color}
            variant="light"
            styles={{
              label: {
                textTransform: "none",
              },
            }}
          >
            <DateView timestampMs={new Date(lastSeenAt).getTime()} />
          </Badge>
        );
      },
    }),

    col.accessor("timesheetUrl", {
      header: "Timesheet",
      enableSorting: false,
      cell: (info) => {
        const url = info.getValue();
        const updatedAt = info.row.original.timesheetUpdatedAt;

        if (!url) {
          return (
            <Group gap={4}>
              <IconSpy size={14} />
              <Text size="sm">Never updated</Text>
            </Group>
          );
        }
        if (updatedAt) {
          const days = Math.floor(
            (Date.now() - new Date(updatedAt).getTime()) /
              (1000 * 60 * 60 * 24),
          );

          const color = days > 7 ? "red" : days > 3 ? "yellow" : "green";
          return (
            <Badge
              component="a"
              href={url}
              target="_blank"
              size="md"
              color={color}
              variant="light"
              td="underline"
              styles={{
                label: {
                  textTransform: "none",
                },
              }}
            >
              {updatedAt ? (
                <DateView timestampMs={new Date(updatedAt).getTime()} />
              ) : (
                "Not Updated"
              )}
            </Badge>
          );
        }
        return (
          <Group gap={4}>
            <IconSpy size={14} />
            <Text size="sm">Not Updated</Text>
          </Group>
        );
      },
    }),

    col.accessor("updatedAt", {
      header: "Updated",
      cell: (info) => (
        <Text
          size="xs"
          c="dimmed"
          style={{
            whiteSpace: "nowrap",
            width: 70,
          }}
        >
          {formatDate(info.getValue())}
        </Text>
      ),
    }),

    col.accessor("leave", {
      header: "Leave",
      enableSorting: false,

      cell: (info) => {
        const leave = info.getValue();

        if (!leave) {
          return (
            <Group gap="xs">
              <Text size="sm" c="dimmed" fs="italic">
                —
              </Text>

              <Tooltip label="View Leave History">
                <ActionIcon
                  variant="subtle"
                  size="sm"
                  onClick={() =>
                    setSelectedEmployee({
                      id: info.row.original.id,
                      name: info.row.original.name,
                    })
                  }
                >
                  <IconHistory size={15} />
                </ActionIcon>
              </Tooltip>
            </Group>
          );
        }

        const meta = LEAVE_META[leave.leaveType];

        return (
          <Group gap="xs">
            <Tooltip
              multiline
              withArrow
              label={
                <>
                  <Text size="sm">
                    {formatDate(leave.fromDate)} - {formatDate(leave.toDate)}
                  </Text>

                  {leave.reason && (
                    <Text size="xs">Reason: {leave.reason}</Text>
                  )}
                </>
              }
            >
              <Badge
                color={meta.color}
                variant="light"
                styles={{
                  label: {
                    textTransform: "none",
                  },
                }}
              >
                {meta.label}
              </Badge>
            </Tooltip>

            <Tooltip label="View Leave History">
              <ActionIcon
                variant="subtle"
                onClick={() =>
                  setSelectedEmployee({
                    id: info.row.original.id,
                    name: info.row.original.name,
                  })
                }
              >
                <IconHistory size={15} />
              </ActionIcon>
            </Tooltip>
          </Group>
        );
      },
    }),
  ];

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
              <LoadingRows cols={7} rows={5} />
            ) : visibleRows.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={7}>
                  <EmptyState
                    icon={IconSearch}
                    title="No employees found"
                    description="Try a different search term."
                  />
                </Table.Td>
              </Table.Tr>
            ) : (
              visibleRows.map((row) => (
                <Table.Tr
                  key={row.id}
                  style={{
                    backgroundColor: row.original.leave
                      ? "var(--mantine-color-red-0)"
                      : undefined,
                  }}
                >
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

      <LeaveHistoryModal
        opened={selectedEmployee !== null}
        onClose={() => setSelectedEmployee(null)}
        userId={selectedEmployee?.id ?? ""}
        userName={selectedEmployee?.name ?? ""}
      />
    </Stack>
  );
}
