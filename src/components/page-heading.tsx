import type {ReactNode} from 'react';

export function PageHeading({
  eyebrow,
  title,
  description,
  action
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="mb-7 flex items-end justify-between gap-4">
      <div>
        <p className="text-primary text-[0.68rem] font-black tracking-[0.18em] uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-1.5 text-3xl font-black tracking-[-0.05em] sm:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="text-muted-foreground mt-2 max-w-xl text-sm leading-6">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </header>
  );
}
