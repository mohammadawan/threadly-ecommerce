export const formatPrice = (amount) =>
  `Rs. ${Number(amount).toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
