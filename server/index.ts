import express, { type Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import { registerRoutes } from "./routes.js";
import { setupVite, serveStatic, log } from "./vite.js";

const app = express();

// Serve uploaded files from several possible upload directories so images
// remain accessible whether running in dev or production (bundled) mode.
// Order matters: prefer the directory that the static middleware uses in production.
const uploadCandidates = [
  path.resolve(import.meta.dirname, "public", "uploads"), // dist/server/public/uploads (bundled server)
  path.resolve(import.meta.dirname, "..", "public", "uploads"), // dist/public/uploads
  path.resolve(process.cwd(), "dist", "server", "public", "uploads"),
  path.resolve(process.cwd(), "dist", "public", "uploads"),
  path.resolve(process.cwd(), "public", "uploads"), // project root public/uploads (dev)
];

for (const candidate of uploadCandidates) {
  if (fs.existsSync(candidate)) {
    app.use("/uploads", express.static(candidate));
  }
}

// Serve attached assets (images provided in the repository) so they can be referenced
// directly from client code as `/attached_assets/...` without copying files.
const attachedAssetsPath = path.resolve(process.cwd(), "attached_assets");
if (fs.existsSync(attachedAssetsPath)) {
  app.use("/attached_assets", express.static(attachedAssetsPath));
}

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  // On some platforms (notably Windows) the `reusePort` option is not supported
  // and will cause an ENOTSUP error when trying to bind. Only set reusePort
  // on platforms that support it.
  const listenOptions: any = {
    port,
    host: "0.0.0.0",
  };

  if (process.platform !== "win32") {
    listenOptions.reusePort = true;
  }

  server.listen(listenOptions, () => {
    log(`serving on port ${port}`);
  });
})();
