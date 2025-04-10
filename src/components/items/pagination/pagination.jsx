import ReactPaginate from 'react-paginate';
import PropTypes from 'prop-types';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"  

const PaginationItem = ({ totalPages, handleChangePage, handleChangeRowsPerPage }) => {
    const handleChangePageInChild = (e) => {
        handleChangePage(e);
    }

    const handleChangeRowsPerPageInChild = (rows) => {
        handleChangeRowsPerPage(rows);
    }
    
    return ( 
        <section className='flex items-center gap-x-2'>
            <div className='flex items-center gap-x-2'>
                <span className="text-gray-800 text-sm font-medium">Hàng/trang</span>
                <Select onValueChange={handleChangeRowsPerPageInChild} defaultValue="10">
                    <SelectTrigger>
                        <SelectValue placeholder="10" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="30">30</SelectItem>
                        <SelectItem value="40">40</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <ReactPaginate
                breakLabel="..."
                nextLabel={
                    <button type="button" className="min-h-9.5 min-w-9.5 py-2 px-2.5 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:border-transparent dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10" aria-label="Next">
                        <span className="sr-only">Next</span>
                        <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m9 18 6-6-6-6"></path>
                        </svg>
                    </button>
                }
                previousLabel={
                    <button type="button" className="min-h-9.5 min-w-9.5 py-2 px-2.5 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:border-transparent dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10" aria-label="Previous">
                        <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m15 18-6-6 6-6"></path>
                        </svg>
                        <span className="sr-only">Previous</span>
                    </button>
                }
                onPageChange={handleChangePageInChild}
                pageRangeDisplayed={3}
                pageCount={totalPages}
    
                pageClassName="min-h-9.5 min-w-9.5 flex justify-center items-center text-gray-800 hover:bg-gray-100 py-2 px-3 text-sm rounded-lg"
                // previousClassName="join-item btn"
                // nextClassName="join-item btn"
                containerClassName="flex items-center gap-x-1"
                activeClassName="outline-hidden bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
            />
        </section>
     );
}
PaginationItem.propTypes = {
    totalPages: PropTypes.number.isRequired,
    handleChangePage: PropTypes.func.isRequired,
    handleChangeRowsPerPage: PropTypes.func.isRequired,
};

export default PaginationItem;