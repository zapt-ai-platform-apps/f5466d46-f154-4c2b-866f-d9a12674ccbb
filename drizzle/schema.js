import { pgTable, serial, text, timestamp, uuid, boolean, integer, decimal, array, primaryKey } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull().unique(),
  phone: text('phone').unique(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const addresses = pgTable('addresses', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull(),
  isDefault: boolean('is_default').default(false),
  fullName: text('full_name').notNull(),
  phone: text('phone').notNull(),
  addressLine1: text('address_line1').notNull(),
  addressLine2: text('address_line2'),
  city: text('city').notNull(),
  state: text('state').notNull(),
  postalCode: text('postal_code').notNull(),
  country: text('country').notNull().default('India'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  imageUrl: text('image_url'),
  parentId: integer('parent_id').references(() => categories.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const brands = pgTable('brands', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  logoUrl: text('logo_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  shortDescription: text('short_description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  mrp: decimal('mrp', { precision: 10, scale: 2 }).notNull(),
  categoryId: integer('category_id').notNull().references(() => categories.id),
  brandId: integer('brand_id').notNull().references(() => brands.id),
  stockQuantity: integer('stock_quantity').notNull().default(0),
  imageUrls: array(text('image_urls')),
  weight: text('weight'),
  sku: text('sku').unique(),
  nutritionFacts: text('nutrition_facts'),
  ingredients: text('ingredients'),
  usageInstructions: text('usage_instructions'),
  form: text('form'),
  isFeatured: boolean('is_featured').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const productVariants = pgTable('product_variants', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').notNull().references(() => products.id),
  name: text('name').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  mrp: decimal('mrp', { precision: 10, scale: 2 }).notNull(),
  stockQuantity: integer('stock_quantity').notNull().default(0),
  weight: text('weight'),
  sku: text('sku').unique(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').notNull().references(() => products.id),
  userId: uuid('user_id').notNull(),
  rating: integer('rating').notNull(),
  reviewText: text('review_text'),
  isVerifiedPurchase: boolean('is_verified_purchase').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const carts = pgTable('carts', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id'),
  guestId: text('guest_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const cartItems = pgTable('cart_items', {
  id: serial('id').primaryKey(),
  cartId: integer('cart_id').notNull().references(() => carts.id),
  productId: integer('product_id').notNull().references(() => products.id),
  variantId: integer('variant_id').references(() => productVariants.id),
  quantity: integer('quantity').notNull().default(1),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id'),
  guestEmail: text('guest_email'),
  guestPhone: text('guest_phone'),
  status: text('status').notNull().default('pending'),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  shippingAddressId: integer('shipping_address_id').references(() => addresses.id),
  shippingMethod: text('shipping_method'),
  shippingCost: decimal('shipping_cost', { precision: 10, scale: 2 }).default('0'),
  paymentMethod: text('payment_method'),
  paymentStatus: text('payment_status').notNull().default('pending'),
  transactionId: text('transaction_id'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').notNull().references(() => orders.id),
  productId: integer('product_id').notNull().references(() => products.id),
  variantId: integer('variant_id').references(() => productVariants.id),
  name: text('name').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  quantity: integer('quantity').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const wishlists = pgTable('wishlists', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull(),
  productId: integer('product_id').notNull().references(() => products.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const coupons = pgTable('coupons', {
  id: serial('id').primaryKey(),
  code: text('code').notNull().unique(),
  description: text('description'),
  discountType: text('discount_type').notNull(),
  discountValue: decimal('discount_value', { precision: 10, scale: 2 }).notNull(),
  minPurchase: decimal('min_purchase', { precision: 10, scale: 2 }).default('0'),
  maxDiscount: decimal('max_discount', { precision: 10, scale: 2 }),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  usageLimit: integer('usage_limit'),
  usedCount: integer('used_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const subscriptions = pgTable('subscriptions', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull(),
  productId: integer('product_id').notNull().references(() => products.id),
  variantId: integer('variant_id').references(() => productVariants.id),
  quantity: integer('quantity').notNull().default(1),
  frequencyDays: integer('frequency_days').notNull(),
  nextDeliveryDate: timestamp('next_delivery_date').notNull(),
  status: text('status').notNull().default('active'),
  shippingAddressId: integer('shipping_address_id').references(() => addresses.id),
  paymentMethodId: text('payment_method_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const healthGoals = pgTable('health_goals', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const productHealthGoals = pgTable('product_health_goals', {
  productId: integer('product_id').notNull().references(() => products.id),
  goalId: integer('goal_id').notNull().references(() => healthGoals.id),
  createdAt: timestamp('created_at').defaultNow()
}, (t) => ({
  pk: primaryKey({ columns: [t.productId, t.goalId] })
}));

export const userHealthGoals = pgTable('user_health_goals', {
  userId: uuid('user_id').notNull(),
  goalId: integer('goal_id').notNull().references(() => healthGoals.id),
  createdAt: timestamp('created_at').defaultNow()
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.goalId] })
}));