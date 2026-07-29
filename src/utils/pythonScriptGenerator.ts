import { SheetConfig } from '../types';

export function generatePythonScript(config: SheetConfig, photoFilename: string = 'passport_photo.jpg'): string {
  const isLandscape = config.orientation === 'landscape';
  const widthInches = isLandscape ? config.sheetWidthInches : config.sheetHeightInches;
  const heightInches = isLandscape ? config.sheetHeightInches : config.sheetWidthInches;
  const dpi = config.dpi || 300;

  const canvasWidthPx = Math.round(widthInches * dpi);
  const canvasHeightPx = Math.round(heightInches * dpi);

  const photoWidthPx = Math.round((config.photoWidthMm / 25.4) * dpi);
  const photoHeightPx = Math.round((config.photoHeightMm / 25.4) * dpi);

  const cols = config.cols;
  const rows = config.rows;

  return `import sys
import os
from PIL import Image, ImageOps, ImageDraw

def create_passport_sheet(
    input_image_path="${photoFilename}",
    output_image_path="passport_sheet_6x4.jpg",
    dpi=${dpi},
    sheet_width_in=${widthInches},
    sheet_height_in=${heightInches},
    photo_width_mm=${config.photoWidthMm},
    photo_height_mm=${config.photoHeightMm},
    cols=${cols},
    rows=${rows},
    draw_cut_lines=${config.showCutLines ? 'True' : 'False'}
):
    """
    Arranges uploaded passport photo onto a 6x4 inch 300 DPI sheet.
    Strictly uses PIL/Pillow image processing - no generative AI alterations.
    """
    if not os.path.exists(input_image_path):
        print(f"Error: Input photo '{input_image_path}' not found.")
        print("Please place your passport photo in the same directory or update input_image_path.")
        return

    # 1. Convert dimensions from inches/mm to pixels at specified DPI
    canvas_w = int(round(sheet_width_in * dpi))  # ${canvasWidthPx} px
    canvas_h = int(round(sheet_height_in * dpi)) # ${canvasHeightPx} px

    target_photo_w = int(round((photo_width_mm / 25.4) * dpi))  # ${photoWidthPx} px
    target_photo_h = int(round((photo_height_mm / 25.4) * dpi)) # ${photoHeightPx} px

    # 2. Create blank pure white canvas
    sheet = Image.new("RGB", (canvas_w, canvas_h), (255, 255, 255))

    # 3. Open and resize uploaded photo to exact photo target dimensions (maintain aspect ratio / fill)
    img = Image.open(input_image_path).convert("RGB")
    
    # Use ImageOps.fit to center-crop & resize preserving correct aspect ratio
    resized_photo = ImageOps.fit(img, (target_photo_w, target_photo_h), method=Image.Resampling.LANCZOS)

    # 4. Calculate grid positions & equal white gaps across the 6x4 canvas
    total_photos_w = cols * target_photo_w
    total_photos_h = rows * target_photo_h

    gap_x = (canvas_w - total_photos_w) / (cols + 1)
    gap_y = (canvas_h - total_photos_h) / (rows + 1)

    draw = ImageDraw.Draw(sheet)

    # 5. Paste the photo copies in grid across the canvas
    print(f"Pasting {cols}x{rows} photos on {canvas_w}x{canvas_h}px sheet at {dpi} DPI...")
    for r in range(rows):
        for c in range(cols):
            x = int(round(gap_x + c * (target_photo_w + gap_x)))
            y = int(round(gap_y + r * (target_photo_h + gap_y)))

            # Paste photo copy
            sheet.paste(resized_photo, (x, y))

            # Optional: Draw faint cut lines around each photo for scissors trimming
            if draw_cut_lines:
                # Draw 1px subtle gray boundary rectangle
                draw.rectangle([x, y, x + target_photo_w - 1, y + target_photo_h - 1], outline=(209, 213, 219), width=1)

    # 6. Save as high quality JPG with DPI metadata attached for photo kiosks
    sheet.save(output_image_path, "JPEG", quality=98, dpi=(dpi, dpi))
    print(f"SUCCESS: Printable passport sheet saved to '{output_image_path}'!")
    print(f"Dimensions: {canvas_w}x{canvas_h} pixels ({sheet_width_in}x{sheet_height_in} inches @ {dpi} DPI)")

if __name__ == "__main__":
    # Run creation
    photo_file = sys.argv[1] if len(sys.argv) > 1 else "${photoFilename}"
    create_passport_sheet(input_image_path=photo_file)
`;
}
