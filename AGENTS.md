# 🤖 AGENT RULES & SPECIFICATION — GeminiFlow Sales Landing Page

> File này định nghĩa các quy tắc phát triển, cấu trúc kỹ thuật và ràng buộc hoạt động cho tất cả các AI Agent khi làm việc trên repository **google-ai-productivity**.

---

## 📌 Project Overview
- **Name:** GeminiFlow Sales Landing Page
- **Tech Stack:** Vite + React 19 + TypeScript
- **Styling:** Tailwind CSS v4 (class-based, CSS-first config)
- **Deployment:** GitHub Pages (Static hosting)

---

## ⚠️ Critical Development Constraints (MUST FOLLOW)

### 1. Client-Side Routing
- **Constraint:** Phải sử dụng **Hash routing** (`#/laptop-us`, `#about`, etc.) được điều khiển qua sự kiện `hashchange` trong `src/App.tsx`.
- **Reason:** GitHub Pages không hỗ trợ cấu hình server-side fallback cho Single Page Apps (SPA) sử dụng Path routing. Nếu đổi sang `/laptop-us`, khi người dùng truy cập trực tiếp hoặc reload trang sẽ bị lỗi **404 Not Found**.
- **Action:** TUYỆT ĐỐI không thay thế bằng `BrowserRouter` hay path-based routing thông thường.

### 2. Vite Base URL
- **Constraint:** Trong `vite.config.ts`, giá trị `base` phải luôn được đặt là `'./'` (relative path).
- **Reason:** Đảm bảo trang web tải đúng tài nguyên (JS, CSS, hình ảnh) dù được host dưới dạng root domain (ví dụ: `https://domain.com/`) hay subfolder của GitHub Pages (ví dụ: `https://username.github.io/repo-name/`).

### 3. Tailwind CSS v4 Configuration
- **Constraint:** Dự án sử dụng Tailwind CSS v4 (được tích hợp thông qua `@tailwindcss/vite` ở `vite.config.ts`).
- **Reason:** Tailwind v4 không sử dụng file `tailwind.config.js` hay `tailwind.config.ts`. Thay vào đó, toàn bộ custom theme, font, animation và variable được cấu hình trực tiếp trong file CSS bằng cú pháp CSS-first (tại `src/index.css` sử dụng quy tắc `@theme`).
- **Action:** Không tạo file `tailwind.config.js` truyền thống. Nếu cần chỉnh sửa theme, hãy chỉnh sửa trong block `@theme` của `src/index.css`.

### 4. Gradient Text on Dark Backgrounds
- **Constraint:** Khi thiết kế text gradient trên nền tối, tránh sử dụng `google-indigo` (hoặc các màu tương tự) làm điểm cuối gradient.
- **Reason:** Màu `google-indigo` (xấp xỉ `#3949AB`) rất tối và sẽ bị chìm nghỉm, biến mất vào nền tối `bg-slate-950`.
- **Action:** Dùng các màu sáng hơn như `sky-300` hoặc `blue-400` để làm sáng chữ ở cuối gradient.
  - *Ví dụ chuẩn:* `<span className="bg-gradient-to-r from-google-blue via-blue-400 to-sky-300 bg-clip-text text-transparent">Mỹ về</span>`

### 5. Floating Banner (Chỉ áp dụng cho Trang chủ)
- **Constraint:** Banner nổi giới thiệu gói dịch vụ chỉ hiển thị trên trang chủ (`/` hoặc `#`), không hiển thị trên trang phụ `#/laptop-us`.
- **Ràng buộc vị trí & drag:**
  - Drag giới hạn theo trục dọc (Y-axis), vị trí ngang cố định ở bên phải (`right: 4px`).
  - Điểm giới hạn phía trên (`top` clamp min): `74px` để không đè lên thanh Navbar.
  - Điểm giới hạn phía dưới (`top` clamp max): `window.innerHeight - 132 - 140` để không đè lên nút Zalo chat và Back-to-top ở góc dưới cùng bên phải.
  - Trạng thái hoạt động (indicator dot): Sử dụng màu xanh lá (`bg-google-green`), **không** sử dụng màu đỏ.
  - Không có text CTA bên dưới (chữ "ĐĂNG KÝ NGAY" đã được gỡ bỏ). Khi click vào banner, trang web sẽ scroll đến form liên hệ và tự động chọn gói thích hợp (`intent='buy'`, `role='opt5'`).

### 6. Danh sách sản phẩm Laptop (`src/components/Laptop.tsx`)
- Khi thêm mới hoặc sửa đổi sản phẩm Laptop, cần tuân thủ cấu trúc dữ liệu sau:
  - `id`: Định danh duy nhất (string, ví dụ: `'dell-xps-13'`).
  - `price`: Phải là kiểu dữ liệu số (`number`), viết liền không dấu phân cách (ví dụ: `44900000` thay vì `"44,900,000"`). Điều này rất quan trọng để bộ lọc khoảng giá hoạt động chính xác.
  - Bộ lọc thương hiệu: Nếu thêm một hãng mới (ví dụ: `Asus`), hãy thêm chuỗi tương ứng vào mảng `brands` ở dòng ~137 (`const brands = ['all', 'Dell', 'Lenovo', 'HP', 'Asus'];`).

---

## 📞 Contact Information & Links
Nếu cần hiển thị hoặc cập nhật thông tin liên hệ, hãy sử dụng chính xác các giá trị cấu hình sau:
- **Zalo (VI):** `098 938 2090`
- **Zalo (EN/International):** `+84 98 938 2090`
- **Email:** `kenngo.mmo@gmail.com`
- **Zalo Link Format:** `https://zalo.me/0989382090` (không chứa dấu cách, dấu cộng, hoặc dấu chấm).

---

## 🚀 GitHub Pages Deployment Steps

### Deploy thủ công (Local)
1. Chạy lệnh: `npm run deploy`
2. Lệnh này thực chất sẽ kích hoạt script:
   - `predeploy`: `npm run build` (Biên dịch TypeScript và build code thông qua Vite vào thư mục `dist/`).
   - `deploy`: `gh-pages -d dist` (Sử dụng package `gh-pages` để đẩy toàn bộ file trong `dist/` lên nhánh `gh-pages` trên GitHub).

### Deploy tự động (GitHub Actions)
- Mỗi khi đẩy code lên nhánh chính (`main` hoặc `master`), workflow tại `.github/workflows/deploy.yml` sẽ tự động khởi chạy, build dự án và deploy lên nhánh `gh-pages`.
