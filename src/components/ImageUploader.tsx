import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Sparkles, CheckCircle2, FileImage, ShieldCheck } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (file: File | string, filename: string) => void;
  onUseSamplePhoto: () => void;
  currentFilename?: string;
  imageDimensions?: { width: number; height: number };
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelected,
  onUseSamplePhoto,
  currentFilename,
  imageDimensions,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onImageSelected(file, file.name);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      onImageSelected(file, file.name);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100 inline-block mb-1">
            Step 1: Source Photo
          </span>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Upload className="w-5 h-5 text-blue-600" />
            Upload Soft-Copy Passport Photo
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Select a high-resolution portrait photograph (JPG, PNG, or WEBP).
          </p>
        </div>

        <button
          onClick={onUseSamplePhoto}
          className="inline-flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 text-indigo-700 rounded-xl border border-indigo-200/70 transition-all active:scale-95 cursor-pointer shrink-0"
        >
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Test with Sample Photo</span>
        </button>
      </div>

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-blue-500 bg-blue-50/60 scale-[0.99]'
            : 'border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/20'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-100/80 text-blue-600 flex items-center justify-center shadow-xs">
            <FileImage className="w-6 h-6" />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              Click to browse or drag & drop photo here
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Supports JPG, PNG, WEBP • Pure pixel processing without distortion
            </p>
          </div>

          {currentFilename && (
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 text-xs font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Loaded: <strong>{currentFilename}</strong></span>
              {imageDimensions && (
                <span className="text-emerald-600 font-mono">
                  ({imageDimensions.width}×{imageDimensions.height} px)
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/60 gap-2">
        <span className="flex items-center font-medium text-slate-700">
          <ShieldCheck className="w-4 h-4 text-emerald-600 mr-1.5 shrink-0" />
          100% Privacy: Processed locally inside your browser canvas
        </span>
        <span className="text-slate-500 text-[11px] font-medium">0% Generative AI Alterations</span>
      </div>
    </div>
  );
};
