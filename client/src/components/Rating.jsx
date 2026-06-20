const Rating = ({ value, numReviews, size = 'sm' }) => {
  const s = size === 'lg' ? 'text-xl' : 'text-sm';
  return (
    <div className={`flex items-center gap-1 ${s}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={value >= star ? 'text-yellow-400' : value >= star - 0.5 ? 'text-yellow-300' : 'text-gray-300'}>
          ★
        </span>
      ))}
      {numReviews !== undefined && (
        <span className="text-gray-500 text-xs ml-1">({numReviews})</span>
      )}
    </div>
  );
};

export default Rating;
