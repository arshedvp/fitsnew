import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { insertAdminSchema, insertProductSchema, updateProductSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";

const JWT_SECRET = process.env.SESSION_SECRET || "your-secret-key-change-in-production";

interface AuthRequest extends Express.Request {
  adminId?: string;
}

const authMiddleware = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { adminId: string };
    req.adminId = decoded.adminId;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      const admin = await storage.getAdminByEmail(email);
      if (!admin) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(password, admin.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign({ adminId: admin.id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.json({ token, admin: { id: admin.id, email: admin.email } });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/admin/register", async (req, res) => {
    try {
      const data = insertAdminSchema.parse(req.body);

      const existing = await storage.getAdminByEmail(data.email);
      if (existing) {
        return res.status(400).json({ error: "Admin already exists" });
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);
      const admin = await storage.createAdmin({
        ...data,
        password: hashedPassword,
      });

      const token = jwt.sign({ adminId: admin.id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.json({ token, admin: { id: admin.id, email: admin.email } });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/products/featured", async (req, res) => {
    try {
      const products = await storage.getFeaturedProducts();
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/products/trending", async (req, res) => {
    try {
      const products = await storage.getTrendingProducts();
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/products", authMiddleware, async (req, res) => {
    try {
      const data = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(data);
      res.status(201).json(product);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/products/:id", authMiddleware, async (req, res) => {
    try {
      const data = updateProductSchema.parse(req.body);
      const product = await storage.updateProduct(req.params.id, data);
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      res.json(product);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/products/:id", authMiddleware, async (req, res) => {
    try {
      const deleted = await storage.deleteProduct(req.params.id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Image upload endpoint (authenticated)
  try {
    // Prefer the uploads dir that the static server will actually serve from.
    // When running the bundled server the static middleware serves `dist/server/public`.
    const preferred = path.resolve(import.meta.dirname, "public", "uploads"); // dist/server/public/uploads
    const fallback = path.resolve(import.meta.dirname, "..", "public", "uploads"); // dist/public/uploads

    // If fallback has files (e.g. from build/postbuild) but preferred doesn't exist yet,
    // create preferred and copy files so they remain accessible when the server serves
    // from dist/server/public.
    if (!fs.existsSync(preferred)) {
      fs.mkdirSync(preferred, { recursive: true });
      if (fs.existsSync(fallback)) {
        try {
          const items = fs.readdirSync(fallback);
          for (const it of items) {
            const from = path.join(fallback, it);
            const to = path.join(preferred, it);
            try {
              fs.copyFileSync(from, to);
            } catch (copyErr) {
              // ignore copy failures for individual files
            }
          }
        } catch (e) {
          // ignore
        }
      }
    }

    const uploadsDir = fs.existsSync(preferred) ? preferred : fallback;

    const multerStorage = multer.diskStorage({
      destination: (_req, _file, cb) => cb(null, uploadsDir),
      filename: (_req, file, cb) => {
        const safe = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.\-_%]/g, "-")}`;
        cb(null, safe);
      },
    });

    const upload = multer({ storage: multerStorage });

    app.post("/api/upload", authMiddleware, upload.single("file"), async (req: any, res: any) => {
      try {
        if (!req.file) {
          return res.status(400).json({ error: "No file uploaded" });
        }

        // Return a URL that the client can use to display the uploaded image
        const url = `/uploads/${req.file.filename}`;
        res.json({ url });
      } catch (err: any) {
        res.status(500).json({ error: err.message });
      }
    });
  } catch (err) {
    // Non-fatal: ensure routes still register if uploads dir can't be prepared
    console.warn("Warning: upload route could not be prepared", err);
  }

  const httpServer = createServer(app);

  return httpServer;
}
