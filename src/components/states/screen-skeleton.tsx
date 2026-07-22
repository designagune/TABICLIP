import {Skeleton} from '@/components/ui/skeleton';

export function ScreenSkeleton() {
  return (
    <div aria-label="loading" className="space-y-4">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-28 w-full rounded-[1.75rem]" />
      <Skeleton className="h-44 w-full rounded-[1.75rem]" />
    </div>
  );
}
