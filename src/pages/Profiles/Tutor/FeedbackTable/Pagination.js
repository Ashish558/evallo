import React from 'react'
import ReactPaginate from 'react-paginate';

export default function Pagination({ currentPage, setCurrentPage, totalPages }) {

   const handleClick = size => setCurrentPage(size)

   return (
      <div className='flex justify-center mt-5'>
{/*         
         {[...Array(totalPages)].map((x, i) =>
            <button key={i} className={`w-[38.12px] h-[38.12px] border border-primary rounded-full mr-7
             ${i + 1 === currentPage ? 'bg-primary text-white' : 'text-primary'}`}
               onClick={() => handleClick(i + 1)}
            >
               {i + 1}
            </button>
         )} */}

         <ReactPaginate
            className='table-pagination-container flex justify-center mt-5'
            pageClassName={`flex justify-center items-center w-[38.12px] h-[38.12px] border border-primary rounded-full mr-5 cursor-pointer
               ${'text-primary'}`}
            activeClassName={`bg-primary text-white`}
            breakLabel="..."
            onPageChange={(val) => handleClick(val.selected + 1)}
            pageRangeDisplayed={3}
            pageCount={totalPages}
            previousClassName='hidden'
            nextClassName='hidden'
            renderOnZeroPageCount={null}
            pageLinkClassName='w-full h-full flex justify-center items-center'
         />

      </div>
   )
}
