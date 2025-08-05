import { Link, useLocation } from "wouter";
import { BarChart3, Users, FolderOpen, Clock, BarChart, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Employees", href: "/employees", icon: Users },
  { name: "Projects", href: "/projects", icon: FolderOpen },
  { name: "Attendance", href: "/attendance", icon: Clock },
  { name: "Reports", href: "/reports", icon: BarChart },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const [location] = useLocation();

  const handleNavClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="w-64 bg-white shadow-sm border-r border-slate-200 h-full flex flex-col">
      {/* Mobile close button */}
      {onClose && (
        <div className="flex justify-between items-center p-4 border-b border-slate-200 lg:hidden">
          <h2 className="text-lg font-semibold text-slate-800">Menu</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}
      
      <div className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href || (location === "/" && item.href === "/dashboard");
            
            return (
              <li key={item.name}>
                <Link href={item.href}>
                  <span
                    className={cn(
                      "flex items-center p-2 rounded-lg transition-colors cursor-pointer",
                      isActive
                        ? "bg-primary text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    )}
                    onClick={handleNavClick}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="ml-3">{item.name}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
