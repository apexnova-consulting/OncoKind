'use client';

import { forwardRef } from 'react';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

export const TrackedCalendlyLink = forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { plan?: string }
>(function TrackedCalendlyLink({ children, className, plan = 'professional', onClick, ...props }, ref) {
  return (
    <a
      ref={ref}
      href="https://calendly.com/oncokind-support"
      target="_blank"
      rel="noreferrer"
      className={cn(className)}
      onClick={(event) => {
        track('demo_booked_click', { plan });
        onClick?.(event);
      }}
      {...props}
    >
      {children}
    </a>
  );
});
