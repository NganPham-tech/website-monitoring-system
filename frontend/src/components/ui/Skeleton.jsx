import React from 'react';
import { cn } from '../../lib/utils';

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-200", className)}
      {...props}
    />
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="w-full">
      <div className="flex border-b border-slate-200 bg-slate-50 py-3 px-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1 mx-2" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex border-b border-slate-100 py-4 px-4 items-center">
           {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} className="h-6 flex-1 mx-2" />
          ))}
        </div>
      ))}
    </div>
  )
}
