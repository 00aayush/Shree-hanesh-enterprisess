import { Link, useLocation } from "wouter";
import { BarChart3, Users, FolderOpen, Clock, BarChart } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Employees", href: "/employees", icon: Users },
  { name: "Projects", href: "/projects", icon: FolderOpen },
  { name: "Attendance", href: "/attendance", icon: Clock },
  { name: "Reports", href: "/reports", icon: BarChart },
];

export function MobileNav() {
  const [location] = useLocation();

  return (
    <nav className="bg-white border-t border-slate-200 px-4 py-2">
      <div className="flex justify-around">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href || (location === "/" && item.href === "/dashboard");
          
          return (
            <Link key={item.name} href={item.href}>
              <span
                className={cn(
                  "flex flex-col items-center p-2 rounded-lg transition-colors cursor-pointer min-w-0",
                  isActive
                    ? "text-primary"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs truncate">{item.name}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}