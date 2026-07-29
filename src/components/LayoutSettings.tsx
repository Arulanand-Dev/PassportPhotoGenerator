import React from 'react';
import { SheetConfig, PassportPreset, PRESETS } from '../types';
import { LayoutGrid, Scissors, Sparkles, SlidersHorizontal, Check } from 'lucide-react';

interface LayoutSettingsProps {
  config: SheetConfig;
  setConfig: React.Dispatch<React.SetStateAction<SheetConfig>>;
  selectedPreset: PassportPreset;
  setSelectedPreset: (preset: PassportPreset) => void;
  onProceedToPreview: () => void;
}

export const LayoutSettings: React.FC<LayoutSettingsProps> = ({
  config,
  setConfig,
  selectedPreset,
  setSelectedPreset,
  onProceedToPreview,
}) => {
  const handlePresetChange = (presetId: string) => {
    const preset = PRESETS.find((p) => p.id === presetId) || PRESETS[0];
    setSelectedPreset(preset);
    setConfig((prev) => ({
      ...prev,
      photoWidthMm: preset.widthMm,
      photoHeightMm: preset.heightMm,
      rows: preset.defaultRows,
      cols: preset.defaultCols,
    }));
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100 inline-block mb-1">
            Step 2: Sheet Setup
          </span>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-blue-600" />
            Grid Layout & Cut Line Settings
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure photo grid arrangement and scissors trimming guides on 6×4 inch canvas.
          </p>
        </div>

        <div className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg border border-slate-200/80 font-mono text-xs font-medium shrink-0">
          Target Canvas: {config.orientation === 'landscape' ? '1800×1200' : '1200×1800'} px @ 300 DPI
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Preset Selector */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-800 tracking-wide block">
            Passport Dimension & Layout Presets
          </label>

          <div className="space-y-2.5">
            {PRESETS.map((preset) => {
              const isSelected = selectedPreset.id === preset.id;
              return (
                <div
                  key={preset.id}
                  onClick={() => handlePresetChange(preset.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                    isSelected
                      ? 'bg-blue-50/60 border-blue-500 shadow-xs'
                      : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-100/60'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-900">{preset.name}</span>
                      {preset.id === 'uk_eu_35x45' && (
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-600 text-white rounded-md">
                          DEFAULT
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-mono">{preset.description}</p>
                  </div>

                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 shrink-0 ${
                    isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Grid & Cut Line Details */}
        <div className="space-y-6">

          {/* Grid Rows & Columns */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
            <label className="text-xs font-semibold text-slate-800 tracking-wide block">
              Grid Placement (Rows × Columns)
            </label>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-600 mb-1 block">
                  Columns (Horizontal)
                </label>
                <select
                  value={config.cols}
                  onChange={(e) => setConfig((prev) => ({ ...prev, cols: parseInt(e.target.value) }))}
                  className="w-full bg-white border border-slate-200/80 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value={1}>1 Photo Row</option>
                  <option value={2}>2 Photos Wide</option>
                  <option value={3}>3 Photos Wide</option>
                  <option value={4}>4 Photos Wide (Standard 1x4)</option>
                  <option value={5}>5 Photos Wide</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-600 mb-1 block">
                  Rows (Vertical)
                </label>
                <select
                  value={config.rows}
                  onChange={(e) => setConfig((prev) => ({ ...prev, rows: parseInt(e.target.value) }))}
                  className="w-full bg-white border border-slate-200/80 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value={1}>1 Single Row across Center</option>
                  <option value={2}>2 Rows Grid (8 Photos)</option>
                  <option value={3}>3 Rows Grid</option>
                </select>
              </div>
            </div>

            <div className="p-2.5 bg-blue-50 text-blue-800 rounded-lg text-xs font-medium border border-blue-100 flex items-center justify-between">
              <span>Total photos on 6×4" sheet:</span>
              <span className="font-bold font-mono text-blue-700">{config.cols * config.rows} COPIES</span>
            </div>
          </div>

          {/* Scissors Cut Lines */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-800 tracking-wide flex items-center gap-1.5">
                <Scissors className="w-4 h-4 text-blue-600" />
                Scissors Cut Line Guides
              </label>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showCutLines}
                  onChange={(e) => setConfig((prev) => ({ ...prev, showCutLines: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
              </label>
            </div>

            {config.showCutLines && (
              <div className="grid grid-cols-3 gap-2 pt-1">
                <button
                  onClick={() => setConfig((prev) => ({ ...prev, cutLineStyle: 'solid' }))}
                  className={`py-1.5 px-2 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                    config.cutLineStyle === 'solid'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Solid Line
                </button>

                <button
                  onClick={() => setConfig((prev) => ({ ...prev, cutLineStyle: 'dashed' }))}
                  className={`py-1.5 px-2 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                    config.cutLineStyle === 'dashed'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Dashed Line
                </button>

                <button
                  onClick={() => setConfig((prev) => ({ ...prev, cutLineStyle: 'corner-ticks' }))}
                  className={`py-1.5 px-2 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                    config.cutLineStyle === 'corner-ticks'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Corner Ticks
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

      <div className="pt-2">
        <button
          onClick={onProceedToPreview}
          className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all active:scale-[0.99] flex items-center justify-center space-x-2 cursor-pointer"
        >
          <Check className="w-4 h-4" />
          <span>Generate 6×4" Printable Canvas</span>
        </button>
      </div>

    </div>
  );
};
