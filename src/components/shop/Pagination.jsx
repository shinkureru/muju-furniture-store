function Pagination({ currentPage, totalPages, onPageChange }) {
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );

  const goToPrevPage = () => {
    if (currentPage === 1) return; // 如果已經在第 1 頁，就不要再減

    onPageChange(currentPage - 1);
  }; // 這是上一頁

  const goToNextPage = () => {
    if (currentPage === totalPages) return; // 如果已經在最後一頁，就不要再加

    onPageChange(currentPage + 1); // 下一頁
  };

  return (
    <nav className="shop-pagination" aria-label="商品分頁">
      <button type="button" disabled={currentPage === 1} onClick={goToPrevPage}>
        上一頁
      </button>

      {pageNumbers.map((page) => (
        <button
          type="button"
          key={page}
          className={currentPage === page ? "is-active" : ""}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={goToNextPage}
      >
        下一頁
      </button>
    </nav>
  );
}

export default Pagination;
