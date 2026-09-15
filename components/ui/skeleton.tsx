import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-pulse motion-reduce:animate-none rounded-md bg-slate-200/70",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
