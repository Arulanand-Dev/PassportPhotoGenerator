export interface PassportPreset {
  id: string;
  name: string;
  description: string;
  widthMm: number;
  heightMm: number;
  widthPx300Dpi: number; // calculated at 300 DPI
  heightPx300Dpi: number;
  defaultRows: number;
  defaultCols: number;
}

export interface CropTransform {
  x: number; // offset X in pixels
  y: number; // offset Y in pixels
  scale: number;
  rotation: number;
  brightness: number; // 0-200, default 100
  contrast: number; // 0-200, default 100
}

export interface SheetConfig {
  sheetWidthInches: number; // 6
  sheetHeightInches: number; // 4
  dpi: number; // 300
  photoWidthMm: number; // 35
  photoHeightMm: number; // 45
  rows: number; // 1
  cols: number; // 4
  gapPx: number; // auto or custom
  showCutLines: boolean;
  cutLineStyle: 'solid' | 'dashed' | 'corner-ticks';
  cutLineColor: string; // e.g. "#D1D5DB"
  orientation: 'landscape' | 'portrait';
  backgroundColor: string; // "#FFFFFF"
}

export const PRESETS: PassportPreset[] = [
  {
    id: 'uk_eu_35x45',
    name: 'UK / EU / International (35×45 mm)',
    description: 'Standard 35mm × 45mm (413×531 px @ 300 DPI)',
    widthMm: 35,
    heightMm: 45,
    widthPx300Dpi: 413,
    heightPx300Dpi: 531,
    defaultRows: 1,
    defaultCols: 4,
  },
  {
    id: 'us_india_2x2',
    name: 'US / India / Standard 2×2 inch',
    description: '50.8mm × 50.8mm (600×600 px @ 300 DPI)',
    widthMm: 50.8,
    heightMm: 50.8,
    widthPx300Dpi: 600,
    heightPx300Dpi: 600,
    defaultRows: 2,
    defaultCols: 3,
  },
  {
    id: 'uk_eu_35x45_grid8',
    name: 'UK / EU 8-Photo Grid (2×4 Grid)',
    description: '35mm × 45mm placed in 2 rows of 4',
    widthMm: 35,
    heightMm: 45,
    widthPx300Dpi: 413,
    heightPx300Dpi: 531,
    defaultRows: 2,
    defaultCols: 4,
  },
  {
    id: 'custom',
    name: 'Custom Dimensions',
    description: 'Specify custom photo size in mm or inches',
    widthMm: 35,
    heightMm: 45,
    widthPx300Dpi: 413,
    heightPx300Dpi: 531,
    defaultRows: 1,
    defaultCols: 4,
  },
];
