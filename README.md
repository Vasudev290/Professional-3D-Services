# Professional-3D-Services

## Web Developer Technical Assessment — ThePro3DStudio (MAP Systems)

**Role:** Web Developer  
**Experience Level:** 2 Years  
**Company Reference:** ThePro3DStudio (MAP Systems)  
**Live Canonical Service URL:** `https://professional3dservices.com/3d-rendering/product-services.html`  
**Submission Email:** `hrd@mapsystems.com`

---

## 1. Project Overview

This project is a modern, high-performance responsive landing page for **3D Product Rendering Services**. It fulfills all 6 technical tasks required by the assessment:

- **Task 1: Figma to Responsive Website** — Converted service page design into semantic HTML5 and modern CSS3, responsive across Desktop, Tablet, and Mobile devices.
- **Task 2: JavaScript Interactions** — Responsive mobile hamburger menu drawer, accessible FAQ accordion, real-time input validation, and feedback notifications.
- **Task 3: Contact Form Backend (PHP)** — Dual-layer frontend/backend validation, sanitization, email transmission to `hrd@mapsystems.com`, anti-spam honeypot, and accidental duplicate submission prevention.
- **Task 4: Technical SEO & Schema Markup** — Meta titles, meta descriptions, canonical URLs, Open Graph / Twitter Cards, proper H1-H3 hierarchy, descriptive alt tags, and JSON-LD structured data (`Service`/`Organization`, `BreadcrumbList`, `FAQPage`).
- **Task 5: URL Redirection** — Apache `.htaccess` 301 permanent redirect from `product.html` to `product-services.html`.
- **Task 6: Performance & Core Web Vitals Optimization** — Zero-layout-shift (CLS = 0) explicit dimensions, lazy-loaded offscreen media, optimized font delivery (`DM Sans 18pt` global base), and browser caching/compression rules.

---

## 2. Directory Structure

```text
Maps Assignment/
├── .htaccess                       # Apache 301 redirect & performance rules (Task 5 & 6)
├── README.md                       # Complete technical documentation & architecture
├── index.html                      # Entry point redirecting to canonical product-services.html
├── product-services.html           # Primary canonical 3D Product Rendering service page
├── product.html                    # Legacy file placeholder (with client fallback redirect)
│
├── assets/
│   ├── css/
│   │   ├── reset.css               # Modern CSS reset & box-sizing normalize
│   │   ├── variables.css           # Design tokens, DM Sans 18pt font & color variables
│   │   ├── components.css          # Reusable buttons, cards, badges, inputs & accordion
│   │   ├── layout.css              # Header/nav, container, grid system & footer
│   │   ├── sections.css            # Hero, stats, service grid, process & contact styles
│   │   └── responsive.css          # Media queries (Desktop 1200px+, Tablet 768-1024px, Mobile <768px)
│   │
│   ├── js/
│   │   ├── navigation.js           # Hamburger toggle, drawer & sticky header interaction (Task 2)
│   │   ├── accordion.js            # Accessible FAQ expand/collapse logic (Task 2)
│   │   ├── form-validation.js      # Frontend validation, sanitization & AJAX submit (Task 2 & 3)
│   │   └── main.js                 # Smooth scrolling, active nav observer & CWV monitoring (Task 6)
│   │
│   └── images/
│       ├── logo/
│       │   └── logo.svg            # Responsive brand vector logo
│       ├── hero/
│       │   └── hero-3d-render.svg  # High-fidelity 3D audio product showcase
│       └── services/
│           ├── white-bg-render.svg # White-background eCommerce visual
│           ├── lifestyle-render.svg# Contextual lifestyle environment visual
│           ├── 360-spin.svg        # 360-degree interactive spin visual
│           ├── ar-visualization.svg# Augmented Reality (AR) asset visual
│           ├── furniture-render.svg# Photorealistic furniture visual
│           └── electronics-render.svg # Sub-millimeter electronics CAD visual
│
└── backend/
    ├── config.php                  # Centralized configuration & mail settings (Task 3)
    ├── helpers.php                 # Input sanitization and validation helper library (Task 3)
    └── process-form.php            # Form submission processor & email dispatch handler (Task 3)
```

---

## 3. Implementation Details by Task

### Task 1: Figma to Responsive Website
- **Typography**: Configured Google Fonts `DM Sans` with an `18pt` global base size across all body copy, accompanied by a clean typographic hierarchy (`h1`, `h2`, `h3`, `h4`).
- **Semantic Structure**: Built with `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, and `<footer>` elements.
- **Service Categories**: Six dedicated service cards with feature bullet points and CTA buttons.
- **Process Pipeline**: 4-step workflow (*Submit Assets* &rarr; *Modeling & Texturing* &rarr; *Preview & Revisions* &rarr; *Final Delivery*).
- **Responsive Layouts**:
  - **Desktop (1200px+)**: 3-column service grid, 4-column stats and process grids, dual-column hero and contact layouts.
  - **Tablet (768px – 1024px)**: 2-column grids, optimized padding, and touch-friendly button targets.
  - **Mobile (< 768px)**: 1-column stacked flow, slide-out hamburger navigation drawer, and full-width form inputs.

### Task 2: JavaScript Functionality
- **Mobile Navigation (`assets/js/navigation.js`)**:
  - Smooth slide-in drawer on mobile devices with animated hamburger icon transitions.
  - Backdrop blur overlay that closes the drawer on click.
  - Automatic drawer close on `Escape` keypress or navigation link click.
- **FAQ Accordion (`assets/js/accordion.js`)**:
  - Accessible accordion utilizing dynamic `scrollHeight` calculation for smooth CSS height transitions.
  - Full ARIA attribute sync (`aria-expanded="true|false"`).
  - Auto-collapses neighboring panels to keep the viewport clean.
- **Validation & Form UX (`assets/js/form-validation.js`)**:
  - Real-time field validation on both `blur` and `input` events.
  - Highlighting of valid (`success`) and invalid (`error`) form controls.
  - User-friendly error message alerts and focus management scrolling to the first invalid input.
  - Accidental duplicate submission prevention using submission locks and unique token IDs.

### Task 3: Contact Form Development (Frontend + Backend PHP)
- **Form Fields**: Full Name, Business Email, Phone Number, Service Required, Project Budget (optional), Message, Anti-spam Honeypot, and CSRF/Session Token.
- **Backend Architecture (`backend/`)**:
  - `config.php`: Central recipient configuration (`hrd@mapsystems.com`), sender credentials, whitelist of valid services, and security flags.
  - `helpers.php`: Functions for string stripping, `filter_var` email validation, international phone format checking (7–15 digits), and email header injection protection.
  - `process-form.php`: Validates inputs, checks the honeypot field, prevents duplicate submissions via session token caching, and constructs both HTML and Plain Text email payloads.
  - Supports both **AJAX (JSON)** responses and traditional **HTTP POST** redirects.

### Task 4: Technical SEO Implementation
- **On-Page SEO**:
  - Descriptive, keyword-optimized page `<title>`: `Photorealistic 3D Product Rendering Services | ThePro3DStudio`.
  - Compelling `<meta name="description">` under 160 characters.
  - Canonical URL tag: `<link rel="canonical" href="https://professional3dservices.com/3d-rendering/product-services.html">`.
  - Meta robots tag: `index, follow, max-snippet:-1, max-image-preview:large`.
  - Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`, `og:site_name`).
  - Twitter Card tags (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`).
  - Strict heading hierarchy (`<h1>` for hero &rarr; `<h2>` for major sections &rarr; `<h3>` for cards/steps).
  - All images include meaningful `alt`, `width`, and `height` attributes.
- **JSON-LD Schema Markup (Validated against Schema.org standards)**:
  1. **`Service` / `Organization` Schema**: Details the provider, area served, brand logo, contact info, and catalog of services.
  2. **`BreadcrumbList` Schema**: Declares hierarchy `Home` &rarr; `3D Rendering` &rarr; `Product Rendering Services`.
  3. **`FAQPage` Schema**: Fully structured Q&A matching the accordion content for rich snippets on Google Search.

### Task 5: URL Redirection (`.htaccess`)
Apache `.htaccess` implements a **301 Permanent Redirect** to handle the URL change:
- **Old URL**: `https://professional3dservices.com/3d-rendering/product.html`
- **New URL**: `https://professional3dservices.com/3d-rendering/product-services.html`

Rule implementation:
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^3d-rendering/product\.html$ /3d-rendering/product-services.html [R=301,L,NC]
    RewriteRule ^product\.html$ product-services.html [R=301,L,NC]
</IfModule>
```

### Task 6: Website Performance & Core Web Vitals
- **Cumulative Layout Shift (CLS = 0)**: Explicit `width` and `height` attributes on all images and containers to eliminate layout shifts during page load.
- **Largest Contentful Paint (LCP)**: Hero visual loaded with `loading="eager"` and `fetchpriority="high"`, accompanied by `<link rel="preconnect">` for Google Fonts.
- **Offscreen Images**: Lazy loading applied via `loading="lazy"` on below-the-fold service card visuals.
- **Deflate / GZIP Compression**: Configured in `.htaccess` for HTML, CSS, JavaScript, SVG, and JSON.
- **Browser Caching**: `mod_expires` configured with 1-year cache headers for static assets and fonts.

---

## 4. How to Test & Preview Locally

### Option A: Using Built-in PHP Development Server
Run the following command in the project root:
```bash
php -S localhost:8000
```
Open your browser and navigate to:
```text
http://localhost:8000/product-services.html
```
Test form submissions directly against the PHP backend.

### Option B: Using Node.js / Local HTTP Server
Run any local static server:
```bash
npx serve .
```
Navigate to:
```text
http://localhost:3000/product-services.html
```

### Option C: Direct File Opening
Double-click `product-services.html` in your file explorer to open it in Chrome, Firefox, or Edge. All styles, responsive layouts, navigation drawer, and FAQ accordions will function immediately.

---

## 5. Verification Checklist

- [x] Responsive layout tested for Desktop (1440px, 1200px), Tablet (768px, 1024px), and Mobile (375px, 414px, 480px).
- [x] Global typography matches requirement: `DM Sans` at `18pt` base.
- [x] Mobile navigation hamburger opens/closes with backdrop dismiss.
- [x] FAQ accordion expands/collapses with ARIA updates.
- [x] Contact form blocks empty or malformed submissions on the frontend.
- [x] Contact form backend sanitizes inputs and validates emails/phone numbers in PHP.
- [x] Anti-spam honeypot and duplicate token prevention implemented.
- [x] Meta tags, Open Graph, and Twitter Cards populated.
- [x] JSON-LD `Service`, `BreadcrumbList`, and `FAQPage` schemas embedded.
- [x] Apache `.htaccess` contains 301 permanent redirect rules.
- [x] Clean, semantic, production-ready code with no external dependencies required.
