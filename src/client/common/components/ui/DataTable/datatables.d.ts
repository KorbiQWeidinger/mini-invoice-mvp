// jQuery DataTable type definitions for our use case
interface DataTableInstance {
  search(query: string): DataTableInstance;
  draw(): DataTableInstance;
  destroy(): void;
  ajax: {
    reload(): void;
  };
  on(event: string, callback: () => void): void;
  page: {
    len(length: number): DataTableInstance;
    info(): {
      page: number;
      pages: number;
      start: number;
      end: number;
      length: number;
    };
  };
  page(page: number): DataTableInstance;
}

interface JQueryDataTable {
  DataTable(options: DataTableOptions): DataTableInstance;
}

interface DataTableOptions {
  responsive: boolean;
  pageLength: number;
  lengthMenu: number[];
  language: {
    search: string;
    searchPlaceholder: string;
    lengthMenu: string;
    info: string;
    paginate: {
      first: string;
      last: string;
      next: string;
      previous: string;
    };
  };
  dom: string;
  columnDefs: Array<{
    targets: number;
    orderable: boolean;
    searchable: boolean;
  }>;
}

declare global {
  interface JQuery {
    DataTable(options: DataTableOptions): DataTableInstance;
  }

  interface JQueryStatic {
    fn: {
      DataTable: {
        isDataTable(element: HTMLElement): boolean;
      };
    };
  }
}
