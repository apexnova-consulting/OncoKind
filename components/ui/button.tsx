import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold transition-[transform,box-shadow,background-color,color,border-color] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-400)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none',
  {
    variants: {
      variant: {
        default:
          'rounded-full bg-[var(--color-accent-400)] px-7 py-3.5 text-[var(--color-primary-900)] shadow-sm hover:bg-[var(--color-accent-500)] motion-safe:hover:-translate-y-px motion-safe:hover:shadow-md',
        secondary:
          'rounded-full bg-[var(--color-surface-200)] text-[var(--color-primary-800)] hover:bg-[var(--color-surface-300)]',
        outline:
          'rounded-full border-[1.5px] border-[var(--color-primary-700)] bg-transparent text-[var(--color-primary-800)] hover:bg-[var(--color-primary-900)] hover:text-[var(--color-text-inverse)]',
        ghost: 'rounded-full hover:bg-[var(--color-surface-200)]',
        link: 'h-auto min-h-[44px] rounded-none px-1 py-2 font-medium text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'min-h-11 rounded-full px-5 py-2.5',
        sm: 'min-h-11 rounded-full px-5 py-2.5 text-sm',
        lg: 'min-h-12 rounded-full px-8 py-3 text-base',
        icon: 'h-11 w-11 min-h-11 min-w-11 rounded-full p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
