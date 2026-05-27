// components/ui/LoadingRows.tsx
//
// Renders N skeleton rows inside a Mantine Table body.
// Drop this in place of the real <tbody> rows while data loads.
//
// Usage inside a table:
//   <Table>
//     <Table.Thead>...</Table.Thead>
//     <Table.Tbody>
//       {isLoading
//         ? <LoadingRows cols={5} rows={5} />
//         : realRows
//       }
//     </Table.Tbody>
//   </Table>

import { Table, Skeleton } from "@mantine/core";

interface LoadingRowsProps {
  /** Number of columns — determines how many Skeleton cells per row */
  cols: number;
  /** Number of skeleton rows to render. Default: 5 */
  rows?: number;
}

export function LoadingRows({ cols, rows = 5 }: LoadingRowsProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <Table.Tr key={rowIdx}>
          {Array.from({ length: cols }).map((_, colIdx) => (
            <Table.Td key={colIdx}>
              {/* Vary skeleton widths so it looks more natural */}
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
