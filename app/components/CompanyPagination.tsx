import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface CompanyPaginationProps {
  currentPage: number;
  totalPages: number;
  params: { [key: string]: string | string[] | undefined };
}

export function CompanyPagination({ currentPage, totalPages, params }: CompanyPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-8">
      <Pagination>
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious href={`?${new URLSearchParams({ ...params, page: (currentPage - 1).toString() })}`} />
            </PaginationItem>
          )}
          
          <PaginationItem>
            <PaginationLink 
              href={`?${new URLSearchParams({ ...params, page: "1" })}`}
              isActive={currentPage === 1}
            >
              1
            </PaginationLink>
          </PaginationItem>

          {currentPage > 3 && <PaginationEllipsis />}

          {currentPage !== 1 && currentPage !== totalPages && (
            <PaginationItem>
              <PaginationLink 
                href={`?${new URLSearchParams({ ...params, page: currentPage.toString() })}`}
                isActive={true}
              >
                {currentPage}
              </PaginationLink>
            </PaginationItem>
          )}

          {currentPage < totalPages - 2 && <PaginationEllipsis />}

          {totalPages !== 1 && (
            <PaginationItem>
              <PaginationLink 
                href={`?${new URLSearchParams({ ...params, page: totalPages.toString() })}`}
                isActive={currentPage === totalPages}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          )}

          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationNext href={`?${new URLSearchParams({ ...params, page: (currentPage + 1).toString() })}`} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
