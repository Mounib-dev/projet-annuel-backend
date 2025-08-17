import express from "express";
import cors, { CorsOptions } from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";

export function securityConfig(app: express.Express) {
  app.set("trust proxy", 1);

  app.use(express.json({ limit: "500kb" }));
  app.use(express.urlencoded({ extended: false, limit: "500kb" }));

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
      referrerPolicy: { policy: "no-referrer" },
      hsts: { maxAge: 15552000, includeSubDomains: true, preload: false },
    })
  );

  app.use(mongoSanitize());

  const DEV_ORIGINS = ["http://localhost:5173", "http://localhost:8080"];
  const PROD_ORIGINS = [
    process.env.FRONTEND_ORIGIN?.replace(/\/$/, "") ||
      "https://smartfunds-frontend-a2854cc82a30.herokuapp.com",
  ];

  const allowedOrigins =
    process.env.NODE_ENV === "production" ? PROD_ORIGINS : DEV_ORIGINS;

  const corsOptions: CorsOptions = {
    origin(origin, cb) {
      if (!origin) return cb(null, true);

      const normalized = origin.replace(/\/$/, "");
      if (allowedOrigins.includes(normalized)) return cb(null, true);

      return cb(new Error("CORS: origin not allowed"));
    },
    credentials: false,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Length", "Content-Type"],
    optionsSuccessStatus: 204,
  };

  app.use(cors(corsOptions));

  const globalLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 min
    max: 300, // 300 req / 5 min / IP
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { error: "Too many requests." },
    keyGenerator: (req) => req.ip || "unknown",
  });
  app.use(globalLimiter);
}

export const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many auth attempts. Please wait a moment." },
  keyGenerator: (req) => {
    const ip = req.ip || "unknown";
    const id = (req.body?.email || req.body?.username || "").toLowerCase();
    return `${ip}:${id}`;
  },
});
