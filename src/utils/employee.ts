const VALID_TASK_STATUSES = ["NO_TASKS", "IN_PROGRESS", "COMPLETED"] as const;

interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateTaskStatus(value: unknown): ValidationResult {
  if (!value) {
    return {
      valid: false,
      error: "taskStatus is required",
    };
  }

  if (
    typeof value !== "string" ||
    !VALID_TASK_STATUSES.includes(value as (typeof VALID_TASK_STATUSES)[number])
  ) {
    return {
      valid: false,
      error: `Invalid taskStatus. Must be one of: ${VALID_TASK_STATUSES.join(", ")}`,
    };
  }

  return { valid: true };
}

export function sanitizeLearningString(value: unknown): string | null {
  if (value == null) {
    return null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}
