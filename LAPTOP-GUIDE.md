# Hướng dẫn cấu hình danh sách Laptop

## Mở file cần sửa

```
src/components/Laptop.tsx
```

Tìm mảng `products` (dòng ~24), cấu trúc mỗi sản phẩm như sau:

```ts
{
  id: 'mbp-m4',                    // ID duy nhất, không trùng
  name: 'MacBook Pro 14" M4 Pro', // Tên máy
  brand: 'Apple',                  // Thương hiệu (để trống nếu ko muốn lọc)
  image: '',                       // Để trống, sau này có thể gán URL ảnh
  cpu: 'Apple M4 Pro (12-core)',  // CPU
  ram: '24GB Unified',            // RAM
  storage: '512GB SSD',           // Ổ cứng
  display: '14.2" Liquid Retina', // Màn hình
  price: 44900000,                // Giá bán (VNĐ, chỉ số, ko có dấu phẩy)
  originalPrice: 54900000,        // Giá gốc (để gạch ngang), xoá dòng này nếu ko có
  rating: 5,                      // Số sao (1-5)
  badge: 'BESTSELLER',            // Nhãn góc phải (để trống hoặc xoá nếu ko cần)
}
```

## Các bước thêm máy mới

1. Copy block sản phẩm hiện có
2. Dán vào trong mảng `products` (trước dấu `]` cuối cùng)
3. Sửa các trường tương ứng
4. Đảm bảo `id` không trùng với máy khác

## Xoá / sửa máy

- **Xoá**: xoá block `{...}` của máy đó (nhớ xoá dấu phẩy cuối)
- **Sửa**: sửa trực tiếp giá trị các trường trong block

## Giá VNĐ

Viết liền không dấu phẩy, ví dụ:

| Giá         | Nhập vào       |
|-------------|----------------|
| 44,900,000₫ | `44900000`     |
| 33,900,000₫ | `33900000`     |
| 12,500,000₫ | `12500000`     |

## Bộ lọc thương hiệu

Nếu muốn thêm brand vào bộ lọc, sửa mảng `brands` (dòng ~137):

```ts
const brands = ['all', 'Dell', 'Lenovo', 'HP'];
```

Chỉ các brand có trong mảng này mới xuất hiện trên nút lọc.
