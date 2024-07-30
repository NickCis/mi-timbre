import type { PropsWithChildren } from 'react';
import { BellRing } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export function Wrapper({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="group flex items-center text-sm font-medium p-3">
        <BellRing className="w-4 h-4" />
        <Separator orientation="vertical" className="mx-2 h-4" />
        <span className="underline-offset-4 group-hover:underline">
          Mi Timbre
        </span>
      </div>
      <div className={cn('mx-2 flex-1', className)}>{children}</div>
    </div>
  );
}
