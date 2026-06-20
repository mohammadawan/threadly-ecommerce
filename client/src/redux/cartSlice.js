import { createSlice } from '@reduxjs/toolkit';

const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');

const saveCart = (items) => localStorage.setItem('cartItems', JSON.stringify(items));

const cartSlice = createSlice({
  name: 'cart',
  initialState: { cartItems },
  reducers: {
    addToCart(state, action) {
      const item = action.payload;
      const key = `${item._id}-${item.size}-${item.color}`;
      const existing = state.cartItems.find((i) => `${i._id}-${i.size}-${i.color}` === key);
      if (existing) {
        existing.qty += item.qty;
      } else {
        state.cartItems.push(item);
      }
      saveCart(state.cartItems);
    },
    removeFromCart(state, action) {
      const { id, size, color } = action.payload;
      state.cartItems = state.cartItems.filter(
        (i) => !(i._id === id && i.size === size && i.color === color)
      );
      saveCart(state.cartItems);
    },
    updateQty(state, action) {
      const { id, size, color, qty } = action.payload;
      const item = state.cartItems.find(
        (i) => i._id === id && i.size === size && i.color === color
      );
      if (item) item.qty = qty;
      saveCart(state.cartItems);
    },
    clearCart(state) {
      state.cartItems = [];
      localStorage.removeItem('cartItems');
    },
  },
});

export const { addToCart, removeFromCart, updateQty, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
