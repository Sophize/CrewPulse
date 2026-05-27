

import { useState, useCallback } from "react";
import {
  Paper,
  Text,
  Group,
  Stack,
  ThemeIcon,
  Button,
  Progress,
  Badge,
  Box,
  Alert,
  Center,
  RingProgress,
  rem,
} from "@mantine/core";
import {
  IconCloudUpload,
  IconFile,
  IconAlertCircle,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { formatFileSize } from "@/lib/formatters";

const ACCEPTED_TYPES = {
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
  "application/vnd.ms-excel":                                         ".xls",
  "text/csv":                                                         ".csv",
};

const ACCEPTED_EXTENSIONS = [".xlsx", ".csv"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

type UploadState = "idle" | "validating" | "uploading" | "success" | "error";

interface UploadFile {
  file: File;
  name: string;
  size: number;
}

interface UploadError {
  code: "invalid_type" | "invalid_size" | "upload_failed";
  message: string;
}

export interface UploadDropzoneProps {
  onUpload?: (file: File, metadata: { name: string; size: number }) => void;
  disabled?: boolean;
}

export function UploadDropzone({ onUpload, disabled = false }: UploadDropzoneProps) {
  const [state, setState] = useState<UploadState>("idle");
  const [selected, setSelected] = useState<UploadFile | null>(null);
  const [error, setError] = useState<UploadError | null>(null);
  const [progress, setProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);

  const validateFile = useCallback((file: File): UploadError | null => {
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf("."));

    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      return {
        code: "invalid_type",
        message: `File type not supported. Accepted: ${ACCEPTED_EXTENSIONS.join(", ")}`,
      };
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        code: "invalid_size",
        message: `File size exceeds 10 MB limit. Your file: ${formatFileSize(file.size)}`,
      };
    }

    return null;
  }, []);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      const validationError = validateFile(file);

      if (validationError) {
        setError(validationError);
        setState("error");
        return;
      }

      setSelected({
        file,
        name: file.name,
        size: file.size,
      });

      setState("validating");
      setProgress(0);

      setTimeout(() => {
        setState("uploading");
        setProgress(30);
      }, 600);

      setTimeout(() => {
        setProgress(65);
      }, 1200);

      setTimeout(() => {
        setProgress(100);
        setState("success");

        onUpload?.(file, {
          name: file.name,
          size: file.size,
        });

        setTimeout(() => {
          setState("idle");
          setSelected(null);
          setProgress(0);
        }, 2000);
      }, 2000);
    },
    [validateFile, onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      if (disabled || state !== "idle") return;

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFile(files[0]!);
      }
    },
    [handleFile, disabled, state]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.currentTarget.files;
      if (files && files.length > 0) {
        handleFile(files[0]!);
      }
    },
    [handleFile]
  );

  const handleReset = useCallback(() => {
    setState("idle");
    setSelected(null);
    setError(null);
    setProgress(0);
  }, []);

  if (state === "idle") {
    return (
      <Paper
        withBorder
        radius="sm"
        p={0}
        style={{
          cursor: disabled ? "not-allowed" : "pointer",
          borderStyle: "dashed",
          borderColor: isDragOver && !disabled
            ? "var(--mantine-color-blue-5)"
            : "var(--mantine-color-default-border)",
          backgroundColor: isDragOver && !disabled
            ? "var(--mantine-color-blue-0)"
            : undefined,
          transition: "all 150ms ease",
          opacity: disabled ? 0.6 : 1,
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Stack
          align="center"
          justify="center"
          gap="md"
          py={48}
          px={24}
          style={{ pointerEvents: disabled ? "none" : "auto" }}
        >
          <ThemeIcon
            size={56}
            radius="xl"
            color="blue"
            variant="light"
          >
            <IconCloudUpload size={28} stroke={1.5} />
          </ThemeIcon>

          <Stack gap={4} align="center">
            <Text fw={600} size="md" ta="center">
              Drop your timesheet here
            </Text>
            <Text size="sm" c="dimmed" ta="center">
              or click to browse files
            </Text>
          </Stack>

          <Group gap={6}>
            <Badge size="lg" variant="light" color="gray" radius="sm">
              .xlsx
            </Badge>
            <Badge size="lg" variant="light" color="gray" radius="sm">
              .csv
            </Badge>
          </Group>

          <Text size="xs" c="dimmed" ta="center">
            Max file size: 10 MB
          </Text>

          <input
            type="file"
            id="file-input"
            style={{ display: "none" }}
            onChange={handleInputChange}
            accept={Object.values(ACCEPTED_TYPES).join(",")}
            disabled={disabled}
          />

          <Button
            size="md"
            color="blue"
            onClick={() => document.getElementById("file-input")?.click()}
            disabled={disabled}
          >
            Browse file
          </Button>
        </Stack>
      </Paper>
    );
  }

  if (state === "validating" || state === "uploading") {
    return (
      <Paper withBorder radius="sm" p="lg">
        <Stack align="center" gap="md">
          <Group gap="sm">
            <ThemeIcon size={40} radius="xl" color="blue" variant="light">
              <IconFile size={20} stroke={1.5} />
            </ThemeIcon>
            <Box>
              <Text fw={500} size="sm" truncate maw={300}>
                {selected?.name}
              </Text>
              <Text size="xs" c="dimmed">
                {formatFileSize(selected?.size)}
              </Text>
            </Box>
          </Group>

          <Stack gap={8} w="100%">
            <Group justify="space-between">
              <Text size="xs" c="dimmed" tt="uppercase" fw={500}>
                {state === "validating" ? "Validating…" : "Uploading…"}
              </Text>
              <Text size="xs" fw={600}>
                {progress}%
              </Text>
            </Group>
            <Progress value={progress} radius="sm" size="md" />
          </Stack>

          <Text size="xs" c="dimmed">
            {state === "validating"
              ? "Checking file format and integrity…"
              : "Uploading to server…"}
          </Text>
        </Stack>
      </Paper>
    );
  }

  if (state === "success") {
    return (
      <Paper withBorder radius="sm" p="lg" style={{ background: "var(--mantine-color-green-0)" }}>
        <Stack align="center" gap="md">
          <Center>
            <RingProgress
              sections={[{ value: 100, color: "green" }]}
              size={80}
              thickness={6}
              label={
                <Center>
                  <ThemeIcon color="green" variant="filled" size={40} radius="xl">
                    <IconCheck size={20} stroke={2} />
                  </ThemeIcon>
                </Center>
              }
            />
          </Center>

          <Stack gap={4} align="center">
            <Text fw={600} size="md" c="green">
              Upload successful
            </Text>
            <Text size="sm" c="dimmed">
              {selected?.name} has been processed
            </Text>
          </Stack>

          <Text size="xs" c="dimmed" ta="center">
            Your timesheet is now available in the uploads history.
            The page will refresh automatically.
          </Text>
        </Stack>
      </Paper>
    );
  }

  if (state === "error") {
    return (
      <Alert
        icon={<IconAlertCircle size={16} stroke={1.5} />}
        color="red"
        title="Upload failed"
        style={{ borderRadius: "var(--mantine-radius-sm)" }}
      >
        <Stack gap="xs">
          <Text size="sm">
            {error?.message}
          </Text>

          {selected && (
            <Text size="xs" c="dimmed">
              File: {selected.name} ({formatFileSize(selected.size)})
            </Text>
          )}

          <Group gap="xs" mt="sm">
            <Button
              size="xs"
              color="red"
              variant="light"
              onClick={handleReset}
              leftSection={<IconX size={12} stroke={1.5} />}
            >
              Try again
            </Button>
            <Button
              size="xs"
              variant="subtle"
              color="gray"
              onClick={handleReset}
            >
              Clear
            </Button>
          </Group>
        </Stack>
      </Alert>
    );
  }

  return null;
}