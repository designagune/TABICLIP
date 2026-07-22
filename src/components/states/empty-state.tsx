import type {LucideIcon} from 'lucide-react';
import type {ReactNode} from 'react';

export function EmptyState({
  icon: Icon,
  title,
  description,
  action
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <section className="bg-card rounded-[1.75rem] border border-dashed px-6 py-12 text-center">
      <span className="bg-muted mx-auto grid size-14 place-items-center rounded-2xl">
        <Icon aria-hidden="true" className="text-muted-foreground size-6" />
      </span>
      <h2 className="mt-5 text-lg font-black">{title}</h2>
      <p className="text-muted-foreground mx-auto mt-2 max-w-sm text-sm leading-6">
        {description}
      </p>
      {action ? <div className="mt-6">{action}</div> : null}
    </section>
  );
}
