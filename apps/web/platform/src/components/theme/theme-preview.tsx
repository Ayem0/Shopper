'use client';

import { rgbToOklch } from '@/lib/theme/rgb-to-oklch';
import { Button } from '@shopify-clone/ui';

interface ThemePreviewProps {
  primary: string;
  secondary: string;
}

export function ThemePreview({ primary, secondary }: ThemePreviewProps) {
  const primaryNumbers = rgbToOklch(hexToRgb(primary) ?? { r: 0, g: 0, b: 0 });
  const formatedPrimary = `oklch(${primaryNumbers.L} ${primaryNumbers.C} ${primaryNumbers.h})`;

  const secondaryNumbers = rgbToOklch(
    hexToRgb(secondary) ?? { r: 0, g: 0, b: 0 }
  );
  const formatedSecondary = `oklch(${secondaryNumbers.L} ${secondaryNumbers.C} ${secondaryNumbers.h})`;
  return (
    <div
      className="flex"
      style={
        {
          '--primary': formatedPrimary,
          '--secondary': formatedSecondary,
        } as React.CSSProperties
      }
    >
      <Button variant="default">Primary</Button>
      <Button variant="secondary">Secondary</Button>
    </div>
  );
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}
