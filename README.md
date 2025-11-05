# ByteNest — Frontend UI/UX Project
Version: 1.0  
Language: English

## Overview
ByteNest is a front-end eCommerce UI project built with HTML, CSS, and JavaScript (ES6).  
The goal is to create a consistent, responsive, and accessible user interface with reusable components and a solid design system.

---

## Main Features
- Header with mega-menu (desktop) and mobile slide panel (ARIA supported)
- Hero, Featured Products, Categories, Testimonials, Blog sections
- Product cards with Add to Cart and Quick View actions
- Popup & Promo banners, Toast notifications
- Dark/Light mode and Language toggle (stored in localStorage)
- Fully responsive design with smooth animations

---

## Tech Stack
- Core: HTML5, CSS3 (CSS Variables), JavaScript (ES6)
- Icons: Bootstrap Icons
- Design Tool: Figma
- Hosting: Netlify / Vercel / GitHub Pages

---

## Folder Structure
/css
  /components      → individual component styles (header, popup, etc.)
  style.css        → main stylesheet
/js
  ui.js            → menu, i18n, mobile nav logic
  main.js, cart.js, theme.js, animations.js
/assets            → images, icons, favicon
index.html, products.html, blog.html, services.html, contact.html

---

## Quick Start

### Option 1 — Open directly
Simply double-click `index.html` to open it in your browser.

Access: http://localhost:8080


---

## Development Notes
- Edit color palette & tokens in `css/style.css` or `css/base.css`
- Popup styles: `css/components/popup.css`
- Mobile navigation & i18n: `js/ui.js`

---

## Style Guide
Token                  | Example Value
----------------------- | --------------
--color-primary         | #0EA5E9
--color-primary-dark    | #0284C7
--color-accent          | #06B6D4
--color-bg              | #F6FBFD
--color-text            | #0B1220

Typography: Inter / system-ui (Base: 16px)  
Spacing Scale: 8px  
Border Radius: 12–16px

---

## Accessibility
- Uses aria-expanded, aria-hidden, and role="dialog" for menus/panels
- ESC key and backdrop click close popups
- Minimum 44px tap targets for mobile actions

---

## Author
Đỗ Lý Anh Kiệt  
Email: kiet.2274802010451@vanlanguni.vn

---

Designed and developed as part of the UI/UX Design Project — ByteNest
