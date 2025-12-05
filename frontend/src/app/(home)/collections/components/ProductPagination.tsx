import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { cn } from '@/lib/utils'

interface ProductPaginationProps {
    handleNext:() => void,
    handlePrev:() => void,
    handlePageChange:(page: number | string )=> void,
    page: number,
    totalPages: number
}

const ProductPagination = ({handleNext, handlePrev, handlePageChange, page, totalPages} : ProductPaginationProps) => {
  
  /** Function to genarate paginations */
  const generatePages = () => {
    const pages = [];

    {/**Dont' show '...' if total pages < 4 */}
    if(totalPages < 4) {
      for(let i = 1; i <= totalPages ; i++){
        pages.push(i)
      }
    } 

    else {
      /**If current page < 2, show : 1,2,3, ..., last page */
      if(page < 2) {
        pages.push(1,2,3, "...", totalPages)
      }

      /**If current page is next to last page, show : 1, ... , lastpage-2, lastpage-1, lastpage */
      else if (page >= totalPages -1) {
        pages.push(1, '...', totalPages-2, totalPages-1, totalPages)
      }

      /** If current page is in the middle, show 1,..., current page, ..., last page */
      else {
        pages.push(1, '...', page, '...', totalPages)
      }
    }

    return pages
  }

  /** an array include pagination's elements */
  const pagesToShow = generatePages()
  
  return (
    <div className='flex justify-center my-4'> 
      <Pagination>
        <PaginationContent>
          {/** Previous Page */}
          <PaginationItem>
            <PaginationPrevious 
              onClick={page === 1 ? undefined : handlePrev}
              className={cn("cursor-pointer",
                page === 1 && "pointer-events-none opacity-50"
              )}
            />
          </PaginationItem>

          {pagesToShow.map((p, index) => (
            <PaginationItem key={index}>
              {
                p === '...' ? (<PaginationEllipsis/>) :(
                  <PaginationLink
                    isActive={p === page}
                    onClick={() => {
                      if (p !== page ) handlePageChange(p);
                    }}
                    className='cursor-pointer'
                  >
                    {p}
                  </PaginationLink>
                )

              } 
            </PaginationItem>
          ))}

          {/**Next Page */}
          <PaginationItem>
            <PaginationNext 
              onClick={page === totalPages ? undefined : handleNext}
              className={cn("cursor-pointer",
                page === totalPages && "pointer-events-none opacity-50"
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

export default ProductPagination
