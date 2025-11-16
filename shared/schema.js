import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
export const admins = pgTable("admins", {
    id: varchar("id").primaryKey().default(sql `gen_random_uuid()`),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
});
export const products = pgTable("products", {
    id: varchar("id").primaryKey().default(sql `gen_random_uuid()`),
    title: text("title").notNull(),
    description: text("description").notNull(),
    price: integer("price").notNull(),
    category: text("category").notNull(),
    brand: text("brand").notNull(),
    sizes: text("sizes").array().notNull(),
    images: text("images").array().notNull(),
    stock: integer("stock").notNull().default(0),
    isFeatured: boolean("is_featured").notNull().default(false),
    isTrending: boolean("is_trending").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});
export const insertAdminSchema = createInsertSchema(admins).omit({
    id: true,
});
export const insertProductSchema = createInsertSchema(products).omit({
    id: true,
    createdAt: true,
});
export const updateProductSchema = insertProductSchema.partial();
