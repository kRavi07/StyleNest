// hooks/usePagination.ts
import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type { Route } from "next";

const usePagination = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initialPage = Number(searchParams.get("page")) || 1;
  const initialSize = Number(searchParams.get("size")) || 10;

  const [pageIndex, setPageIndex] = useState(initialPage - 1);
  const [pageSize, setPageSize] = useState(initialSize);

  // Keep state in sync with URL if searchParams change (e.g., back/forward navigation)
  useEffect(() => {
    const page = Number(searchParams.get("page"));
    const size = Number(searchParams.get("size"));

    if (!isNaN(page) && page > 0 && page - 1 !== pageIndex) {
      setPageIndex(page - 1);
    }

    if (!isNaN(size) && size > 0 && size !== pageSize) {
      setPageSize(size);
    }
  }, [searchParams, pageIndex, pageSize]);

  const updateUrl = (page: number, size: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", (page + 1).toString());
    params.set("size", size.toString());

    router.push(`${pathname}?${params.toString()}` as Route, {
      scroll: false, // prevents page jump when paginating
    });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage !== pageIndex) {
      setPageIndex(newPage);
      updateUrl(newPage, pageSize);
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    if (newSize !== pageSize) {
      setPageSize(newSize);
      updateUrl(pageIndex, newSize);
    }
  };

  return {
    pageIndex,
    pageSize,
    handlePageChange,
    handlePageSizeChange,
  };
};

export default usePagination;
