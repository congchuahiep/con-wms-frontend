/**
 * Cấu trúc dữ liệu được phân trang theo chuẩn response mà Server trả về.
 *
 * @template T Kiểu dữ liệu của từng phần tử trong danh sách `items`.
 */
export type Paginated<T> = {
  items: T[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};
