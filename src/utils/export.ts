import ExcelJS from "exceljs";

/** Map 1 cột trong sheet Excel từ dữ liệu bảng đang hiển thị (phương án A — xuất trang hiện tại). */
export type ExportColumn<T> = {
  /** Tên cột hiển thị (tiếng Việt, khớp header bảng). */
  header: string;
  /** Value của cell — trả string/number; null/undefined/"-" → ô trống. */
  accessor: (row: T) => string | number | null | undefined;
};

/** Tên file tải về: `ton-kho_2026-09-21.xlsx` hoặc `..._trang-2.xlsx` khi có phân trang. */
export function excelFileName(prefix: string, page?: number): string {
  const date = new Date().toISOString().slice(0, 10);
  const pagePart = page !== undefined && page > 0 ? `_trang-${page}` : "";
  return `${prefix}_${date}${pagePart}.xlsx`;
}

// Màu style sheet: header navy + chữ trắng, viền xám nhạt, zebra cực nhạt.
const HEADER_BG = "334155";
const HEADER_FG = "FFFFFF";
const BORDER = "D1D5DB";
const ZEBRA = "F8FAFC";

/** Viền thin 4 cạnh màu xám nhạt. */
function allBorders(): Partial<ExcelJS.Borders> {
  const border: ExcelJS.Border = {
    style: "thin",
    color: { argb: `FF${BORDER}` },
  };
  return { top: border, left: border, bottom: border, right: border };
}

/** Tải Blob xuống trình duyệt (client-only). */
function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Xuất mảng dữ liệu hiện tại ra file .xlsx có style (exceljs):
 * header tô màu + đậm chữ trắng + đóng băng dòng 1, kẻ viền, zebra,
 * số canh phải. Số xuất dạng number để Excel tính được; null/"-" → ô trống.
 */
export async function exportRowsToXlsx<T>({
  fileName,
  sheetName = "Sheet1",
  columns,
  rows,
}: {
  fileName: string;
  sheetName?: string;
  columns: ExportColumn<T>[];
  rows: T[];
}) {
  if (typeof document === "undefined") return;

  const headers = columns.map((column) => column.header);
  const dataRows = rows.map((row) =>
    columns.map((column) => {
      const value = column.accessor(row);
      if (value === null || value === undefined || value === "") return "";
      return value;
    }),
  );

  const workbook = new ExcelJS.Workbook();
  // Đóng băng dòng tiêu đề — lăn xuống vẫn thấy header.
  const worksheet = workbook.addWorksheet(sheetName, {
    views: [{ state: "frozen", ySplit: 1 }],
  });

  columns.forEach((_column, index) => {
    const width = Math.max(
      headers[index].length,
      ...dataRows.map((row) => String(row[index]).length),
    );
    worksheet.getColumn(index + 1).width = Math.min(Math.max(width, 8), 40);
  });

  // Header: tô màu navy, chữ trắng đậm, căn giữa.
  const headerRow = worksheet.addRow(headers);
  headerRow.font = { bold: true, color: { argb: `FF${HEADER_FG}` } };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: `FF${HEADER_BG}` },
  };
  headerRow.alignment = { horizontal: "center", vertical: "middle" };
  headerRow.eachCell((cell) => {
    cell.border = allBorders();
  });

  dataRows.forEach((values, index) => {
    const row = worksheet.addRow(values);
    const zebra = index % 2 === 1;
    row.eachCell((cell) => {
      cell.border = allBorders();
      if (typeof cell.value === "number") {
        cell.alignment = { horizontal: "right" };
      }
      if (zebra) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: `FF${ZEBRA}` },
        };
      }
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  downloadBlob(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    fileName,
  );
}
