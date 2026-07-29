import { CropTransform, SheetConfig } from '../types';

/**
 * Calculates pixel dimensions from mm or inches at specified DPI
 */
export function mmToPixels(mm: number, dpi: number = 300): number {
  return Math.round((mm / 25.4) * dpi);
}

export function inchesToPixels(inches: number, dpi: number = 300): number {
  return Math.round(inches * dpi);
}

/**
 * Renders the processed single passport photo to a high-res HTMLCanvasElement
 */
export function renderSinglePhotoCanvas(
  img: HTMLImageElement,
  crop: CropTransform,
  targetWidthPx: number,
  targetHeightPx: number
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = targetWidthPx;
  canvas.height = targetHeightPx;
  const ctx = canvas.getContext('2d');

  if (!ctx) return canvas;

  // Background white
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, targetWidthPx, targetHeightPx);

  ctx.save();

  // Apply brightness & contrast filters
  ctx.filter = `brightness(${crop.brightness}%) contrast(${crop.contrast}%)`;

  // Move origin to center of destination canvas
  ctx.translate(targetWidthPx / 2 + crop.x, targetHeightPx / 2 + crop.y);
  ctx.rotate((crop.rotation * Math.PI) / 180);

  // Calculate scaled image size based on crop.scale
  const baseScale = Math.max(targetWidthPx / img.width, targetHeightPx / img.height);
  const finalScale = baseScale * crop.scale;

  const drawWidth = img.width * finalScale;
  const drawHeight = img.height * finalScale;

  ctx.drawImage(
    img,
    -drawWidth / 2,
    -drawHeight / 2,
    drawWidth,
    drawHeight
  );

  ctx.restore();

  return canvas;
}

export interface RenderGridResult {
  canvas: HTMLCanvasElement;
  photoPositions: Array<{ x: number; y: number; w: number; h: number }>;
}

/**
 * Renders the full 6x4 inch 300 DPI print canvas (1800x1200 px) with the grid of passport photos
 */
export function renderPrintSheet(
  photoCanvas: HTMLCanvasElement,
  config: SheetConfig
): RenderGridResult {
  const dpi = config.dpi || 300;
  
  // Sheet dimensions
  let sheetWidthPx = inchesToPixels(config.sheetWidthInches, dpi); // 1800 px for 6 inch
  let sheetHeightPx = inchesToPixels(config.sheetHeightInches, dpi); // 1200 px for 4 inch

  if (config.orientation === 'portrait') {
    const temp = sheetWidthPx;
    sheetWidthPx = sheetHeightPx;
    sheetHeightPx = temp;
  }

  const canvas = document.createElement('canvas');
  canvas.width = sheetWidthPx;
  canvas.height = sheetHeightPx;
  const ctx = canvas.getContext('2d');

  const photoPositions: Array<{ x: number; y: number; w: number; h: number }> = [];

  if (!ctx) return { canvas, photoPositions };

  // Fill canvas with pure white background
  ctx.fillStyle = config.backgroundColor || '#FFFFFF';
  ctx.fillRect(0, 0, sheetWidthPx, sheetHeightPx);

  const photoW = photoCanvas.width;
  const photoH = photoCanvas.height;

  const cols = config.cols;
  const rows = config.rows;

  // Calculate margins and gaps
  const totalPhotoWidth = cols * photoW;
  const totalPhotoHeight = rows * photoH;

  const totalHorizontalSpace = sheetWidthPx - totalPhotoWidth;
  const totalVerticalSpace = sheetHeightPx - totalPhotoHeight;

  // Divide available space equally across (cols + 1) horizontal gaps and (rows + 1) vertical gaps
  const gapX = totalHorizontalSpace > 0 ? totalHorizontalSpace / (cols + 1) : 10;
  const gapY = totalVerticalSpace > 0 ? totalVerticalSpace / (rows + 1) : 10;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = Math.round(gapX + c * (photoW + gapX));
      const y = Math.round(gapY + r * (photoH + gapY));

      // Draw photo
      ctx.drawImage(photoCanvas, x, y, photoW, photoH);

      photoPositions.push({ x, y, w: photoW, h: photoH });

      // Draw cut lines / guides around photo if enabled
      if (config.showCutLines) {
        ctx.save();
        ctx.strokeStyle = config.cutLineColor || '#D1D5DB'; // subtle neutral gray
        ctx.lineWidth = 1;

        if (config.cutLineStyle === 'dashed') {
          ctx.setLineDash([8, 8]);
          ctx.strokeRect(x, y, photoW, photoH);
        } else if (config.cutLineStyle === 'corner-ticks') {
          const tickLen = 15;
          // Top-left
          ctx.beginPath();
          ctx.moveTo(x - tickLen, y);
          ctx.lineTo(x + tickLen, y);
          ctx.moveTo(x, y - tickLen);
          ctx.lineTo(x, y + tickLen);
          ctx.stroke();

          // Top-right
          ctx.beginPath();
          ctx.moveTo(x + photoW - tickLen, y);
          ctx.lineTo(x + photoW + tickLen, y);
          ctx.moveTo(x + photoW, y - tickLen);
          ctx.lineTo(x + photoW, y + tickLen);
          ctx.stroke();

          // Bottom-left
          ctx.beginPath();
          ctx.moveTo(x - tickLen, y + photoH);
          ctx.lineTo(x + tickLen, y + photoH);
          ctx.moveTo(x, y + photoH - tickLen);
          ctx.lineTo(x, y + photoH + tickLen);
          ctx.stroke();

          // Bottom-right
          ctx.beginPath();
          ctx.moveTo(x + photoW - tickLen, y + photoH);
          ctx.lineTo(x + photoW + tickLen, y + photoH);
          ctx.moveTo(x + photoW, y + photoH - tickLen);
          ctx.lineTo(x + photoW, y + photoH + tickLen);
          ctx.stroke();
        } else {
          // Solid subtle outline
          ctx.setLineDash([]);
          ctx.strokeRect(x, y, photoW, photoH);
        }

        ctx.restore();
      }
    }
  }

  return { canvas, photoPositions };
}

/**
 * Downloads canvas as high-quality JPG
 */
export function downloadCanvasAsJpg(canvas: HTMLCanvasElement, filename: string = 'passport_photos_6x4.jpg', quality: number = 0.98) {
  const dataUrl = canvas.toDataURL('image/jpeg', quality);
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
