
import React, { useRef, useState, useEffect } from 'react';
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  DoorOpen, Square, Package, Minus, Bath, User, Circle,
  Calculator, Info, Search, X, ChevronRight, 
  Menu, Sparkles, BookOpen, LayoutGrid, FileText,
  Download, Printer, Share2, ArrowRight, Settings,
  List as ListIcon, Grid as GridIcon, Check, Image as ImageIcon,
  Zap, FileSpreadsheet
} from "lucide-react";
import { jsPDF } from "jspdf";

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

const iconClass = "h-5 w-5 text-slate-500";

const priceData: PriceItem[] = [
  // Room Door Items
  { name: "房间门 (影木)", formula: "按套", unit: "套", priceRange: "5800", material: "影木贴皮", description: "影木贴皮复合", category: "门类", icon: <DoorOpen className={iconClass} /> },
  { name: "房间门 (烟熏/混油)", formula: "按套", unit: "套", priceRange: "5200", material: "烟熏/混油", description: "烟熏贴皮复合、混油烤漆复合", category: "门类", icon: <DoorOpen className={iconClass} /> },
  { name: "门➕套", formula: "按套", unit: "套", priceRange: "4800", material: "木/烤漆", description: "常规 2150；超高/超宽 +48/公分", category: "门类", icon: <DoorOpen className={iconClass} /> },
  { name: "子母门", formula: "按套", unit: "套", priceRange: "7920", material: "木/烤漆", description: "含门套; 价格≈门➕套(4800)×1.65", category: "门类", icon: <DoorOpen className={iconClass} /> },
  { name: "双开门", formula: "按套", unit: "套", priceRange: "9120", material: "木/烤漆", description: "含门套; 价格≈门➕套(4800)×1.9", category: "门类", icon: <DoorOpen className={iconClass} /> },
  { name: "隐形门", formula: "按套", unit: "套", priceRange: "5300", material: "木/烤漆", description: "标配液压荷叶(十字); 具体看造型", category: "门类", icon: <DoorOpen className={iconClass} /> },
  
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
  { name: "柜门 (免漆板)", formula: "宽×高", unit: "㎡", priceRange: "待定", material: "爱格/福人/PET", description: "品牌:爱格/福人; 稳定性好,适合做柜门", category: "柜门", icon: <DoorOpen className={iconClass} /> },
  { name: "柜门 (烟熏/混油)", formula: "宽×高", unit: "㎡", priceRange: "1780", material: "烟熏/混油", description: "烟熏贴皮复合、混油烤漆复合", category: "柜门", icon: <DoorOpen className={iconClass} /> },
  { name: "柜门 (影木)", formula: "宽×高", unit: "㎡", priceRange: "2080", material: "影木贴皮", description: "影木贴皮复合", category: "柜门", icon: <DoorOpen className={iconClass} /> },
  { name: "柜门 (金属漆)", formula: "宽×高", unit: "㎡", priceRange: "2180", material: "金属漆", description: "金属漆复合", category: "柜门", icon: <DoorOpen className={iconClass} /> },
  { name: "柜门 (影木格栅/弧形)", formula: "宽×高", unit: "㎡", priceRange: "2680", material: "影木贴皮", description: "影木贴皮格栅、弧形", category: "柜门", icon: <DoorOpen className={iconClass} /> },
  { name: "抽屉面", formula: "宽×高", unit: "㎡", priceRange: "1680", material: "木/烤漆", description: "不足0.2㎡按0.2㎡", category: "柜门", icon: <Square className={iconClass} /> },

  // Cabinet Bodies & Special Cabinets
  { name: "柜体 (双面铝)", formula: "宽×高", unit: "㎡", priceRange: "1680", material: "佰思双面铝", description: "佰思双面铝防潮板", category: "柜体", icon: <Package className={iconClass} /> },
  { name: "敞开柜 (标准)", formula: "宽×高", unit: "㎡", priceRange: "3800~4680", material: "贴皮/混油", description: "深350=3800; 深450=4200; 深600=4680", category: "柜体", icon: <Package className={iconClass} /> },
  { name: "敞开柜/高柜 (橡木/烟熏)", formula: "宽×高", unit: "㎡", priceRange: "4200", material: "橡木、烟熏贴皮复合", description: "敞开柜、高柜", category: "柜体", icon: <Package className={iconClass} /> },
  { name: "敞开柜/高柜 (混油)", formula: "宽×高", unit: "㎡", priceRange: "4000", material: "混油烤漆复合", description: "敞开柜、高柜", category: "柜体", icon: <Package className={iconClass} /> },
  { name: "敞开柜/高柜 (金属/影木)", formula: "宽×高", unit: "㎡", priceRange: "4800", material: "金属漆复合、影木贴皮复合", description: "敞开柜、高柜", category: "柜体", icon: <Package className={iconClass} /> },
  { name: "布鲁斯立柱开放柜+亚克力透光板", formula: "宽×高", unit: "㎡", priceRange: "7300", material: "贴皮复合、混油烤漆复合", description: "含亚克力透光板", category: "柜体", icon: <Package className={iconClass} /> },
  { name: "衣柜柜体 (生态板)", formula: "投影×5", unit: "㎡", priceRange: "680~880", material: "生态板", description: "品牌:兔宝宝/莫干山/小灵驹/好太太; 仅限柜体,做门易变形; 展开面积≈投影×5", category: "柜体", icon: <Package className={iconClass} /> },
  
  // Other Cabinet Items (Categorized as Body/Structure)
  { name: "浴室柜", formula: "长度", unit: "m", priceRange: "3800~4800/m", material: "防水板", description: "含防潮处理", category: "柜体", icon: <Bath className={iconClass} /> },
  { name: "梳妆台", formula: "长度", unit: "m", priceRange: "3800~4800/m", material: "木/烤漆", description: "含镜/灯可选", category: "柜体", icon: <User className={iconClass} /> },
  { name: "抽屉盒", formula: "长度", unit: "m", priceRange: "3800~4800/m", material: "木/烤漆", description: "含结构位", category: "柜体", icon: <Package className={iconClass} /> },
  { name: "抽屉", formula: "按个", unit: "个", priceRange: "200", material: "环保免漆板", description: "基础不含高端导轨", category: "柜体", icon: <Package className={iconClass} /> },
  
  // Smart Devices
  { name: "智能镜", formula: "长度", unit: "m", priceRange: "2800~3800/m", material: "智能玻璃", description: "触控/防雾/灯光", category: "智能设备", icon: <Circle className={iconClass} /> },
  { name: "灯带", formula: "按米", unit: "m", priceRange: "85", material: "LED", description: "灯带 (实价)", category: "智能设备", icon: <Sparkles className={iconClass} /> },
  { name: "变压器 (100W)", formula: "按个", unit: "个", priceRange: "238", material: "电子元件", description: "标配含1根延长线", category: "智能设备", icon: <Zap className={iconClass} /> },
  { name: "变压器延长线", formula: "按根", unit: "根", priceRange: "5", material: "线材", description: "2米/根; 通常每个变压器需额外配1根", category: "智能设备", icon: <Zap className={iconClass} /> },
  { name: "变压器分线盒", formula: "按个", unit: "个", priceRange: "35", material: "塑料", description: "5孔", category: "智能设备", icon: <Zap className={iconClass} /> },

  // Hardware
  { name: "液压荷叶 (十字)", formula: "按个", unit: "个", priceRange: "180", material: "金属", description: "常规配3个；超高(>2.4m)配4个", category: "五金", icon: <Settings className={iconClass} /> },
  { name: "四寸荷叶", formula: "按个", unit: "个", priceRange: "40", material: "金属", description: "隐形门平替方案；3个约120元", category: "五金", icon: <Settings className={iconClass} /> },
  { name: "门锁", formula: "按把", unit: "把", priceRange: "待定", material: "金属", description: "需客户选款后核价；默认不含在预算内", category: "五金", icon: <Settings className={iconClass} /> },
  { name: "门吸", formula: "按个", unit: "个", priceRange: "待定", material: "金属/磁吸", description: "单开门配1个，子母门/双开门配2个", category: "五金", icon: <Settings className={iconClass} /> },
  { name: "天地插", formula: "按个", unit: "个", priceRange: "待定", material: "金属", description: "子母门/双开门副扇固定用", category: "五金", icon: <Settings className={iconClass} /> },
  { name: "防尘器", formula: "按个", unit: "个", priceRange: "待定", material: "金属", description: "配合天地插使用；非必选项，不强调则不报", category: "五金", icon: <Settings className={iconClass} /> },
  { name: "反弹器", formula: "按个", unit: "个", priceRange: "待定", material: "金属/塑料", description: "一扇门一个", category: "五金", icon: <Settings className={iconClass} /> },
  { name: "柜门铰链", formula: "按门高", unit: "个", priceRange: "待定", material: "金属", description: "1m以下2个; 1-1.5m配3个; 2m以下4个; >2m配5个", category: "五金", icon: <Settings className={iconClass} /> }
];

const categories = [...new Set(priceData.map(i => i.category))];

// --- Main Component ---

const FurniturePriceReference: React.FC = () => {
  // Navigation & Layout State
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PriceItem | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
      
      // Intelligent default
      let defaultQuantity = '1';
      if (selectedItem.name.includes('液压荷叶')) defaultQuantity = '3';
      if (selectedItem.name === '四寸荷叶') defaultQuantity = '3';
      if (selectedItem.name === '门吸') defaultQuantity = '1'; 
      if (selectedItem.name === '天地插') defaultQuantity = '1';
      if (selectedItem.name === '防尘器') defaultQuantity = '1';
      if (selectedItem.name === '反弹器') defaultQuantity = '1';
      if (selectedItem.name.includes('变压器')) defaultQuantity = '1';
      if (selectedItem.name === '变压器延长线') defaultQuantity = '1';
      if (selectedItem.name === '变压器分线盒') defaultQuantity = '1';
      
      setCalcInputs({ w: '', h: '', l: '', q: defaultQuantity });
    }
  }, [selectedItem]);

  // Hinge Logic: Auto-calculate quantity based on height
  useEffect(() => {
    if (calcInputs.h) {
      const h = parseFloat(calcInputs.h);
      if (!isNaN(h)) {
        // Cabinet Hinges Logic
        if (selectedItem?.name === "柜门铰链") {
          let q = 2;
          if (h < 1000) q = 2;
          else if (h >= 1000 && h < 1500) q = 3;
          else if (h >= 1500 && h <= 2000) q = 4;
          else q = 5;

          if (calcInputs.q !== q.toString()) {
            setCalcInputs(prev => ({ ...prev, q: q.toString() }));
          }
        }
        
        // Room Door Hydraulic Hinge Logic
        if (selectedItem?.name === "液压荷叶 (十字)") {
           let q = 3;
           if (h > 2400) q = 4;
           
           if (calcInputs.q !== q.toString()) {
            setCalcInputs(prev => ({ ...prev, q: q.toString() }));
           }
        }
      }
    }
  }, [calcInputs.h, selectedItem]);

  // Open Cabinet Logic: Auto-calculate price based on depth
  useEffect(() => {
    if (selectedItem?.name === "敞开柜 (标准)" && calcInputs.l) {
      const d = parseFloat(calcInputs.l);
      if (!isNaN(d)) {
         let price = "3800";
         if (d <= 350) price = "3800";
         else if (d <= 450) price = "4200";
         else price = "4680";
         
         setManualPrice(price);
      }
    }
  }, [calcInputs.l, selectedItem]);

  const showWidthHeight = selectedItem && (["单边套", "双边套", "墙板", "柜门", "柜门 (免漆板)", "衣柜柜体 (生态板)", "衣柜柜体", "抽屉面", "柜体 (双面铝)", "敞开柜 (标准)", "敞开柜/高柜 (混油)", "敞开柜/高柜 (橡木/烟熏)", "敞开柜/高柜 (金属/影木)", "布鲁斯立柱开放柜+亚克力透光板", "柜门铰链", "液压荷叶 (十字)"].includes(selectedItem.name) || selectedItem.name.includes("墙板") || selectedItem.name.includes("柜门") || selectedItem.formula.includes("宽×高"));
  const showLength = selectedItem && (["收口条", "异形收口条", "浴室柜", "梳妆台", "抽屉盒", "智能镜", "灯带"].includes(selectedItem.name) || selectedItem.formula.includes("长度") || selectedItem.formula === "按米");
  const showDepth = selectedItem?.name === "敞开柜 (标准)";

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
    // For Open Cabinet (Standard), uses Width x Height for area, but Price is derived from Depth (l)
    if (showDepth) return (w * h / 1000000) * price * q; 

    return price * q;
  };

  const calculatedTotal = calculateTotal();

  // --- Export Logic ---
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleExportCSV = () => {
    setIsExporting('csv');
    try {
      // Define CSV Headers
      const headers = ['产品名称', '分类', '材质', '计价公式', '单位', '参考价', '详细描述'];
      
      // Map Data to CSV Rows
      const csvContent = [
        headers.join(','),
        ...filteredData.map(item => {
          // Escape quotes and wrap fields in quotes to handle commas in content
          return [
            `"${item.name.replace(/"/g, '""')}"`,
            `"${item.category.replace(/"/g, '""')}"`,
            `"${item.material.replace(/"/g, '""')}"`,
            `"${item.formula.replace(/"/g, '""')}"`,
            `"${item.unit.replace(/"/g, '""')}"`,
            `"${item.priceRange.replace(/"/g, '""')}"`,
            `"${item.description.replace(/"/g, '""')}"`
          ].join(',');
        })
      ].join('\n');

      // Add BOM for Excel UTF-8 support
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Price_List_${currentDate}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showNotification('success', '表格已导出 (CSV)');
    } catch (e) {
      console.error(e);
      showNotification('error', '导出失败');
    } finally {
      setIsExporting(null);
    }
  };

  const generateTableCanvas = async (): Promise<HTMLCanvasElement> => {
      if (!tableSectionRef.current) throw new Error('Export source not ready');
      
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

      return canvas;
  }

  const handleExportTableImage = async () => {
    setIsExporting('table');
    try {
      const canvas = await generateTableCanvas();
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

  const handleExportPDF = async () => {
    setIsExporting('pdf');
    try {
      const canvas = await generateTableCanvas();
      const imgData = canvas.toDataURL('image/png');
      
      // Initialize PDF (Orientation depends on aspect ratio)
      const orientation = canvas.width > canvas.height ? 'l' : 'p';
      const doc = new jsPDF({
        orientation,
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2] // Scale down by 2 (since canvas was scaled 2x for retina)
      });

      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = doc.internal.pageSize.getHeight();
      
      doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      doc.save(`Price_List_${currentDate}.pdf`);
      
      showNotification('success', 'PDF 已导出');
    } catch (e) {
      console.error(e);
      showNotification('error', '导出 PDF 失败');
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col font-sans text-[#1D1D1F] selection:bg-blue-100 selection:text-blue-900">
      
      {/* --- Global Header --- */}
      <header className="sticky top-0 z-40 w-full bg-[rgba(255,255,255,0.72)] backdrop-blur-xl border-b border-black/5 supports-[backdrop-filter]:bg-white/60">
        <div className="flex h-14 md:h-16 items-center px-4 md:px-6 gap-4 max-w-[1600px] mx-auto">
          <Button variant="ghost" size="icon" className="md:hidden text-slate-500 hover:bg-black/5" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-2 font-semibold text-lg tracking-tight text-[#1D1D1F]">
            <div className="bg-black text-white p-1.5 rounded-lg">
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
                placeholder="搜索产品..." 
                className="w-full h-9 md:h-10 pl-10 pr-4 rounded-lg bg-black/5 border-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all text-sm placeholder:text-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-1 md:gap-2">
            <div className="flex items-center bg-black/5 rounded-lg p-1 mr-2">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-black' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <GridIcon className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-black' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <ListIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="h-6 w-px bg-black/10 mx-1 hidden md:block"></div>

            <Button 
              variant="outline" 
              size="sm" 
              className="hidden md:flex gap-2 text-slate-600 border-black/10 bg-transparent hover:bg-black/5"
              onClick={handleExportCSV}
              disabled={!!isExporting}
            >
              {isExporting === 'csv' ? <span className="animate-spin">⏳</span> : <FileSpreadsheet className="h-4 w-4" />}
              表格
            </Button>

            <Button 
              variant="outline" 
              size="sm" 
              className="hidden md:flex gap-2 text-slate-600 border-black/10 bg-transparent hover:bg-black/5"
              onClick={handleExportTableImage}
              disabled={!!isExporting}
            >
              {isExporting === 'table' ? <span className="animate-spin">⏳</span> : <ImageIcon className="h-4 w-4" />}
              图片
            </Button>

            <Button 
              variant="outline" 
              size="sm" 
              className="hidden md:flex gap-2 text-slate-600 border-black/10 bg-transparent hover:bg-black/5"
              onClick={handleExportPDF}
              disabled={!!isExporting}
            >
               {isExporting === 'pdf' ? <span className="animate-spin">⏳</span> : <FileText className="h-4 w-4" />}
               PDF
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 items-start max-w-[1600px] mx-auto w-full">
        
        {/* --- Sidebar Navigation --- */}
        <aside className={`
          fixed inset-y-0 left-0 z-30 w-72 bg-[#F5F5F7]/95 backdrop-blur-xl border-r border-black/5 transform transition-transform duration-300 ease-in-out pt-16
          md:translate-x-0 md:static md:h-[calc(100vh-4rem)] md:bg-transparent md:border-r-0 md:pt-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="h-full overflow-y-auto p-4 md:p-6 md:pt-8 scrollbar-hide">
            <div className="mb-4 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              分类索引
            </div>
            <nav className="space-y-0.5">
              <button
                onClick={() => { setSelectedCategory('全部'); setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                  selectedCategory === '全部' 
                    ? 'bg-black/5 text-black' 
                    : 'text-slate-600 hover:bg-black/5 hover:text-black'
                }`}
              >
                <LayoutGrid className="h-4 w-4 opacity-70" />
                全部产品
                <span className="ml-auto text-xs opacity-40">{priceData.length}</span>
              </button>
              
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                    selectedCategory === cat 
                      ? 'bg-black/5 text-black' 
                      : 'text-slate-600 hover:bg-black/5 hover:text-black'
                  }`}
                >
                  <BookOpen className="h-4 w-4 opacity-70" />
                  {cat}
                  <span className="ml-auto text-xs opacity-40">{priceData.filter(i => i.category === cat).length}</span>
                </button>
              ))}
            </nav>

            <div className="mt-8 px-4 py-5 bg-white/60 rounded-2xl border border-black/5 shadow-sm backdrop-blur-sm">
               <h4 className="text-xs font-bold text-[#1D1D1F] mb-3 flex items-center gap-2">
                 <Info className="h-3 w-3 text-blue-500" />
                 销售简讯
               </h4>
               <div className="text-xs text-slate-500 leading-relaxed space-y-2.5">
                 <p>遇非标尺寸，请使用内置计算器试算。复杂工艺需咨询工厂。</p>
                 <div className="h-px bg-black/5 my-2"></div>
                 <p><span className="font-medium text-slate-700">门锁：</span> 需客户自选，默认不做预算。</p>
                 <p><span className="font-medium text-slate-700">隐形门：</span> 标配十字液压荷叶，可换普通四寸荷叶以降低预算。</p>
                 <p><span className="font-medium text-slate-700">变压器：</span> 预算不区分瓦数，按个数核算。</p>
                 <p><span className="font-medium text-slate-700">敞开柜：</span> 按深度计价，350深¥3800，450深¥4200，600深¥4680。</p>
                 <p><span className="font-medium text-slate-700">生态板：</span> 兔宝宝/莫干山/小灵驹/好太太仅做柜体，做柜门易变形。</p>
                 <p><span className="font-medium text-slate-700">免漆板：</span> 爱格/福人/PET材质稳定性好，适合做柜门。</p>
               </div>
            </div>
          </div>
        </aside>

        {/* --- Main Content Area --- */}
        <main className="flex-1 p-4 md:p-8 lg:px-12 min-w-0">
          
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-[#1D1D1F] tracking-tight">
               {selectedCategory === '全部' ? '所有产品' : selectedCategory}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
               {filteredData.length} 个项目
            </p>
          </div>

          {/* VIEW MODE: GRID */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
              {filteredData.map((item, idx) => (
                <div 
                  key={idx}
                  onClick={() => setSelectedItem(item)}
                  className="group relative bg-white rounded-2xl border border-black/5 p-5 shadow-sm hover:shadow-xl hover:shadow-black/5 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex flex-col h-full"
                >
                  <div className="flex items-start justify-between mb-4">
                      <div className="p-2.5 bg-[#F5F5F7] rounded-xl text-slate-600 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                        {item.icon}
                      </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-[17px] font-semibold text-[#1D1D1F] mb-1 group-hover:text-blue-600 transition-colors">
                        {item.name}
                    </h3>
                    <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-2">
                        {item.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-black/5 flex items-end justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-0.5">参考价</div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-[17px] font-semibold text-[#1D1D1F] tabular-nums">
                              {item.priceRange === '待定' ? '待定' : `¥${item.priceRange}`}
                            </span>
                            {item.priceRange !== '待定' && <span className="text-xs text-slate-400">/{item.unit}</span>}
                        </div>
                      </div>
                      <div className="text-slate-300 group-hover:text-blue-500 transition-colors">
                         <ArrowRight className="h-5 w-5" />
                      </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VIEW MODE: LIST */}
          {viewMode === 'list' && (
            <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
               <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="bg-slate-50/50 border-b border-black/5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                       <th className="px-6 py-4 w-12">#</th>
                       <th className="px-6 py-4">产品名称</th>
                       <th className="px-6 py-4 hidden md:table-cell">描述</th>
                       <th className="px-6 py-4">公式</th>
                       <th className="px-6 py-4 text-right">参考价</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-black/5 text-sm">
                     {filteredData.map((item, idx) => (
                       <tr 
                         key={idx} 
                         onClick={() => setSelectedItem(item)}
                         className="group hover:bg-blue-50/50 cursor-pointer transition-colors"
                       >
                         <td className="px-6 py-4 text-slate-400 font-mono text-xs">{idx + 1}</td>
                         <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                             <div className="p-2 rounded-lg bg-[#F5F5F7] text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                               {React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, { className: "h-4 w-4" })}
                             </div>
                             <div>
                               <div className="font-medium text-[#1D1D1F]">{item.name}</div>
                               <div className="text-xs text-slate-400 md:hidden mt-0.5">{item.description}</div>
                             </div>
                           </div>
                         </td>
                         <td className="px-6 py-4 text-slate-500 hidden md:table-cell max-w-xs truncate">
                           {item.description}
                         </td>
                         <td className="px-6 py-4">
                           <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-normal border-0">
                              {item.formula}
                           </Badge>
                         </td>
                         <td className="px-6 py-4 text-right">
                           <div className="font-semibold text-[#1D1D1F] tabular-nums">
                              {item.priceRange === '待定' ? '待定' : `¥${item.priceRange}`}
                              {item.priceRange !== '待定' && <span className="text-xs text-slate-400 font-normal ml-1">/{item.unit}</span>}
                           </div>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
               {filteredData.length === 0 && (
                  <div className="p-12 text-center text-slate-400">
                    未找到相关产品
                  </div>
               )}
            </div>
          )}

          {filteredData.length === 0 && viewMode === 'grid' && (
               <div className="py-20 text-center text-slate-400">
                  <Search className="h-10 w-10 mx-auto mb-4 opacity-20" />
                  <p>没有找到相关产品，请尝试其他关键词</p>
               </div>
            )}

        </main>
      </div>

      {/* --- Notification Toast --- */}
      {notification && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-xl shadow-black/10 text-sm font-medium text-white animate-in slide-in-from-bottom-5 fade-in ${
          notification.type === 'success' ? 'bg-[#1D1D1F]' : 'bg-red-500'
        }`}>
          {notification.message}
        </div>
      )}

      {/* --- Detail Modal (Apple Sheet Style) --- */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
           <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" onClick={() => setSelectedItem(null)} />
           
           <div className="relative bg-white w-full max-w-4xl max-h-[85vh] rounded-[24px] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300 ring-1 ring-black/5">
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/5 hover:bg-black/10 rounded-full text-slate-500 transition-colors md:hidden"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Left Side: Knowledge Article */}
              <div className="flex-1 p-8 md:p-10 overflow-y-auto bg-white">
                 <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 bg-[#F5F5F7] text-slate-700 rounded-2xl">
                       {React.cloneElement(selectedItem.icon as React.ReactElement<{ className?: string }>, { className: "h-8 w-8" })}
                    </div>
                    <div>
                       <h2 className="text-2xl font-bold text-[#1D1D1F] tracking-tight">{selectedItem.name}</h2>
                       <div className="flex items-center gap-3 text-sm text-slate-500 mt-2">
                          <span className="px-2 py-0.5 rounded-md bg-[#F5F5F7] border border-black/5">{selectedItem.category}</span>
                          <span>材质: {selectedItem.material}</span>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-8">
                    <section>
                       <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                          产品详情
                       </h3>
                       <p className="text-[#1D1D1F] leading-relaxed text-[15px]">
                          {selectedItem.description}
                       </p>
                    </section>
                    
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-5 rounded-2xl bg-[#F5F5F7] border border-black/5">
                          <div className="text-xs text-slate-400 font-semibold uppercase mb-1">计价单位</div>
                          <div className="text-xl font-semibold text-[#1D1D1F]">{selectedItem.unit}</div>
                       </div>
                       <div className="p-5 rounded-2xl bg-[#F5F5F7] border border-black/5">
                          <div className="text-xs text-slate-400 font-semibold uppercase mb-1">计价公式</div>
                          <div className="text-xl font-semibold text-[#1D1D1F] font-mono">{selectedItem.formula}</div>
                       </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-orange-50/50 border border-orange-100/50 text-orange-900/80 text-sm leading-relaxed flex gap-3">
                       <Info className="h-5 w-5 shrink-0 text-orange-400" /> 
                       <div>
                         <div className="font-semibold mb-1 text-orange-900">注意事项</div>
                         本产品价格仅供参考，特殊工艺（如超高、异形、特殊配色）需额外核价。下单前请务必复核现场尺寸。
                       </div>
                    </div>
                 </div>
              </div>

              {/* Right Side: Calculator Tool */}
              <div className="w-full md:w-[360px] bg-[#F5F5F7]/80 backdrop-blur-xl border-l border-black/5 p-8 flex flex-col">
                 <div className="mb-8 flex items-center justify-between">
                    <h3 className="text-base font-semibold text-[#1D1D1F] flex items-center gap-2">
                       <Calculator className="h-4 w-4 text-blue-500" />
                       价格试算
                    </h3>
                    <button onClick={() => setSelectedItem(null)} className="hidden md:block p-1 rounded-full hover:bg-black/5 text-slate-400 hover:text-slate-600 transition-colors">
                       <X className="h-5 w-5" />
                    </button>
                 </div>

                 <div className="space-y-6 flex-1">
                    <div className="space-y-2">
                       <label className="text-xs font-semibold text-slate-500 uppercase ml-1">基础单价 (¥)</label>
                       <div className="relative">
                         <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">¥</span>
                         <input 
                           type="number" 
                           value={manualPrice} 
                           onChange={e => setManualPrice(e.target.value)}
                           className="w-full h-12 pl-8 pr-4 rounded-xl border border-black/5 bg-white text-lg font-semibold text-[#1D1D1F] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                           placeholder="0"
                         />
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       {showWidthHeight && (
                         <>
                           <div className="space-y-2">
                              <label className="text-xs font-semibold text-slate-500 uppercase ml-1">宽度 (mm)</label>
                              <input type="number" value={calcInputs.w} onChange={e => setCalcInputs({...calcInputs, w: e.target.value})} className="w-full h-10 px-3 rounded-lg border border-black/10 bg-white/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" placeholder="0" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-semibold text-slate-500 uppercase ml-1">高度 (mm)</label>
                              <input type="number" value={calcInputs.h} onChange={e => setCalcInputs({...calcInputs, h: e.target.value})} className="w-full h-10 px-3 rounded-lg border border-black/10 bg-white/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" placeholder="0" />
                           </div>
                         </>
                       )}
                       {showLength && (
                           <div className="space-y-2 col-span-2">
                              <label className="text-xs font-semibold text-slate-500 uppercase ml-1">长度 (mm)</label>
                              <input type="number" value={calcInputs.l} onChange={e => setCalcInputs({...calcInputs, l: e.target.value})} className="w-full h-10 px-3 rounded-lg border border-black/10 bg-white/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" placeholder="0" />
                           </div>
                       )}
                       {showDepth && (
                           <div className="space-y-2 col-span-2">
                              <label className="text-xs font-semibold text-slate-500 uppercase ml-1">深度 (mm)</label>
                              <input type="number" value={calcInputs.l} onChange={e => setCalcInputs({...calcInputs, l: e.target.value})} className="w-full h-10 px-3 rounded-lg border border-black/10 bg-white/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" placeholder="0" />
                           </div>
                       )}
                       <div className="col-span-2 space-y-2">
                          <label className="text-xs font-semibold text-slate-500 uppercase ml-1">数量</label>
                          <input type="number" value={calcInputs.q} onChange={e => setCalcInputs({...calcInputs, q: e.target.value})} className="w-full h-10 px-3 rounded-lg border border-black/10 bg-white/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" placeholder="1" />
                       </div>
                    </div>
                 </div>

                 <div className="mt-8 pt-6 border-t border-black/5">
                    <div className="flex items-center justify-between text-slate-500 text-sm mb-2">
                       <span>预估总价</span>
                       <Badge variant="outline" className="text-[10px] h-5 bg-white border-black/5 text-slate-400 font-normal">不含税运</Badge>
                    </div>
                    <div className="text-4xl font-bold text-[#1D1D1F] tracking-tight tabular-nums">
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
