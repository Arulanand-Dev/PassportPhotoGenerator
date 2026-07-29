import React from 'react';
import { Camera, Printer, ShieldCheck, Sparkles, SlidersHorizontal, Info } from 'lucide-react';

interface HeaderProps {
  onOpenPrintGuide: () => void;
  activeTab: 'crop' | 'layout' | 'preview';
  setActiveTab: (tab: 'crop' | 'layout' | 'preview') => void;
  hasImage: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenPrintGuide,
  activeTab,
  setActiveTab,
  hasImage,
}) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                  Grid<span className="text-blue-600">Print</span>
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-blue-600" />
                  300 DPI 6×4" Canvas
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Official 35×45 mm Passport & Visa Photo Sheet Generator
              </p>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center flex-wrap gap-2.5">
            <button
              onClick={onOpenPrintGuide}
              className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 transition-all border border-blue-200/80 active:scale-95 cursor-pointer shadow-xs"
              title="Print settings for Walgreens, CVS, Boots, Kodak kiosks"
            >
              <Printer className="w-4 h-4 mr-1.5 text-blue-600" />
              <span>Print Kiosk Guide</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation if image loaded */}
        {hasImage && (
          <div className="flex items-center space-x-1.5 mt-3 pt-3 border-t border-slate-100">
            <button
              onClick={() => setActiveTab('crop')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center space-x-2 cursor-pointer ${
                activeTab === 'crop'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>1. Framing & Crop</span>
            </button>

            <button
              onClick={() => setActiveTab('layout')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center space-x-2 cursor-pointer ${
                activeTab === 'layout'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>2. Sheet Layout</span>
            </button>

            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center space-x-2 cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>3. Printable Canvas</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
