import { useState } from "react";
import {
  Card,
  Stack,
  Text,
  Select,
  Textarea,
  Button,
  Alert,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconAlertCircle } from "@tabler/icons-react";

import { auth } from "@/firebase/config";

const LEAVE_TYPES = [
  { value: "SICK", label: "Sick Leave" },
  { value: "CASUAL", label: "Casual Leave" },
  { value: "VACATION", label: "Vacation" },
  { value: "OPTIONAL", label: "Optional Leave" },
];

export function LeaveManagementCard() {
  const [leaveType, setLeaveType] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleApplyLeave = async () => {
    setError("");

    if (!leaveType || !fromDate || !toDate) {
      setError("Please fill all required fields.");

      return;
    }

    try {
      setLoading(true);

      const token = await auth.currentUser?.getIdToken();

      if (!token) {
        throw new Error("User is not authenticated");
      }

      const response = await fetch("/api/leaves", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          leaveType,
          fromDate,
          toDate,
          reason,
        }),
      });

      if (!response.ok) {
        const data = await response.json();

        throw new Error(data.error ?? "Failed to apply leave.");
      }

      setLeaveType(null);
      setFromDate(null);
      setToDate(null);
      setReason("");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card withBorder p="md" radius="sm">
      <Stack gap="md">
        <Text fw={500}>Leave Application</Text>

        {error && (
          <Alert color="red" icon={<IconAlertCircle size={16} />} title="Error">
            {error}
          </Alert>
        )}

        <Select
          label="Leave Type"
          placeholder="Select leave type"
          data={LEAVE_TYPES}
          value={leaveType}
          onChange={setLeaveType}
        />

        <DatePickerInput
          type="default"
          label="From Date"
          placeholder="Select start date"
          value={fromDate}
          onChange={(value) => setFromDate(value)}
        />

        <DatePickerInput
          type="default"
          label="To Date"
          placeholder="Select end date"
          value={toDate}
          onChange={(value) => setToDate(value)}
        />

        <Textarea
          label="Reason"
          placeholder="Reason (optional)"
          value={reason}
          onChange={(event) => setReason(event.currentTarget.value)}
          minRows={3}
        />

        <Button onClick={handleApplyLeave} loading={loading}>
          Apply Leave
        </Button>
      </Stack>
    </Card>
  );
}
