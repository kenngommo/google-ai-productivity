export interface AffiliateProduct {
  id: string;
  platform: 'Shopee' | 'TikTok' | 'Lazada' | string;
  category: string;
  subCategory: string;
  name: string;
  notes?: string;
  active?: boolean;
  link: string;
  currentPrice: number;
  highestPrice: number;
  lowestPrice?: number;
  targetPrice?: number; // Recommended target price
  imageUrl?: string;
  lastUpdated?: string;
  priceHistory?: Array<{ timestamp: string; price: number }>;
}

const STORAGE_KEY = 'geminiflow_affiliate_db_v1';
const SHEET_URL_KEY = 'geminiflow_affiliate_sheet_url';
export const DEFAULT_GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/18-G0at73MdKwmYIdtAt3h8pPMtse4ZdDneis0M-cXK4/export?format=csv';

import defaultProducts from '../data/affiliate-db.json';

// Default initial dataset adhering to user's Google Sheet schema
export const INITIAL_AFFILIATE_PRODUCTS: AffiliateProduct[] = defaultProducts as AffiliateProduct[];


// Helper to load products from LocalStorage or return Initial
export function getLocalAffiliateProducts(): AffiliateProduct[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const hasDummy = parsed.some((p: any) => 
          p.name?.includes('Dell XPS') || 
          p.currentPrice < 1000 ||
          p.imageUrl?.includes('unsplash.com') // invalidate old fake unsplash images
        );
        if (!hasDummy) return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse affiliate products from localStorage', e);
  }
  saveLocalAffiliateProducts(INITIAL_AFFILIATE_PRODUCTS);
  return INITIAL_AFFILIATE_PRODUCTS;
}


export function saveLocalAffiliateProducts(products: AffiliateProduct[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (e) {
    console.error('Failed to save affiliate products to localStorage', e);
  }
}

export function getSavedSheetUrl(): string {
  return localStorage.getItem(SHEET_URL_KEY) || DEFAULT_GOOGLE_SHEET_URL;
}

export function saveSheetUrl(url: string) {
  localStorage.setItem(SHEET_URL_KEY, url.trim());
}

export function autoDetectCategoryAndSubCategory(notes: string, link: string): { category: string; subCategory: string } {
  const text = (notes + ' ' + link).toLowerCase();

  // Bàn ghế, nội thất, đồ dùng gia đình
  if (/bàn|ghế|nội thất|tủ|giường|lumini|sofa|đèn|kệ/.test(text)) {
    return { category: 'Nội thất & Gia dụng', subCategory: 'Bàn ghế & Nội thất' };
  }
  // Giặt giũ, hóa mỹ phẩm, tẩy rửa
  if (/nước giặt|ariel|comfort|omo|giặt|tẩy|dầu gội|sữa tắm|kem đánh răng/.test(text)) {
    return { category: 'Bách hóa & Hóa mỹ phẩm', subCategory: 'Giặt giũ & Chăm sóc nhà cửa' };
  }
  // Laptop & Máy tính
  if (/laptop|dell|hp|lenovo|macbook|máy tính|pc|asus|acer|msi/.test(text)) {
    return { category: 'Công nghệ & Điện tử', subCategory: 'Laptop & Máy tính' };
  }
  // Tai nghe & Âm thanh
  if (/tai nghe|sony|bluetooth|soundbar|loa|airpods|headphone/.test(text)) {
    return { category: 'Công nghệ & Điện tử', subCategory: 'Tai nghe & Âm thanh' };
  }
  // Điện thoại & Phụ kiện
  if (/điện thoại|iphone|samsung|xiaomi|ốp|sạc|cáp|pin dự phòng/.test(text)) {
    return { category: 'Công nghệ & Điện tử', subCategory: 'Điện thoại & Phụ kiện' };
  }
  // Nồi chiên, thiết bị nhà bếp, gia dụng thông minh
  if (/nồi|bếp|chiên|robot|hút bụi|dreame|philips|máy rửa bát/.test(text)) {
    return { category: 'Gia dụng & Đời sống', subCategory: 'Thiết bị thông minh & Bếp' };
  }
  // Thời trang
  if (/áo|quần|váy|giày|dép|túi|ví|nón|đồng hồ/.test(text)) {
    return { category: 'Thời trang & Phụ kiện', subCategory: 'Trang phục & Phụ kiện' };
  }

  return { category: 'Sản phẩm Tiêu dùng', subCategory: 'Tổng hợp' };
}

// Parse Google Sheet CSV output
// Columns expected: ID, Platform, Category, Sub-category, Notes, Active, Product Link, Current Price, Highest Price
export function parseCSVData(csvText: string, existingProducts: AffiliateProduct[]): AffiliateProduct[] {
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim() !== '');
  if (lines.length < 2) return existingProducts;

  const existingMap = new Map<string, AffiliateProduct>();
  existingProducts.forEach((p) => existingMap.set(p.id, p));

  const updatedProducts: AffiliateProduct[] = [];
  const nowStr = new Date().toLocaleString('vi-VN');

  // Skip header line 0
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    if (cols.length < 5) continue;

    const id = cols[0]?.trim() || `AFF-${i}`;
    const platform = cols[1]?.trim() || 'Shopee';
    const notes = cols[4]?.trim() || '';

    // Active column (Col F / cols[5]): default true unless explicitly false / 0
    const activeStr = cols[5]?.trim().toLowerCase();
    const active = activeStr === undefined || activeStr === '' ? true : (activeStr !== 'false' && activeStr !== '0' && activeStr !== 'no');

    const link = cols[6]?.trim() || cols[5]?.trim() || '';
    
    // Filter out empty rows without valid product link or notes
    if ((!link || !link.startsWith('http')) && !notes) {
      continue;
    }

    const rawCategory = cols[2]?.trim();
    const rawSubCategory = cols[3]?.trim();
    const detected = autoDetectCategoryAndSubCategory(notes, link);
    const category = (rawCategory && rawCategory !== 'Khác' && rawCategory !== '') ? rawCategory : detected.category;
    const subCategory = (rawSubCategory && rawSubCategory !== 'Tổng hợp' && rawSubCategory !== '') ? rawSubCategory : detected.subCategory;

    const rawCurrentPrice = parsePriceNumber(cols[7]);
    const rawHighestPrice = parsePriceNumber(cols[8]) || rawCurrentPrice;
    
    // Support custom Image URL in Column J (cols[9])
    const customImageUrl = cols[9]?.trim() || '';

    const existing = existingMap.get(id);

    // If existing product already has a scraped name, use it; otherwise use notes or fallback
    const name = existing?.name && existing.name !== notes
      ? existing.name
      : (notes ? notes : `${subCategory} (${platform})`);

    const currentPrice = rawCurrentPrice > 0 ? rawCurrentPrice : (existing?.currentPrice || 100000);
    
    // Calculate highest recorded price
    let highestPrice = Math.max(
      rawHighestPrice,
      currentPrice,
      existing ? existing.highestPrice : 0
    );

    // Calculate lowest recorded price (for premium mode)
    let lowestPrice = existing?.lowestPrice
      ? Math.min(existing.lowestPrice, currentPrice)
      : currentPrice;

    // Parse target price from Column K (index 10) or calculate a default (80% of highest)
    const rawTargetPrice = parsePriceNumber(cols[10]);
    const targetPrice = rawTargetPrice > 0
      ? rawTargetPrice
      : (existing?.targetPrice || Math.round(highestPrice * 0.8));
    
    // Price history update
    const history = existing?.priceHistory ? [...existing.priceHistory] : [];
    const lastPoint = history[history.length - 1];
    if (!lastPoint || lastPoint.price !== currentPrice) {
      history.push({ timestamp: nowStr, price: currentPrice });
    }

    updatedProducts.push({
      id,
      platform,
      category,
      subCategory,
      name,
      notes: notes || existing?.notes,
      active,
      link,
      currentPrice,
      highestPrice,
      lowestPrice,
      targetPrice,
      imageUrl: customImageUrl || (existing?.imageUrl && !existing.imageUrl.includes('unsplash.com') ? existing.imageUrl : getPlatformFallbackImage(platform, category)),
      lastUpdated: new Date().toISOString(),
      priceHistory: history,
    });
  }

  return updatedProducts.length > 0 ? updatedProducts : existingProducts;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result.map((s) => s.replace(/^"|"$/g, '').trim());
}

function parsePriceNumber(val?: string): number {
  if (!val) return 0;
  // If the value contains characters indicating it's a URL or text rather than a price, return 0
  if (val.includes('/') || val.includes(':') || /[a-zA-Z]/.test(val)) {
    return 0;
  }
  const clean = val.replace(/[^0-9]/g, '');
  return parseInt(clean, 10) || 0;
}

export function getPlatformFallbackImage(_platform: string, _category?: string, _notes: string = ''): string {
  // Trả về placeholder No Image rõ ràng thay vì dùng hình ảnh không liên quan (như máy tính, túi xách)
  // nếu script không cào được hình ảnh thực sự.
  return 'https://placehold.co/600x600/f8fafc/94a3b8?text=No+Image';
}

