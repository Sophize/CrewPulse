import type { NextApiResponse } from 'next';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export function sendSuccess<T>(
  res: NextApiResponse<ApiResponse<T>>,
  data: T,
  statusCode = 200
) {
  return res.status(statusCode).json({
    success: true,
    data,
  });
}

export function sendError(
  res: NextApiResponse<any>,
  error: string,
  statusCode = 500
) {
  return res.status(statusCode).json({
    success: false,
    error,
  });
}