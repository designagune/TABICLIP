import {MapPinned} from 'lucide-react';

import {brand} from '@/config/brand';

export function BrandMark({compact = false}: {compact?: boolean}) {
  return (
    <span className="inline-flex items-center gap-2.5 font-black tracking-[-0.04em]">
      <span className="bg-primary text-primary-foreground grid size-9 place-items-center rounded-xl shadow-sm">
        <MapPinned aria-hidden="true" className="size-5" />
      </span>
      {compact ? null : <span>{brand.name}</span>}
    </span>
  );
}
