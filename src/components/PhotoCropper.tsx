import React, { useRef, useEffect, useState } from 'react';
import { CropTransform, PassportPreset } from '../types';
import { renderSinglePhotoCanvas } from '../utils/photoProcessor';
import { RotateCw, RotateCcw, ZoomIn, ZoomOut, Move, Eye, Sun, Sliders, RefreshCw, Check } from 'lucide-react';

interface PhotoCropperProps {
  imageElement: HTMLImageElement | null;
  crop: CropTransform;
  setCrop: React.Dispatch<React.SetStateAction<CropTransform>>;
  preset: PassportPreset;
  onCropConfirmed: () => void;
}

export const PhotoCropper: React.FC<PhotoCropperProps> = ({
  imageElement,
  crop,
  setCrop,
  preset,
  onCropConfirmed,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showGuide, setShowGuide] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Update canvas preview whenever image, crop or preset changes
  useEffect(() => {
    if (!imageElement || !canvasRef.current) return;

    const previewCanvas = renderSinglePhotoCanvas(
      imageElement,
      crop,
      preset.widthPx300Dpi,
      preset.heightPx300Dpi
    );

    const targetCanvas = canvasRef.current;
    targetCanvas.width = preset.widthPx300Dpi;
    targetCanvas.height = preset.heightPx300Dpi;

    const ctx = targetCanvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
      ctx.drawImage(previewCanvas, 0, 0);
    }
  }, [imageElement, crop, preset]);

  // Dragging handlers for mouse panning
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - crop.x, y: e.clientY - crop.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setCrop((prev) => ({
      ...prev,
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleReset = () => {
    setCrop({
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      brightness: 100,
      contrast: 100,
    });
  };

  if (!imageElement) return null;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100 inline-block mb-1">
            Step 1: Framing & Alignment
          </span>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-600" />
            Face Framing & Biometric Crop
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Position head inside target {preset.widthMm}×{preset.heightMm} mm ({preset.widthPx300Dpi}×{preset.heightPx300Dpi} px @ 300 DPI) frame.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer ${
              showGuide
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Guide: {showGuide ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={handleReset}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80 transition-all flex items-center space-x-1 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1 text-slate-500" />
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Canvas Framing Box */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative p-3 bg-slate-900 rounded-2xl shadow-xl border border-slate-800 overflow-hidden w-full max-w-[320px] flex flex-col items-center">
            {/* Resolution Badge */}
            <div className="absolute top-4 left-4 z-20 px-2.5 py-1 bg-slate-800/90 backdrop-blur-md text-blue-400 text-[11px] font-mono font-semibold rounded-lg border border-slate-700/80">
              {preset.widthPx300Dpi}×{preset.heightPx300Dpi} px @ 300 DPI
            </div>

            {/* Interactive Canvas container */}
            <div
              className="relative cursor-move overflow-hidden flex items-center justify-center bg-slate-950 select-none rounded-xl border border-slate-700/80"
              style={{
                width: '260px',
                height: `${(260 * preset.heightPx300Dpi) / preset.widthPx300Dpi}px`,
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain pointer-events-none"
              />

              {/* Biometric Face Framing Overlay */}
              {showGuide && (
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-3">
                  {/* Top crown boundary */}
                  <div className="w-full border-b border-dashed border-amber-400/90 pt-5 text-[10px] text-amber-300 font-mono font-medium tracking-wider text-center bg-slate-950/40">
                    TOP OF HEAD / CROWN
                  </div>

                  {/* Eye Level Guideline */}
                  <div className="w-full border-b border-emerald-400/90 text-[10px] text-emerald-300 font-mono font-medium tracking-wider text-center flex items-center justify-between px-2">
                    <span>EYE LEVEL</span>
                    <div className="w-14 h-10 border border-emerald-400/60 rounded-full" />
                    <span>EYE LEVEL</span>
                  </div>

                  {/* Face Oval Frame */}
                  <div
                    className="absolute border border-amber-400/80 rounded-full pointer-events-none"
                    style={{
                      width: '58%',
                      height: '62%',
                      top: '19%',
                    }}
                  />

                  {/* Chin boundary */}
                  <div className="w-full border-t border-dashed border-amber-400/90 pb-5 text-[10px] text-amber-300 font-mono font-medium tracking-wider text-center bg-slate-950/40">
                    BOTTOM OF CHIN
                  </div>
                </div>
              )}
            </div>

            <div className="mt-2.5 text-center text-[11px] font-medium text-slate-400 py-1 flex items-center justify-center gap-1.5">
              <Move className="w-3.5 h-3.5 text-blue-400" />
              Click & drag to pan photo inside frame
            </div>
          </div>
        </div>

        {/* Adjustments Controls */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Zoom & Scale */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <ZoomIn className="w-4 h-4 text-blue-600" />
                Zoom & Scale
              </label>
              <span className="text-xs font-mono font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">
                {Math.round(crop.scale * 100)}%
              </span>
            </div>
            <div className="flex items-center space-x-3 pt-1">
              <ZoomOut className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.02"
                value={crop.scale}
                onChange={(e) =>
                  setCrop((prev) => ({ ...prev, scale: parseFloat(e.target.value) }))
                }
                className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
              <ZoomIn className="w-4 h-4 text-slate-400 shrink-0" />
            </div>
          </div>

          {/* Rotation & Angle */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <RotateCw className="w-4 h-4 text-blue-600" />
                Rotation & Tilt
              </label>
              <span className="text-xs font-mono font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">
                {crop.rotation}°
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => setCrop((prev) => ({ ...prev, rotation: (prev.rotation - 90 + 360) % 360 }))}
                className="py-1.5 bg-white rounded-lg border border-slate-200/80 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-center space-x-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>-90°</span>
              </button>

              <button
                onClick={() => setCrop((prev) => ({ ...prev, rotation: (prev.rotation + 90) % 360 }))}
                className="py-1.5 bg-white rounded-lg border border-slate-200/80 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-center space-x-1 cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5 text-slate-500" />
                <span>+90°</span>
              </button>

              <button
                onClick={() => setCrop((prev) => ({ ...prev, rotation: (prev.rotation + 180) % 360 }))}
                className="py-1.5 bg-white rounded-lg border border-slate-200/80 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                180°
              </button>

              <button
                onClick={() => setCrop((prev) => ({ ...prev, rotation: 0 }))}
                className="py-1.5 bg-white rounded-lg border border-slate-200/80 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Straight
              </button>
            </div>

            <input
              type="range"
              min="-15"
              max="15"
              step="0.5"
              value={crop.rotation > 180 ? crop.rotation - 360 : crop.rotation}
              onChange={(e) =>
                setCrop((prev) => ({
                  ...prev,
                  rotation: (parseFloat(e.target.value) + 360) % 360,
                }))
              }
              className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
            />
            <div className="flex justify-between text-[10px] font-mono font-medium text-slate-400">
              <span>Fine tilt -15°</span>
              <span>0°</span>
              <span>Fine tilt +15°</span>
            </div>
          </div>

          {/* Brightness & Contrast */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                  <Sun className="w-4 h-4 text-amber-500" />
                  Brightness
                </label>
                <span className="text-xs font-mono font-medium bg-slate-200/80 text-slate-700 px-1.5 py-0.5 rounded">{crop.brightness}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={crop.brightness}
                onChange={(e) =>
                  setCrop((prev) => ({ ...prev, brightness: parseInt(e.target.value) }))
                }
                className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                  <Sliders className="w-4 h-4 text-indigo-500" />
                  Contrast
                </label>
                <span className="text-xs font-mono font-medium bg-slate-200/80 text-slate-700 px-1.5 py-0.5 rounded">{crop.contrast}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={crop.contrast}
                onChange={(e) =>
                  setCrop((prev) => ({ ...prev, contrast: parseInt(e.target.value) }))
                }
                className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onCropConfirmed}
              className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all active:scale-[0.99] flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Confirm Framing & Continue to Layout</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
