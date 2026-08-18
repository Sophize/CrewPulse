import { useState } from "react";
import {
  Box,
  Text,
  Table,
  Select,
  MultiSelect,
  Group,
  ActionIcon,
  Paper,
  Loader,
  Badge,
  TextInput,
  Stack,
  Button,
} from "@mantine/core";
import {
  IconTrash,
  IconPencil,
  IconDeviceFloppy,
  IconCalendarPlus,
  IconCalendarEvent,
} from "@tabler/icons-react";
import {
  useMeetings,
  useCreateMeeting,
  useUpdateMeeting,
  useDeleteMeeting,
} from "@/hooks/useMeetings";
import {
  MeetingFrequency,
  convertClientTimeToIST,
  getNextOccurrence,
  frequencyLabel,
} from "@/utils/meetingUtils";

const TIMEZONE_OPTIONS = [
  { value: "Europe/Berlin", label: "Europe/Berlin (CET)" },
  { value: "Europe/London", label: "Europe/London (GMT)" },
  { value: "UTC", label: "UTC" },
  { value: "Asia/Kolkata", label: "Asia/Kolkata (IST)" },
];

const MONTH_DATES = Array.from({ length: 31 }, (_, index) => index + 1);

export function MeetingSchedulesSection({
  projectId,
  projectName,
}: {
  projectId: string;
  projectName?: string;
}) {
  const { data: meetings = [], isLoading } = useMeetings(projectId);

  const createMutation = useCreateMeeting(projectId);
  const updateMutation = useUpdateMeeting(projectId);
  const deleteMutation = useDeleteMeeting(projectId);

  const [newTZ, setNewTZ] = useState("Europe/Berlin");
  const [newFrequency, setNewFrequency] = useState<MeetingFrequency>("WEEKLY");
  const [newMeetingTime, setNewMeetingTime] = useState("");
  const [newDaysOfWeek, setNewDaysOfWeek] = useState<number[]>([1]);
  const [newDatesOfMonth, setNewDatesOfMonth] = useState<number[]>([]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTZ, setEditTZ] = useState("Europe/Berlin");
  const [editFrequency, setEditFrequency] =
    useState<MeetingFrequency>("WEEKLY");
  const [editMeetingTime, setEditMeetingTime] = useState("");
  const [editDaysOfWeek, setEditDaysOfWeek] = useState<number[]>([]);
  const [editDatesOfMonth, setEditDatesOfMonth] = useState<number[]>([]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeetingTime) return;
    if (newFrequency === "WEEKLY" && newDaysOfWeek.length === 0) return;
    if (newFrequency === "MONTHLY" && newDatesOfMonth.length === 0) return;

    const istMeetingTime = convertClientTimeToIST(newMeetingTime, newTZ);
    await createMutation.mutateAsync({
      frequency: newFrequency,
      meetingTime: istMeetingTime,
      clientTimeZone: newTZ,
      daysOfWeek: newFrequency === "WEEKLY" ? newDaysOfWeek : [],
      datesOfMonth: newFrequency === "MONTHLY" ? newDatesOfMonth : [],
    });

    setNewFrequency("WEEKLY");
    setNewMeetingTime("");
    setNewDaysOfWeek([1]);
    setNewDatesOfMonth([]);
    setNewTZ("Europe/Berlin");
  };

  const handleStartEdit = (meeting: {
    id: string;
    frequency: MeetingFrequency;
    meetingTime: string;
    clientTimeZone: string;
    daysOfWeek: number[];
    datesOfMonth: number[];
  }) => {
    setEditingId(meeting.id);
    setEditTZ(meeting.clientTimeZone);
    setEditFrequency(meeting.frequency);
    setEditMeetingTime(meeting.meetingTime);
    setEditDaysOfWeek(meeting.daysOfWeek);
    setEditDatesOfMonth(meeting.datesOfMonth);
  };

  const handleSaveEdit = async (meetingId: string) => {
    if (!editMeetingTime) return;
    if (editFrequency === "WEEKLY" && editDaysOfWeek.length === 0) return;
    if (editFrequency === "MONTHLY" && editDatesOfMonth.length === 0) return;

    const istMeetingTime = convertClientTimeToIST(editMeetingTime, editTZ);
    await updateMutation.mutateAsync({
      meetingId,
      frequency: editFrequency,
      meetingTime: istMeetingTime,
      clientTimeZone: editTZ,
      daysOfWeek: editFrequency === "WEEKLY" ? editDaysOfWeek : [],
      datesOfMonth: editFrequency === "MONTHLY" ? editDatesOfMonth : [],
    });

    setEditingId(null);
  };

  return (
    <Box mt="xl">
      <Paper p="lg" mb="lg" withBorder radius="md">
        <Group mb="md">
          <IconCalendarPlus size={18} />
          <Text fw={600} size="sm">
            Schedule a Meeting {projectName ? `for ${projectName}` : ""}
          </Text>
        </Group>

        <form onSubmit={handleCreate}>
          <Stack gap="sm">
            <Group align="flex-end" wrap="nowrap" style={{ width: "100%" }}>
              <Select
                label="Frequency"
                value={newFrequency}
                onChange={(value) => {
                  if (
                    value === "DAILY" ||
                    value === "WEEKLY" ||
                    value === "MONTHLY"
                  ) {
                    setNewFrequency(value);
                  }
                }}
                data={[
                  { value: "DAILY", label: "Daily" },
                  { value: "WEEKLY", label: "Weekly" },
                  { value: "MONTHLY", label: "Monthly" },
                ]}
                style={{ flex: 1 }}
              />

              {newFrequency === "WEEKLY" && (
                <MultiSelect
                  label="Meeting Days"
                  placeholder="Select days"
                  data={[
                    { value: "0", label: "Sunday" },
                    { value: "1", label: "Monday" },
                    { value: "2", label: "Tuesday" },
                    { value: "3", label: "Wednesday" },
                    { value: "4", label: "Thursday" },
                    { value: "5", label: "Friday" },
                    { value: "6", label: "Saturday" },
                  ]}
                  value={newDaysOfWeek.map(String)}
                  onChange={(values) => setNewDaysOfWeek(values.map(Number))}
                  style={{ flex: 1 }}
                />
              )}

              {newFrequency === "MONTHLY" && (
                <MultiSelect
                  label="Meeting Dates"
                  placeholder="Select dates"
                  data={MONTH_DATES.map((date) => ({
                    value: String(date),
                    label: String(date),
                  }))}
                  value={newDatesOfMonth.map(String)}
                  onChange={(values) => setNewDatesOfMonth(values.map(Number))}
                  style={{ flex: 1 }}
                />
              )}

              <TextInput
                label="Meeting Time"
                type="time"
                value={newMeetingTime}
                onChange={(e) => setNewMeetingTime(e.currentTarget.value)}
                required
                style={{ flex: 1 }}
              />

              <Select
                label="Client Timezone"
                data={TIMEZONE_OPTIONS}
                value={newTZ}
                onChange={(value) => {
                  if (value) {
                    setNewTZ(value);
                  }
                }}
                style={{ flex: 1 }}
              />

              <Button
                type="submit"
                leftSection={<IconDeviceFloppy size={14} />}
                loading={createMutation.isPending}
                size="sm"
                style={{ flex: "0 0 auto", height: 36 }}
              >
                Save
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>

      <Paper withBorder radius="md" style={{ overflow: "hidden" }}>
        <Box
          px="md"
          py="sm"
          style={{
            borderBottom: "1px solid var(--mantine-color-default-border)",
          }}
        >
          <Group gap="xs">
            <IconCalendarEvent size={16} />
            <Text fw={600} size="sm">
              Meeting Schedule
            </Text>
          </Group>
        </Box>

        {isLoading ? (
          <Box style={{ textAlign: "center" }} py="xl">
            <Loader size="sm" />
          </Box>
        ) : (
          <Table highlightOnHover verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>FREQUENCY</Table.Th>
                <Table.Th>MEETING-TIME</Table.Th>
                <Table.Th>CLIENT TIMEZONE</Table.Th>
                <Table.Th style={{ width: 100, textAlign: "right" }}>
                  ACTIONS
                </Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {meetings.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={4}>
                    <Text c="dimmed" ta="center" py="md">
                      No meeting schedules yet.
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                meetings.map((meeting) => (
                  <Table.Tr key={meeting.id}>
                    <Table.Td>
                      {editingId === meeting.id ? (
                        <Stack gap={4}>
                          <Select
                            size="xs"
                            value={editFrequency}
                            onChange={(value) => {
                              if (
                                value === "DAILY" ||
                                value === "WEEKLY" ||
                                value === "MONTHLY"
                              ) {
                                setEditFrequency(value);
                              }
                            }}
                            data={[
                              { value: "DAILY", label: "Daily" },
                              { value: "WEEKLY", label: "Weekly" },
                              { value: "MONTHLY", label: "Monthly" },
                            ]}
                          />
                          {editFrequency === "WEEKLY" && (
                            <MultiSelect
                              size="xs"
                              placeholder="Select days"
                              data={[
                                { value: "0", label: "Sun" },
                                { value: "1", label: "Mon" },
                                { value: "2", label: "Tue" },
                                { value: "3", label: "Wed" },
                                { value: "4", label: "Thu" },
                                { value: "5", label: "Fri" },
                                { value: "6", label: "Sat" },
                              ]}
                              value={editDaysOfWeek.map(String)}
                              onChange={(values) =>
                                setEditDaysOfWeek(values.map(Number))
                              }
                              style={{ minWidth: 200 }}
                            />
                          )}
                          {editFrequency === "MONTHLY" && (
                            <MultiSelect
                              size="xs"
                              placeholder="Select dates"
                              data={MONTH_DATES.map((date) => ({
                                value: String(date),
                                label: String(date),
                              }))}
                              value={editDatesOfMonth.map(String)}
                              onChange={(values) =>
                                setEditDatesOfMonth(values.map(Number))
                              }
                              style={{ minWidth: 200 }}
                            />
                          )}
                        </Stack>
                      ) : (
                        <Badge variant="light">
                          {frequencyLabel(meeting.frequency)}
                        </Badge>
                      )}
                    </Table.Td>
                    <Table.Td>
                      {editingId === meeting.id ? (
                        <TextInput
                          size="xs"
                          type="time"
                          value={editMeetingTime}
                          onChange={(e) =>
                            setEditMeetingTime(e.currentTarget.value)
                          }
                        />
                      ) : (
                        <Badge variant="dot" color="green" size="sm">
                          {getNextOccurrence(
                            meeting.frequency,
                            meeting.daysOfWeek,
                            meeting.datesOfMonth,
                            meeting.meetingTime,
                          )}
                        </Badge>
                      )}
                    </Table.Td>
                    <Table.Td>
                      {editingId === meeting.id ? (
                        <Select
                          size="xs"
                          data={TIMEZONE_OPTIONS}
                          value={editTZ}
                          onChange={(value) => {
                            if (value) {
                              setEditTZ(value);
                            }
                          }}
                        />
                      ) : (
                        <Badge variant="light" color="grape" size="sm">
                          {meeting.clientTimeZone}
                        </Badge>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Group gap={4} justify="flex-end">
                        {editingId === meeting.id ? (
                          <ActionIcon
                            color="blue"
                            variant="subtle"
                            onClick={() => handleSaveEdit(meeting.id)}
                            loading={updateMutation.isPending}
                          >
                            <IconDeviceFloppy size={16} />
                          </ActionIcon>
                        ) : (
                          <ActionIcon
                            color="gray"
                            variant="subtle"
                            onClick={() => handleStartEdit(meeting)}
                          >
                            <IconPencil size={16} />
                          </ActionIcon>
                        )}

                        <ActionIcon
                          color="red"
                          variant="subtle"
                          onClick={() => deleteMutation.mutate(meeting.id)}
                          loading={deleteMutation.isPending}
                          disabled={editingId === meeting.id}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        )}
      </Paper>
    </Box>
  );
}
