import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type StatsCardProps = {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: string
    type: 'increase' | 'decrease'
  }
  className?: string
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  className,
}: StatsCardProps) {
  return (
    <div className={cn(
      "rounded-xl p-6 bg-white dark:bg-gray-800/50 backdrop-blur-sm",
      "border border-gray-100 dark:border-gray-700",
      "shadow-sm hover:shadow-md transition-all duration-200",
      className
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {value}
            </p>
            {trend && (
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                  trend.type === 'increase'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                )}
              >
                {trend.type === 'increase' ? '↑' : '↓'} {trend.value}
              </span>
            )}
          </div>
        </div>
        <div className="rounded-lg p-3 bg-helix-gradient-start/10 dark:bg-helix-gradient-start/20">
          <Icon className="h-6 w-6 text-helix-gradient-start" />
        </div>
      </div>
    </div>
  )
}
