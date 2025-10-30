# ByteNest — Frontend UI/UX Project

Phiên bản: 1.0  
Ngôn ngữ: Tiếng Việt

## Giới thiệu ngắn
ByteNest là dự án giao diện website thương mại điện tử (front-end) được phát triển như một đồ án thiết kế UI/UX và triển khai bằng HTML/CSS/JS. Mục tiêu: tạo giao diện nhất quán, responsive, thân thiện trên di động, có hệ thống style-guide và các component tái sử dụng.

## Tính năng chính
- Header/mega-menu cho desktop, mobile slide-panel cho điện thoại (ARIA + focus management).  
- Hero, Featured Products, Categories Grid, Testimonials, Blog.  
- Product card với CTA (Thêm giỏ hàng, Xem nhanh).  
- Popup / Promo, Toast notifications.  
- Theme toggle (Dark/Light), Language toggle (i18n), lưu lựa chọn vào localStorage.  
- Responsive (desktop / tablet / mobile) với animation mượt cho menu và popup.

## Công nghệ sử dụng
- HTML5, CSS3 (CSS Variables), JavaScript (ES6).  
- Icons: bootstrap-icons.  
- Công cụ thiết kế: Figma.  
- Hosting: Netlify / Vercel / GitHub Pages (khuyến nghị Netlify/Vercel).

## Cấu trúc thư mục (tổng quan)
- /css
  - /components — các thành phần (header.css, popup.css, ...)
  - style.css (tổng hợp)
- /js
  - ui.js (menu, i18n, mobile nav)
  - main.js, cart.js, theme.js, animations.js
- /assets — ảnh, favicon, icons
- index.html, products.html, blog.html, services.html, contact.html, create-account.html
- README.md

## Quick start (Chạy local)
Yêu cầu: trình duyệt hiện đại. (Nếu muốn dev server: Node.js hoặc Python).

1. Mở nhanh:
   - Mở file `index.html` trực tiếp bằng trình duyệt (double-click).
2. Hoặc chạy server (Windows / Terminal):
   - Với Python: 
     - Mở terminal tại thư mục dự án và chạy:
       ```
       python -m http.server 8080
       ```
     - Truy cập: http://localhost:8080
   - Với npm (serve):
     ```
     npx http-server . -p 8080
     ```
3. Sử dụng Live Server extension trong VS Code (khuyến nghị cho dev).

## Thao tác phát triển
- Màu chủ đạo và token CSS: chỉnh trong `css/style.css` hoặc `css/base.css` (biến :root).  
- Popup styles: `css/components/popup.css`.  
- Mobile nav & i18n: `js/ui.js`.  
- Thêm/điều chỉnh component => cập nhật style và class tương ứng trong CSS.

## Style Guide (tóm tắt)
- Palette:
  - --color-primary: #0EA5E9
  - --color-primary-dark: #0284C7
  - --color-accent: #06B6D4
  - --color-bg: #F6FBFD
  - --color-surface: #EFF6FA
  - --color-text: #0B1220
- Typography: Inter (hoặc system-ui), body 16px, H1 responsive 48/36/28.
- Spacing base: 8px scale, border-radius 12–16px.

> Đổi palette: tìm `:root` trong `css/style.css` hoặc `css/base.css` và sửa giá trị biến.

## Accessibility & Best practices
- Menu sử dụng `aria-expanded`, `aria-hidden`, role="dialog" cho mobile panel.  
- ESC key & backdrop click đóng menu/popup.  
- Tap targets tối thiểu 44px cho mobile CTA.  
- Kiểm tra contrast với Lighthouse / axe.

## Kiểm thử
- Thử trên breakpoint: 320px (iPhone SE), 360px, 412px (Pixel), 768px (tablet), 1200px (desktop).  
- Kiểm tra: mở/đóng mobile menu, thêm giỏ hàng (toast), popup promo, theme toggle, i18n toggle.

## Triển khai
- GitHub + Netlify/Vercel:
  - Push repo lên GitHub.
  - Kết nối repo với Netlify hoặc Vercel, cấu hình build (nếu không có build step thì dùng publish root).  
- Cấu hình tối ưu: bật gzip/Brotli, cache headers, cấu hình meta tags SEO.

## Hướng dẫn đóng góp
- Branching: `main` (production), `develop`, `feature/...`.  
- Commit message theo Conventional Commits.  
- Pull request: mô tả thay đổi, liên quan file CSS/JS/HTML.

## Vấn đề thường gặp & xử lý nhanh
- Styles không cập nhật: clear cache hoặc hard reload (Ctrl+F5).  
- Popup không hiển thị: kiểm tra class `.popup-overlay.active` và console JS.  
- Mobile menu không mở: kiểm tra `id="mobileNav"` tồn tại và `js/ui.js` được load.

## Tài liệu tham khảo
- Nielsen Norman Group — UX principles.  
- WCAG 2.1 — Accessibility.  
- Google Lighthouse — performance & accessibility.  
- Material Design & Figma docs.

## Liên hệ
- Tác giả / Người thực hiện: Đỗ Lý Anh Kiệt  
- Email: kiet.2274802010451@vanlanguni.vn

---

File liên quan bạn có thể muốn chỉnh:
- `css/components/popup.css` — popup styling (đã có sẵn).  
- `css/style.css` hoặc `css/base.css` — palette & typography tokens.  
- `js/ui.js` — mobile nav, i18n, toggle logic.

Nếu bạn muốn, tôi có thể:
- 1) Tự động cập nhật `:root` palette trong `css/style.css` (gửi patch).  
- 2) Thêm phần hướng dẫn triển khai CI/CD (Netlify/Vercel) cụ thể.  
Chọn 1 hoặc 2 để tôi thực hiện tiếp.
