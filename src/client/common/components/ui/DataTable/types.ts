import { ReactNode } from "react";

export interface DataTableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
  searchable?: boolean;
  width?: string;
  sortKey?: keyof T | string; // Optional custom sort key
}

export interface DataTableAction<T> {
  label: string;
  icon: ReactNode;
  onClick: (row: T) => void;
  variant?: "primary" | "secondary" | "danger" | "warning" | "ghost";
  disabled?: (row: T) => boolean;
}

export interface DataTableFilter {
  key: string;
  label: string;
  type: "select" | "date" | "text" | "number";
  options?: { value: string; label: string }[];
  placeholder?: string;
}

export interface DataTableFiltersProps {
  searchable?: boolean;
  filterable?: boolean;
  refreshable?: boolean;
  filters?: DataTableFilter[];
  onSearch?: (query: string) => void;
  onFilter?: (filters: Record<string, string>) => void;
  onRefresh?: () => void;
  title?: string;
  className?: string;
}

export interface DataTableCardViewProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  actions?: DataTableAction<T>[];
  emptyMessage?: string;
  className?: string;
}
