import React from 'react';
import { Printer, X, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

interface PrintGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrintGuideModal: React.FC<PrintGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30 flex items-center justify-center">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Photo Kiosk & Printing Guide</h3>
              <p className="text-xs text-slate-400">Step-by-step instructions for 4×6 inch prints</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-700 text-xs">
          
          {/* Critical Tip */}
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-xs text-amber-900">Critical: Order a standard 4×6" photo print</p>
              <p className="text-xs text-amber-800 leading-relaxed">
                Do <strong>NOT</strong> select "Passport Photo Package" at the kiosk counter (which charges $15+ for automated head crops). Order a standard single 4×6 inch glossy photo print (typically ~$0.20 - $0.45).
              </p>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-xs tracking-wide uppercase">
              At the Kiosk / Online Order (Walgreens / CVS / Boots / Walmart / Kodak)
            </h4>

            <ol className="space-y-2.5">
              <li className="flex items-start space-x-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                <span className="w-6 h-6 bg-blue-600 text-white font-bold rounded-lg flex items-center justify-center shrink-0 text-xs">
                  1
                </span>
                <div>
                  <p className="font-bold text-slate-900">Transfer File</p>
                  <p className="text-slate-600 mt-0.5">
                    Upload the downloaded <code className="bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded font-mono text-[11px]">passport_photos_6x4.jpg</code> file to the kiosk via USB drive, SD card, or mobile app.
                  </p>
                </div>
              </li>

              <li className="flex items-start space-x-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                <span className="w-6 h-6 bg-blue-600 text-white font-bold rounded-lg flex items-center justify-center shrink-0 text-xs">
                  2
                </span>
                <div>
                  <p className="font-bold text-slate-900">Select Print Size: 4×6 Inches (10×15 cm)</p>
                  <p className="text-slate-600 mt-0.5">
                    Choose standard 4" × 6" glossy or matte photo paper.
                  </p>
                </div>
              </li>

              <li className="flex items-start space-x-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                <span className="w-6 h-6 bg-blue-600 text-white font-bold rounded-lg flex items-center justify-center shrink-0 text-xs">
                  3
                </span>
                <div>
                  <p className="font-bold text-slate-900">Disable "Auto-Crop" & "Face Zoom"</p>
                  <p className="text-slate-600 mt-0.5">
                    Select <strong>"Fit to Page" / "Do Not Crop" / "Actual Size (100%)"</strong>. This ensures the photo dimensions remain 100% accurate.
                  </p>
                </div>
              </li>

              <li className="flex items-start space-x-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                <span className="w-6 h-6 bg-blue-600 text-white font-bold rounded-lg flex items-center justify-center shrink-0 text-xs">
                  4
                </span>
                <div>
                  <p className="font-bold text-slate-900">Cut Out Along Lines</p>
                  <p className="text-slate-600 mt-0.5">
                    Use scissors or a paper trimmer along the cut line guides to trim your individual passport photos.
                  </p>
                </div>
              </li>
            </ol>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer"
          >
            Got It
          </button>
        </div>

      </div>
    </div>
  );
};
