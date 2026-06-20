require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const connectDB = require('../config/db');

const users = [
  {
    name: 'Admin User',
    email: 'admin@threadly.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'customer',
  },
];

const products = [
  {
    name: 'Classic White Tee',
    description: 'A timeless white cotton t-shirt with a relaxed fit. Perfect for any casual occasion.',
    price: 29.99,
    category: 'men',
    subCategory: 'shirts',
    sizes: [
      { size: 'S', stock: 20 },
      { size: 'M', stock: 35 },
      { size: 'L', stock: 30 },
      { size: 'XL', stock: 15 },
    ],
    colors: ['white', 'black', 'grey'],
    images: ['https://placehold.co/800x800?text=White+Tee'],
    brand: 'Threadly Basics',
    isFeatured: true,
  },
  {
    name: 'Slim Fit Jeans',
    description: 'Modern slim fit jeans crafted from premium stretch denim for all-day comfort.',
    price: 79.99,
    discountPrice: 59.99,
    category: 'men',
    subCategory: 'jeans',
    sizes: [
      { size: '30', stock: 10 },
      { size: '32', stock: 18 },
      { size: '34', stock: 20 },
      { size: '36', stock: 8 },
    ],
    colors: ['blue', 'black', 'grey'],
    images: ['https://placehold.co/800x800?text=Slim+Jeans'],
    brand: 'DenimCo',
    isFeatured: true,
  },
  {
    name: 'Floral Wrap Dress',
    description: 'Elegant wrap dress with a beautiful floral print. Flattering for all body types.',
    price: 64.99,
    category: 'women',
    subCategory: 'dresses',
    sizes: [
      { size: 'XS', stock: 12 },
      { size: 'S', stock: 25 },
      { size: 'M', stock: 22 },
      { size: 'L', stock: 10 },
    ],
    colors: ['floral-pink', 'floral-blue'],
    images: ['https://placehold.co/800x800?text=Wrap+Dress'],
    brand: 'Bloom',
    isFeatured: true,
  },
  {
    name: 'Kids Graphic Hoodie',
    description: 'Cozy fleece hoodie with fun graphic print. Machine washable.',
    price: 39.99,
    category: 'kids',
    subCategory: 'hoodies',
    sizes: [
      { size: '4T', stock: 15 },
      { size: '5T', stock: 18 },
      { size: '6', stock: 20 },
      { size: '7', stock: 12 },
      { size: '8', stock: 8 },
    ],
    colors: ['blue', 'red', 'green'],
    images: ['https://placehold.co/800x800?text=Kids+Hoodie'],
    brand: 'KidStyle',
    isFeatured: false,
  },
  {
    name: 'Leather Belt',
    description: 'Full-grain leather belt with a brushed silver buckle. Fits waist 28–42 inches.',
    price: 34.99,
    category: 'accessories',
    subCategory: 'belts',
    sizes: [
      { size: 'S/M', stock: 25 },
      { size: 'L/XL', stock: 20 },
    ],
    colors: ['brown', 'black'],
    images: ['https://placehold.co/800x800?text=Leather+Belt'],
    brand: 'LeatherCraft',
    isFeatured: false,
  },
  {
    name: 'Oversized Knit Sweater',
    description: 'Chunky knit oversized sweater in a relaxed silhouette. Perfect for layering.',
    price: 89.99,
    discountPrice: 69.99,
    category: 'women',
    subCategory: 'sweaters',
    sizes: [
      { size: 'S', stock: 3 },
      { size: 'M', stock: 2 },
      { size: 'L', stock: 4 },
    ],
    colors: ['cream', 'camel', 'forest-green'],
    images: ['https://placehold.co/800x800?text=Knit+Sweater'],
    brand: 'Cozy Co',
    isFeatured: true,
  },
  {
    name: 'Bomber Jacket',
    description: 'Classic bomber jacket with ribbed cuffs and hem. Lightweight and versatile.',
    price: 119.99,
    category: 'men',
    subCategory: 'jackets',
    sizes: [
      { size: 'S', stock: 8 },
      { size: 'M', stock: 12 },
      { size: 'L', stock: 10 },
      { size: 'XL', stock: 6 },
    ],
    colors: ['olive', 'black', 'navy'],
    images: ['https://placehold.co/800x800?text=Bomber+Jacket'],
    brand: 'UrbanEdge',
    isFeatured: true,
  },
  {
    name: 'High-Waist Leggings',
    description: 'Buttery-soft high-waist leggings with four-way stretch. Squat-proof.',
    price: 44.99,
    category: 'women',
    subCategory: 'activewear',
    sizes: [
      { size: 'XS', stock: 20 },
      { size: 'S', stock: 30 },
      { size: 'M', stock: 28 },
      { size: 'L', stock: 15 },
      { size: 'XL', stock: 10 },
    ],
    colors: ['black', 'charcoal', 'burgundy'],
    images: ['https://placehold.co/800x800?text=Leggings'],
    brand: 'ActiveWear',
    isFeatured: false,
    soldCount: 85,
  },
];

const seed = async () => {
  await connectDB();
  await User.deleteMany();
  await Product.deleteMany();

  const createdUsers = await User.create(users);
  await Product.create(products);

  console.log(`✓ Seeded ${createdUsers.length} users`);
  console.log(`✓ Seeded ${products.length} products`);
  console.log('\nAdmin credentials:');
  console.log('  Email:    admin@threadly.com');
  console.log('  Password: admin123');

  await mongoose.connection.close();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
