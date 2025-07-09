import { ReactNode } from "react"
import { cn } from "@/lib/utils"

type DashboardCardProps = {
  title: string
  description?: string
  children: ReactNode
  className?: string
  headerAction?: ReactNode
}

export function DashboardCard({
  title,
  description,
  children,
  className,
  headerAction,
}: DashboardCardProps) {
  return (
    <div className={cn(
      "rounded-xl border bg-white dark:bg-gray-800/50 backdrop-blur-sm",
      "shadow-sm hover:shadow-md transition-shadow duration-200",
      className
    )}>
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            {description && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
          {headerAction}
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  )
}
