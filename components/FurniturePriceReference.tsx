
import React, { useRef, useState, useEffect } from 'react';
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  DoorOpen, Square, Package, Minus, Bath, User, Circle,
  Calculator, Info, Search, X, ChevronRight, 
  Menu, Sparkles, BookOpen, LayoutGrid, FileText,
  Download, Printer, Share2, ArrowRight, Settings
} from "lucide-react";

// --- Types & Data ---

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

const iconClass = "h-5 w-5 text-slate-600";

const priceData: PriceItem[] = [
  // Room Door Items
  { name: "房间门 (影木)", formula: "按套", unit: "套", priceRange: "5800", material: "影木贴皮", description: "影木贴皮复合", category: "门类", icon: <DoorOpen className={iconClass} /> },
  { name: "房间门 (烟熏/混油)", formula: "按套", unit: "套", priceRange: "5200", material: "烟熏/混油", description: "烟熏贴皮复合、混油烤漆复合", category: "门类", icon: <DoorOpen className={iconClass} /> },
  { name: "门➕套", formula: "按套", unit: "套", priceRange: "4800", material: "木/烤漆", description: "常规 2150；超高/超宽 +48/公分", category: "门类", icon: <DoorOpen className={iconClass} /> },
  { name: "子母门", formula: "按套", unit: "套", priceRange: "待定", material: "木/烤漆", description: "主/副扇尺寸确认后核价", category: "门类", icon: <DoorOpen className={iconClass} /> },
  { name: "双开门", formula: "按套", unit: "套", priceRange: "待定", material: "木/烤漆", description: "规格 & 五金配置待定", category: "门类", icon: <DoorOpen className={iconClass} /> },
  
  // Door Frames & Trims
  { name: "单边套", formula: "高×2×数量+宽", unit: "套", priceRange: "320/m", material: "木/烤漆", description: "速算：≈双边套价÷3×2", category: "门类", icon: <Square className={iconClass} /> },
  { name: "双边套", formula: "高×4×数量+宽×2", unit: "套", priceRange: "480/m", material: "木/烤漆", description: "常规厚度约 2400", category: "门类", icon: <Square className={iconClass} /> },
  { name: "收口条", formula: "按米", unit: "m", priceRange: "260/m", material: "木/烤漆", description: "标准造型收边", category: "收口类", icon: <Minus className={iconClass} /> },
  { name: "异形收口条", formula: "按米", unit: "m", priceRange: "780/m", material: "木/烤漆", description: "复杂造型≈260×3", category: "收口类", icon: <Minus className={iconClass} /> },
  
  // Wall Panel Items
  { name: "墙板 (基础复合)", formula: "宽×高", unit: "㎡", priceRange: "1680", material: "贴皮/混油", description: "贴皮复合、混油烤漆复合", category: "墙面", icon: <Square className={iconClass} /> },
  { name: "墙板 (格栅/弧形)", formula: "宽×高", unit: "㎡", priceRange: "2380", material: "贴皮/混油", description: "贴皮复合、混油烤漆格栅、弧形", category: "墙面", icon: <Square className={iconClass} /> },
  { name: "墙板 (金属漆)", formula: "宽×高", unit: "㎡", priceRange: "2080", material: "金属漆", description: "金属漆复合", category: "墙面", icon: <Square className={iconClass} /> },
  { name: "墙板 (影木)", formula: "宽×高", unit: "㎡", priceRange: "1980", material: "影木贴皮", description: "影木贴皮复合", category: "墙面", icon: <Square className={iconClass} /> },
  { name: "墙板 (影木特殊)", formula: "宽×高", unit: "㎡", priceRange: "2580", material: "影木贴皮", description: "影木贴皮格栅、弧形", category: "墙面", icon: <Square className={iconClass} /> },

  // Cabinet Door Items
  { name: "柜门 (烟熏/混油)", formula: "宽×高", unit: "㎡", priceRange: "1780", material: "烟熏/混油", description: "烟熏贴皮复合、混油烤漆复合", category: "柜类", icon: <DoorOpen className={iconClass} /> },
  { name: "柜门 (影木)", formula: "宽×高", unit: "㎡", priceRange: "2080", material: "影木贴皮", description: "影木贴皮复合", category: "柜类", icon: <DoorOpen className={iconClass} /> },
  { name: "柜门 (金属漆)", formula: "宽×高", unit: "㎡", priceRange: "2180", material: "金属漆", description: "金属漆复合", category: "柜类", icon: <DoorOpen className={iconClass} /> },
  { name: "柜门 (影木格栅/弧形)", formula: "宽×高", unit: "㎡", priceRange: "2680", material: "影木贴皮", description: "影木贴皮格栅、弧形", category: "柜类", icon: <DoorOpen className={iconClass} /> },

  // Cabinet Bodies & Special Cabinets
  { name: "柜体 (双面铝)", formula: "宽×高", unit: "㎡", priceRange: "1680", material: "佰思双面铝", description: "佰思双面铝防潮板", category: "柜类", icon: <Package className={iconClass} /> },
  { name: "敞开柜/高柜 (橡木/烟熏)", formula: "宽×高", unit: "㎡", priceRange: "4200", material: "橡木、烟熏贴皮复合", description: "敞开柜、高柜", category: "柜类", icon: <Package className={iconClass} /> },
  { name: "敞开柜/高柜 (混油)", formula: "宽×高", unit: "㎡", priceRange: "4000", material: "混油烤漆复合", description: "敞开柜、高柜", category: "柜类", icon: <Package className={iconClass} /> },
  { name: "敞开柜/高柜 (金属/影木)", formula: "宽×高", unit: "㎡", priceRange: "4800", material: "金属漆复合、影木贴皮复合", description: "敞开柜、高柜", category: "柜类", icon: <Package className={iconClass} /> },
  { name: "布鲁斯立柱开放柜+亚克力透光板", formula: "宽×高", unit: "㎡", priceRange: "7300", material: "贴皮复合、混油烤漆复合", description: "含亚克力透光板", category: "柜类", icon: <Package className={iconClass} /> },
  { name: "衣柜柜体", formula: "投影×5", unit: "㎡", priceRange: "680~880", material: "生态板", description: "展开面积≈投影×5", category: "柜类", icon: <Package className={iconClass} /> },
  
  // Other Cabinet Items
  { name: "浴室柜", formula: "长度", unit: "m", priceRange: "3800~4800/m", material: "防水板", description: "含防潮处理", category: "柜类", icon: <Bath className={iconClass} /> },
  { name: "梳妆台", formula: "长度", unit: "m", priceRange: "3800~4800/m", material: "木/烤漆", description: "含镜/灯可选", category: "柜类", icon: <User className={iconClass} /> },
  { name: "抽屉面", formula: "宽×高", unit: "㎡", priceRange: "1680", material: "木/烤漆", description: "不足0.2㎡按0.2㎡", category: "柜类", icon: <Square className={iconClass} /> },
  { name: "抽屉盒", formula: "长度", unit: "m", priceRange: "3800~4800/m", material: "木/烤漆", description: "含结构位", category: "柜类", icon: <Package className={iconClass} /> },
  { name: "抽屉", formula: "按个", unit: "个", priceRange: "31/个", material: "环保免漆板", description: "基础不含高端导轨", category: "柜类", icon: <Package className={iconClass} /> },
  
  // Smart Devices
  { name: "智能镜", formula: "长度", unit: "m", priceRange: "2800~3800/m", material: "智能玻璃", description: "触控/防雾/灯光", category: "智能设备", icon: <Circle className={iconClass} /> },
  { name: "灯带", formula: "按米", unit: "m", priceRange: "85", material: "LED", description: "灯带 (实价)", category: "智能设备", icon: <Sparkles className={iconClass} /> },

  // Hardware
  { name: "液压荷叶", formula: "按个", unit: "个", priceRange: "80", material: "金属", description: "承重80kg；即十字荷叶；2.4m门通常配3个", category: "五金", icon: <Settings className={iconClass} /> },
  { name: "门吸", formula: "按个", unit: "个", priceRange: "待定", material: "金属/磁吸", description: "单开门配1个，子母门/双开门配2个", category: "五金", icon: <Settings className={iconClass} /> }
];

const categories = [...new Set(priceData.map(i => i.category))];

// --- Main Component ---

const FurniturePriceReference: React.FC = () => {
  // Navigation & Layout State
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PriceItem | null>(null);

  // Export State
  const tableSectionRef = useRef<HTMLDivElement | null>(null);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Calculator State (Embedded)
  const [calcInputs, setCalcInputs] = useState({ w: '', h: '', l: '', q: '1' });
  const [manualPrice, setManualPrice] = useState('');

  const currentDate = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit'
  });

  // --- Filtering ---
  const filteredData = priceData.filter(item => {
    const matchesCategory = selectedCategory === '全部' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // --- Calculator Logic ---
  useEffect(() => {
    if (selectedItem) {
      const match = selectedItem.priceRange.match(/(\d+)/);
      setManualPrice(match ? match[0] : '');
      
      // Intelligent default: 3 for hydraulic hinges as per description
      let defaultQuantity = '1';
      if (selectedItem.name === '液压荷叶') defaultQuantity = '3';
      if (selectedItem.name === '门吸') defaultQuantity = '1'; // Default to 1
      
      setCalcInputs({ w: '', h: '', l: '', q: defaultQuantity });
    }
  }, [selectedItem]);

  const showWidthHeight = selectedItem && (["单边套", "双边套", "墙板", "柜门", "衣柜柜体", "抽屉面", "柜体 (双面铝)", "敞开柜/高柜 (混油)", "敞开柜/高柜 (橡木/烟熏)", "敞开柜/高柜 (金属/影木)", "布鲁斯立柱开放柜+亚克力透光板"].includes(selectedItem.name) || selectedItem.name.includes("墙板") || selectedItem.name.includes("柜门") || selectedItem.formula.includes("宽×高"));
  const showLength = selectedItem && (["收口条", "异形收口条", "浴室柜", "梳妆台", "抽屉盒", "智能镜", "灯带"].includes(selectedItem.name) || selectedItem.formula.includes("长度") || selectedItem.formula === "按米");

  const calculateTotal = () => {
    if (!selectedItem) return 0;
    const price = parseFloat(manualPrice) || 0;
    const w = parseFloat(calcInputs.w) || 0;
    const h = parseFloat(calcInputs.h) || 0;
    const l = parseFloat(calcInputs.l) || 0;
    const q = parseFloat(calcInputs.q) || 1;

    if (selectedItem.name === "单边套") return ((h * 2 * q + w) / 1000) * price;
    if (selectedItem.name === "双边套") return ((h * 4 * q + w * 2) / 1000) * price;
    if (selectedItem.formula.includes("宽×高")) return (w * h / 1000000) * price * q; 
    if (selectedItem.formula === "投影×5") return (w * h / 1000000) * 5 * price * q;
    if (showLength) return (l / 1000) * price * q;
    return price * q;
  };

  const calculatedTotal = calculateTotal();

  // --- Export Logic (Legacy Support) ---
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleExportTableImage = async () => {
    if (!tableSectionRef.current) return;
    setIsExporting('table');
    try {
      // Logic for canvas generation (reusing previous robust logic)
      const table = tableSectionRef.current.querySelector('table');
      if (!table) throw new Error('Export source not ready');

      const headerCells = Array.from(table.querySelectorAll('thead th')).map((th) => (th as HTMLElement).textContent?.trim() || '');
      const bodyRows = Array.from(table.querySelectorAll('tbody tr')).map((tr) =>
        Array.from((tr as HTMLElement).querySelectorAll('td')).map((td) => (td as HTMLElement).innerText.trim())
      );
      const allRows = [headerCells, ...bodyRows];

      // Configuration for canvas
      const paddingX = 24, paddingY = 16, lineHeight = 24;
      const font = "14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
      const headerFont = "600 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
      
      // Calculate dimensions
      const measureCanvas = document.createElement('canvas');
      const mCtx = measureCanvas.getContext('2d')!;
      mCtx.font = font;
      const colWidths = headerCells.map(() => 100);
      allRows.forEach(row => row.forEach((cell, i) => {
        const w = mCtx.measureText(cell).width + paddingX * 2;
        if (w > colWidths[i]) colWidths[i] = Math.min(w, 400);
      }));
      const tableWidth = colWidths.reduce((a, b) => a + b, 0);
      const rowHeight = lineHeight + paddingY * 2;
      const tableHeight = allRows.length * rowHeight;
      const headSpace = 100;

      const scale = 2;
      const canvas = document.createElement('canvas');
      canvas.width = tableWidth * scale;
      canvas.height = (tableHeight + headSpace + 60) * scale;
      const ctx = canvas.getContext('2d')!;
      ctx.scale(scale, scale);
      
      // Draw Background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, tableWidth, tableHeight + headSpace + 60);

      // Draw Header
      ctx.fillStyle = "#111827";
      ctx.font = "bold 24px -apple-system, BlinkMacSystemFont, 'Segoe UI'";
      ctx.fillText("兴大地 · 产品价格知识库", 32, 50);
      ctx.fillStyle = "#6b7280";
      ctx.font = "14px -apple-system, BlinkMacSystemFont, 'Segoe UI'";
      ctx.fillText(`生成日期: ${currentDate}`, 32, 80);

      // Draw Table
      allRows.forEach((row, ri) => {
        const y = headSpace + ri * rowHeight;
        if (ri === 0) {
          ctx.fillStyle = "#f3f4f6";
          ctx.fillRect(0, y, tableWidth, rowHeight);
        }
        ctx.fillStyle = ri === 0 ? "#111827" : "#374151";
        ctx.font = ri === 0 ? headerFont : font;
        ctx.textBaseline = "middle";
        let x = 0;
        row.forEach((cell, ci) => {
           ctx.fillText(cell, x + paddingX, y + rowHeight / 2);
           x += colWidths[ci];
        });
        // Border
        ctx.strokeStyle = "#e5e7eb";
        ctx.beginPath();
        ctx.moveTo(0, y + rowHeight);
        ctx.lineTo(tableWidth, y + rowHeight);
        ctx.stroke();
      });

      const link = document.createElement('a');
      link.download = `Price_List_${currentDate}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      showNotification('success', '表格图片已导出');
    } catch (e) {
      showNotification('error', '导出失败');
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      
      {/* --- Global Header --- */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/60">
        <div className="flex h-16 items-center px-4 md:px-6 gap-4">
          <Button variant="ghost" size="icon" className="md:hidden text-slate-500" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight text-slate-900">
            <div className="bg-slate-900 text-white p-1.5 rounded-lg">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="hidden md:inline">兴大地 · 导购知识库</span>
            <span className="md:hidden">知识库</span>
          </div>

          <div className="flex-1 max-w-md ml-4 md:ml-8">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input 
                type="text" 
                placeholder="搜索产品、材质或公式..." 
                className="w-full h-10 pl-10 pr-4 rounded-full bg-slate-100 border-none focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden md:flex gap-2 text-slate-600 border-slate-200 hover:bg-slate-50"
              onClick={handleExportTableImage}
              disabled={!!isExporting}
            >
              {isExporting ? <span className="animate-spin">⏳</span> : <Download className="h-4 w-4" />}
              导出价目表
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 items-start max-w-[1600px] mx-auto w-full">
        
        {/* --- Sidebar Navigation --- */}
        <aside className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
          md:translate-x-0 md:static md:h-[calc(100vh-4rem)] md:bg-transparent md:border-r-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="h-full overflow-y-auto p-4 md:p-6 md:pt-8">
            <div className="mb-6 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Knowledge Categories
            </div>
            <nav className="space-y-1">
              <button
                onClick={() => { setSelectedCategory('全部'); setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all ${
                  selectedCategory === '全部' 
                    ? 'bg-blue-50 text-blue-700 shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-100/50 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
                全部产品
                <span className="ml-auto text-xs opacity-60 bg-white/50 px-2 py-0.5 rounded-full">{priceData.length}</span>
              </button>
              
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all ${
                    selectedCategory === cat 
                      ? 'bg-blue-50 text-blue-700 shadow-sm' 
                      : 'text-slate-600 hover:bg-slate-100/50 hover:text-slate-900'
                  }`}
                >
                  <BookOpen className="h-4 w-4 opacity-70" />
                  {cat}
                  <span className="ml-auto text-xs opacity-60">{priceData.filter(i => i.category === cat).length}</span>
                </button>
              ))}
            </nav>

            <div className="mt-10 px-4 py-4 bg-slate-100/50 rounded-2xl border border-slate-200/50">
               <h4 className="text-xs font-bold text-slate-900 mb-2">💡 销售小贴士</h4>
               <div className="text-xs text-slate-500 leading-relaxed space-y-2">
                 <p>遇到非标尺寸时，请先使用内置计算器试算，复杂工艺务必咨询工厂确认工期。</p>
                 <p>
                   <span className="font-semibold text-slate-600">门碰配置：</span>
                   单开门配1个，子母门/双开门配2个。
                 </p>
               </div>
            </div>
          </div>
        </aside>

        {/* --- Main Content Area --- */}
        <main className="flex-1 p-4 md:p-8 lg:p-10 min-w-0">
          
          {/* Breadcrumb / Title */}
          <div className="mb-8 flex items-end justify-between">
            <div>
               <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                  <span>知识库</span>
                  <ChevronRight className="h-3 w-3" />
                  <span className="text-slate-900 font-medium">{selectedCategory}</span>
               </div>
               <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                 {selectedCategory === '全部' ? '所有产品定价索引' : `${selectedCategory} 定价细则`}
               </h1>
            </div>
            <div className="hidden md:block text-sm text-slate-500">
               共找到 {filteredData.length} 个结果
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {filteredData.map((item, idx) => (
              <div 
                key={idx}
                onClick={() => setSelectedItem(item)}
                className="group relative bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full"
              >
                 <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-slate-50 rounded-xl text-slate-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                       {item.icon}
                    </div>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                      {item.category}
                    </Badge>
                 </div>
                 
                 <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {item.name}
                 </h3>
                 <p className="text-sm text-slate-500 line-clamp-2 mb-6 flex-1 leading-relaxed">
                    {item.description}
                 </p>

                 <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                       <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">参考价</span>
                       <div className="flex items-baseline gap-1">
                          <span className="text-lg font-bold text-slate-900">
                            {item.priceRange === '待定' ? '待定' : `¥${item.priceRange}`}
                          </span>
                          {item.priceRange !== '待定' && <span className="text-xs text-slate-400">/{item.unit}</span>}
                       </div>
                    </div>
                    <Button size="icon" variant="ghost" className="rounded-full text-slate-300 group-hover:text-blue-600 group-hover:bg-blue-50">
                       <ArrowRight className="h-5 w-5" />
                    </Button>
                 </div>
              </div>
            ))}
            
            {filteredData.length === 0 && (
               <div className="col-span-full py-20 text-center text-slate-400">
                  <Search className="h-10 w-10 mx-auto mb-4 opacity-20" />
                  <p>没有找到相关产品，请尝试其他关键词</p>
               </div>
            )}
          </div>

        </main>
      </div>

      {/* --- Notification Toast --- */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-50 px-6 py-3 rounded-full shadow-lg text-sm font-bold text-white animate-in slide-in-from-bottom-5 fade-in ${
          notification.type === 'success' ? 'bg-emerald-600' : 'bg-red-500'
        }`}>
          {notification.message}
        </div>
      )}

      {/* --- Detail Modal (Knowledge Card + Calculator) --- */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setSelectedItem(null)} />
           
           <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-white/50 hover:bg-slate-100 rounded-full text-slate-500 transition-colors md:hidden"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Left Side: Knowledge Article */}
              <div className="flex-1 p-8 md:p-10 overflow-y-auto bg-white">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                       {React.cloneElement(selectedItem.icon as React.ReactElement<{ className?: string }>, { className: "h-8 w-8" })}
                    </div>
                    <div>
                       <h2 className="text-2xl font-bold text-slate-900">{selectedItem.name}</h2>
                       <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                          <Badge variant="outline" className="text-slate-500 border-slate-200">{selectedItem.category}</Badge>
                          <span>•</span>
                          <span>材质: {selectedItem.material}</span>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-8">
                    <section>
                       <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                          <FileText className="h-4 w-4 text-blue-600" />
                          产品详情
                       </h3>
                       <p className="text-slate-600 leading-relaxed text-base">
                          {selectedItem.description}
                       </p>
                    </section>
                    
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                          <div className="text-xs text-slate-400 font-bold uppercase mb-1">计价单位</div>
                          <div className="text-lg font-bold text-slate-900">{selectedItem.unit}</div>
                       </div>
                       <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                          <div className="text-xs text-slate-400 font-bold uppercase mb-1">计价公式</div>
                          <div className="text-lg font-bold text-slate-900 font-mono">{selectedItem.formula}</div>
                       </div>
                    </div>

                    <section className="p-5 rounded-2xl bg-amber-50 border border-amber-100 text-amber-900/80 text-sm leading-relaxed">
                       <h3 className="font-bold flex items-center gap-2 mb-2 text-amber-900">
                          <Info className="h-4 w-4" /> 
                          注意事项
                       </h3>
                       本产品价格仅供参考，特殊工艺（如超高、异形、特殊配色）需额外核价。下单前请务必复核现场尺寸。
                    </section>
                 </div>
              </div>

              {/* Right Side: Calculator Tool */}
              <div className="w-full md:w-[380px] bg-slate-50 border-l border-slate-200 p-8 flex flex-col">
                 <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                       <Calculator className="h-5 w-5 text-blue-600" />
                       价格试算
                    </h3>
                    <button onClick={() => setSelectedItem(null)} className="hidden md:block text-slate-400 hover:text-slate-600">
                       <X className="h-5 w-5" />
                    </button>
                 </div>

                 <div className="space-y-5 flex-1">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-500 uppercase">基础单价 (¥)</label>
                       <input 
                         type="number" 
                         value={manualPrice} 
                         onChange={e => setManualPrice(e.target.value)}
                         className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-lg font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                         placeholder="输入单价"
                       />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       {showWidthHeight && (
                         <>
                           <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-500 uppercase">宽度 (mm)</label>
                              <input type="number" value={calcInputs.w} onChange={e => setCalcInputs({...calcInputs, w: e.target.value})} className="w-full h-10 px-3 rounded-lg border border-slate-200" placeholder="0" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-500 uppercase">高度 (mm)</label>
                              <input type="number" value={calcInputs.h} onChange={e => setCalcInputs({...calcInputs, h: e.target.value})} className="w-full h-10 px-3 rounded-lg border border-slate-200" placeholder="0" />
                           </div>
                         </>
                       )}
                       {showLength && (
                           <div className="space-y-2 col-span-2">
                              <label className="text-xs font-bold text-slate-500 uppercase">长度 (mm)</label>
                              <input type="number" value={calcInputs.l} onChange={e => setCalcInputs({...calcInputs, l: e.target.value})} className="w-full h-10 px-3 rounded-lg border border-slate-200" placeholder="0" />
                           </div>
                       )}
                       <div className="col-span-2 space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase">数量</label>
                          <input type="number" value={calcInputs.q} onChange={e => setCalcInputs({...calcInputs, q: e.target.value})} className="w-full h-10 px-3 rounded-lg border border-slate-200" placeholder="1" />
                       </div>
                    </div>
                 </div>

                 <div className="mt-8 pt-6 border-t border-slate-200">
                    <div className="flex items-center justify-between text-slate-500 text-sm mb-1">
                       <span>预估总价</span>
                       <span className="text-xs bg-slate-200 px-2 py-0.5 rounded text-slate-600">不含税/运费</span>
                    </div>
                    <div className="text-4xl font-bold text-slate-900 tracking-tight">
                       ¥{calculatedTotal.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* --- Hidden Table for Export Functionality --- */}
      <div className="hidden">
         <div ref={tableSectionRef}>
            <table>
               <thead>
                 <tr>
                   <th>No.</th><th>Product</th><th>Formula</th><th>Unit</th><th>Price</th><th>Material</th><th>Note</th><th>Category</th>
                 </tr>
               </thead>
               <tbody>
                 {filteredData.map((item, i) => (
                   <tr key={i}>
                     <td>{i + 1}</td><td>{item.name}</td><td>{item.formula}</td><td>{item.unit}</td><td>{item.priceRange}</td><td>{item.material}</td><td>{item.description}</td><td>{item.category}</td>
                   </tr>
                 ))}
               </tbody>
            </table>
         </div>
      </div>

    </div>
  );
};

export default FurniturePriceReference;
