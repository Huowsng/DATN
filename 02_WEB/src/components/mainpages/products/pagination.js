import React from "react";

function Pagination({
  currentPage,
  totalPages,
  handlePreviousPage,
  handleNextPage,
  handlePageChange,
}) {
  return (
    <nav aria-label="Page navigation example">
      <ul className="pagination justify-content-center">
        <li className="page-item">
          <a className="page-link" href="#" onClick={handlePreviousPage}>
            Previous
          </a>
        </li>
        {[...Array(totalPages)].map((_, index) => (
          <li
            key={index}
            className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
          >
            <a
              className="page-link"
              href="#"
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </a>
          </li>
        ))}
        <li className="page-item">
          <a className="page-link" href="#" onClick={handleNextPage}>
            Next
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
