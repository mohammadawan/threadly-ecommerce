const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ['men', 'women', 'kids', 'accessories'],
    },
    subCategory: {
      type: String,
      required: true,
    },
    sizes: [
      {
        size: { type: String, required: true },
        stock: { type: Number, required: true, min: 0, default: 0 },
      },
    ],
    colors: [{ type: String }],
    images: [{ type: String }],
    brand: { type: String },
    ratings: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    soldCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', brand: 'text' });

productSchema.virtual('totalStock').get(function () {
  return this.sizes.reduce((sum, s) => sum + s.stock, 0);
});

productSchema.virtual('effectivePrice').get(function () {
  return this.discountPrice && this.discountPrice < this.price
    ? this.discountPrice
    : this.price;
});

module.exports = mongoose.model('Product', productSchema);
