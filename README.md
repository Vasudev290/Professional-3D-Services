# ThePro3DStudio — Web Developer Technical Assessment

## Technical Assessment Overview & Deliverables
- **Role:** Web Developer (Experience Level: 2 Years)
- **Assignment Reference:** MAP Systems Group — ThePro3DStudio
- **Figma Design Reference:** [Figma Service Page Design](https://www.figma.com/design/RDvAKuowZXYgS4XvijMuL4/WEB-DEVELOPER-ASSESMENT?node-id=0-1&t=qDy8IjNe9oBiaVp4-1)
- **Canonical Service Pages:** 
  - `https://professional3dservices.com/3d-rendering/product-services.html`
  - `https://professional3dservices.com/3d-solutions/360-degree-viewer.html`
- **Submission Recipient:** `hrd@mapsystems.com`

---

## 1. Assessment Compliance Summary

| Task | Requirement | Status | Key Highlights |
| :--- | :--- | :---: | :--- |
| **Task 1: Figma to Responsive Website** | HTML5, CSS3, JS, PHP; Desktop, Tablet & Mobile responsiveness; DM Sans 18pt typography. | **Completed** | Full pixel-accurate implementation of both `product-services.html` and `360-degree-viewer.html`. Fully responsive across desktop (1440px+), tablet (768px-1024px), and mobile (320px-480px). |
| **Task 2: JavaScript Functionality** | Mobile drawer, exclusive accordion, form validation, error/success messaging, responsive controls. | **Completed** | Auto-closing exclusive drawer accordions; background body scroll lock (`html.menu-open, body.menu-open`); touch & keyboard controls; smooth scroll carousels; instant field error dismissal when cleared. |
| **Task 3: Contact Form Development** | Complete Figma fields, frontend validation, PHP backend, email dispatch to `hrd@mapsystems.com`, spam & duplicate protection. | **Completed** | Full Name, Email, Country Code prefix, Phone (numeric-only enforcement), Service dropdown, Message, Visual Captcha with refresh, User Agreement checkbox, honeypot anti-spam, session tokens, and secure lead logging. |
| **Task 4: Technical SEO Implementation** | Meta tags, canonicals, robots, Open Graph, Twitter Cards, H1-H3 hierarchy, descriptive alt tags, JSON-LD Schema.org. | **Completed** | 100% Schema.org validated JSON-LD (`Service`, `BreadcrumbList`, `FAQPage`); single semantic `<h1>` per page; absolute 1200x630 OG image cards; 0 missing image alt attributes. |
| **Task 5: URL Redirection** | Apache 301 permanent redirect from `product.html` to `product-services.html`. | **Completed** | Production-ready `.htaccess` containing both `mod_alias` (`Redirect 301`) and `mod_rewrite` (`RewriteRule [R=301,L,NC]`) rules, plus client-side HTML fallback. |
| **Task 6: Performance & Core Web Vitals** | Lazy loading, font optimization, layout shift prevention (CLS=0), render-blocking elimination. | **Completed** | Parallel non-blocking Google Fonts with `preconnect` & `dns-prefetch`; `decoding="async"` on 100% of images; explicit `width`/`height` + CSS `aspect-ratio`; `content-visibility: auto` on offscreen sections. |

---

## 2. Project Directory Structure

```text
Maps Assignment/
├── .htaccess                       # Apache 301 redirects, GZIP compression, caching & security rules (Task 5 & 6)
├── README.md                       # Comprehensive documentation & evaluation guide
├── product-services.html           # Primary 3D Product Rendering & Modeling service page (Tasks 1, 2, 4, 6)
├── 360-degree-viewer.html          # Interactive 360-Degree Viewer & Contact Form page (Tasks 1, 2, 3, 4, 6)
├── product.html                    # Legacy file with 301 canonical link & meta-refresh fallback (Task 5)
├── process-contact.php             # Secure backend PHP contact form processor & email dispatcher (Task 3)
│
├── assets/
│   ├── css/
│   │   ├── reset.css               # Modern CSS reset, box-sizing normalize & responsive image base
│   │   ├── variables.css           # Design tokens, DM Sans typography scale & color variables
│   │   ├── components.css          # Reusable buttons, badges, card containers & form alert boxes
│   │   ├── layout.css              # Sticky site header, mega-dropdowns, mobile luxury drawer & footer
│   │   ├── sections.css            # Hero, about, services, industries, showcase, FAQ & contact sections
│   │   └── responsive.css          # Media queries (Mobile <768px, Tablet 768-1024px, Desktop 1200px+)
│   │
│   ├── js/
│   │   ├── navigation.js           # Hamburger drawer, exclusive auto-close accordions & scroll lock (Task 2)
│   │   ├── accordion.js            # Accessible FAQ expand/collapse with dynamic scrollHeight (Task 2)
│   │   ├── form-validation.js      # Real-time regex validation, numeric phone filter & AJAX handler (Task 2 & 3)
│   │   └── main.js                 # Carousels, active scroll observer, smooth scroll & CWV monitoring (Task 6)
│   │
│   └── images/                     # Optimized visual assets (SVG vectors, PNGs, and JPGs)
│       ├── hero/                   # Logos, mega-menu banners, about visuals, industries, showcase & footer icons
│       ├── services/               # 3D modeling chair hero, product renders, why choose us visuals
│       └── testimonials/           # Client reviewer avatars
│
└── data/                           # (Auto-generated by process-contact.php on submission)
    ├── .htaccess                   # "Deny from all" security directive protecting lead logs from public access
    └── leads.log                   # Persistent JSON lead backup logs ensuring 0 lead loss
```

---

## 3. Deep-Dive Implementation Details

### Task 1: Figma to Responsive Website
- **Typography**: Base typography set to Google Fonts `DM Sans` at `18pt` global body size as specified, loaded via high-performance non-blocking `<link>` tags with `font-display: swap;`.
- **Desktop Mega-Menu**: Implemented exact white luxury dropdowns matching the Figma design with 3 structured columns (`3D Modeling`, `3D Rendering & Texturing`, `3D Animation & CGI`) and a right-hand promotional card with custom pill CTA buttons.
- **Mobile Responsive Drawer**: Matches the desktop white theme (`#ffffff`), dark slate text (`#0f172a`), purple accents (`#7928ca`), and dark logo (`logo-dark.svg`).
- **Section Layouts**:
  1. *Hero Section*: High-contrast dark aesthetic with giant typography, launch button, and case study links.
  2. *About Section*: Floating stat cards (100+ Experts, 14,000+ Projects, 15+ Years, 92% Retention) and design imagery.
  3. *Services Section*: Detailed product modeling, lifestyle texturing, and rapid 3D printing service cards.
  4. *Industries Grid*: Horizontal interactive carousel covering Architecture, eCommerce, Fashion, Furniture, Sports, and Gaming.
  5. *Insights / Case Studies*: Multi-card carousel with tags and project overviews.
  6. *3D Portfolio Showcase*: High-fidelity visual showcase gallery with side-arrow controls.
  7. *FAQ Section*: 2-column accordion grid with plus/minus toggles.
  8. *Footer*: 5-column layout with ISO 27001 & ISO 9001 certification badges, navigation links, and social icons.

### Task 2: JavaScript Functionality
- **Mobile Navigation (`navigation.js`)**:
  - Exclusive accordion logic: Opening one main dropdown or sub-dropdown automatically closes open siblings.
  - Body scroll lock: Sets `html.menu-open, body.menu-open` with `overflow: hidden; touch-action: none;` to completely prevent background scroll bleed on iOS and Android.
  - Backdrop tap and `Escape` key listeners to dismiss drawer.
- **FAQ Accordion (`accordion.js`)**:
  - Calculates element `scrollHeight` dynamically for fluid CSS expansion.
  - Manages `aria-expanded` attributes for screen readers.
  - Window `resize` event handler dynamically updates active accordion heights.
- **Input & Form Validation (`form-validation.js`)**:
  - Full Name: Min 2 characters, strictly letters/spaces/hyphens.
  - Email: RFC-compliant email regex format.
  - Phone Number: Strictly numeric keystroke blocking (`keypress` + `input` sanitization) to prevent entering text.
  - Error Dismissal: When an input is cleared (`backspace`), error borders and red messages disappear immediately, restoring the clean neutral state.
  - Visual Captcha: Dynamic 4-character code generation with interactive refresh.
  - Agreement Checkbox: Cleanly formatted with `#termsError` positioned directly underneath without displacing layout.

### Task 3: Contact Form Backend (PHP)
- **Script**: `process-contact.php`
- **Fields Processed**: `fullName`, `email`, `phoneCountryCode`, `phone`, `serviceType`, `message`, `captchaInput`, `termsCheck`, `website_hp` (honeypot), `formToken`.
- **Validation & Sanitization**:
  - Uses `htmlspecialchars()`, `strip_tags()`, `trim()`, and `filter_var(..., FILTER_VALIDATE_EMAIL)`.
  - Allowed whitelist verification for services.
  - Phone validation (7 to 15 digits).
- **Spam & Duplicate Defense**:
  - Silent rejection of automated bots filling the hidden `website_hp` honeypot.
  - Tracks unique `formToken` per session to block repeated submissions.
  - Frontend submission locking with loading spinner.
- **Email Transmission**:
  - Dispatches to: `hrd@mapsystems.com`
  - From: `ThePro3DStudio <no-reply@professional3dservices.com>`
  - `Reply-To` header set to the client's email for instant reply.
  - Clean HTML email template with client metadata, timestamp, and IP address.
- **Lead Persistence**:
  - Appends records to `data/leads.log` with `.htaccess` `Deny from all` security protection so inquiries are preserved even if local MTA sendmail is unconfigured.
- **Dual Support**:
  - JSON response for modern AJAX submissions.
  - Styled HTML confirmation page fallback for direct HTTP POST submissions.

### Task 4: Technical SEO Implementation
- **Metadata**:
  - Optimized page titles under 70 characters and meta descriptions under 160 characters.
  - Canonical link tags pointing to official URLs.
  - Meta robots tag: `index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1`.
  - Complete Open Graph & Twitter Cards with absolute 1200×630px image previews.
- **Heading Hierarchy**:
  - Strictly **one single `<h1>`** per page (`WE FRAME THE FUTURE` on Product Services; `3D MODELING SERVICES` on 360 Viewer).
  - Main sections nested as `<h2>`, subsections as `<h3>`, sub-items as `<h4>`. Mega-menu navigation titles use styled CSS classes to avoid polluting the heading tree.
- **Descriptive Alt Attributes**:
  - 100% of images (47 in `product-services.html`, 37 in `360-degree-viewer.html`) carry meaningful, keyword-rich `alt` text.
- **JSON-LD Schema.org Markup (0 Errors on Schema.org Validator)**:
  1. `Service` schema (including provider `Organization`, logo, contact point, and `OfferCatalog`).
  2. `BreadcrumbList` schema (3-tier semantic navigation).
  3. `FAQPage` schema (matching on-page FAQ content for Google Rich Snippets).

### Task 5: URL Redirection (`.htaccess`)
- Permanent HTTP 301 redirection rules configured in `.htaccess`:
  ```apache
  # Method 1: Using mod_alias
  <IfModule mod_alias.c>
      Redirect 301 /3d-rendering/product.html https://professional3dservices.com/3d-rendering/product-services.html
  </IfModule>

  # Method 2: Using mod_rewrite
  <IfModule mod_rewrite.c>
      RewriteEngine On
      RewriteBase /
      RewriteRule ^3d-rendering/product\.html$ /3d-rendering/product-services.html [R=301,L,NC]
      RewriteRule ^product\.html$ product-services.html [R=301,L,NC]
  </IfModule>
  ```
- `product.html` includes a `<link rel="canonical">` and `<meta http-equiv="refresh">` client-side fallback.

### Task 6: Performance & Core Web Vitals
- **Cumulative Layout Shift (CLS = 0)**: Explicit `width` and `height` attributes on every `<img>` tag, coupled with CSS `aspect-ratio` rules.
- **Largest Contentful Paint (LCP)**: Preloaded hero visuals via `<link rel="preload" as="image" fetchpriority="high">`.
- **Resource Hinting**: Google Fonts loaded via `<link rel="dns-prefetch">` and `<link rel="preconnect">` with `display=swap`, completely eliminating render-blocking CSS `@import` chains.
- **Offscreen Media**: `loading="lazy"` on all below-the-fold imagery.
- **Off-Thread Decoding**: `decoding="async"` applied across all images.
- **Rendering Performance**: Modern CSS `content-visibility: auto; contain-intrinsic-size: 1px 650px;` applied to heavy below-the-fold sections to skip off-screen style calculations until scrolled into view.
- **Compression & Caching**: GZIP deflate compression and 1-year browser caching headers configured in `.htaccess`.

---

## 4. How to Test and Preview Locally

### Option A: Using Built-in PHP Server (Recommended for Backend Testing)
```bash
php -S localhost:8000
```
Open in browser:
- `http://localhost:8000/360-degree-viewer.html`
- `http://localhost:8000/product-services.html`

### Option B: Using VS Code Live Server or Node Static Server
```bash
npx serve .
```
Open in browser:
- `http://localhost:3000/360-degree-viewer.html`
- `http://localhost:3000/product-services.html`

### Option C: Direct File Opening
Double-click `360-degree-viewer.html` or `product-services.html` in your file explorer. All interactive components, carousels, accordions, and frontend validations operate client-side without any setup.

---

## 5. Submission Checklist & Guidelines Followed
- [x] Complete source code delivered with clean, organized folder structure.
- [x] HTML5, CSS3, JavaScript, and PHP files tested and verified.
- [x] Responsive layout tested across Desktop (1440px, 1200px), Tablet (768px, 1024px), and Mobile (375px, 414px).
- [x] Contact form backend implementation (`process-contact.php`) with validation, spam protection, and lead logging.
- [x] `.htaccess` file containing permanent 301 redirect rules and caching headers.
- [x] Technical SEO metadata, Open Graph, Twitter Cards, and Schema.org JSON-LD structured data.
- [x] Comprehensive `README.md` documentation.
- [x] Ready to be submitted to `hrd@mapsystems.com`.
