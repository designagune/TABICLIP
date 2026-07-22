export function FieldError({id, children}: {id: string; children?: string}) {
  if (!children) return null;
  return (
    <p id={id} role="alert" className="text-danger mt-1.5 text-sm font-medium">
      {children}
    </p>
  );
}
