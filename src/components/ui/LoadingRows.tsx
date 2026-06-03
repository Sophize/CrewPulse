import { Table, Skeleton } from "@mantine/core";

interface LoadingRowsProps {
  cols: number;
  rows?: number;
}

export function LoadingRows({ cols, rows = 5 }: LoadingRowsProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <Table.Tr key={rowIdx}>
          {Array.from({ length: cols }).map((_, colIdx) => (
            <Table.Td key={colIdx}>
              <Skeleton
                height={14}
                width={`${65 + ((rowIdx * cols + colIdx) % 4) * 8}%`}
                radius="sm"
              />
            </Table.Td>
          ))}
        </Table.Tr>
      ))}
    </>
  );
}
