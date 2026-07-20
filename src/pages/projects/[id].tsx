import { useState } from "react";
import { useRouter } from "next/router";
import {
  Card,
  Stack,
  Group,
  Text,
  SegmentedControl,
  TextInput,
  Textarea,
  Button,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout";
import { PageHeader } from "@/components/ui";
import { IconCalendar } from "@tabler/icons-react";

const TASK_STATUS_OPTIONS = [
  { label: "Blocked", value: "BLOCKED" },
  { label: "Tasks In Progress", value: "IN_PROGRESS" },
  { label: "All Tasks Completed", value: "COMPLETED" },
];

export default function ProjectStatusPage() {
  const router = useRouter();
  const { id } = router.query;

  const projectName = typeof id === "string" 
    ? (id === "fau" ? "FAU" : id.charAt(0).toUpperCase() + id.slice(1)) 
    : "";

  const [taskStatus, setTaskStatus] = useState("BLOCKED");
  const [assignTask, setAssignTask] = useState("");
  const [meetingTime, setMeetingTime] = useState<Date | null>(null);
  const [meetingPurpose, setMeetingPurpose] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  function getStatusColor(status: string) {
    switch (status) {
      case "BLOCKED":
        return "#dc2626"; // red
      case "IN_PROGRESS":
        return "blue";
      case "COMPLETED":
        return "green";
      default:
        return "gray";
    }
  }

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      if (taskStatus === "COMPLETED") {
        setAssignTask("");
      }
    }, 500);
  };

  return (
    <AuthGuard>
      <DashboardLayout
        title={`Project Status - ${projectName}`}
        breadcrumbs={[
          { label: "Project Status" },
          { label: projectName },
        ]}
      >
        <PageHeader
          title={`Project Status - ${projectName}`}
          subtitle={`Manage tasks and meetings for ${projectName}`}
        />

        <Stack gap="lg">
          <Card withBorder p="md" radius="sm">
            <Stack gap="md">
              <Text fw={500}>Task Status</Text>

              <div>
                <SegmentedControl
                  fullWidth
                  value={taskStatus}
                  onChange={setTaskStatus}
                  data={TASK_STATUS_OPTIONS}
                  color={getStatusColor(taskStatus)}
                />
              </div>

              <Group align="flex-end" wrap="nowrap">
                <TextInput
                  label="Assign Task"
                  placeholder="Enter task to assign"
                  value={assignTask}
                  onChange={(e) => setAssignTask(e.currentTarget.value)}
                  style={{ flex: 1 }}
                />
                <Button onClick={handleSave} loading={isSaving}>
                  Save
                </Button>
              </Group>

              <DateTimePicker
                label="Meeting Time"
                placeholder=""
                leftSection={<IconCalendar size={18} stroke={1.5} />}
                leftSectionPointerEvents="none"
                value={meetingTime}
                onChange={(val) => setMeetingTime(val ? new Date(val) : null)}
                clearable
              />

              <Textarea
                label="Meeting Purpose"
                placeholder="e.g. Weekly Sync"
                value={meetingPurpose}
                onChange={(e) => setMeetingPurpose(e.currentTarget.value)}
                minRows={4}
                autosize
              />
            </Stack>
          </Card>
        </Stack>
      </DashboardLayout>
    </AuthGuard>
  );
}
