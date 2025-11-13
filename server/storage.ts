import { type Admin, type InsertAdmin, type Product, type InsertProduct, type UpdateProduct } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getAdmin(id: string): Promise<Admin | undefined>;
  getAdminByEmail(email: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
  
  getAllProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getFeaturedProducts(): Promise<Product[]>;
  getTrendingProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: UpdateProduct): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private admins: Map<string, Admin>;
  private products: Map<string, Product>;

  constructor() {
    this.admins = new Map();
    this.products = new Map();
    this.seedData();
  }

  private seedData() {
    const adminId = randomUUID();
    this.admins.set(adminId, {
      id: adminId,
      email: "admin@fitsnew.com",
      password: "$2b$10$2z3sSzQNQ9mdeQERMwlZiu/OnP1Xte2psrH0Jvs1lJd4SmANqX9e.",
    });

    const sampleProducts = [
      {
        id: randomUUID(),
        title: "Classic White T-Shirt",
        description: "Premium cotton t-shirt with a comfortable fit. Perfect for everyday wear.",
        price: 899,
        category: "T-Shirts",
        brand: "FitsNew",
        sizes: ["S", "M", "L", "XL"],
        images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"],
        stock: 50,
        isFeatured: true,
        isTrending: true,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Black Denim Jacket",
        description: "Stylish denim jacket with modern fit. A wardrobe essential.",
        price: 2499,
        category: "Jackets",
        brand: "FitsNew",
        sizes: ["M", "L", "XL"],
        images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5"],
        stock: 30,
        isFeatured: true,
        isTrending: false,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Blue Slim Fit Jeans",
        description: "Comfortable stretch denim jeans with a modern slim fit.",
        price: 1999,
        category: "Jeans",
        brand: "FitsNew",
        sizes: ["30", "32", "34", "36"],
        images: ["https://images.unsplash.com/photo-1542272604-787c3835535d"],
        stock: 40,
        isFeatured: false,
        isTrending: true,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Vintage Windbreaker",
        description: "Authentic 90s windbreaker in excellent condition. Unique colorway.",
        price: 1499,
        category: "Vintage",
        brand: "FitsAgain",
        sizes: ["M", "L"],
        images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea"],
        stock: 5,
        isFeatured: true,
        isTrending: true,
        createdAt: new Date(),
      },
    ];

    sampleProducts.forEach(product => {
      this.products.set(product.id, product);
    });
  }

  async getAdmin(id: string): Promise<Admin | undefined> {
    return this.admins.get(id);
  }

  async getAdminByEmail(email: string): Promise<Admin | undefined> {
    return Array.from(this.admins.values()).find(
      (admin) => admin.email === email
    );
  }

  async createAdmin(insertAdmin: InsertAdmin): Promise<Admin> {
    const id = randomUUID();
    const admin: Admin = { ...insertAdmin, id };
    this.admins.set(id, admin);
    return admin;
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values())
      .filter((product) => product.isFeatured)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 8);
  }

  async getTrendingProducts(): Promise<Product[]> {
    return Array.from(this.products.values())
      .filter((product) => product.isTrending)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 8);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = {
      ...insertProduct,
      id,
      createdAt: new Date(),
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(
    id: string,
    updateProduct: UpdateProduct
  ): Promise<Product | undefined> {
    const existing = this.products.get(id);
    if (!existing) return undefined;

    const updated: Product = {
      ...existing,
      ...updateProduct,
    };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }
}

export const storage = new MemStorage();
