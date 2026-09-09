import {
  Stack,
  Table,
  Text,
  Title,
  Badge,
  Group,
  Card,
  SimpleGrid,
  Button,
  Alert,
} from "@mantine/core";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout";
import { PageHeader } from "@/components/ui";
import { MANDATORY_HOLIDAYS, OPTIONAL_HOLIDAYS } from "@/constants/holidays";
import { useUpcomingLeaves } from "@/hooks/useUpcomingLeaves";
import { getErrorMessage } from "@/api/errors";

export default function LeavesPage() {
  const leavesQuery = useUpcomingLeaves();
  const leaves = leavesQuery.data ?? [];
  const mandatoryRows = MANDATORY_HOLIDAYS.map((element, index) => (
    <Table.Tr key={index}>
      <Table.Td>{element.date}</Table.Td>
      <Table.Td>{element.day}</Table.Td>
      <Table.Td>
        <Group gap="xs">
          {element.holiday}
          {element.note && (
            <Badge size="xs" color="gray" variant="light">
              {element.note}
            </Badge>
          )}
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  const optionalRows = OPTIONAL_HOLIDAYS.map((element, index) => (
    <Table.Tr key={index}>
      <Table.Td>{element.date}</Table.Td>
      <Table.Td>{element.day}</Table.Td>
      <Table.Td>{element.holiday}</Table.Td>
    </Table.Tr>
  ));

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
    <AuthGuard>
      <DashboardLayout title="Leaves" breadcrumbs={[{ label: "Leaves" }]}>
        <PageHeader
          title="Leaves"
          // subtitle="2026 holiday calendar "
          action={
            <Button
              component="a"
              href="https://drive.google.com/drive/folders/1xpo3PbdGrjJ-njUKp8dqEOL-xPymVLjq"
              target="_blank"
              rel="noopener noreferrer"
              variant="light"
            >
              View Holiday Doc
            </Button>
          }
        />

        <Stack gap="xl">
          {leavesQuery.isError && (
            <Alert color="red" title="Unable to load leaves">
              {getErrorMessage(leavesQuery.error)}
            </Alert>
          )}
          <Card
            withBorder
            radius="md"
            padding="xl"
            bg="var(--mantine-color-body)"
          >
            <Title order={3} size="h4" mb="md">
              Employee Leaves
            </Title>

            <Text c="dimmed" size="sm" mb="lg">
              Current and upcoming employee leaves.
            </Text>

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
                      <Table.Td colSpan={6}>
                        <Text c="dimmed" ta="center">
                          Loading leaves...
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  ) : leaves.length === 0 ? (
                    <Table.Tr>
                      <Table.Td colSpan={6}>
                        <Text c="dimmed" ta="center">
                          No current or upcoming leaves.
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  ) : (
                    leaveRows
                  )}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </Card>
          <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="xl">
            <Card
              withBorder
              radius="md"
              padding="xl"
              bg="var(--mantine-color-body)"
            >
              <Title order={3} size="h4" mb="md">
                Mandatory Holidays
              </Title>
              <Text c="dimmed" size="sm" mb="lg">
                These holidays are fixed and apply to all employees.
              </Text>

              <Table.ScrollContainer minWidth={400}>
                <Table verticalSpacing="sm" striped>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Date</Table.Th>
                      <Table.Th>Day</Table.Th>
                      <Table.Th>Holiday</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>{mandatoryRows}</Table.Tbody>
                </Table>
              </Table.ScrollContainer>
            </Card>

            <Card
              withBorder
              radius="md"
              padding="xl"
              bg="var(--mantine-color-body)"
            >
              <Group justify="space-between" align="flex-start" mb="md">
                <div>
                  <Title order={3} size="h4">
                    Optional Holidays
                  </Title>
                  <Text c="dimmed" size="sm" mt={4}>
                    Pick any 4 based on personal preference.
                  </Text>
                </div>
              </Group>

              <Table.ScrollContainer minWidth={400}>
                <Table verticalSpacing="sm" striped>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Date</Table.Th>
                      <Table.Th>Day</Table.Th>
                      <Table.Th>Holiday</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>{optionalRows}</Table.Tbody>
                </Table>
              </Table.ScrollContainer>
            </Card>
          </SimpleGrid>
        </Stack>
      </DashboardLayout>
    </AuthGuard>
  );
}
