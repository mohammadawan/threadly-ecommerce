const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null;
  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-40 hover:bg-gray-50"
      >
        Prev
      </button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-1 rounded border text-sm ${p === page ? 'bg-black text-white border-black' : 'border-gray-300 hover:bg-gray-50'}`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-40 hover:bg-gray-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
