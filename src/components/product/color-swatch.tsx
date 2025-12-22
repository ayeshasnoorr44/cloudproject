'use client';

import { cn } from '@/lib/utils';
import type { ProductColor } from '@/lib/products';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type ColorSwatchProps = {
  color: ProductColor;
  isSelected: boolean;
  onClick: () => void;
};

export function ColorSwatch({ color, isSelected, onClick }: ColorSwatchProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={onClick}
            className={cn(
              "h-8 w-8 rounded-full border-2 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              isSelected ? "border-primary scale-110" : "border-transparent"
            )}
            aria-label={`Select color ${color.name}`}
            style={{ backgroundColor: color.hex }}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>{color.name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
