import { useState, useEffect } from 'react';
import {
  RefreshCw,
  Search,
  ExternalLink,
  Crown,
  TrendingDown,
  TrendingUp,
  Clock,
  Sparkles,
  Settings,
  ShoppingBag,
  Filter,
  History,
  X,
  CheckCircle2
} from 'lucide-react';
import type { AffiliateProduct } from '../services/affiliateData';
import {
  getLocalAffiliateProducts,
  saveLocalAffiliateProducts,
  getSavedSheetUrl,
  saveSheetUrl,
  parseCSVData,
  INITIAL_AFFILIATE_PRODUCTS
} from '../services/affiliateData';

export default function Affiliate() {
  const [products, setProducts] = useState<AffiliateProduct[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dealFilter, setDealFilter] = useState<string>('all'); // 'all', 'worth-buying', 'not-worth-buying'
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingTargetPriceId, setEditingTargetPriceId] = useState<string | null>(null);
  const [tempTargetPriceInput, setTempTargetPriceInput] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isScraping, setIsScraping] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [sheetUrlModalOpen, setSheetUrlModalOpen] = useState<boolean>(false);
  const [sheetUrlInput, setSheetUrlInput] = useState<string>('');
  const [activeHistoryProduct, setActiveHistoryProduct] = useState<AffiliateProduct | null>(null);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  // Load products on mount & start 1-hour interval timer
  useEffect(() => {
    const loaded = getLocalAffiliateProducts();
    setProducts(loaded);
    setSheetUrlInput(getSavedSheetUrl());
    setLastSyncTime(new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }));

    // Check for admin query parameter or saved admin status
    const href = window.location.href;
    const urlHasAdmin = href.includes('admin=true') || href.includes('admin=1');
    const urlClearAdmin = href.includes('admin=false') || href.includes('admin=0');
    
    if (urlClearAdmin) {
      localStorage.removeItem('geminiflow_admin');
      setIsAdmin(false);
      // Clean query parameter from URL
      const cleanUrl = href.replace(/[?&]admin=[^&#]*/, '');
      window.history.replaceState({}, document.title, cleanUrl);
    } else if (urlHasAdmin) {
      const pin = prompt('Vui lòng nhập mã bảo mật Admin:');
      if (pin === '8989') {
        localStorage.setItem('geminiflow_admin', 'true');
        setIsAdmin(true);
        // Clean query parameter from URL to hide admin flag from view
        const cleanUrl = href.replace(/[?&]admin=[^&#]*/, '');
        window.history.replaceState({}, document.title, cleanUrl);
      } else {
        alert('❌ Sai mã bảo mật. Truy cập bị từ chối!');
        localStorage.removeItem('geminiflow_admin');
        setIsAdmin(false);
        // Clean query parameter from URL
        const cleanUrl = href.replace(/[?&]admin=[^&#]*/, '');
        window.history.replaceState({}, document.title, cleanUrl);
      }
    } else {
      setIsAdmin(localStorage.getItem('geminiflow_admin') === 'true');
    }

    // Auto-update every 1 hour (3600000 ms)
    const interval = setInterval(() => {
      handleSync(true);
    }, 3600000);

    return () => clearInterval(interval);
  }, []);

  // Sync handler (manual or auto)
  const handleSync = async (isAuto = false) => {
    setIsSyncing(true);
    const targetUrl = getSavedSheetUrl();

    try {
      if (targetUrl) {
        let response = await fetch(targetUrl);
        let csvText = response.ok ? await response.text() : '';
        
        // If Google Sheet CSV is currently empty, fallback to local template file public/affiliate-data.csv
        if (!csvText || csvText.trim() === '') {
          const fallbackRes = await fetch('./affiliate-data.csv');
          if (fallbackRes.ok) {
            csvText = await fallbackRes.text();
          }
        }

        const currentLocal = getLocalAffiliateProducts();
        const updated = parseCSVData(csvText, currentLocal);
        setProducts(updated);
        saveLocalAffiliateProducts(updated);
        setSyncNotice('Đã đồng bộ thành công dữ liệu sản phẩm!');
      } else {
        // Simulating sync update & price checks on local dataset
        const currentLocal = getLocalAffiliateProducts();
        const nowStr = new Date().toLocaleString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        });

        const refreshed = currentLocal.map((p) => {
          // Keep highest price and update lowest price tracking
          const highest = Math.max(p.highestPrice, p.currentPrice);
          const lowest = p.lowestPrice ? Math.min(p.lowestPrice, p.currentPrice) : p.currentPrice;
          const history = p.priceHistory ? [...p.priceHistory] : [];
          if (history.length === 0 || history[history.length - 1].price !== p.currentPrice) {
            history.push({ timestamp: nowStr, price: p.currentPrice });
          }
          return {
            ...p,
            highestPrice: highest,
            lowestPrice: lowest,
            lastUpdated: new Date().toISOString(),
            priceHistory: history,
          };
        });

        setProducts(refreshed);
        saveLocalAffiliateProducts(refreshed);
        setSyncNotice(isAuto ? 'Tự động đồng bộ hoàn tất (1h)' : 'Đã kiểm tra và đồng bộ lại dữ liệu!');
      }
    } catch (error) {
      console.error('Error syncing sheet:', error);
      setSyncNotice('Không kết nối được Google Sheet. Đã cập nhật từ cơ sở dữ liệu local.');
    } finally {
      setIsSyncing(false);
      setLastSyncTime(new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }));
      setTimeout(() => setSyncNotice(null), 4000);
    }
  };

  const handleSaveSheetUrl = () => {
    saveSheetUrl(sheetUrlInput);
    setSheetUrlModalOpen(false);
    handleSync(false);
  };

  const handleScrapePrices = async () => {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!isLocal) {
      alert(
        '⚠️ Tính năng cào giá Shopee trực tiếp yêu cầu môi trường Node.js và Chrome chạy trên máy của bạn.\n\n' +
        'Hãy chạy dự án ở local (npm run dev) để sử dụng nút này trực tiếp từ giao diện, hoặc chạy file scripts/scrape-shopee-real.cjs trong VSCode.'
      );
      return;
    }

    setIsScraping(true);
    setSyncNotice('Đang khởi chạy trình cào giá Shopee (CDP + GUI Chrome)... Vui lòng đợi...');

    try {
      const response = await fetch('/api/scrape');
      const data = await response.json();
      
      if (data.success) {
        // Scraped successfully. Reload local products to show latest values!
        const loaded = getLocalAffiliateProducts();
        setProducts(loaded);
        setSyncNotice('🎉 Cập nhật và cào giá Shopee thành công!');
      } else {
        setSyncNotice(`❌ Cào giá thất bại: ${data.error || 'Lỗi không xác định'}`);
      }
    } catch (error: any) {
      setSyncNotice(`❌ Lỗi kết nối API cào giá: ${error.message}`);
    } finally {
      setIsScraping(false);
      setTimeout(() => setSyncNotice(null), 5000);
    }
  };

  const handleResetDefault = () => {
    saveLocalAffiliateProducts(INITIAL_AFFILIATE_PRODUCTS);
    setProducts(INITIAL_AFFILIATE_PRODUCTS);
    setSyncNotice('Đã khôi phục dữ liệu mẫu ban đầu!');
    setTimeout(() => setSyncNotice(null), 3000);
  };

  const handleSaveTargetPrice = (productId: string) => {
    const newPrice = parseInt(tempTargetPriceInput, 10) || 0;
    if (newPrice > 0) {
      const updated = products.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            targetPrice: newPrice,
            lastUpdated: new Date().toISOString(),
          };
        }
        return p;
      });
      setProducts(updated);
      saveLocalAffiliateProducts(updated);
    }
    setEditingTargetPriceId(null);
  };

  // Filtering
  const platforms = ['all', 'Shopee', 'TikTok', 'Lazada'];
  const categories = ['all', ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products.filter((p) => {
    const matchesPlatform = selectedPlatform === 'all' || p.platform.toLowerCase() === selectedPlatform.toLowerCase();
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subCategory.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Deal Target Price Filter
    let matchesDeal = true;
    if (dealFilter === 'worth-buying') {
      matchesDeal = p.targetPrice ? p.currentPrice <= p.targetPrice : false;
    } else if (dealFilter === 'not-worth-buying') {
      matchesDeal = p.targetPrice ? p.currentPrice > p.targetPrice : true;
    }

    return matchesPlatform && matchesCategory && matchesSearch && matchesDeal;
  });

  const formatVND = (price: number) => {
    return price.toLocaleString('vi-VN') + ' ₫';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950/40 border border-slate-800 p-8 sm:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-google-red/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-google-blue/10 border border-google-blue/30 text-google-blue text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Affiliate Price Tracker & Auto Scraper</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight">
                Săn Deal <span className="bg-gradient-to-r from-google-blue via-blue-400 to-sky-300 bg-clip-text text-transparent">Affiliate</span> & Lịch Sử Giá
              </h1>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Tự động đồng bộ dữ liệu từ Google Sheet, cào ảnh từ Shopee, TikTok Shop, Lazada và ghi nhận biến động giá mỗi 1 tiếng.
              </p>
            </div>
          </div>
        </div>

        {/* Sync & Admin Control Bar (Only for owner/admin) */}
        {isAdmin && (
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md">
            {/* Status info */}
            <div className="flex items-center space-x-3 text-xs sm:text-sm text-slate-300">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-google-green opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-google-green" />
              </span>
              <span className="font-medium">Tự động cập nhật: <strong className="text-google-green">1 giờ / lần</strong></span>
              <span className="text-slate-600">|</span>
              <span className="flex items-center space-x-1 text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span>Cập nhật gần nhất: {lastSyncTime}</span>
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={handleScrapePrices}
                disabled={isScraping || isSyncing}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-google-green to-emerald-600 hover:opacity-95 active:scale-95 text-slate-950 font-extrabold text-xs sm:text-sm transition shadow-lg shadow-emerald-500/20 disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className={`w-4 h-4 ${isScraping ? 'animate-pulse' : ''}`} />
                <span>{isScraping ? 'Đang cào giá...' : 'Cào giá Shopee'}</span>
              </button>

              <button
                onClick={() => handleSync(false)}
                disabled={isSyncing || isScraping}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-google-blue hover:bg-blue-600 active:scale-95 text-white font-medium text-xs sm:text-sm transition shadow-lg shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ ngay'}</span>
              </button>

              <button
                onClick={() => setSheetUrlModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs sm:text-sm border border-slate-700 transition cursor-pointer"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Link Google Sheet</span>
              </button>

              <button
                onClick={handleResetDefault}
                title="Khôi phục dữ liệu mẫu"
                className="px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs border border-slate-800 transition"
              >
                Đặt lại mẫu
              </button>
            </div>
          </div>
        )}

        {/* Sync notification toast */}
        {syncNotice && (
          <div className="flex items-center space-x-2 p-3.5 rounded-xl bg-google-green/10 border border-google-green/30 text-google-green text-xs font-semibold animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{syncNotice}</span>
          </div>
        )}

        {/* Filter & Search Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Platform Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {platforms.map((p) => {
              const isSelected = selectedPlatform === p;
              let badgeColor = 'bg-slate-800 text-slate-300 hover:bg-slate-700';
              if (isSelected) {
                if (p === 'Shopee') badgeColor = 'bg-orange-600 text-white shadow-lg shadow-orange-500/30';
                else if (p === 'TikTok') badgeColor = 'bg-slate-100 text-slate-950 font-bold shadow-lg';
                else if (p === 'Lazada') badgeColor = 'bg-blue-600 text-white shadow-lg shadow-blue-500/30';
                else badgeColor = 'bg-google-blue text-white shadow-lg shadow-blue-500/30';
              }
              return (
                <button
                  key={p}
                  onClick={() => setSelectedPlatform(p)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer ${badgeColor}`}
                >
                  {p === 'all' ? 'Tất cả nền tảng' : p}
                </button>
              );
            })}
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Category selector */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-48 pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-google-blue cursor-pointer"
              >
                <option value="all">Tất cả danh mục</option>
                {categories.filter((c) => c !== 'all').map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Deal Status selector */}
            <div className="relative">
              <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                value={dealFilter}
                onChange={(e) => setDealFilter(e.target.value)}
                className="w-full sm:w-48 pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-google-blue cursor-pointer"
              >
                <option value="all">Tất cả khuyến nghị</option>
                <option value="worth-buying">🔥 Đáng mua (Đạt giá đề xuất)</option>
                <option value="not-worth-buying">⌛ Chưa đáng mua</option>
              </select>
            </div>

            {/* Search Box */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-google-blue"
              />
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800 space-y-4">
            <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-slate-400 text-sm">Không tìm thấy sản phẩm Affiliate nào phù hợp.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const hasDiscountFromMax = product.highestPrice > product.currentPrice;
              const discountPercent = hasDiscountFromMax
                ? Math.round(((product.highestPrice - product.currentPrice) / product.highestPrice) * 100)
                : 0;

              return (
                <div
                  key={product.id}
                  className="group relative flex flex-col justify-between rounded-2xl bg-slate-900/90 border border-slate-800/90 hover:border-blue-500/50 p-5 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1"
                >
                  <div className="space-y-4">
                    {/* Image preview with platform badge */}
                    <div className="relative h-48 rounded-xl overflow-hidden bg-slate-950">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://placehold.co/600x600/f8fafc/94a3b8?text=No+Image';
                        }}
                      />
                      <div className="absolute top-3 left-3 flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase shadow-lg bg-slate-950/80 backdrop-blur-md border border-slate-700/50">
                        {product.platform === 'Shopee' && <span className="text-orange-500">🛒 Shopee</span>}
                        {product.platform === 'TikTok' && <span className="text-cyan-400">🎵 TikTok Shop</span>}
                        {product.platform === 'Lazada' && <span className="text-blue-400">🛍️ Lazada</span>}
                        {!['Shopee', 'TikTok', 'Lazada'].includes(product.platform) && (
                          <span className="text-google-yellow">{product.platform}</span>
                        )}
                      </div>

                      {hasDiscountFromMax && (
                        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-google-red text-white text-[11px] font-extrabold shadow-md">
                          Giảm {discountPercent}% từ đỉnh
                        </div>
                      )}

                      {product.active === false && (
                        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 text-center">
                          <span className="px-3 py-1.5 rounded-xl bg-google-red text-white text-xs font-bold shadow-lg animate-pulse">
                            ⚠️ Link Tạm Ngưng / Die
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 font-medium">
                        {product.category}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span>{product.subCategory}</span>
                      {product.active === false && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-500/20 text-red-400 font-bold border border-red-500/30">
                          Inactive
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="font-sans font-bold text-sm sm:text-base text-slate-100 line-clamp-2 leading-snug group-hover:text-google-blue transition">
                      {product.name}
                    </h3>

                    {/* Notes Badge */}
                    {product.notes && (
                      <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300">
                        <strong className="text-blue-400">Ghi chú:</strong> {product.notes}
                      </div>
                    )}

                    {/* Price Section */}
                    <div className="space-y-2 pt-2 border-t border-slate-800/80">
                      {/* Current Price */}
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs text-slate-400 font-medium">Giá hiện tại:</span>
                        <span className="text-lg font-extrabold text-google-green">
                          {formatVND(product.currentPrice)}
                        </span>
                      </div>

                      {/* Target Price (Giá đề xuất) */}
                      <div className="flex items-center justify-between text-xs h-7">
                        <span className="text-slate-400 font-medium">Giá đề xuất mua:</span>
                        {editingTargetPriceId === product.id ? (
                          <div className="flex items-center space-x-1">
                            <input
                              type="text"
                              value={tempTargetPriceInput}
                              onChange={(e) => setTempTargetPriceInput(e.target.value.replace(/[^0-9]/g, ''))}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveTargetPrice(product.id);
                                else if (e.key === 'Escape') setEditingTargetPriceId(null);
                              }}
                              className="w-24 px-1.5 py-0.5 rounded bg-slate-950 border border-slate-700 text-xs text-right font-bold text-slate-100 focus:outline-none focus:border-google-blue"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveTargetPrice(product.id)}
                              className="p-0.5 rounded bg-google-green text-slate-950 hover:bg-green-400 cursor-pointer flex items-center justify-center"
                              title="Lưu"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingTargetPriceId(null)}
                              className="p-0.5 rounded bg-slate-800 text-slate-400 hover:text-white cursor-pointer flex items-center justify-center"
                              title="Hủy"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1.5 group/price">
                            <span className="font-extrabold text-blue-400">
                              {formatVND(product.targetPrice || 0)}
                            </span>
                            {isAdmin && (
                              <button
                                onClick={() => {
                                  setEditingTargetPriceId(product.id);
                                  setTempTargetPriceInput(String(product.targetPrice || 0));
                                }}
                                className="opacity-0 group-hover/price:opacity-100 text-slate-500 hover:text-blue-400 p-0.5 rounded transition cursor-pointer flex items-center justify-center"
                                title="Sửa giá đề xuất"
                              >
                                <Settings className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Deal Status Recommendation Badge */}
                      {product.targetPrice !== undefined && (
                        <div className="pt-1">
                          {product.currentPrice <= product.targetPrice ? (
                            <div className="flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-lg bg-google-green/10 border border-google-green/30 text-google-green font-bold text-xs">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>ĐÁNG MUA (Đạt giá đề xuất)</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 font-medium text-xs">
                              <Clock className="w-3.5 h-3.5 text-slate-500" />
                              <span>Chờ giảm {formatVND(product.currentPrice - product.targetPrice)} nữa</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Highest Recorded Price */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 flex items-center space-x-1">
                          <TrendingUp className="w-3.5 h-3.5 text-google-red" />
                          <span>Giá cao nhất đã ghi nhận:</span>
                        </span>
                        <span className="font-semibold text-slate-400 line-through">
                          {formatVND(product.highestPrice)}
                        </span>
                      </div>

                      {/* Lowest Price History */}
                      {product.lowestPrice !== undefined && (
                        <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-950 border border-slate-800/60 text-slate-300">
                          <span className="flex items-center space-x-1 font-medium text-slate-400">
                            <TrendingDown className="w-3.5 h-3.5 text-google-green" />
                            <span>Giá thấp nhất lịch sử:</span>
                          </span>
                          <span className="font-extrabold text-slate-200">
                            {formatVND(product.lowestPrice || product.currentPrice)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 space-y-2">
                    {product.priceHistory && product.priceHistory.length > 0 && (
                      <button
                        onClick={() => setActiveHistoryProduct(product)}
                        className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700/50 transition cursor-pointer"
                      >
                        <History className="w-3.5 h-3.5" />
                        <span>Xem lịch sử biến động giá</span>
                      </button>
                    )}

                    <a
                      href={product.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-google-blue to-blue-600 hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-lg transition duration-200 group-hover:shadow-blue-500/25"
                    >
                      <span>Đến nơi bán (Mua ngay)</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Google Sheet URL Config Modal */}
      {sheetUrlModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
                <Settings className="w-5 h-5 text-google-blue" />
                <span>Cấu hình đường dẫn Google Sheet</span>
              </h3>
              <button
                onClick={() => setSheetUrlModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed">
                Nhập link file Google Sheet đã được Xuất bản ra Web dưới dạng CSV (File &gt; Share &gt; Publish to web &gt; chọn định dạng CSV).
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Đường dẫn CSV Google Sheet:
                </label>
                <input
                  type="url"
                  placeholder="https://docs.google.com/spreadsheets/d/e/.../pub?output=csv"
                  value={sheetUrlInput}
                  onChange={(e) => setSheetUrlInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-google-blue"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                <p className="font-bold text-slate-300">Cấu trúc 10 cột chuẩn trong Google Sheet:</p>
                <p className="font-mono text-slate-400 text-[10.5px]">
                  Cột A: ID | Cột B: Platform | Cột C: Category | Cột D: Sub-category | Cột E: Notes (Ghi chú) | Cột F: Active (TRUE/FALSE) | Cột G: Product Link | Cột H: Current Price | Cột I: Highest Price | Cột J: Image URL (Tùy chọn)
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setSheetUrlModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveSheetUrl}
                className="px-5 py-2.5 rounded-xl bg-google-blue hover:bg-blue-600 text-white text-xs font-bold shadow-lg"
              >
                Lưu và Đồng bộ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Price History Log Modal (Premium) */}
      {activeHistoryProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base font-bold text-amber-300 flex items-center space-x-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <span>Lịch Sử Biến Động Giá (Premium)</span>
              </h3>
              <button
                onClick={() => setActiveHistoryProduct(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h4 className="font-bold text-sm text-slate-100 line-clamp-1">
                {activeHistoryProduct.name}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Nền tảng: <strong className="text-slate-200">{activeHistoryProduct.platform}</strong>
              </p>
            </div>

            <div className="max-h-64 overflow-y-auto pr-1 space-y-2">
              {activeHistoryProduct.priceHistory && activeHistoryProduct.priceHistory.length > 0 ? (
                activeHistoryProduct.priceHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs"
                  >
                    <span className="text-slate-400 flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{item.timestamp}</span>
                    </span>
                    <span className="font-extrabold text-google-green">
                      {formatVND(item.price)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic text-center py-4">Chưa có bản ghi lịch sử giá trước đây.</p>
              )}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setActiveHistoryProduct(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
