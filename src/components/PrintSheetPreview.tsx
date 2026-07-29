import React, { useRef, useEffect, useState } from 'react';
import { SheetConfig, CropTransform, PassportPreset } from '../types';
import { renderSinglePhotoCanvas, renderPrintSheet, downloadCanvasAsJpg } from '../utils/photoProcessor';
import { Download, Printer, ZoomIn, Eye, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

interface PrintSheetPreviewProps {
  imageElement: HTMLImageElement | null;
  crop: CropTransform;
  preset: PassportPreset;
  config: SheetConfig;
  onOpenPrintGuide: () => void;
}

export const PrintSheetPreview: React.FC<PrintSheetPreviewProps> = ({
  imageElement,
  crop,
  preset,
  config,
  onOpenPrintGuide,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [renderedCanvas, setRenderedCanvas] = useState<HTMLCanvasElement | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  // Re-render sheet when crop, config, image changes
  useEffect(() => {
    if (!imageElement || !canvasRef.current) return;

    // 1. Render single photo canvas at exact target resolution (e.g. 413x531 px)
    const singlePhotoCanvas = renderSinglePhotoCanvas(
      imageElement,
      crop,
      preset.widthPx300Dpi,
      preset.heightPx300Dpi
    );

    // 2. Render onto master 1800x1200 px sheet
    const { canvas: sheetCanvas } = renderPrintSheet(singlePhotoCanvas, config);
    setRenderedCanvas(sheetCanvas);

    // 3. Draw onto display preview canvas
    const previewCanvas = canvasRef.current;
    previewCanvas.width = sheetCanvas.width;
    previewCanvas.height = sheetCanvas.height;

    const ctx = previewCanvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
      ctx.drawImage(sheetCanvas, 0, 0);
    }
  }, [imageElement, crop, preset, config]);

  const handleDownloadJpg = () => {
    if (renderedCanvas) {
      downloadCanvasAsJpg(renderedCanvas, 'passport_photos_6x4.jpg', 0.98);
    }
  };

  const handleDownloadPng = () => {
    if (renderedCanvas) {
      const dataUrl = renderedCanvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'passport_photos_6x4.png';
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!imageElement) return null;

  const isLandscape = config.orientation === 'landscape';
  const canvasWidthPx = isLandscape ? 1800 : 1200;
  const canvasHeightPx = isLandscape ? 1200 : 1800;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-6">
      
      {/* Top Banner & Specs */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between pb-4 border-b border-slate-100 gap-4">
        <div>
          <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100 inline-block mb-1">
            Step 3: Printable Output
          </span>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Printer className="w-5 h-5 text-blue-600" />
              High-Resolution 6×4" Print Sheet
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
              Ready to Print
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Exact 300 DPI canvas output ({canvasWidthPx}×{canvasHeightPx} pixels). Suitable for printing at any 4×6" photo kiosk.
          </p>
        </div>

        {/* Primary Download Buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={handleDownloadJpg}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-500/20 transition-all active:scale-95 flex items-center space-x-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download 6×4" High-Res JPG</span>
          </button>

          <button
            onClick={handleDownloadPng}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-semibold text-xs border border-slate-200/80 transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Download PNG Sheet</span>
          </button>
        </div>
      </div>

      {/* Technical Specs Breakdown Badge */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
          <div className="text-[10px] uppercase font-bold text-slate-400">Sheet Size</div>
          <div className="text-xs font-bold text-slate-800 font-mono mt-0.5">
            6.0 × 4.0 Inches
          </div>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
          <div className="text-[10px] uppercase font-bold text-slate-400">Resolution</div>
          <div className="text-xs font-bold text-slate-800 font-mono mt-0.5">
            1800 × 1200 px @ 300 DPI
          </div>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
          <div className="text-[10px] uppercase font-bold text-slate-400">Single Photo</div>
          <div className="text-xs font-bold text-slate-800 font-mono mt-0.5">
            {preset.widthMm} × {preset.heightMm} mm ({preset.widthPx300Dpi}×{preset.heightPx300Dpi} px)
          </div>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
          <div className="text-[10px] uppercase font-bold text-slate-400">Copies Count</div>
          <div className="text-xs font-bold text-slate-800 font-mono mt-0.5">
            {config.cols * config.rows} Photos (Equal Gaps)
          </div>
        </div>
      </div>

      {/* Main Preview Screen */}
      <div className="relative flex flex-col items-center bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-inner">
        
        <div className="flex items-center justify-between w-full max-w-2xl mb-3 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Printable 6x4" Photo Canvas (300 DPI)
          </span>

          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-[11px] border border-slate-700 flex items-center space-x-1 cursor-pointer transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
            <span>{isZoomed ? 'Actual Scale' : 'Zoom 100% View'}</span>
          </button>
        </div>

        {/* Canvas Display with scale borders */}
        <div
          ref={containerRef}
          className={`relative bg-white shadow-2xl rounded-sm transition-all overflow-hidden border border-slate-700 ${
            isZoomed ? 'scale-125 my-8' : 'w-full max-w-2xl'
          }`}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-auto block"
          />
        </div>

        <p className="text-[11px] text-slate-400 mt-4 text-center max-w-lg">
          Tip: When printing at a photo kiosk (Walgreens, CVS, Boots, Kodak), order a standard <strong>4×6 inch print</strong> and ensure <strong>"Fit to Page" / "Do Not Auto-Crop"</strong> is selected.
        </p>

      </div>

      {/* Kiosk Printing Instructions Footer Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
            <Printer className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-blue-900">Printing at a Photo Kiosk or Home Printer</h4>
            <p className="text-xs text-blue-700 mt-0.5">
              Select 4×6" photo paper size. Do not apply automatic face detection or image cropping at the kiosk.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenPrintGuide}
          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors shrink-0 cursor-pointer"
        >
          View Full Kiosk Instructions
        </button>
      </div>

    </div>
  );
};
