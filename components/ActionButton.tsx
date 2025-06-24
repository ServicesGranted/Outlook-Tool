'use client';

import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ActionButton({ children, className, ...props }: ButtonProps) {
  return (
    <Button
      variant="default"
      size="lg"
      className={cn('glass-button action-button', className)}
      {...props}
    >
      {children}
    </Button>
  );
}