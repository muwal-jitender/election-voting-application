import { Router } from "express";
import helmet from "helmet";

const securityHeaders = Router();

// Apply helmet with modular config
securityHeaders.use(
  helmet({
    // 🛡️ Click-jacking protection
    frameguard: { action: "deny" },
    // ❌ Don’t leak page URL to third-party services (e.g., Cloudinary) — improves privacy
    referrerPolicy: { policy: "no-referrer" },
    crossOriginEmbedderPolicy: false, // Useful if you hit CORS or iframe issues
    contentSecurityPolicy: {
      directives: {
        // Allow everything else only from your own origin
        defaultSrc: ["'self'"],

        // Allow JavaScript only from your domain (no CDNs or inline scripts)
        scriptSrc: ["'self'"],

        // Allow CSS only from your domain (no inline styles or external fonts)
        styleSrc: ["'self'"],

        // Allow image loading from your domain and Cloudinary only
        imgSrc: ["'self'", "https://res.cloudinary.com"],

        // Allow fonts only from your domain (add Google Fonts if needed)
        fontSrc: ["'self'"],

        // Disallow embedding any objects (like Flash, PDFs, etc.)
        objectSrc: ["'none'"],

        // Force all HTTP requests to be upgraded to HTTPS
        upgradeInsecureRequests: [],
      },
    },
  })
);

export default securityHeaders;
