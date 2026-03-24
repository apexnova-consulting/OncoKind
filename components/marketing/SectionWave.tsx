import { cn } from '@/lib/utils';

/** Organic section divider — use between alternating backgrounds */
export function SectionWave({
  className,
  flip,
  fill = 'var(--color-surface-200)',
}: {
  className?: string;
  flip?: boolean;
  fill?: string;
}) {
  return (
    <div
      className={cn(
        'pointer-events-none relative -mt-px w-full overflow-hidden leading-[0] text-[var(--color-surface-200)]',
        className
      )}
      aria-hidden
    >
      <svg
        className={cn('relative block h-10 w-full scale-x-[1.01]', flip && 'rotate-180')}
        viewBox="0 0 1440 48"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 24C240 8 480 40 720 24C960 8 1200 40 1440 24V48H0V24Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}
