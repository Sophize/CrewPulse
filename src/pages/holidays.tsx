import {
  Stack,
  Table,
  Text,
  Title,
  Badge,
  Group,
  Card,
  SimpleGrid,
} from "@mantine/core";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout";
import { PageHeader } from "@/components/ui";
import { MANDATORY_HOLIDAYS, OPTIONAL_HOLIDAYS } from "@/constants/holidays";

export default function LeavesPage() {
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

  return (
    <AuthGuard>
      <DashboardLayout title="Holidays" breadcrumbs={[{ label: "Holidays" }]}>
        <PageHeader title="Holidays" subtitle="2026 holiday calendar " />

        <Stack gap="xl">
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
