import {Slot} from '@radix-ui/react-slot';
import {cva, type VariantProps} from 'class-variance-authority';
import type {ButtonHTMLAttributes} from 'react';

import {cn} from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition active:translate-y-px disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-primary-foreground shadow-[0_6px_18px_rgb(216_95_56_/_22%)] hover:bg-[#c9502e]',
        secondary: 'bg-secondary text-white hover:bg-[#264b43]',
        outline: 'border bg-card text-foreground hover:bg-muted',
        ghost: 'text-foreground hover:bg-muted',
        danger: 'bg-danger text-white hover:bg-[#92352f]'
      },
      size: {
        default: 'min-h-11 px-4',
        lg: 'min-h-13 rounded-2xl px-6 text-base',
        icon: 'size-11 p-0'
      }
    },
    defaultVariants: {variant: 'primary', size: 'default'}
  }
);

export interface ButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : 'button';
  return (
    <Component
      className={cn(buttonVariants({variant, size}), className)}
      {...props}
    />
  );
}

export {buttonVariants};
