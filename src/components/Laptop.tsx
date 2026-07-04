import { useState } from 'react';
import { Laptop, Cpu, HardDrive, Monitor, Star, ShoppingCart } from 'lucide-react';

interface LaptopProduct {
  id: string;
  name: string;
  brand: string;
  image: string;
  cpu: string;
  ram: string;
  storage: string;
  display: string;
  price: number;
  originalPrice?: number;
  rating: number;
  badge?: string;
}

interface LaptopSectionProps {
  onBuyClick: (productName: string) => void;
}

export default function LaptopSection({ onBuyClick }: LaptopSectionProps) {
  const [selectedBrand, setSelectedBrand] = useState<string>('all');

  const products: LaptopProduct[] = [
    {
      id: 'mbp-m4',
      name: 'MacBook Pro 14" M4 Pro',
      brand: 'Apple',
      image: '',
      cpu: 'Apple M4 Pro (12-core)',
      ram: '24GB Unified',
      storage: '512GB SSD',
      display: '14.2" Liquid Retina XDR',
      price: 44900000,
      originalPrice: 54900000,
      rating: 5,
      badge: 'BESTSELLER',
    },
    {
      id: 'xps-15',
      name: 'Dell XPS 15 Intel Ultra 9',
      brand: 'Dell',
      image: '',
      cpu: 'Intel Core Ultra 9 185H',
      ram: '32GB DDR5',
      storage: '1TB NVMe SSD',
      display: '15.6" OLED 3.5K Touch',
      price: 39900000,
      originalPrice: 49900000,
      rating: 4,
      badge: '-20%',
    },
    {
      id: 'rog-zephyrus',
      name: 'ASUS ROG Zephyrus G16',
      brand: 'ASUS',
      image: '',
      cpu: 'AMD Ryzen 9 7940HS',
      ram: '16GB DDR5',
      storage: '1TB NVMe SSD',
      display: '16" QHD+ 240Hz',
      price: 47900000,
      originalPrice: 59900000,
      rating: 5,
      badge: 'GAMING',
    },
    {
      id: 'thinkpad-x1',
      name: 'Lenovo ThinkPad X1 Carbon Gen 12',
      brand: 'Lenovo',
      image: '',
      cpu: 'Intel Core Ultra 7 155H',
      ram: '32GB LPDDR5',
      storage: '512GB NVMe SSD',
      display: '14" WUXGA IPS Low Power',
      price: 33900000,
      originalPrice: 42900000,
      rating: 4,
      badge: 'BUSINESS',
    },
    {
      id: 'surface-laptop-6',
      name: 'Microsoft Surface Laptop 6',
      brand: 'Microsoft',
      image: '',
      cpu: 'Intel Core Ultra 7 165H',
      ram: '16GB LPDDR5x',
      storage: '512GB NVMe SSD',
      display: '15" PixelSense Touch',
      price: 32900000,
      originalPrice: 39900000,
      rating: 4,
    },
    {
      id: 'gram-17',
      name: 'LG Gram 17" Intel Ultra 7',
      brand: 'LG',
      image: '',
      cpu: 'Intel Core Ultra 7 155H',
      ram: '16GB LPDDR5x',
      storage: '512GB NVMe SSD',
      display: '17" WQXGA IPS',
      price: 28900000,
      originalPrice: 37900000,
      rating: 3,
      badge: 'SIÊU NHẸ',
    },
    {
      id: 'galaxy-book-4',
      name: 'Samsung Galaxy Book4 Pro 360',
      brand: 'Samsung',
      image: '',
      cpu: 'Intel Core Ultra 7 155H',
      ram: '16GB LPDDR5x',
      storage: '512GB NVMe SSD',
      display: '16" AMOLED Touch 120Hz',
      price: 31900000,
      originalPrice: 41900000,
      rating: 4,
    },
    {
      id: 'hp-spectre',
      name: 'HP Spectre x360 16"',
      brand: 'HP',
      image: '',
      cpu: 'Intel Core Ultra 7 155H',
      ram: '16GB LPDDR5x',
      storage: '1TB NVMe SSD',
      display: '16" 3K+ OLED Touch',
      price: 34900000,
      originalPrice: 43900000,
      rating: 5,
      badge: '2-IN-1',
    },
  ];

  const brands = ['all', 'Dell', 'Lenovo', 'HP'];

  const filtered = selectedBrand === 'all'
    ? products
    : products.filter((p) => p.brand === selectedBrand);

  const renderStars = (n: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < n ? 'text-google-yellow fill-google-yellow' : 'text-slate-600'}`}
      />
    ));

  return (
    <section id="laptop" className="pt-6 pb-20 relative">
      <div className="glow-spot glow-blue w-[400px] h-[400px] top-[10%] left-[-80px] opacity-30"></div>
      <div className="glow-spot glow-purple w-[400px] h-[400px] bottom-[10%] right-[-80px] opacity-30"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-google-blue mb-4">
            <Laptop className="h-3.5 w-3.5" />
            <span>Laptop US - Hàng Mỹ chính hãng</span>
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
            Laptop Giá Tốt Nhất từ{' '}
            <span className="bg-gradient-to-r from-google-blue via-blue-400 to-sky-300 bg-clip-text text-transparent">
              Mỹ về
            </span>
          </h2>
          <p className="text-slate-400 mt-4 text-base sm:text-lg font-light">
            Laptop Mỹ chính hãng, cấu hình cao, giá tốt. Bảo hành 12 tháng, hỗ trợ trả góp.
          </p>
        </div>

        {/* Brand Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition duration-200 cursor-pointer ${
                selectedBrand === brand
                  ? 'bg-google-blue text-white shadow-lg shadow-blue-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              {brand === 'all' ? 'Tất cả' : brand}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="glass-panel rounded-2xl border border-slate-900 overflow-hidden group hover:border-slate-800 hover:bg-slate-900/30 transition duration-300 flex flex-col"
            >
              {/* Image Placeholder */}
              <div className="relative h-48 bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                <div className="flex flex-col items-center space-y-2 text-slate-600 group-hover:text-slate-500 transition">
                  <Laptop className="h-16 w-16" />
                  <span className="text-[10px] font-mono">{product.brand}</span>
                </div>
                {product.badge && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider bg-google-red text-white animate-pulse">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-heading font-bold text-sm text-white group-hover:text-google-blue transition">
                  {product.name}
                </h3>

                <div className="mt-3 space-y-1.5 text-[11px] text-slate-400">
                  <div className="flex items-center space-x-2">
                    <Cpu className="h-3 w-3 shrink-0" />
                    <span>{product.cpu}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <HardDrive className="h-3 w-3 shrink-0" />
                    <span>{product.ram} / {product.storage}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Monitor className="h-3 w-3 shrink-0" />
                    <span>{product.display}</span>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-1 mt-3">
                  {renderStars(product.rating)}
                </div>

                {/* Price */}
                <div className="flex items-baseline space-x-2 mt-3">
                    <span className="text-lg font-extrabold text-white">
                      {product.price.toLocaleString()}₫
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-slate-500 line-through">
                        {product.originalPrice.toLocaleString()}₫
                      </span>
                    )}
                </div>

                {/* CTA */}
                <div className="mt-auto pt-4">
                  <button
                    onClick={() => onBuyClick(product.name)}
                    className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-lg bg-gradient-to-r from-google-blue to-blue-600 hover:brightness-110 text-white font-semibold text-xs transition duration-200 cursor-pointer"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    <span>Liên hệ mua ngay</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
