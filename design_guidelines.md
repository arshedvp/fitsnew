# FitsNew E-Commerce Design Guidelines

## Design Approach
**Reference-Based Approach** drawing from premium fashion e-commerce leaders: Nike (bold typography, product focus), Urbanic (clean layouts, strong imagery), AJIO (modern Indian e-commerce aesthetic), and H&M (accessible premium feel).

**Dual Brand Identity:**
- FitsNew: Modern, clean, premium contemporary fashion
- FitsAgain: Retro-modern fusion with vintage character and curated aesthetic

---

## Typography System

**Primary Font:** Inter or DM Sans (Google Fonts)
**Accent Font:** Space Grotesk or Archivo (for FitsAgain sections)

**Hierarchy:**
- Hero Headlines: text-5xl md:text-7xl, font-bold, tracking-tight
- Section Headers: text-3xl md:text-5xl, font-bold
- Product Titles: text-xl md:text-2xl, font-semibold
- Product Prices: text-2xl md:text-3xl, font-bold
- Body Text: text-base md:text-lg, leading-relaxed
- Buttons: text-sm md:text-base, font-semibold, uppercase tracking-wide
- Cart Items: text-sm, font-medium

---

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16, 24 for consistent rhythm
- Component padding: p-4 md:p-6
- Section spacing: py-12 md:py-24
- Grid gaps: gap-4 md:gap-6 lg:gap-8
- Container max-width: max-w-7xl mx-auto px-4 md:px-6

**Grid Systems:**
- Product Grid: grid-cols-2 md:grid-cols-3 lg:grid-cols-4
- Category Cards: grid-cols-2 lg:grid-cols-4
- Cart Layout: Single column on mobile, two-column desktop (items + summary)

---

## Component Library

### Navigation
- **Desktop:** Horizontal nav with centered logo, category links flanking, cart icon right
- **Mobile:** Hamburger menu, slide-in drawer, sticky header
- Logo placement: Centered, generous sizing (h-8 md:h-12)
- Cart badge: Absolute positioned counter with product count

### Hero Section
- Full-width banner: h-[60vh] md:h-[80vh]
- Large hero image with subtle parallax effect
- Centered overlay content with blurred background button (Shop Now CTA)
- Text: Large headline + subheadline + CTA button
- Image: Fashion model or product lifestyle shot showing brand aesthetic

### Product Cards
- Image: Aspect ratio 3:4, hover zoom effect (scale-105 transition)
- Quick view on hover (desktop): Overlay with "Add to Cart" + "WhatsApp Order"
- Product info: Title, Price (bold), Available sizes (small chips)
- WhatsApp icon button: Positioned top-right corner on card

### Product Detail Page
- **Layout:** Two-column desktop (image gallery left 60%, details right 40%)
- **Image Gallery:** Main image large, thumbnail strip below (5-6 images), click to expand
- **Details Section:** 
  - Product title (large, bold)
  - Price (prominent, 2x larger than body)
  - Size selector: Pill-style buttons (border, active state filled)
  - Quantity selector: Minimal +/- buttons
  - Two CTAs stacked: "Add to Cart" (primary), "Order on WhatsApp" (secondary with WhatsApp icon)
  - Accordion sections: Description, Size Guide, Care Instructions

### Cart System
- **Cart Drawer:** Slide-in from right, h-full, overlay backdrop
- **Cart Items:** Product thumbnail (small), title, size/qty selectors, price, remove icon
- **Summary:** Subtotal, item count, prominent "Checkout on WhatsApp" button (green accent with WhatsApp icon)
- **Empty State:** Icon, message, "Continue Shopping" link

### FitsAgain Section
- **Aesthetic:** Warm vintage filter overlay on images, serif accent typography
- **Layout:** Masonry grid or Pinterest-style staggered cards
- **Cards:** Polaroid-style with handwritten-feel captions
- **Badge:** "Vintage" or "Pre-loved" label on products
- **Color treatment:** Warmer tones, slightly desaturated imagery

### WhatsApp Integration
- **Icon Presence:** WhatsApp logo/icon on all order buttons (use Font Awesome or Heroicons)
- **Button Style:** Distinctive treatment - slightly rounded, icon + text
- **Placement:** Product page (below Add to Cart), Cart summary (primary CTA), Product cards (quick action)

### Admin Dashboard
- **Style:** Clean, utilitarian Material Design approach
- **Layout:** Sidebar navigation + main content area
- **Tables:** Striped rows, hover states, action buttons
- **Forms:** Clear labels, validation states, image upload preview

---

## Animations & Interactions

**Minimal, purposeful animations only:**
- Product card hover: scale-105, duration-300
- Cart drawer: Slide transition
- Image gallery: Fade transition between images
- Button states: Smooth hover/active scale (scale-95)
- Hero scroll: Subtle parallax on large screens

**No:** Complex scroll animations, page transitions, loading spinners beyond basics

---

## Responsive Behavior

**Breakpoints:**
- Mobile-first approach
- md: 768px (tablet)
- lg: 1024px (desktop)

**Mobile Optimizations:**
- Single column layouts
- Larger touch targets (min-h-12)
- Bottom sticky cart button on product pages
- Simplified navigation (hamburger)
- Full-width CTAs

---

## Images

**Required Images:**
1. **Hero Banner:** Full-width lifestyle shot of models wearing FitsNew clothing in urban/modern setting (bright, energetic, aspirational)
2. **Category Images:** 4-6 category tiles with product/lifestyle shots (Shirts, T-shirts, Pants, Jeans, Jackets, Vintage)
3. **Product Images:** Multiple angles per product (front, back, detail shots, styled on model)
4. **FitsAgain Hero:** Vintage aesthetic image - curated thrift items, warm tones, nostalgic setting
5. **Trending Section:** 3-4 featured products with lifestyle context

**Image Treatment:**
- High quality, consistent aspect ratios
- FitsNew: Bright, modern, clean backgrounds
- FitsAgain: Warm filters, textured backgrounds, vintage feel
- Product images: White or minimal backgrounds for clarity

---

## Accessibility

- Semantic HTML throughout
- ARIA labels on icon-only buttons
- Keyboard navigation for cart and menus
- Focus states: visible outline on all interactive elements
- Alt text on all product images
- Sufficient contrast ratios (AA standard minimum)