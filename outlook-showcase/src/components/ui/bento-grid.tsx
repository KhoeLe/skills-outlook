import { cn } from "@/lib/utils";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "row-span-1 rounded-2xl group/bento p-5",
        "bg-zinc-50 hover:bg-white",
        "border border-zinc-200/50",
        "transition-all duration-300 ease-out",
        "hover:shadow-sm hover:border-zinc-200/80",
        "flex flex-col justify-between space-y-4",
        className
      )}
    >
      {header}
      <div className="group-hover/bento:translate-x-1 transition-transform duration-200">
        <div className="flex items-center gap-2 mb-2">
          {icon}
        </div>
        <div className="font-semibold text-zinc-900 mb-1.5">
          {title}
        </div>
        <div className="text-sm text-zinc-500 leading-relaxed">
          {description}
        </div>
      </div>
    </div>
  );
};
