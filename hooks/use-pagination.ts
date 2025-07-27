// hooks/usePagination.ts
import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Route } from "next";

const usePagination = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initialPage = parseInt(searchParams.get(`page`) as string, 10) || 1;
  const initialSize = parseInt(searchParams.get(`size`) as string, 10) || 10;

  const [pageIndex, setPageIndex] = useState<number>(initialPage - 1);
  const [pageSize, setPageSize] = useState<number>(initialSize);

  useEffect(() => {
    const page = parseInt(searchParams.get(`page`) as string, 10);
    const size = parseInt(searchParams.get(`size`) as string, 10);

    if (!isNaN(page) && page - 1 !== pageIndex) {
      setPageIndex(page - 1);
    }

    if (!isNaN(size) && size !== pageSize) {
      setPageSize(size);
    }
  }, [searchParams, pageIndex, pageSize]);

  const updateUrl = (page: number, size: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set(`page`, (page + 1).toString());
    newSearchParams.set(`size`, size.toString());
    router.push(
      `${pathname}?${newSearchParams.toString()}` as unknown as Route
    );
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
