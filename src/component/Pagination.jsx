// import React, { useContext } from 'react';
// import { BlogContext } from '../context/blog'; // Adjust the path as needed

// const Pagination = () => {
//   const { currentPage, totalPages, paginate } = useContext(BlogContext);

//   const handlePrev = () => {
//     if (currentPage > 1) paginate(currentPage - 1);
//   };

//   const handleNext = () => {
//     if (currentPage < totalPages) paginate(currentPage + 1);
//   };

//   const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

//   return (
//     <div className="pagination">
//       <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
//         <button className="page-link prev-next" onClick={handlePrev}>
//           <i className="fas fa-chevron-left"></i>
//           <span>Previous</span>
//         </button>
//       </li>

//       {pageNumbers.map((num) => (
//         <li key={num} className="page-item">
//           <button
//             onClick={() => paginate(num)}
//             className={`page-link ${currentPage === num ? 'active' : ''}`}
//           >
//             {num}
//           </button>
//         </li>
//       ))}

//       <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
//         <button className="page-link prev-next" onClick={handleNext}>
//           <span>Next</span>
//           <i className="fas fa-chevron-right"></i>
//         </button>
//       </li>
//     </div>
//   );
// };

// export default Pagination;

import React, { useContext } from 'react';
import { BlogContext } from '../context/blog'; // Adjust the path as needed

const Pagination = () => {
  const { currentPage, totalPages, paginate } = useContext(BlogContext);

  const handlePrev = () => {
    if (currentPage > 1) paginate(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) paginate(currentPage + 1);
  };

  const visiblePages = 5;

  let startPage = Math.max(currentPage - Math.floor(visiblePages / 2), 1);
  let endPage = startPage + visiblePages - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(endPage - visiblePages + 1, 1);
  }

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination">
      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
        <button className="page-link prev-next" onClick={handlePrev} disabled={currentPage === 1}>
          <i className="fas fa-chevron-left"></i>
          <span>Previous</span>
        </button>
      </li>

      {/* Show first page + ellipsis if startPage > 1 */}
      {startPage > 1 && (
        <>
          <li className="page-item">
            <button className="page-link" onClick={() => paginate(1)}>1</button>
          </li>
          {startPage > 2 && <li className="page-item disabled"><span className="page-link">...</span></li>}
        </>
      )}

      {pageNumbers.map((num) => (
        <li key={num} className="page-item">
          <button
            onClick={() => paginate(num)}
            className={`page-link ${currentPage === num ? 'active' : ''}`}
          >
            {num}
          </button>
        </li>
      ))}

      {/* Show ellipsis + last page if endPage < totalPages */}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <li className="page-item disabled"><span className="page-link">...</span></li>}
          <li className="page-item">
            <button className="page-link" onClick={() => paginate(totalPages)}>{totalPages}</button>
          </li>
        </>
      )}

      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
        <button className="page-link prev-next" onClick={handleNext} disabled={currentPage === totalPages}>
          <span>Next</span>
          <i className="fas fa-chevron-right"></i>
        </button>
      </li>
    </div>
  );
};

export default Pagination;
