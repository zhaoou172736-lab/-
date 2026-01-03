import React, { useRef, useState, useEffect } from 'react';
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Home, Square, DoorOpen, Package, Minus, Bath, User, Circle,
  Download, Maximize2, Calculator, Ruler, DollarSign,
  Info, Loader2, TrendingUp, AlertTriangle,
  Calendar, Clock, FileText, ChevronRight, Filter, X, Search, Sparkles
} from "lucide-react";

interface PriceItem {
  name: string;
  formula: string;
  unit: string;
  priceRange: string;
  material: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  note?: string;
}

const iconClass = "h-5 w-5 text-slate-700";

const priceData: PriceItem[] = [
  { name: "门➕套", formula: "按套", unit: "套", priceRange: "4800", material: "木/烤漆", description: "常规 2150；超高/超宽 +48/公分", category: "门类", icon: <DoorOpen className={iconClass} /> },
  { name: "子母门", formula: "按套", unit: "套", priceRange: "待定", material: "木/烤漆", description: "主/副扇尺寸确认后核价", category: "门类", icon: <DoorOpen className={iconClass} /> },
  { name: "双开门", formula: "按套", unit: "套", priceRange: "待定", material: "木/烤漆", description: "规格 & 五金配置待定", category: "门类", icon: <DoorOpen className={iconClass} /> },
  { name: "单边套", formula: "高×2×数量+宽", unit: "套", priceRange: "320/m", material: "木/烤漆", description: "速算：≈双边套价÷3×2", category: "门类", icon: <Square className={iconClass} /> },
  { name: "双边套", formula: "高×4×数量+宽×2", unit: "套", priceRange: "480/m", material: "木/烤漆", description: "常规厚度约 2400", category: "门类", icon: <Square className={iconClass} /> },
  { name: "收口条", formula: "按米", unit: "m", priceRange: "260/m", material: "木/烤漆", description: "标准造型收边", category: "收口类", icon: <Minus className={iconClass} /> },
  { name: "异形收口条", formula: "按米", unit: "m", priceRange: "780/m", material: "木/烤漆", description: "复杂造型≈260×3", category: "收口类", icon: <Minus className={iconClass} /> },
  { name: "墙板", formula: "宽×高", unit: "㎡", priceRange: "1680", material: "木/烤漆", description: "护墙/背景墙", category: "墙面", icon: <Square className={iconClass} /> },
  { name: "柜门", formula: "宽×高", unit: "㎡", priceRange: "1780", material: "木/烤漆", description: "墙板价 +100", category: "柜类", icon: <DoorOpen className={iconClass} /> },
  { name: "衣柜柜体", formula: "投影×5", unit: "㎡", priceRange: "680~880", material: "生态板", description: "展开面积≈投影×5", category: "柜类", icon: <Package className={iconClass} /> },
  { name: "浴室柜", formula: "长度", unit: "m", priceRange: "3800~4800/m", material: "防水板", description: "含防潮处理", category: "柜类", icon: <Bath className={iconClass} /> },
  { name: "梳妆台", formula: "长度", unit: "m", priceRange: "3800~4800/m", material: "木/烤漆", description: "含镜/灯可选", category: "柜类", icon: <User className={iconClass} /> },
  { name: "抽屉面", formula: "宽×高", unit: "㎡", priceRange: "1680", material: "木/烤漆", description: "不足0.2㎡按0.2㎡", category: "柜类", icon: <Square className={iconClass} /> },
  { name: "抽屉盒", formula: "长度", unit: "m", priceRange: "3800~4800/m", material: "木/烤漆", description: "含结构位", category: "柜类", icon: <Package className={iconClass} /> },
  { name: "抽屉", formula: "按个", unit: "个", priceRange: "31/个", material: "环保免漆板", description: "基础不含高端导轨", category: "柜类", icon: <Package className={iconClass} /> },
  { name: "智能镜", formula: "长度", unit: "m", priceRange: "2800~3800/m", material: "智能玻璃", description: "触控/防雾/灯光", category: "智能设备", icon: <Circle className={iconClass} /> }
];

const categories = [...new Set(priceData.map(i => i.category))];

const FurniturePriceReference: React.FC = () => {
  const pageRef = useRef<HTMLDivElement | null>(null);
  const tableSectionRef = useRef<HTMLDivElement | null>(null);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [isPrintMode, setIsPrintMode] = useState(false);
  
  // Filter & Search State
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Calculator State
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcItem, setCalcItem] = useState<PriceItem>(priceData[0]);
  const [calcInputs, setCalcInputs] = useState({ w: '', h: '', l: '', q: '1' });
  const [manualPrice, setManualPrice] = useState('');

  const currentDate = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Enhanced filtering logic
  const filteredData = priceData.filter(item => {
    const matchesCategory = selectedCategory === '全部' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filterOptions = ['全部', ...categories];

  // Initialize calculator when item changes
  useEffect(() => {
    if (calcItem) {
      // Extract numeric price or range min
      const match = calcItem.priceRange.match(/(\d+)/);
      const initialPrice = match ? match[0] : '';
      setManualPrice(initialPrice);
      // Reset dimensions but keep quantity 1
      setCalcInputs({ w: '', h: '', l: '', q: '1' });
    }
  }, [calcItem]);

  // Logic to determine which inputs to show
  const showWidthHeight = ["单边套", "双边套", "墙板", "柜门", "衣柜柜体", "抽屉面"].includes(calcItem.name) || calcItem.formula.includes("宽×高");
  const showLength = ["收口条", "异形收口条", "浴室柜", "梳妆台", "抽屉盒", "智能镜"].includes(calcItem.name) || calcItem.formula.includes("长度") || calcItem.formula === "按米";
  // Always show quantity

  const calculateTotal = () => {
    const price = parseFloat(manualPrice) || 0;
    const w = parseFloat(calcInputs.w) || 0;
    const h = parseFloat(calcInputs.h) || 0;
    const l = parseFloat(calcInputs.l) || 0;
    const q = parseFloat(calcInputs.q) || 1;

    if (calcItem.name === "单边套") {
       // Formula: 高×2×数量+宽 (mm -> m)
       const meters = (h * 2 * q + w) / 1000;
       return meters * price;
    }
    if (calcItem.name === "双边套") {
       // Formula: 高×4×数量+宽×2 (mm -> m)
       const meters = (h * 4 * q + w * 2) / 1000;
       return meters * price;
    }
    if (calcItem.formula.includes("宽×高")) {
       // Area in m2
       return (w * h / 1000000) * price * q; 
    }
    if (calcItem.formula === "投影×5") {
       // Expanded area approx calculation
       return (w * h / 1000000) * 5 * price * q;
    }
    if (showLength) {
       // Length in m
       return (l / 1000) * price * q;
    }
    
    // Default: Fixed price * quantity (按套, 按个)
    return price * q;
  };

  const calculatedTotal = calculateTotal();


  // 导出逻辑：保持原有的 Apple Style 样式，不做大改，确保功能稳定
  const handleExportTableImage = async () => {
    if (!tableSectionRef.current) return;
    setIsExporting('table');
    try {
      const table = tableSectionRef.current.querySelector('table');
      if (!table) throw new Error('未找到表格');

      const headerCells = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent?.trim() || '');
      const bodyRows = Array.from(table.querySelectorAll('tbody tr')).map(tr =>
        Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim())
      );
      const allRows = [headerCells, ...bodyRows];

      const paddingX = 24, paddingY = 16, lineHeight = 24;
      const font = "15px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
      const headerFont = "600 15px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
      
      const borderColor = "#e5e5e5";
      const headerBg = "#f5f5f7"; 
      const headerText = "#1d1d1f"; 
      const rowBg = "#ffffff";
      const bodyText = "#1d1d1f";
      const secondaryText = "#86868b";
      
      const minColWidth = 100, maxColWidth = 300;

      const measureCanvas = document.createElement('canvas');
      const mCtx = measureCanvas.getContext('2d')!;
      mCtx.font = font;

      const colCount = headerCells.length;
      const colWidths = new Array(colCount).fill(minColWidth);
      allRows.forEach((row, ri) => {
        row.forEach((cell, ci) => {
          mCtx.font = ri === 0 ? headerFont : font;
          const w = mCtx.measureText(cell).width + paddingX * 2;
          if (w > colWidths[ci]) colWidths[ci] = Math.min(w, maxColWidth);
        });
      });

      const tableWidth = colWidths.reduce((a, b) => a + b, 0);
      const rowHeight = lineHeight + paddingY * 2;
      const tableHeight = allRows.length * rowHeight;
      const headSpace = 80;

      const scale = 3;
      const canvas = document.createElement('canvas');
      canvas.width = tableWidth * scale;
      canvas.height = (tableHeight + headSpace + 60) * scale;
      const ctx = canvas.getContext('2d')!;
      ctx.scale(scale, scale);

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, tableWidth, tableHeight + headSpace + 60);

      ctx.fillStyle = "#1d1d1f";
      ctx.font = "700 24px -apple-system, BlinkMacSystemFont, 'Segoe UI'";
      ctx.fillText("兴大地导购价格参考", 24, 40);
      
      ctx.font = "14px -apple-system, BlinkMacSystemFont, 'Segoe UI'";
      ctx.fillStyle = "#86868b";
      ctx.fillText(`内部机密 · 更新于 ${currentDate}`, 24, 64);
      
      if (selectedCategory !== '全部') {
        ctx.fillStyle = "#0066cc";
        ctx.font = "600 14px -apple-system, BlinkMacSystemFont, 'Segoe UI'";
        ctx.fillText(`分类: ${selectedCategory}`, tableWidth - 140, 64);
      }

      ctx.textBaseline = "middle";

      allRows.forEach((row, ri) => {
        const y = headSpace + ri * rowHeight;

        if (ri === 0) {
          ctx.fillStyle = headerBg;
          ctx.fillRect(0, y, tableWidth, rowHeight);
          ctx.strokeStyle = "#d2d2d7";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(0, y + rowHeight);
          ctx.lineTo(tableWidth, y + rowHeight);
          ctx.stroke();
        } else {
           ctx.fillStyle = rowBg;
           ctx.fillRect(0, y, tableWidth, rowHeight);
           ctx.strokeStyle = "#f5f5f7";
           ctx.lineWidth = 1;
           ctx.beginPath();
           ctx.moveTo(24, y + rowHeight);
           ctx.lineTo(tableWidth - 24, y + rowHeight);
           ctx.stroke();
        }

        let x = 0;
        row.forEach((cell, ci) => {
          const cw = colWidths[ci];
          
          if (ri === 0) {
            ctx.fillStyle = headerText;
            ctx.font = headerFont;
          } else {
            ctx.fillStyle = ci === 1 || ci === 4 ? bodyText : secondaryText;
            ctx.font = font;
          }

          let text = cell;
          while (ctx.measureText(text).width > cw - paddingX * 2 && text.length > 0) {
            text = text.slice(0, -1);
          }
          if (text !== cell) text += "…";
          
          ctx.fillText(text, x + paddingX, y + rowHeight / 2);
          x += cw;
        });
      });

      ctx.save();
      ctx.globalAlpha = 0.03;
      ctx.translate(tableWidth / 2, (tableHeight + headSpace) / 2);
      ctx.rotate(-Math.PI / 12);
      ctx.font = "600 64px -apple-system, BlinkMacSystemFont, 'Segoe UI'";
      ctx.fillStyle = "#1d1d1f";
      ctx.fillText("XINGDADI INTERNAL", -300, 0);
      ctx.restore();

      const link = document.createElement('a');
      link.download = `兴大地价格表_AppleStyle_${currentDate}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      showNotification('success', '表格已导出');
    } catch (e: any) {
      showNotification('error', `导出失败：${e.message}`);
    } finally {
      setIsExporting(null);
    }
  };

  const handleExportFullPage = async () => {
    if (!pageRef.current) return;
    setIsExporting('full');
    try {
      const source = pageRef.current;
      const clone = source.cloneNode(true) as HTMLElement;
      clone.style.background = '#ffffff';
      clone.classList.remove('bg-[#fbfbfd]'); 
      clone.classList.add('bg-white');
      
      // Hide animated blobs for export
      const blobs = clone.querySelector('.fixed.inset-0');
      if(blobs) blobs.remove();

      const inlineAll = (root: HTMLElement) => {
        const walk = (el: Element) => {
          if (el.nodeType !== 1) return;
          const cs = window.getComputedStyle(el as HTMLElement);
          const styleStr = Array.from(cs)
            .filter(p => !p.startsWith('-webkit'))
            .map(p => `${p}:${cs.getPropertyValue(p)};`).join('');
          (el as HTMLElement).setAttribute('style', styleStr);
          Array.from(el.children).forEach(c => walk(c));
        };
        walk(root);
      };
      inlineAll(clone);

      const rect = source.getBoundingClientRect();
      const width = Math.ceil(rect.width);
      const height = Math.ceil(rect.height);

      const wrapper = document.createElement('div');
      wrapper.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
      wrapper.appendChild(clone);

      const serialized = new XMLSerializer().serializeToString(wrapper);
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
          <foreignObject x="0" y="0" width="100%" height="100%">
            ${serialized}
          </foreignObject>
        </svg>
      `;
      const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        const scale = 2;
        const canvas = document.createElement('canvas');
        canvas.width = width * scale;
        canvas.height = height * scale;
        const ctx = canvas.getContext('2d')!;
        ctx.scale(scale, scale);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0);

        URL.revokeObjectURL(url);
        const link = document.createElement('a');
        link.download = "兴大地_整页视图.png";
        link.href = canvas.toDataURL('image/png');
        link.click();
        showNotification('success', '整页快照已导出');
        setIsExporting(null);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        showNotification('error', '导出失败，请重试');
        setIsExporting(null);
      };
      img.src = url;
    } catch (e: any) {
      showNotification('error', `导出失败：${e.message}`);
      setIsExporting(null);
    }
  };

  const handleExportPDF = () => {
    setIsExporting('pdf');
    setIsPrintMode(true);
    const afterPrint = () => {
      setIsPrintMode(false);
      setIsExporting(null);
      showNotification('success', 'PDF 导出流程结束');
      window.removeEventListener('afterprint', afterPrint);
    };
    window.addEventListener('afterprint', afterPrint);
    setTimeout(() => window.print(), 250);
  };

  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (isPrintMode && e.key === 'Escape') {
        setIsPrintMode(false);
        setIsExporting(null);
      }
    };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [isPrintMode]);

  return (
    <div
      ref={pageRef}
      className={`min-h-screen font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900 ${isPrintMode ? 'bg-white p-0' : 'bg-[#fbfbfd] relative'}`}
    >
      {/* Animated Ambient Background - Adds subtle depth and "design feel" */}
      {!isPrintMode && (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100/40 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-blob" />
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-100/40 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] bg-purple-100/40 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-blob animation-delay-4000" />
        </div>
      )}

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @media print {
          body { background: #ffffff !important; }
          .no-print { display: none !important; }
        }
        .glass-panel {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }
        .glass-card {
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.6);
        }
      `}</style>

      {/* Calculator Modal - Enhanced Glassmorphism */}
      {showCalculator && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 no-print">
          <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-sm transition-opacity duration-500" onClick={() => setShowCalculator(false)} />
          <div className="relative glass-panel rounded-[32px] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.1)] w-full max-w-md overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ring-1 ring-white/60">
            <div className="p-6 border-b border-slate-100/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="bg-gradient-to-br from-[#1d1d1f] to-[#3a3a3c] p-2.5 rounded-2xl text-white shadow-lg shadow-slate-900/10">
                   <Calculator className="h-5 w-5" />
                 </div>
                 <h3 className="text-xl font-bold text-[#1d1d1f] tracking-tight">快速计算器</h3>
              </div>
              <button onClick={() => setShowCalculator(false)} className="p-2 hover:bg-slate-100/50 rounded-full transition-colors text-slate-500 hover:text-slate-800">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              {/* Product Select */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#86868b] uppercase tracking-widest pl-1">选择产品</label>
                <div className="relative">
                    <select 
                      className="w-full h-14 rounded-2xl border-0 ring-1 ring-slate-200 px-4 text-[#1d1d1f] bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066cc] transition-all appearance-none font-medium shadow-sm"
                      value={calcItem.name}
                      onChange={(e) => {
                        const item = priceData.find(p => p.name === e.target.value);
                        if (item) setCalcItem(item);
                      }}
                    >
                      {priceData.map(p => (
                        <option key={p.name} value={p.name}>{p.name}</option>
                      ))}
                    </select>
                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 rotate-90 pointer-events-none" />
                </div>
              </div>

              {/* Price Input */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#86868b] uppercase tracking-widest pl-1">单价 (¥)</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">¥</span>
                    <input
                      type="number"
                      placeholder="0"
                      value={manualPrice}
                      onChange={(e) => setManualPrice(e.target.value)}
                      className="w-full h-14 pl-8 rounded-2xl border-0 ring-1 ring-slate-200 text-[#1d1d1f] bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066cc] transition-all font-semibold text-lg shadow-sm"
                    />
                </div>
              </div>

              {/* Dynamic Inputs */}
              <div className="grid grid-cols-2 gap-4">
                 {showWidthHeight && (
                   <>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-[#86868b] uppercase tracking-widest pl-1">宽度 (mm)</label>
                      <input type="number" value={calcInputs.w} onChange={e => setCalcInputs({...calcInputs, w: e.target.value})} className="w-full h-12 rounded-xl border-0 ring-1 ring-slate-200 px-4 focus:bg-white bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#0066cc] transition-all shadow-sm" placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-[#86868b] uppercase tracking-widest pl-1">高度 (mm)</label>
                      <input type="number" value={calcInputs.h} onChange={e => setCalcInputs({...calcInputs, h: e.target.value})} className="w-full h-12 rounded-xl border-0 ring-1 ring-slate-200 px-4 focus:bg-white bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#0066cc] transition-all shadow-sm" placeholder="0" />
                    </div>
                   </>
                 )}
                 {showLength && (
                    <div className="space-y-2 col-span-2">
                      <label className="text-[11px] font-bold text-[#86868b] uppercase tracking-widest pl-1">长度 (mm)</label>
                      <input type="number" value={calcInputs.l} onChange={e => setCalcInputs({...calcInputs, l: e.target.value})} className="w-full h-12 rounded-xl border-0 ring-1 ring-slate-200 px-4 focus:bg-white bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#0066cc] transition-all shadow-sm" placeholder="0" />
                    </div>
                 )}
                 <div className={`space-y-2 ${showLength ? 'col-span-2' : showWidthHeight ? 'col-span-2' : 'col-span-2'}`}>
                    <label className="text-[11px] font-bold text-[#86868b] uppercase tracking-widest pl-1">数量</label>
                    <input type="number" value={calcInputs.q} onChange={e => setCalcInputs({...calcInputs, q: e.target.value})} className="w-full h-12 rounded-xl border-0 ring-1 ring-slate-200 px-4 focus:bg-white bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#0066cc] transition-all shadow-sm" placeholder="1" />
                 </div>
              </div>

              {/* Result Area */}
              <div className="pt-6 border-t border-slate-200/50">
                <div className="bg-white/60 rounded-2xl p-5 border border-white shadow-inner flex flex-col gap-1">
                    <span className="text-xs font-semibold text-[#86868b] uppercase tracking-wider">预估总价</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-[#1d1d1f] tracking-tighter">
                        ¥{calculatedTotal.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                        </span>
                    </div>
                    <div className="text-[11px] text-[#86868b] mt-1 flex items-center gap-1.5">
                        <Info className="h-3 w-3" />
                        公式: {calcItem.formula} {calcItem.formula === "投影×5" && "(展开估算)"}
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-[1200px] mx-auto space-y-10 px-6 py-12">
        
        {/* Header Section - More dramatic typography */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-[#1d1d1f] bg-clip-text">
              导购价格参考
            </h1>
            <p className="text-lg text-[#86868b] font-medium max-w-2xl flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" /> 兴大地内部核心数据 · 精简版
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
             <div className="glass-card px-4 py-1.5 rounded-full shadow-sm text-sm font-semibold text-[#1d1d1f] flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#86868b]" />
                <span>更新于 {currentDate}</span>
             </div>
          </div>
        </div>

        {/* Floating Sticky Action Bar */}
        <div className="no-print sticky top-6 z-50 glass-panel rounded-full px-2 py-2 flex items-center justify-between gap-2 max-w-fit mx-auto md:mx-0 shadow-xl shadow-slate-200/20 transition-all hover:shadow-2xl hover:shadow-slate-200/40">
            <Button
              disabled={!!isExporting}
              onClick={handleExportTableImage}
              variant="ghost"
              className="rounded-full h-11 px-6 text-[#1d1d1f] hover:bg-white hover:shadow-sm font-medium transition-all text-[13px]"
            >
              {isExporting === 'table' ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
              保存表格
            </Button>
            <div className="w-px h-5 bg-slate-300/50 mx-1"></div>
            <Button
              disabled={!!isExporting}
              onClick={handleExportFullPage}
              variant="ghost"
              className="rounded-full h-11 px-6 text-[#1d1d1f] hover:bg-white hover:shadow-sm font-medium transition-all text-[13px]"
            >
               {isExporting === 'full' ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Maximize2 className="h-4 w-4 mr-2" />}
              保存长图
            </Button>
            <div className="w-px h-5 bg-slate-300/50 mx-1"></div>
             {/* Calculator Toggle */}
             <Button
              onClick={() => setShowCalculator(true)}
              variant="ghost"
              className="rounded-full h-11 px-4 text-[#1d1d1f] hover:bg-white hover:shadow-sm transition-all"
              title="Calculator"
            >
               <Calculator className="h-5 w-5" />
            </Button>
            <div className="w-px h-5 bg-slate-300/50 mx-1"></div>
            <Button
              disabled={!!isExporting}
              onClick={handleExportPDF}
              className="rounded-full h-11 px-7 bg-[#1d1d1f] text-white hover:bg-black font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
               {isExporting === 'pdf' ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileText className="h-4 w-4 mr-2" />}
              导出 PDF
            </Button>
        </div>

        {/* Filter & Search Section - Integrated into glass look */}
        <div className="no-print flex flex-col md:flex-row md:items-center justify-between gap-6">
           {/* Search Bar - Floating */}
           <div className="relative w-full md:w-80 group">
             <div className="absolute inset-0 bg-white/40 rounded-full blur-md group-hover:bg-white/60 transition-colors" />
             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#86868b] group-focus-within:text-[#0066cc] transition-colors" />
                <input 
                type="text"
                placeholder="搜索产品..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-11 pr-4 rounded-full border border-white/40 bg-white/60 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20 focus:border-[#0066cc]/50 transition-all placeholder:text-[#86868b]/70 backdrop-blur-sm"
                />
                {searchQuery && (
                    <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f] transition-colors"
                    >
                    <X className="h-3 w-3" />
                    </button>
                )}
             </div>
           </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-3 px-1 -mx-1 mask-linear-fade">
            <div className="flex items-center gap-2 mr-3 text-[#86868b] shrink-0">
              <Filter className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">筛选</span>
            </div>
            {filterOptions.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`
                  whitespace-nowrap px-5 py-2.5 rounded-full text-[13px] font-semibold transition-all duration-300 ease-out border border-transparent
                  ${selectedCategory === cat
                    ? 'bg-[#1d1d1f] text-white shadow-lg shadow-slate-900/20 scale-105'
                    : 'bg-white/60 text-[#86868b] hover:bg-white hover:text-[#1d1d1f] hover:shadow-md hover:scale-105'
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {notification && (
          <div
            className={`no-print fixed top-6 right-6 z-[100] px-6 py-4 rounded-[20px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md text-sm font-medium animate-in slide-in-from-top-4 fade-in duration-300 border border-white/20 ${
              notification.type === 'success'
                ? 'bg-emerald-500/90 text-white'
                : 'bg-red-500/90 text-white'
            }`}
          >
            {notification.message}
          </div>
        )}

        {/* Main Table Card - Floating Appearance */}
        <div ref={tableSectionRef} className="glass-card rounded-[32px] shadow-sm overflow-hidden transition-all hover:shadow-md">
          <div className="px-8 py-6 border-b border-slate-100/50 flex items-center justify-between bg-white/40">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-slate-800 to-black rounded-xl p-2 shadow-lg shadow-slate-900/10">
                 <DollarSign className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-[#1d1d1f] tracking-tight">价格明细</h2>
            </div>
            <Badge variant="secondary" className="bg-white/80 backdrop-blur-md text-[#86868b] border border-white/50 shadow-sm rounded-full px-4 py-1 font-medium">
              {filteredData.length} Items
            </Badge>
          </div>
          
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100/50 bg-slate-50/30">
                  <th className="py-5 px-6 pl-8 text-[11px] font-bold text-[#86868b] uppercase tracking-wider w-16">No.</th>
                  <th className="py-5 px-6 text-[11px] font-bold text-[#86868b] uppercase tracking-wider">Product</th>
                  <th className="py-5 px-6 text-[11px] font-bold text-[#86868b] uppercase tracking-wider text-center">Formula</th>
                  <th className="py-5 px-6 text-[11px] font-bold text-[#86868b] uppercase tracking-wider text-center">Unit</th>
                  <th className="py-5 px-6 text-[11px] font-bold text-[#86868b] uppercase tracking-wider">Price</th>
                  <th className="py-5 px-6 text-[11px] font-bold text-[#86868b] uppercase tracking-wider">Material</th>
                  <th className="py-5 px-6 text-[11px] font-bold text-[#86868b] uppercase tracking-wider">Note</th>
                  <th className="py-5 px-6 pr-8 text-[11px] font-bold text-[#86868b] uppercase tracking-wider text-right">Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredData.length > 0 ? (
                  filteredData.map((item, i) => (
                    <tr
                      key={i}
                      onClick={() => {
                        setCalcItem(item);
                        setShowCalculator(true);
                      }}
                      className="group hover:bg-white/80 transition-all duration-200 cursor-pointer"
                    >
                      <td className="py-5 px-6 pl-8 text-sm font-medium text-[#86868b]/40 font-mono group-hover:text-[#86868b]/70 transition-colors">
                        {String(i + 1).padStart(2, '0')}
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-2xl bg-white border border-slate-100 text-[#1d1d1f] flex items-center justify-center group-hover:scale-110 group-hover:shadow-md group-hover:border-slate-200 transition-all duration-300">
                            {item.icon}
                          </div>
                          <span className="font-bold text-[#1d1d1f] text-[15px]">{item.name}</span>
                        </div>
                      </td>
                      <td className="py-5 px-6 text-center text-sm font-medium">
                         <span className="bg-slate-100/50 border border-slate-200/50 px-3 py-1 rounded-full text-[12px] text-[#86868b] group-hover:bg-slate-100 group-hover:text-[#1d1d1f] transition-colors">
                          {item.formula}
                         </span>
                      </td>
                      <td className="py-5 px-6 text-center">
                        <span className="text-sm font-semibold text-[#1d1d1f] opacity-80">{item.unit}</span>
                      </td>
                      <td className="py-5 px-6">
                         {item.priceRange === '待定' ? (
                            <span className="text-[13px] font-semibold text-[#86868b] bg-slate-100 px-3 py-1.5 rounded-lg">待定</span>
                          ) : (
                            <span className="text-[17px] font-bold text-[#1d1d1f] tracking-tight tabular-nums">
                              ¥{item.priceRange}
                            </span>
                          )}
                      </td>
                      <td className="py-5 px-6 text-sm text-[#424245] font-medium">
                        {item.material}
                      </td>
                      <td className="py-5 px-6 text-sm text-[#86868b] max-w-[200px] leading-relaxed">
                        {item.description}
                      </td>
                      <td className="py-5 px-6 pr-8 text-right">
                         <span className="text-[11px] font-bold text-white bg-[#1d1d1f] px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.category}
                         </span>
                         <span className="text-[11px] font-bold text-[#0066cc] bg-[#0066cc]/10 px-3 py-1 rounded-full group-hover:hidden">
                          {item.category}
                         </span>
                      </td>
                    </tr>
                  ))
                ) : (
                   <tr>
                    <td colSpan={8} className="py-20 text-center text-[#86868b]">
                       <div className="flex flex-col items-center gap-2">
                           <Search className="h-8 w-8 text-slate-300" />
                           <p>没有找到相关产品</p>
                       </div>
                    </td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category Grid - Floating Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(cat => {
              const items = priceData.filter(p => p.category === cat);
              return (
                <div
                  key={cat}
                  className="glass-card rounded-[28px] p-8 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1.5 transition-all duration-500 group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500 pointer-events-none">
                      {items[0]?.icon}
                  </div>

                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <h3 className="text-xl font-bold text-[#1d1d1f] tracking-tight">{cat}</h3>
                    <Badge className="bg-slate-100 text-[#1d1d1f] group-hover:bg-[#1d1d1f] group-hover:text-white transition-colors border-0 rounded-full h-7 px-3 text-xs font-bold">
                      {items.length}
                    </Badge>
                  </div>
                  <div className="space-y-3 relative z-10">
                    {items.slice(0, 5).map((it, idx) => (
                      <div key={idx} className="flex items-center justify-between group/item cursor-default">
                        <span className="text-sm font-medium text-[#424245] group-hover/item:text-[#1d1d1f] transition-colors">{it.name}</span>
                        <div className="h-px flex-1 bg-slate-100/50 mx-3 group-hover/item:bg-slate-200 transition-colors"></div>
                        <span className="text-xs font-semibold text-[#86868b] whitespace-nowrap tabular-nums">
                          {it.priceRange === '待定' ? 'Pending' : `¥${it.priceRange.replace(/~.*/,'')}`}
                        </span>
                      </div>
                    ))}
                    {items.length > 5 && (
                      <div className="pt-2 flex justify-end">
                         <span className="text-xs font-bold text-[#0066cc] flex items-center cursor-pointer hover:underline opacity-80 hover:opacity-100 transition-opacity">
                            View All <ChevronRight className="h-3 w-3 ml-0.5" />
                         </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>

        {/* Footer Info */}
        <div className="pb-12 pt-6">
           <div className="glass-panel rounded-[32px] p-8 md:p-12 flex flex-col md:flex-row gap-10 items-start shadow-sm hover:shadow-md transition-shadow">
              <div className="flex-shrink-0 bg-white p-4 rounded-3xl shadow-sm ring-1 ring-slate-100">
                 <Info className="h-6 w-6 text-[#1d1d1f]" />
              </div>
              <div className="space-y-5">
                 <h4 className="text-lg font-bold text-[#1d1d1f]">重要备注</h4>
                 <div className="grid md:grid-cols-2 gap-x-16 gap-y-4 text-sm text-[#86868b] leading-relaxed font-medium">
                    <p>• 展开速算：衣柜结构展开 ≈ 投影面积 × 5（用于初步沟通）。</p>
                    <p>• 面积换算：宽 × 高 (mm) ÷ 1,000,000 = ㎡；不足计量按最小计价规则。</p>
                    <p>• “待定” 项目需结合极值尺寸 / 造型复杂度 / 用材等级。</p>
                    <p>• 本表仅内部参考，最终以设计复核与清单报价为准。</p>
                 </div>
              </div>
           </div>
           <div className="mt-12 text-center">
              <p className="text-xs text-[#86868b]/60 font-semibold uppercase tracking-widest">
                 © {new Date().getFullYear()} Xingdadi Furniture. Internal Use Only.
              </p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default FurniturePriceReference;