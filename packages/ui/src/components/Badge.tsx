import * as React from 'react';
import { X, Sparkles } from 'lucide-react';

type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'outline'
  | 'gradient';

type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  clickable?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
  pulse?: boolean;
}

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ');
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'border border-slate-200 bg-slate-900 text-white hover:bg-slate-800',

  secondary: 'border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200',

  success: 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100',

  warning: 'border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100',

  danger: 'border border-red-200 bg-red-50 text-red-700 hover:bg-red-100',

  info: 'border border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100',

  outline: 'border border-slate-300 bg-transparent text-slate-700 hover:bg-slate-100',

  gradient:
    'bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white border-transparent shadow-lg',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'h-5 px-2 text-[10px]',
  md: 'h-7 px-3 text-xs',
  lg: 'h-9 px-4 text-sm',
};

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      clickable = false,
      leftIcon,
      rightIcon,
      removable = false,
      onRemove,
      pulse = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-1.5 rounded-full font-semibold tracking-wide whitespace-nowrap transition-all duration-200 select-none',
          variantClasses[variant],
          sizeClasses[size],
          clickable && 'cursor-pointer active:scale-95',
          pulse && 'animate-pulse',
          className
        )}
        {...props}
      >
        {!!leftIcon && <span className="flex items-center justify-center">{leftIcon}</span>}

        <span>{children}</span>

        {!!rightIcon && <span className="flex items-center justify-center">{rightIcon}</span>}

        {removable && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
            className="ml-1 rounded-full p-0.5 opacity-70 transition hover:bg-black/10 hover:opacity-100"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    );
  }
);

Badge.displayName = 'Badge';

/* -------------------------------------------------------------------------- */
/*                               Usage Examples                               */
/* -------------------------------------------------------------------------- */

export function BadgeExamples() {
  return (
    <div className="flex flex-wrap items-center gap-3 p-6">
      <Badge>Default</Badge>

      <Badge variant="secondary">Secondary</Badge>

      <Badge variant="success">Active</Badge>

      <Badge variant="warning">Pending</Badge>

      <Badge variant="danger">Blocked</Badge>

      <Badge variant="info">Info</Badge>

      <Badge variant="outline">Outline</Badge>

      <Badge variant="gradient" leftIcon={<Sparkles className="h-3.5 w-3.5" />}>
        Premium
      </Badge>

      <Badge size="sm">Small</Badge>

      <Badge size="lg">Large Badge</Badge>

      <Badge removable onRemove={() => console.log('Removed')}>
        Removable
      </Badge>

      <Badge clickable pulse>
        Live
      </Badge>
    </div>
  );
}
