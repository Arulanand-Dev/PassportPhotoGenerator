/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { PhotoCropper } from './components/PhotoCropper';
import { LayoutSettings } from './components/LayoutSettings';
import { PrintSheetPreview } from './components/PrintSheetPreview';
import { PrintGuideModal } from './components/PrintGuideModal';

import { CropTransform, SheetConfig, PRESETS, PassportPreset } from './types';
import { getSamplePassportPhoto } from './utils/sampleImage';
import { Sparkles, ArrowRight, ShieldCheck, FileCheck, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [filename, setFilename] = useState<string>('passport_photo.jpg');
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | undefined>();

  const [activeTab, setActiveTab] = useState<'crop' | 'layout' | 'preview'>('crop');
  const [selectedPreset, setSelectedPreset] = useState<PassportPreset>(PRESETS[0]);

  const [isPrintGuideOpen, setIsPrintGuideOpen] = useState(false);

  // Crop State
  const [crop, setCrop] = useState<CropTransform>({
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
    brightness: 100,
    contrast: 100,
  });

  // Sheet Config - Default strictly 6x4 inch @ 300 DPI (1800x1200 px), 35x45mm (413x531 px), 1 row of 4 photos
  const [sheetConfig, setSheetConfig] = useState<SheetConfig>({
    sheetWidthInches: 6,
    sheetHeightInches: 4,
    dpi: 300,
    photoWidthMm: 35,
    photoHeightMm: 45,
    rows: 1,
    cols: 4,
    gapPx: 30,
    showCutLines: true,
    cutLineStyle: 'dashed',
    cutLineColor: '#D1D5DB',
    orientation: 'landscape',
    backgroundColor: '#FFFFFF',
  });

  // Load image element when imageSrc updates
  useEffect(() => {
    if (!imageSrc) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
    img.onload = () => {
      setImageElement(img);
      setImageDimensions({ width: img.width, height: img.height });
    };
  }, [imageSrc]);

  // Handle user uploading an image file
  const handleImageSelected = (file: File | string, name: string) => {
    setFilename(name);
    if (typeof file === 'string') {
      setImageSrc(file);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImageSrc(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
    // Reset crop state on new image
    setCrop({
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      brightness: 100,
      contrast: 100,
    });
    setActiveTab('crop');
  };

  // Handle sample photo button
  const handleUseSamplePhoto = () => {
    handleImageSelected(getSamplePassportPhoto(), 'sample_passport_photo.jpg');
  };

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 flex flex-col font-sans antialiased">
      
      {/* Top Header */}
      <Header
        onOpenPrintGuide={() => setIsPrintGuideOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasImage={!!imageElement}
      />

      {/* Main Body Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Step Indicator Banner / Print Specification Standard */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 border border-blue-200/80 font-mono font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
              300
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                  Print Specification Standard
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100">
                  Kiosk Standard
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Canvas: 6×4″ (1800×1200 px @ 300 DPI) • Photo: 35×45 mm (413×531 px) • 4 Copies Grid
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/80 shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>100% Print-Ready High Quality</span>
          </div>
        </div>

        {/* Upload Card */}
        <ImageUploader
          onImageSelected={handleImageSelected}
          onUseSamplePhoto={handleUseSamplePhoto}
          currentFilename={imageSrc ? filename : undefined}
          imageDimensions={imageDimensions}
        />

        {/* Active Workflow Views if Image Loaded */}
        {imageElement ? (
          <div className="space-y-6">
            
            {/* Tab 1: Crop & Face Framing */}
            {activeTab === 'crop' && (
              <PhotoCropper
                imageElement={imageElement}
                crop={crop}
                setCrop={setCrop}
                preset={selectedPreset}
                onCropConfirmed={() => setActiveTab('layout')}
              />
            )}

            {/* Tab 2: Layout Settings */}
            {activeTab === 'layout' && (
              <LayoutSettings
                config={sheetConfig}
                setConfig={setSheetConfig}
                selectedPreset={selectedPreset}
                setSelectedPreset={setSelectedPreset}
                onProceedToPreview={() => setActiveTab('preview')}
              />
            )}

            {/* Tab 3: Final High-Res Printable 6x4" Sheet */}
            {activeTab === 'preview' && (
              <PrintSheetPreview
                imageElement={imageElement}
                crop={crop}
                preset={selectedPreset}
                config={sheetConfig}
                onOpenPrintGuide={() => setIsPrintGuideOpen(true)}
              />
            )}

          </div>
        ) : (
          /* Empty State prompt when no image uploaded yet */
          <div className="bg-white rounded-2xl p-10 shadow-sm border border-slate-200/80 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">No Photo Uploaded Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Upload your soft-copy passport photo above or click "Test with Sample Photo" to generate your 6×4 inch 300 DPI photo grid instantly.
              </p>
            </div>
            <button
              onClick={handleUseSamplePhoto}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-500/20 active:scale-95 transition-all inline-flex items-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Test with Sample Passport Photo</span>
            </button>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 mt-12 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-1.5">
          <p className="font-semibold text-slate-200">
            GridPrint — Passport Photo 6×4″ Grid Generator
          </p>
          <p className="text-slate-400 max-w-xl mx-auto">
            Creates 1800×1200 pixel JPEG images at 300 DPI for printing at CVS, Walgreens, Boots, Kodak, or local photo kiosks.
          </p>
        </div>
      </footer>

      {/* Print Kiosk Instructions Modal */}
      <PrintGuideModal
        isOpen={isPrintGuideOpen}
        onClose={() => setIsPrintGuideOpen(false)}
      />

    </div>
  );
}
