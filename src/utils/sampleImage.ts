/**
 * Generates a high quality SVG data URL representing a neutral sample portrait photo
 * so users can test the 6x4 grid generator immediately.
 */
export function getSamplePassportPhoto(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="771" viewBox="0 0 600 771">
    <rect width="600" height="771" fill="#F8FAFC"/>
    
    <!-- Background wall -->
    <rect width="600" height="771" fill="#EFF6FF"/>
    
    <!-- Shoulder / Torso -->
    <path d="M 120 771 C 120 580, 200 520, 300 520 C 400 520, 480 580, 480 771 Z" fill="#1E293B"/>
    <path d="M 230 520 L 300 620 L 370 520 Z" fill="#FFFFFF"/>
    <path d="M 285 580 L 300 771 L 315 580 Z" fill="#0F172A"/>

    <!-- Neck -->
    <rect x="250" y="420" width="100" height="110" rx="10" fill="#E2A882"/>
    <path d="M 250 490 C 280 520, 320 520, 350 490 Z" fill="#D4936B" opacity="0.6"/>

    <!-- Face Oval -->
    <ellipse cx="300" cy="300" rx="110" ry="145" fill="#EEB38C"/>
    
    <!-- Hair -->
    <path d="M 180 270 C 180 140, 420 140, 420 270 C 420 190, 380 160, 300 160 C 220 160, 180 190, 180 270 Z" fill="#292524"/>

    <!-- Eyes -->
    <ellipse cx="250" cy="280" rx="14" ry="9" fill="#FFFFFF"/>
    <ellipse cx="350" cy="280" rx="14" ry="9" fill="#FFFFFF"/>
    <circle cx="250" cy="280" r="6" fill="#1C1917"/>
    <circle cx="350" cy="280" r="6" fill="#1C1917"/>
    <circle cx="252" cy="278" r="2" fill="#FFFFFF"/>
    <circle cx="352" cy="278" r="2" fill="#FFFFFF"/>

    <!-- Eyebrows -->
    <path d="M 230 260 Q 250 252 270 260" stroke="#1C1917" stroke-width="4" stroke-linecap="round" fill="none"/>
    <path d="M 330 260 Q 350 252 370 260" stroke="#1C1917" stroke-width="4" stroke-linecap="round" fill="none"/>

    <!-- Nose -->
    <path d="M 300 280 L 295 325 L 308 325" stroke="#C37E57" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>

    <!-- Lips -->
    <path d="M 265 365 Q 300 355 335 365" stroke="#B45309" stroke-width="3" stroke-linecap="round" fill="none"/>
    <path d="M 265 365 Q 300 380 335 365" stroke="#B45309" stroke-width="2" stroke-linecap="round" fill="none"/>

    <!-- Ears -->
    <ellipse cx="188" cy="300" rx="12" ry="24" fill="#E09C73"/>
    <ellipse cx="412" cy="300" rx="12" ry="24" fill="#E09C73"/>

    <!-- Sample Watermark -->
    <rect x="180" y="680" width="240" height="40" rx="8" fill="#000000" opacity="0.4"/>
    <text x="300" y="706" font-family="sans-serif" font-size="18" font-weight="bold" fill="#FFFFFF" text-anchor="middle">SAMPLE PHOTO</text>
  </svg>`;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}
