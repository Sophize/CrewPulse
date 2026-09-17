import { Card, Collapse, Table, Text, Title } from "@mantine/core";
import { useState } from "react";
import { useUpcomingLeaves } from "@/hooks/useUpcomingLeaves";

export function EmployeeLeavesTable() {
  const leavesQuery = useUpcomingLeaves();
  const leaves = leavesQuery.data ?? [];
  const [opened, setOpened] = useState(false);
  if (!leavesQuery.isLoading && leaves.length === 0) {
    return null;
  }

  const leaveRows = leaves.map((leave) => (
    <Table.Tr key={leave.id}>
      <Table.Td>{leave.user.name}</Table.Td>
      <Table.Td>{leave.leaveType}</Table.Td>
      <Table.Td>{new Date(leave.fromDate).toLocaleDateString()}</Table.Td>
      <Table.Td>{new Date(leave.toDate).toLocaleDateString()}</Table.Td>
      <Table.Td>{leave.isHalfDay ? "Yes" : "No"}</Table.Td>
      <Table.Td>{leave.reason || "-"}</Table.Td>
      <Table.Td>
        {leave.createdAt ? new Date(leave.createdAt).toLocaleDateString() : "-"}
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Card
      withBorder
      radius="md"
      padding={0}
      mb="lg"
      bg="var(--mantine-color-body)"
    >
      <div
        onClick={() => setOpened((prev) => !prev)}
        style={{
          padding: "14px 16px",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title order={3} size="h4">
          Leave Requests
        </Title>

        <Text size="sm">{opened ? "▲" : "▼"}</Text>
      </div>
      <Collapse expanded={opened}>
        {" "}
        <Table.ScrollContainer minWidth={700}>
          <Table verticalSpacing="sm" striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Employee</Table.Th>
                <Table.Th>Leave Type</Table.Th>
                <Table.Th>From Date</Table.Th>
                <Table.Th>To Date</Table.Th>
                <Table.Th>Half Day</Table.Th>
                <Table.Th>Reason</Table.Th>
                <Table.Th>Applied On</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {leavesQuery.isLoading ? (
                <Table.Tr>
                  <Table.Td colSpan={7}>
                    <Text c="dimmed" ta="center">
                      Loading leaves...
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                leaveRows
              )}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Collapse>
    </Card>
  );
}
